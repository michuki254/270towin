import { fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;
/* The once-a-minute re-read this used to describe was declared as
 * `config = { isr: { expiration: 60 } }`, which does nothing under
 * adapter-node — it is an adapter-vercel feature — so prices were in fact
 * re-read on every page view. The throttle now lives in $lib/server/polymarket
 * as a real cache, and applies to every caller rather than page by page. */

export const load: PageServerLoad = async () => {
	const presidential = await fetchPartyOdds(SLUGS.presidential2028);
	return { presidential };
};
