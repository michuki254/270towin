import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getGovernorElection } from '$lib/server/historicalGovernorElections';

export const prerender = false;

export const load: PageServerLoad = () => {
	const election = getGovernorElection('2024');
	if (election === null) {
		throw error(404, 'No 2024 governor election results found');
	}
	return {
		election: {
			...election,
			token: '2024310',
			mapRoute: '/app/usa/governors/2024310/results'
		}
	};
};
