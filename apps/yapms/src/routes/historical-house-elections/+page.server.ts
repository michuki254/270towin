import type { PageServerLoad } from './$types';
import { getHouseElection, listHouseElectionYears } from '$lib/server/historicalHouseElections';

export const prerender = false;

export const load: PageServerLoad = () => {
	const elections = listHouseElectionYears()
		.map(({ year }) => {
			const data = getHouseElection(year);
			if (data === null) {
				return null;
			}
			return {
				year: data.year,
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

	return { elections };
};
