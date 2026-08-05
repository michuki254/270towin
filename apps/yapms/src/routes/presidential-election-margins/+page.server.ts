import type { PageServerLoad } from './$types';
import { getElection, listElectionYears } from '$lib/server/historicalElections';

export const prerender = false;

export const load: PageServerLoad = () => {
	const rows = listElectionYears()
		.map(({ year }) => {
			const election = getElection(year);
			if (election === null || election.winner === null) {
				return null;
			}
			const runnerUp = election.candidates[1];
			const margin = runnerUp ? election.winner.ev - runnerUp.ev : election.winner.ev;
			const needed = Math.floor(election.totalEV / 2) + 1;

			return {
				year: election.year,
				winner: election.winner.name,
				winnerColor: election.winner.color,
				winnerEV: election.winner.ev,
				runnerUp: runnerUp?.name ?? 'No runner-up with EV',
				runnerUpEV: runnerUp?.ev ?? 0,
				margin,
				needed,
				totalEV: election.totalEV,
				href: `/historical-presidential-elections/${election.year}`
			};
		})
		.filter((row): row is NonNullable<typeof row> => row !== null)
		.reverse();

	return { rows };
};
