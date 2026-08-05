import { fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;
/* Re-read prices at most once a minute. Prediction-market odds move slowly
 * enough that a minute is invisible to a reader, and it keeps us off
 * Polymarket's API on every page view. */
export const config = { isr: { expiration: 60 } };

export const load: PageServerLoad = async () => {
	const presidential = await fetchPartyOdds(SLUGS.presidential2028);
	return { presidential };
};
