import type { PageServerLoad, EntryGenerator } from './$types';
import { error } from '@sveltejs/kit';
import { getSenateElection, listSenateElectionYears } from '$lib/server/historicalSenateElections';

export const prerender = false;

export const entries: EntryGenerator = () => {
	return listSenateElectionYears().map(({ year }) => ({ year }));
};

export const load: PageServerLoad = ({ params }) => {
	const election = getSenateElection(params.year);
	if (election === null) {
		throw error(404, `No Senate election results found for ${params.year}`);
	}

	const years = listSenateElectionYears().map((y) => y.year);
	const index = years.indexOf(election.year);
	const prevYear = index > 0 ? years[index - 1] : null;
	const nextYear = index >= 0 && index < years.length - 1 ? years[index + 1] : null;

	return { election, prevYear, nextYear };
};
