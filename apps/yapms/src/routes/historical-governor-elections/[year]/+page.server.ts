import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getGovernorElection, listGovernorElectionYears } from '$lib/server/historicalGovernorElections';

export const prerender = false;

export function entries() {
	return listGovernorElectionYears().map(({ year }) => ({ year }));
}

export const load: PageServerLoad = ({ params }) => {
	const election = getGovernorElection(params.year);
	if (election === null) {
		throw error(404, 'Governor election not found');
	}
	const years = listGovernorElectionYears().map((entry) => entry.year);
	const index = years.indexOf(election.year);

	return {
		election,
		prevYear: index > 0 ? years[index - 1] : null,
		nextYear: index >= 0 && index < years.length - 1 ? years[index + 1] : null
	};
};
