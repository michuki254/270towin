import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getHouseElection, listHouseElectionYears } from '$lib/server/historicalHouseElections';

export const prerender = false;

export function entries() {
	return listHouseElectionYears().map(({ year }) => ({ year }));
}

export const load: PageServerLoad = ({ params }) => {
	const election = getHouseElection(params.year);
	if (election === null) {
		throw error(404, 'House election not found');
	}
	const years = listHouseElectionYears().map((entry) => entry.year);
	const index = years.indexOf(election.year);

	return {
		election,
		prevYear: index > 0 ? years[index - 1] : null,
		nextYear: index >= 0 && index < years.length - 1 ? years[index + 1] : null
	};
};
