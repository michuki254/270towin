import type { PageServerLoad } from './$types';
import historicalGovernorResults from '$lib/data/historical-governor-results.json';

export const load: PageServerLoad = () => ({
	governorDatasetGeneratedAt: historicalGovernorResults.generatedAt
});
