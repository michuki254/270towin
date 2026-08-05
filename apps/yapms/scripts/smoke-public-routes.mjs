const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://localhost:8081';

const routes = [
	'/',
	'/news',
	'/site-map',
	'/maps',
	'/states',
	'/states/texas',
	'/states/texas/voting-history',
	'/states/texas/election-results',
	'/states/texas/primary-results',
	'/states/texas/trifectas',
	'/elected-officials',
	'/contact-senators',
	'/election-results',
	'/2028-presidential-election',
	'/2028-presidential-election-interactive-map',
	'/2026-senate-election',
	'/2026-senate-interactive-map',
	'/2026-house-election',
	'/2026-house-interactive-map',
	'/2026-governor-election',
	'/2026-governor-interactive-map',
	'/2024-election-results',
	'/2024-presidential-election-results',
	'/2024-senate-election-results',
	'/2024-house-election-results',
	'/2024-governor-election-results',
	'/2022-election-results',
	'/2022-senate-election-results',
	'/2022-house-election-results',
	'/2022-governor-election-results',
	'/2020-presidential-election-results',
	'/2020-senate-election-results',
	'/2020-house-election-results',
	'/2020-governor-election-results',
	'/2016-presidential-election-results',
	'/historical-presidential-elections',
	'/historical-presidential-elections/2024',
	'/historical-senate-elections',
	'/historical-senate-elections/2024',
	'/historical-house-elections',
	'/historical-house-elections/2024',
	'/historical-governor-elections',
	'/historical-governor-elections/2024',
	'/forecasts',
	'/polls',
	'/prediction-markets',
	'/poll-closing-times',
	'/state-primary-dates',
	'/state-voting-history',
	'/state-trifectas',
	'/state-primary-results',
	'/state-election-results',
	'/historical-timeline',
	'/presidential-election-margins',
	'/states-voting-same-since',
	'/state-voting-since-1900',
	'/house-retirements',
	'/house-crossover-districts',
	'/uncontested-house-races',
	'/senate-50-50',
	'/electoral-college-tie',
	'/maine-nebraska-split-electoral-votes',
	'/states-visited-map',
	'/fantasy-election-maps',
	'/simulator',
	'/about',
	'/contact',
	'/advertising',
	'/privacy'
];

let failed = false;

for (const route of routes) {
	const url = new URL(route, baseUrl);
	try {
		const response = await fetch(url);
		if (!response.ok) {
			failed = true;
			console.error(`${response.status} ${route}`);
			continue;
		}
		console.log(`${response.status} ${route}`);
	} catch (error) {
		failed = true;
		console.error(`ERR ${route}: ${error instanceof Error ? error.message : String(error)}`);
	}
}

if (failed) {
	process.exitCode = 1;
}
