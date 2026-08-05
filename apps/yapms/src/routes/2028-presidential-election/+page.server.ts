import { fetchCandidateBoard } from '$lib/server/polymarket';
import { headshotFor, initialsFor } from '$lib/server/headshots';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config = { isr: { expiration: 60 } };

export const load: PageServerLoad = async () => {
	// Six is enough for an overview page; the full field lives on
	// /2028-presidential-election-interactive-map.
	const board = await fetchCandidateBoard({ limit: 6, minPct: 1 });

	const candidates = board.candidates.map((c) => ({
		...c,
		photo: headshotFor(c.name),
		initials: initialsFor(c.name)
	}));

	return { board: { ...board, candidates } };
};
