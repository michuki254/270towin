import { fetchCandidateBoard, fetchPartyOdds, SLUGS } from '$lib/server/polymarket';
import { headshotFor, initialsFor } from '$lib/server/headshots';
import type { PageServerLoad } from './$types';

export const prerender = false;

/** First Tuesday after the first Monday in November 2028. */
const ELECTION_DAY = '2028-11-07';

export const load: PageServerLoad = async () => {
	const [party, board] = await Promise.all([
		fetchPartyOdds(SLUGS.presidential2028, { only: ['Democratic', 'Republican'] }),
		fetchCandidateBoard({ limit: 12, minPct: 1 })
	]);

	// Photos are attached here rather than in the component: headshotFor reads a
	// build-time glob, which belongs on the server side of the boundary.
	const candidates = board.candidates.map((c) => ({
		...c,
		photo: headshotFor(c.name),
		initials: initialsFor(c.name)
	}));

	const daysToElection = Math.max(
		0,
		Math.ceil((Date.parse(`${ELECTION_DAY}T00:00:00Z`) - Date.now()) / 86_400_000)
	);

	return { party, board: { ...board, candidates }, daysToElection };
};
