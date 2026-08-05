import type { PageServerLoad } from './$types';
import { getSenateElection, listSenateElectionYears } from '$lib/server/historicalSenateElections';

export const prerender = false;

export const load: PageServerLoad = () => {
	const elections = listSenateElectionYears()
		.map(({ year }) => {
			const data = getSenateElection(year);
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
				hasMap: data.hasMap,
				isControlMap: data.isControlMap
			};
		})
		.filter((e): e is NonNullable<typeof e> => e !== null)
		.reverse();

	return { elections };
};
