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
};

/**
 * Read one Gamma event and return the "Yes" price of each sub-market as a
 * party probability. In a multi-outcome event each party is its own binary
 * market, so the party's chance is its own Yes price — not a share of a total,
 * which is why these legitimately may not sum to 100.
 */
export async function fetchPartyOdds(
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
export async function fetchGovernorBoard(
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
export async function fetchCandidateBoard(
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
