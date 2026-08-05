import { fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config = { isr: { expiration: 60 } };

export const load: PageServerLoad = async () => {
	// National Senate-control market only. Polymarket carries no per-state 2026
	// Senate race markets, so the per-race market column stays unsourced.
	const senate = await fetchPartyOdds(SLUGS.senate2026, {
		only: ['Democratic Party', 'Republican Party']
	});
	return { senate };
};
