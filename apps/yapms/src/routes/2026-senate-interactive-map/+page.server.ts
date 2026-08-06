import { fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	// National Senate-control market only. Polymarket carries no per-state 2026
	// Senate race markets, so the per-race market column stays unsourced.
	const senate = await fetchPartyOdds(SLUGS.senate2026, {
		// Match the TIDIED label: fetchPartyOdds strips the " Party" suffix
		// before filtering, so "Democratic Party" would never match.
		only: ['Democratic', 'Republican']
	});
	return { senate };
};
