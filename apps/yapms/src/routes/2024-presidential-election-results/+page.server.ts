import type { PageServerLoad } from './$types';
import { getElection } from '$lib/server/historicalElections';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageServerLoad = () => {
	const election = getElection('2024');
	if (election === null) {
		throw error(404, 'No 2024 presidential election results found');
	}
	return { election };
};
