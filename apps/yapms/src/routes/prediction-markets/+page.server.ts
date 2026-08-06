import { fetchGovernorBoard, fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config = { isr: { expiration: 60 } };

export const load: PageServerLoad = async () => {
	const only = ['Democratic', 'Republican'];
	const [presidential, senate, house, governors] = await Promise.all([
		fetchPartyOdds(SLUGS.presidential2028, { only }),
		fetchPartyOdds(SLUGS.senate2026, { only }),
		fetchPartyOdds(SLUGS.house2026, { only }),
		fetchGovernorBoard()
	]);
	return { presidential, senate, house, governors };
};
