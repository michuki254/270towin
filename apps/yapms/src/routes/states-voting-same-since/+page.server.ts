import type { PageServerLoad } from './$types';
import { stateConsistencySummary } from '$lib/server/statePresidentialHistory';

export const prerender = false;

export const load: PageServerLoad = () => {
	const since2008 = stateConsistencySummary(2008);
	const since2016 = stateConsistencySummary(2016);
	const sameSince2008 = since2008.filter((state) => !state.changed);
	const changedSince2008 = since2008.filter((state) => state.changed);
	const changedSince2016 = since2016.filter((state) => state.changed);

	return {
		groups: [
			{ label: 'Same winner color family since 2008', count: sameSince2008.length },
			{ label: 'Changed at least once since 2008', count: changedSince2008.length },
			{ label: 'Changed in the last two presidential cycles', count: changedSince2016.length }
		],
		sameSince2008,
		changedSince2008
	};
};
