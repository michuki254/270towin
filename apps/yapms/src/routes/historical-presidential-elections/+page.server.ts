import type { PageServerLoad } from './$types';
import { listElectionYears, getElection } from '$lib/server/historicalElections';

export const prerender = true;

export const load: PageServerLoad = () => {
	const elections = listElectionYears()
		.map(({ year }) => {
			const data = getElection(year);
			if (data === null) {
				return null;
			}
			return {
				year: data.year,
				winner: data.winner?.name ?? 'Unknown',
				winnerColor: data.winner?.color ?? '#888888',
				winnerEV: data.winner?.ev ?? 0,
				winnerPortrait: data.winner?.portrait ?? null,
				totalEV: data.totalEV
			};
		})
		.filter((e): e is NonNullable<typeof e> => e !== null)
		.reverse(); // newest first

	return { elections };
};
