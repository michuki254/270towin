import type { RequestHandler } from './$types';
import stateOfficials from '$lib/data/state-officials.generated.json';
import senate from '$lib/data/historical-senate-results.json';
import house from '$lib/data/historical-house-results.json';
import governor from '$lib/data/historical-governor-results.json';
import { listElectionYears } from '$lib/server/historicalElections';

// Content routes only — the map editor (/app), share links (/view) and API
// stay out. Interactive maps first: they are the pages we want ranked.
const STATIC_ROUTES = [
	'/',
	'/2028-presidential-election-interactive-map',
	'/2026-senate-interactive-map',
	'/2026-house-interactive-map',
	'/2026-governor-interactive-map',
	'/2028-presidential-election',
	'/2026-senate-election',
	'/2026-house-election',
	'/2026-governor-election',
	'/news',
	'/prediction-markets',
	'/forecasts',
	'/polls',
	'/elected-officials',
	'/state-primary-dates',
	'/state-primary-results',
	'/election-results',
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
	'/historical-senate-elections',
	'/historical-house-elections',
	'/historical-governor-elections',
	'/historical-timeline',
	'/presidential-election-margins',
	'/electoral-college-tie',
	'/maine-nebraska-split-electoral-votes',
	'/state-trifectas',
	'/state-voting-history',
	'/state-voting-since-1900',
	'/states-voting-same-since',
	'/senate-50-50',
	'/house-crossover-districts',
	'/house-retirements',
	'/uncontested-house-races',
	'/contact-senators',
	'/poll-closing-times',
	'/election-countdown-clock',
	'/state-election-results',
	'/maps',
	'/site-map',
	'/about',
	'/election-data-methodology',
	'/contact',
	'/advertising',
	'/privacy'
];

const cycleYears = (data: { cycles?: Record<string, unknown> }) =>
	Object.keys(data.cycles ?? {}).filter((k) => /^\d{4}$/.test(k));

export const GET: RequestHandler = ({ url }) => {
	const urls: string[] = [...STATIC_ROUTES];
	for (const slug of Object.keys(stateOfficials)) {
		urls.push(`/states/${slug}`);
		urls.push(`/states/${slug}/election-results`);
	}
	for (const e of listElectionYears()) urls.push(`/historical-presidential-elections/${e.year}`);
	for (const y of cycleYears(senate)) urls.push(`/historical-senate-elections/${y}`);
	for (const y of cycleYears(house)) urls.push(`/historical-house-elections/${y}`);
	for (const y of cycleYears(governor)) urls.push(`/historical-governor-elections/${y}`);

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		urls.map((p) => `  <url><loc>${url.origin}${p}</loc></url>`).join('\n') +
		`\n</urlset>\n`;
	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
