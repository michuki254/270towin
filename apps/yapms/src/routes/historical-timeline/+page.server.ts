import type { PageServerLoad } from './$types';
import { getElection, listElectionYears } from '$lib/server/historicalElections';

export const prerender = false;

const notable: Record<string, string> = {
	'1788': 'First U.S. presidential election under the Constitution.',
	'1800': 'Contingent election after an Electoral College tie between Jefferson and Burr.',
	'1824': 'Contingent election decided by the House after no candidate won an electoral majority.',
	'1860': 'Lincoln victory during the sectional crisis before the Civil War.',
	'1876': 'Disputed election resolved through an electoral commission.',
	'1912': 'Major third-party challenge split the Republican vote.',
	'1932': 'New Deal realignment election during the Great Depression.',
	'1968': 'Modern political geography shifted during a turbulent election year.',
	'2000': 'Electoral College winner differed from the national popular vote winner.',
	'2016': 'Electoral College winner differed from the national popular vote winner.',
	'2024': 'Most recent completed presidential election in the archive.'
};

export const load: PageServerLoad = () => {
	const events = listElectionYears()
		.map(({ year }) => {
			const election = getElection(year);
			if (election === null || election.winner === null) {
				return null;
			}
			const runnerUp = election.candidates[1];
			const margin = runnerUp ? election.winner.ev - runnerUp.ev : election.winner.ev;
			return {
				year: election.year,
				title: `${election.winner.name} wins with ${election.winner.ev} electoral votes`,
				detail:
					notable[election.year] ??
					`${Math.floor(election.totalEV / 2) + 1} electoral votes were needed; the top-two electoral margin was ${margin}.`,
				color: election.winner.color,
				winner: election.winner.name,
				winnerEV: election.winner.ev,
				winnerPortrait: election.winner.portrait,
				runnerUp: runnerUp?.name ?? null,
				runnerUpEV: runnerUp?.ev ?? null,
				runnerUpPortrait: runnerUp?.portrait ?? null,
				runnerUpColor: runnerUp?.color ?? null,
				margin,
				totalEV: election.totalEV,
				candidateCount: election.candidates.length,
				href: `/historical-presidential-elections/${election.year}`
			};
		})
		.filter((event): event is NonNullable<typeof event> => event !== null)
		.reverse();

	return { events };
};
