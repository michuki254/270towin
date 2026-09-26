/* Live prediction-market odds from Polymarket's public Gamma API.
 *
 * These panels were hardcoded percentages with a frozen "as of 16 June 2026"
 * caption, so they aged silently. Gamma needs no key and no auth.
 *
 * One deliberate limitation: Polymarket carries a national Senate-control
 * market but NO per-state 2026 Senate race markets (checked across ~1,500
 * open markets — the only state-level Senate market is a Florida nominee
 * question). So this can drive the control panels; the per-race market column
 * on the Senate map has no source and stays blank rather than invented.
 */

const GAMMA = 'https://gamma-api.polymarket.com';

/* ------------------------------------------------------------------ *
 * Response cache                                                     *
 * ------------------------------------------------------------------ *
 *
 * The pages using this module declared `config = { isr: { expiration } }`,
 * which does nothing here: this app builds with adapter-node, and ISR is an
 * adapter-vercel feature. So every visitor was triggering a fresh set of
 * upstream calls — up to 37 of them on the movers page. adapter-node serves
 * from one long-lived process, so a module-level map is a real cache.
 *
 * Failures are not cached, so an outage cannot pin an empty panel in place for
 * the rest of the window.
 */
type Entry = { at: number; value: unknown };
const cache = new Map<string, Entry>();

async function cached<T extends { ok: boolean }>(
	key: string,
	ttlMs: number,
	fn: () => Promise<T>
): Promise<T> {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
	const value = await fn();
	if (value.ok) cache.set(key, { at: Date.now(), value });
	return value;
}

export type PartyOdds = {
	party: string;
	/** Probability as a whole percentage, 0-100. */
	pct: number;
	color: string;
};

export type MarketPanel = {
	odds: PartyOdds[];
	/** When these prices were read, for the caption. */
	fetchedAt: string;
	/** False when the API failed — callers keep rendering, minus the panel. */
	ok: boolean;
};

const PARTY_COLORS: Record<string, string> = {
	Republican: '#D83A45',
	Republicans: '#D83A45',
	'Republican Party': '#D83A45',
	Democratic: '#2E5AAC',
	Democrats: '#2E5AAC',
	'Democratic Party': '#2E5AAC'
};

function colorFor(label: string): string {
	if (PARTY_COLORS[label]) return PARTY_COLORS[label];
	const l = label.toLowerCase();
	if (l.startsWith('rep')) return '#D83A45';
	if (l.startsWith('dem')) return '#2E5AAC';
	return '#7a6e43';
}

/** Trim Polymarket's "… Party" suffix so labels read like the rest of the UI. */
function tidy(label: string): string {
	return label.replace(/\s+Party$/i, '').trim();
}

type GammaMarket = {
	groupItemTitle?: string;
	question?: string;
	outcomes?: string;
	outcomePrices?: string;
	closed?: boolean;
	/** JSON array of CLOB token ids, positionally matching `outcomes`. Needed to
	 *  ask the CLOB for a price history. */
	clobTokenIds?: string;
};

/**
 * Read one Gamma event and return the "Yes" price of each sub-market as a
 * party probability. In a multi-outcome event each party is its own binary
 * market, so the party's chance is its own Yes price — not a share of a total,
 * which is why these legitimately may not sum to 100.
 */
export function fetchPartyOdds(
	slug: string,
	opts: { only?: string[]; timeoutMs?: number } = {}
): Promise<MarketPanel> {
	return cached(`party:${slug}:${(opts.only ?? []).join(',')}`, 60_000, () =>
		partyOddsUncached(slug, opts)
	);
}

async function partyOddsUncached(
	slug: string,
	opts: { only?: string[]; timeoutMs?: number } = {}
): Promise<MarketPanel> {
	const now = new Date().toISOString();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 6000);
	try {
		const res = await fetch(`${GAMMA}/events?slug=${encodeURIComponent(slug)}`, {
			signal: controller.signal,
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) return { odds: [], fetchedAt: now, ok: false };
		const events = (await res.json()) as Array<{ markets?: GammaMarket[] }>;
		const markets = events?.[0]?.markets ?? [];

		const odds: PartyOdds[] = [];
		for (const m of markets) {
			if (m.closed) continue;
			const label = tidy(m.groupItemTitle ?? m.question ?? '');
			if (!label) continue;
			if (opts.only && !opts.only.some((o) => label.toLowerCase() === o.toLowerCase())) continue;

			let outcomes: string[] = [];
			let prices: string[] = [];
			try {
				outcomes = JSON.parse(m.outcomes ?? '[]');
				prices = JSON.parse(m.outcomePrices ?? '[]');
			} catch {
				continue;
			}
			const yesAt = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
			if (yesAt < 0 || prices[yesAt] === undefined) continue;
			const pct = Math.round(parseFloat(prices[yesAt]) * 100);
			if (!Number.isFinite(pct)) continue;
			odds.push({ party: label, pct, color: colorFor(label) });
		}

		odds.sort((a, b) => b.pct - a.pct);
		return { odds, fetchedAt: now, ok: odds.length > 0 };
	} catch {
		// Never let an upstream outage take the page down with it.
		return { odds: [], fetchedAt: now, ok: false };
	} finally {
		clearTimeout(timer);
	}
}

export const SLUGS = {
	presidential2028: 'which-party-wins-2028-us-presidential-election',
	senate2026: 'which-party-will-win-the-senate-in-2026',
	house2026: 'which-party-will-win-the-house-in-2026'
} as const;

/* ------------------------------------------------------------------ *
 * Candidate-level markets                                            *
 * ------------------------------------------------------------------ */

export type CandidateOdds = {
	name: string;
	/** Probability as a percentage, one decimal. */
	pct: number;
	/** Derived by comparing the two nominee markets; null when in neither. */
	party: 'Democratic' | 'Republican' | null;
};

export type CandidateBoard = {
	candidates: CandidateOdds[];
	fetchedAt: string;
	ok: boolean;
};

export const CANDIDATE_SLUGS = {
	/** Who takes office — both parties in one market. */
	presidentialWinner2028: 'presidential-election-winner-2028',
	democraticNominee2028: 'democratic-presidential-nominee-2028',
	republicanNominee2028: 'republican-presidential-nominee-2028'
} as const;

/* ------------------------------------------------------------------ *
 * Price movement                                                     *
 * ------------------------------------------------------------------ */

const CLOB = 'https://clob.polymarket.com';

export type Mover = {
	/** "Nevada governor", "House control". */
	race: string;
	/** Page on this site covering the race. */
	href: string;
	/** Democratic contract price now and at the start of the window. */
	current: number;
	previous: number;
	/** Signed change in percentage points; positive means toward the Democrats. */
	delta: number;
};

export type MoversBoard = {
	movers: Mover[];
	/** Races that were readable but did not move by the threshold. */
	flat: number;
	windowDays: number;
	minDelta: number;
	fetchedAt: string;
	ok: boolean;
};

/** Pull the market for one side of a race, with the token needed for history. */
function pickSide(
	markets: GammaMarket[] | undefined,
	party: 'Democratic' | 'Republican'
): { tokenId: string; pct: number } | null {
	let best: { tokenId: string; pct: number } | null = null;
	for (const m of markets ?? []) {
		if (m.closed) continue;
		const label = (m.groupItemTitle ?? m.question ?? '').trim();
		if (!label || partyOf(label) !== party) continue;
		let outcomes: string[] = [];
		let prices: string[] = [];
		let tokens: string[] = [];
		try {
			outcomes = JSON.parse(m.outcomes ?? '[]');
			prices = JSON.parse(m.outcomePrices ?? '[]');
			tokens = JSON.parse(m.clobTokenIds ?? '[]');
		} catch {
			continue;
		}
		const yesAt = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
		if (yesAt < 0 || prices.length !== outcomes.length || !tokens[yesAt]) continue;
		const v = parseFloat(prices[yesAt]);
		if (!Number.isFinite(v)) continue;
		const entry = { tokenId: tokens[yesAt], pct: Math.round(v * 1000) / 10 };
		if (!best || entry.pct > best.pct) best = entry;
	}
	return best;
}

/** Price at the start and end of the window, from the CLOB history endpoint. */
async function priceWindow(
	tokenId: string,
	interval: string,
	timeoutMs: number
): Promise<{ first: number; last: number } | null> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(
			`${CLOB}/prices-history?market=${encodeURIComponent(tokenId)}&interval=${interval}&fidelity=180`,
			{ signal: controller.signal, headers: { Accept: 'application/json' } }
		);
		if (!res.ok) return null;
		const body = (await res.json()) as { history?: Array<{ t: number; p: number }> };
		const h = body.history ?? [];
		if (h.length < 2) return null;
		return { first: h[0].p, last: h[h.length - 1].p };
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

/** Run promises in fixed-size batches so one page render cannot open 40 sockets. */
async function inBatches<T, R>(
	items: T[],
	size: number,
	fn: (item: T) => Promise<R>
): Promise<R[]> {
	const out: R[] = [];
	for (let i = 0; i < items.length; i += size) {
		out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
	}
	return out;
}

/**
 * Which races the market repriced, biggest move first.
 *
 * This exists so the news page can be generated rather than written, and so it
 * reports something no other page on the site does: not where a race stands but
 * which way it is going.
 *
 * It reads the Democratic contract for each race and compares its price now
 * with its price at the start of the window. One side is enough — quoting "the
 * Democratic price rose 6 points" is unambiguous, whereas summing two
 * independently quoted contracts into a single "margin" would invent a number
 * neither of them states. The sign carries the direction.
 *
 * Deliberately no snapshot table and no cron: Polymarket serves the history
 * itself, so there is nothing to accumulate and the page is correct the first
 * time it renders rather than a week later.
 */
export function fetchMovers(
	opts: { windowDays?: 1 | 7 | 30; minDelta?: number; timeoutMs?: number } = {}
): Promise<MoversBoard> {
	return cached(`movers:${opts.windowDays ?? 7}:${opts.minDelta ?? 1}`, 300_000, () =>
		moversUncached(opts)
	);
}

async function moversUncached(
	opts: { windowDays?: 1 | 7 | 30; minDelta?: number; timeoutMs?: number } = {}
): Promise<MoversBoard> {
	const { windowDays = 7, minDelta = 1, timeoutMs = 8000 } = opts;
	const interval = windowDays === 1 ? '1d' : windowDays === 30 ? '1m' : '1w';
	const now = new Date().toISOString();
	const empty: MoversBoard = {
		movers: [],
		flat: 0,
		windowDays,
		minDelta,
		fetchedAt: now,
		ok: false
	};

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	let tracked: Array<{ race: string; href: string; tokenId: string; pct: number }> = [];
	try {
		const chamberSlugs = [
			{ slug: SLUGS.presidential2028, race: '2028 presidency', href: '/2028-presidential-election-interactive-map' },
			{ slug: SLUGS.senate2026, race: 'Senate control', href: '/2026-senate-interactive-map' },
			{ slug: SLUGS.house2026, race: 'House control', href: '/2026-house-interactive-map' }
		];

		const [chamberEvents, govEvents] = await Promise.all([
			Promise.all(
				chamberSlugs.map(async (c) => {
					const r = await fetch(`${GAMMA}/events?slug=${encodeURIComponent(c.slug)}`, {
						signal: controller.signal,
						headers: { Accept: 'application/json' }
					});
					if (!r.ok) return null;
					const ev = (await r.json()) as Array<{ markets?: GammaMarket[] }>;
					const side = pickSide(ev?.[0]?.markets, 'Democratic');
					return side ? { race: c.race, href: c.href, ...side } : null;
				})
			),
			(async () => {
				const r = await fetch(
					`${GAMMA}/events?tag_slug=governor-midterms&closed=false&limit=100`,
					{ signal: controller.signal, headers: { Accept: 'application/json' } }
				);
				if (!r.ok) return [];
				const evs = (await r.json()) as Array<{ slug?: string; markets?: GammaMarket[] }>;
				return (evs ?? [])
					.filter(
						(e) =>
							/-governor-(winner|election)-2026$/.test(e.slug ?? '') &&
							!(e.slug ?? '').includes('margin-of-victory')
					)
					.map((e) => {
						const side = pickSide(e.markets, 'Democratic');
						return side
							? {
									race: `${stateFromSlug(e.slug ?? '')} governor`,
									href: '/2026-governor-interactive-map',
									...side
								}
							: null;
					})
					.filter((x): x is NonNullable<typeof x> => x !== null);
			})()
		]);

		tracked = [
			...chamberEvents.filter((x): x is NonNullable<typeof x> => x !== null),
			...govEvents
		];
	} catch {
		return empty;
	} finally {
		clearTimeout(timer);
	}

	if (!tracked.length) return empty;

	const withHistory = await inBatches(tracked, 8, async (t) => {
		const w = await priceWindow(t.tokenId, interval, timeoutMs);
		if (!w) return null;
		const previous = Math.round(w.first * 1000) / 10;
		const current = Math.round(w.last * 1000) / 10;
		return {
			race: t.race,
			href: t.href,
			current,
			previous,
			delta: Math.round((current - previous) * 10) / 10
		};
	});

	const readable = withHistory.filter((x): x is Mover => x !== null);
	const movers = readable
		.filter((m) => Math.abs(m.delta) >= minDelta)
		.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

	return {
		movers,
		flat: readable.length - movers.length,
		windowDays,
		minDelta,
		fetchedAt: now,
		ok: readable.length > 0
	};
}

/* ------------------------------------------------------------------ *
 * Per-state governor markets                                         *
 * ------------------------------------------------------------------ */

export type GovernorRace = {
	/** "New Hampshire", derived from the market slug. */
	state: string;
	democratic: { name: string | null; pct: number };
	republican: { name: string | null; pct: number };
};

export type GovernorBoard = {
	races: GovernorRace[];
	fetchedAt: string;
	ok: boolean;
	/** States carrying a market we could not classify by party. */
	skipped: string[];
};

/** "Rob Sand (D)" -> Democratic; the literal "Democrat" label -> Democratic. */
function partyOf(label: string): 'Democratic' | 'Republican' | null {
	const l = label.toLowerCase();
	if (/\(\s*d\s*\)/.test(l) || /^democrat(ic)?$/.test(l.trim())) return 'Democratic';
	if (/\(\s*r\s*\)/.test(l) || /^republican$/.test(l.trim())) return 'Republican';
	return null;
}

/** Strip the party suffix so "Rob Sand (D)" displays as "Rob Sand". */
function bareName(label: string): string | null {
	const n = label.replace(/\s*\(\s*[DR]\s*\)\s*$/i, '').trim();
	// A bare party label is not a candidate name.
	return /^(democrat(ic)?|republican)$/i.test(n) ? null : n || null;
}

function stateFromSlug(slug: string): string {
	return slug
		.replace(/-governor-(winner|election)-2026$/, '')
		.split('-')
		.map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
		.join(' ');
}

/**
 * Every 2026 governor race Polymarket prices, read in one tagged request.
 *
 * Driven by the `governor-midterms` tag rather than a hardcoded list of states,
 * so a race that opens later shows up without a code change.
 *
 * Two things are deliberately dropped. Slugs containing "margin-of-victory" are
 * companion markets full of unpriced "Person A" placeholders. And a state is
 * skipped when its market is an untagged list of candidate names — California
 * runs 23 of them with no party marker — because assigning those to parties
 * would mean guessing.
 */
export function fetchGovernorBoard(opts: { timeoutMs?: number } = {}): Promise<GovernorBoard> {
	return cached('governors', 120_000, () => governorBoardUncached(opts));
}

async function governorBoardUncached(
	opts: { timeoutMs?: number } = {}
): Promise<GovernorBoard> {
	const now = new Date().toISOString();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);
	try {
		const res = await fetch(
			`${GAMMA}/events?tag_slug=governor-midterms&closed=false&limit=100`,
			{ signal: controller.signal, headers: { Accept: 'application/json' } }
		);
		if (!res.ok) return { races: [], fetchedAt: now, ok: false, skipped: [] };
		const events = (await res.json()) as Array<{ slug?: string; markets?: GammaMarket[] }>;

		const races: GovernorRace[] = [];
		const skipped: string[] = [];

		for (const ev of events ?? []) {
			const slug = ev.slug ?? '';
			if (!/-governor-(winner|election)-2026$/.test(slug)) continue;
			if (slug.includes('margin-of-victory')) continue;

			let dem: { name: string | null; pct: number } | null = null;
			let gop: { name: string | null; pct: number } | null = null;
			let sawAny = false;

			for (const m of ev.markets ?? []) {
				if (m.closed) continue;
				const label = (m.groupItemTitle ?? m.question ?? '').trim();
				if (!label) continue;
				let outcomes: string[] = [];
				let prices: string[] = [];
				try {
					outcomes = JSON.parse(m.outcomes ?? '[]');
					prices = JSON.parse(m.outcomePrices ?? '[]');
				} catch {
					continue;
				}
				const yesAt = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
				if (yesAt < 0 || prices.length !== outcomes.length) continue;
				const v = parseFloat(prices[yesAt]);
				if (!Number.isFinite(v)) continue;
				sawAny = true;

				const party = partyOf(label);
				if (!party) continue;
				const entry = { name: bareName(label), pct: Math.round(v * 1000) / 10 };
				// Keep the strongest entry per party, in case a state runs several.
				if (party === 'Democratic') {
					if (!dem || entry.pct > dem.pct) dem = entry;
				} else if (!gop || entry.pct > gop.pct) gop = entry;
			}

			const state = stateFromSlug(slug);
			if (dem && gop) races.push({ state, democratic: dem, republican: gop });
			else if (sawAny) skipped.push(state);
		}

		races.sort(
			(a, b) =>
				Math.abs(a.democratic.pct - a.republican.pct) -
				Math.abs(b.democratic.pct - b.republican.pct)
		);
		return { races, fetchedAt: now, ok: races.length > 0, skipped: skipped.sort() };
	} catch {
		return { races: [], fetchedAt: now, ok: false, skipped: [] };
	} finally {
		clearTimeout(timer);
	}
}

/** Collapse the renderings of one person to a single key.
 *
 *  The winner market writes "JD Vance", the Republican nominee market writes
 *  "J.D. Vance". Without dropping the periods the two never join and the
 *  candidate loses the party we derive from that join. */
function nameKey(name: string): string {
	return name.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

/** name -> probability (0-1) for every priced sub-market of one event. */
async function readYesPrices(slug: string, timeoutMs: number): Promise<Map<string, number>> {
	const out = new Map<string, number>();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(`${GAMMA}/events?slug=${encodeURIComponent(slug)}`, {
			signal: controller.signal,
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) return out;
		const events = (await res.json()) as Array<{ markets?: GammaMarket[] }>;
		for (const m of events?.[0]?.markets ?? []) {
			if (m.closed) continue;
			const label = (m.groupItemTitle ?? m.question ?? '').trim();
			if (!label) continue;
			let outcomes: string[] = [];
			let prices: string[] = [];
			try {
				outcomes = JSON.parse(m.outcomes ?? '[]');
				prices = JSON.parse(m.outcomePrices ?? '[]');
			} catch {
				continue;
			}
			// These events carry dozens of unpriced placeholder rows
			// ("Party A", empty outcome lists). Skip anything without a
			// price rather than reading a stale or absent index.
			const yesAt = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
			if (yesAt < 0 || prices.length !== outcomes.length) continue;
			const v = parseFloat(prices[yesAt]);
			if (!Number.isFinite(v)) continue;
			out.set(label, v);
		}
		return out;
	} catch {
		return out;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * The 2028 field as the market prices it, strongest first.
 *
 * Party is not stated anywhere on the winner market, so it is derived: a name
 * is assigned to whichever nominee market prices it higher. That is data
 * rather than a hand-maintained roster, so a contender who enters the market
 * later still lands in the right column without a code change.
 */
export function fetchCandidateBoard(
	opts: { limit?: number; minPct?: number; timeoutMs?: number } = {}
): Promise<CandidateBoard> {
	return cached(`candidates:${opts.limit ?? 12}:${opts.minPct ?? 1}`, 60_000, () =>
		candidateBoardUncached(opts)
	);
}

async function candidateBoardUncached(
	opts: { limit?: number; minPct?: number; timeoutMs?: number } = {}
): Promise<CandidateBoard> {
	const { limit = 12, minPct = 1, timeoutMs = 6000 } = opts;
	const now = new Date().toISOString();

	const [winner, dem, gop] = await Promise.all([
		readYesPrices(CANDIDATE_SLUGS.presidentialWinner2028, timeoutMs),
		readYesPrices(CANDIDATE_SLUGS.democraticNominee2028, timeoutMs),
		readYesPrices(CANDIDATE_SLUGS.republicanNominee2028, timeoutMs)
	]);

	if (!winner.size) return { candidates: [], fetchedAt: now, ok: false };

	const byKey = (m: Map<string, number>) => {
		const k = new Map<string, number>();
		for (const [n, v] of m) k.set(nameKey(n), v);
		return k;
	};
	const demKeys = byKey(dem);
	const gopKeys = byKey(gop);

	const candidates: CandidateOdds[] = [];
	for (const [name, v] of winner) {
		const pct = Math.round(v * 1000) / 10;
		if (pct < minPct) continue;
		const k = nameKey(name);
		const d = demKeys.get(k);
		const r = gopKeys.get(k);
		let party: CandidateOdds['party'] = null;
		if (d !== undefined || r !== undefined) {
			party = (d ?? -1) >= (r ?? -1) ? 'Democratic' : 'Republican';
		}
		candidates.push({ name, pct, party });
	}

	candidates.sort((a, b) => b.pct - a.pct);
	return { candidates: candidates.slice(0, limit), fetchedAt: now, ok: candidates.length > 0 };
}
