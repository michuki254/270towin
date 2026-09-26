import type { PageServerLoad } from './$types';
import {
	getGovernorElection,
	listGovernorElectionYears
} from '$lib/server/historicalGovernorElections';

export const prerender = false;

export const load: PageServerLoad = () => {
	const elections = listGovernorElectionYears()
		.map(({ year }) => {
			const data = getGovernorElection(year);
			if (data === null) {
				return null;
			}
			return {
				year: data.year,
				dataSnapshotAt: data.dataSnapshotAt,
				controlName: data.controlName,
				controlSeats: data.controlSeats,
				winnerColor: data.winner?.color ?? '#888888',
				winnerLogo: data.winner?.logo ?? null,
				totalSeats: data.totalSeats,
				seatsDecided: data.seatsDecided,
				hasMap: data.hasMap
			};
		})
		.filter((e): e is NonNullable<typeof e> => e !== null)
		.reverse();

	const decadeStarts = [
		...new Set(elections.map((e) => Math.floor(Number(e.year) / 10) * 10))
	].sort((a, b) => b - a);
	const decades = decadeStarts.map((start) => ({
		id: `decade-${start}`,
		label: `${start}s`,
		elections: elections.filter((e) => Math.floor(Number(e.year) / 10) * 10 === start)
	}));

	return {
		elections,
		decades,
		dataSnapshotAt: elections[0]?.dataSnapshotAt ?? null,
		yearRange: elections.length
			? { first: elections[elections.length - 1].year, last: elections[0].year }
			: null
	};
};
