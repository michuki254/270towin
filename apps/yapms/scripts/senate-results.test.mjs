import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { normalizeResults } from './update-senate-results.mjs';

const snapshot = JSON.parse(
	await readFile(new URL('../src/lib/data/senate2026Results.json', import.meta.url), 'utf8')
);
const svg = await readFile(
	new URL('../src/lib/assets/maps/usa/usa-senate-2026-results.svg', import.meta.url),
	'utf8'
);

function feed() {
	return {
		officeName: 'US Senate',
		totalSeats: 100,
		races: snapshot.races.map((race) => ({
			state: race.state,
			stateAbb: race.region.replace('-S', ''),
			slug: `2026-11-03/${race.state.toLowerCase().replaceAll(' ', '-')}-us-senate-general-election`,
			name: race.region.endsWith('-S') ? 'Special Election General' : 'General Election',
			results: {
				candidates: [
					{
						firstName: 'Test',
						lastName: 'Candidate',
						party: { abbrev: 'DEM' },
						winner: false,
						votes: 999999
					}
				]
			}
		}))
	};
}

test('an uncalled vote leader is never colored as a winner', () => {
	const result = normalizeResults(feed(), snapshot.checkedAt);
	assert.equal(result.won.uncalled, 35);
	assert.deepEqual(result.totals, { D: 34, R: 31, I: 0, uncalled: 35 });
	assert.ok(result.races.every((race) => race.party === null && race.winner === null));
});

test('special-election calls map to FL-S and OH-S, not another seat', () => {
	const payload = feed();
	for (const race of payload.races.filter((race) => ['FL', 'OH'].includes(race.stateAbb)))
		race.results.candidates[0].winner = true;
	const result = normalizeResults(payload, snapshot.checkedAt);
	assert.deepEqual(
		result.races.filter((race) => race.party).map((race) => race.region),
		['FL-S', 'OH-S']
	);
});

test('reject incomplete, duplicate, wrong-cycle and ambiguous feeds', () => {
	const incomplete = feed();
	incomplete.races.pop();
	assert.throws(() => normalizeResults(incomplete, snapshot.checkedAt));
	const duplicate = feed();
	duplicate.races[1] = duplicate.races[0];
	assert.throws(() => normalizeResults(duplicate, snapshot.checkedAt));
	const wrongYear = feed();
	wrongYear.races[0].slug = '2024-11-05/alaska';
	assert.throws(() => normalizeResults(wrongYear, snapshot.checkedAt));
	const ambiguous = feed();
	ambiguous.races[0].results.candidates = [
		{ firstName: 'A', lastName: 'A', winner: true, party: { abbrev: 'DEM' } },
		{ firstName: 'B', lastName: 'B', winner: true, party: { abbrev: 'GOP' } }
	];
	assert.throws(() => normalizeResults(ambiguous, snapshot.checkedAt));
});

test('all 35 SVG assignments match reported calls and the chamber totals', () => {
	const candidates = JSON.parse(svg.match(/\scandidates='([^']+)'/)[1]);
	const totals = Object.fromEntries(
		candidates.map((candidate) => [candidate.id, candidate.defaultCount])
	);
	totals[''] = 0;
	const regions = [...svg.matchAll(/<(?:path|rect|g)\b[^>]*\sregion="([^"]+)"[^>]*>/g)];
	assert.equal(regions.length, 50);
	for (const race of snapshot.races) {
		const tag = regions.find((region) => region[1] === race.region)?.[0];
		assert.ok(tag, `Missing ${race.region}`);
		const assignment = JSON.parse(tag.match(/\scandidates='([^']+)'/)[1]);
		const expected =
			race.party === 'D' ? '0' : race.party === 'R' ? '1' : race.party === 'I' ? '2' : '';
		assert.deepEqual(assignment, [{ candidate: expected, count: 1, margin: 0 }], race.region);
		totals[expected]++;
	}
	assert.equal(snapshot.races.length, 35);
	assert.deepEqual(totals, {
		0: snapshot.totals.D,
		1: snapshot.totals.R,
		...(snapshot.totals.I ? { 2: snapshot.totals.I } : {}),
		'': snapshot.totals.uncalled
	});
	assert.equal(
		Object.values(totals).reduce((sum, count) => sum + count, 0),
		100
	);
	assert.ok(svg.includes(`results-checked-at="${snapshot.checkedAt}"`));
});
