import type { PageServerLoad } from './$types';
import { getSenateElection } from '$lib/server/historicalSenateElections';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageServerLoad = () => {
	const election = getSenateElection('2024');
	if (election === null) {
		throw error(404, 'No 2024 Senate election results found');
	}
	return { election };
};
