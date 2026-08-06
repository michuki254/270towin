import { fetchGovernorBoard } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config = { isr: { expiration: 120 } };

export const load: PageServerLoad = async () => {
	// Unlike the Senate and House, Polymarket prices the individual governor
	// races, so this page can show a real number per state.
	const governors = await fetchGovernorBoard();
	return { governors };
};
