import type { PageServerLoad } from './$types';
import { stateConsistencySummary } from '$lib/server/statePresidentialHistory';

export const prerender = false;

export const load: PageServerLoad = () => {
	const states = stateConsistencySummary(1900).map((state) => {
		const democratic = state.results.filter((result) => result.partyFamily === 'Democratic').length;
		const republican = state.results.filter((result) => result.partyFamily === 'Republican').length;
		const other = state.results.length - democratic - republican;
		return {
			state: state.state,
			region: state.region,
			democratic,
			republican,
			other,
			total: state.results.length,
			lastWinner: state.results.at(-1)?.winner ?? 'Unknown',
			lastFamily: state.results.at(-1)?.partyFamily ?? 'Other'
		};
	});

	return { states };
};
