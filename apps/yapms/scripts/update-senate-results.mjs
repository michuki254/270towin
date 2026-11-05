import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const sourceUrl = 'https://race-api-proxy-production.decisiondeskhq.workers.dev/senate';
const states =
	'AK AL AR CO DE FL GA IA ID IL KS KY LA MA ME MI MN MS MT NC NE NH NJ NM OH OK OR RI SC SD TN TX VA WV WY'.split(
		' '
	);

// Only explicit race calls count. A vote leader or a forecast is never a winner.
export function normalizeResults(payload, checkedAt) {
	if (
		payload?.officeName !== 'US Senate' ||
		payload.totalSeats !== 100 ||
		payload.races?.length !== 35
	) {
		throw new Error('Expected the 35 general-election races for the 100-seat Senate.');
	}
	const seen = new Set();
	const races = payload.races
		.map((race) => {
			const state = race.stateAbb;
			if (!states.includes(state) || seen.has(state) || !race.slug?.startsWith('2026-11-03/')) {
				throw new Error(`Unexpected, duplicate, or wrong-cycle race: ${state}`);
			}
			seen.add(state);
			const special = state === 'FL' || state === 'OH';
			if (special !== race.name?.includes('Special'))
				throw new Error(`Wrong election type: ${state}`);
			if (!Array.isArray(race.results?.candidates) || !race.results.candidates.length) {
				throw new Error(`Missing candidates: ${state}`);
			}
			const winners = race.results.candidates.filter((candidate) => candidate.winner === true);
			if (winners.length > 1) throw new Error(`Ambiguous race call: ${state}`);
			const winner = winners[0];
			if (winner && (!winner.party?.abbrev || !winner.lastName))
				throw new Error(`Incomplete winner: ${state}`);
			return {
				region: special ? `${state}-S` : state,
				state: race.state,
				party: winner
					? winner.party.abbrev === 'DEM'
						? 'D'
						: winner.party.abbrev === 'GOP'
							? 'R'
							: 'I'
					: null,
				winner: winner ? `${winner.firstName ?? ''} ${winner.lastName}`.trim() : null,
				sourceUpdatedAt: race.results.lastUpdated,
				url: `https://www.270towin.com/2026-election-results-live/state/${race.state.toLowerCase().replaceAll(' ', '-')}/`
			};
		})
		.sort((a, b) => a.state.localeCompare(b.state));
	const holdovers = { D: 34, R: 31, I: 0 };
	const won = { D: 0, R: 0, I: 0, uncalled: 0 };
	for (const race of races) won[race.party ?? 'uncalled']++;
	return {
		checkedAt,
		source: 'Decision Desk HQ',
		sourceUrl,
		referenceUrl: 'https://www.270towin.com/2026-election-results-live/',
		holdovers,
		won,
		totals: { D: holdovers.D + won.D, R: holdovers.R + won.R, I: won.I, uncalled: won.uncalled },
		races
	};
}

export function renderResultsMap(template, snapshot) {
	const candidates = [
		{
			id: '0',
			name: 'Democrats',
			defaultCount: snapshot.holdovers.D,
			margins: ['#1C408C', '#577CCC', '#8AAFFF', '#949BB3'].map((color) => ({ color }))
		},
		{
			id: '1',
			name: 'Republicans',
			defaultCount: snapshot.holdovers.R,
			margins: ['#BF1D29', '#FF5865', '#FF8B98', '#CF8980'].map((color) => ({ color }))
		}
	];
	if (snapshot.won.I)
		candidates.push({
			id: '2',
			name: 'Independent / other',
			defaultCount: 0,
			margins: ['#766482', '#9680a6', '#b9a6c4', '#d8cddd'].map((color) => ({ color }))
		});
	const candidateIds = { D: '0', R: '1', I: '2' };
	const byRegion = new Map(snapshot.races.map((race) => [race.region, race]));
	const painted = new Set();
	let svg = template
		.replace(/\bdate="[^"]*"/, 'date="2026"')
		.replace('variant="blank"', 'variant="results"')
		.replace('title="USA 2026 Senate"', 'title="2026 Senate Reported Results"')
		.replace(/\bcandidates='[^']*'/, `candidates='${JSON.stringify(candidates)}'`)
		.replace(
			'<svg',
			`<svg\n\tdefault-mode="fill"\n\toriginal-source='${JSON.stringify([snapshot.referenceUrl, sourceUrl])}'\n\tresults-checked-at="${snapshot.checkedAt}"\n\ttossup-candidate='${JSON.stringify({ id: '', name: 'Uncalled', defaultCount: 0, margins: [{ color: '#C9C09B' }] })}'`
		);
	svg = svg.replace(/<(path|rect|g)\b[^>]*\sregion="([^"]+)"[^>]*>/g, (tag, _element, region) => {
		const race = byRegion.get(region);
		if (!race) return tag;
		if (/\sdisabled=/.test(tag) || painted.has(region))
			throw new Error(`Invalid map region: ${region}`);
		painted.add(region);
		const assignment = JSON.stringify([
			{ candidate: race.party ? candidateIds[race.party] : '', count: 1, margin: 0 }
		]);
		return tag.replace(/(\/?>)$/, ` candidates='${assignment}' $1`);
	});
	if (painted.size !== 35) throw new Error(`Only ${painted.size} of 35 races matched the map.`);
	return svg;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(10000) });
	if (!response.ok) throw new Error(`Results feed returned ${response.status}`);
	const snapshot = normalizeResults(await response.json(), new Date().toISOString());
	const template = await readFile(
		new URL('../src/lib/assets/maps/usa/usa-senate-2026-blank.svg', import.meta.url),
		'utf8'
	);
	const svg = renderResultsMap(template, snapshot);
	await writeFile(
		new URL('../src/lib/data/senate2026Results.json', import.meta.url),
		JSON.stringify(snapshot, null, '\t') + '\n'
	);
	await writeFile(
		new URL('../src/lib/assets/maps/usa/usa-senate-2026-results.svg', import.meta.url),
		svg
	);
	console.log(
		`Updated ${35 - snapshot.won.uncalled}/35 calls at ${snapshot.checkedAt}:`,
		snapshot.totals
	);
}
