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
