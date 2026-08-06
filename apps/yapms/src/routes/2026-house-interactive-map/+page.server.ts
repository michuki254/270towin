import { fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	// Polymarket runs a House-control market but nothing per district, so this
	// drives the control panel only.
	const house = await fetchPartyOdds(SLUGS.house2026, {
		// fetchPartyOdds strips the " Party" suffix before filtering, so match the
		// tidied label rather than "Democratic Party".
		only: ['Democratic', 'Republican']
	});
	return { house };
};
