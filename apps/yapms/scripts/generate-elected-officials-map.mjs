import fs from 'node:fs/promises';
import path from 'node:path';

const svgPath = path.resolve('apps/yapms/src/lib/assets/maps/usa/usa-presidential-2024310-results.svg');
const stateDataPath = path.resolve('apps/yapms/src/lib/data/state-officials.generated.json');
const outPath = path.resolve('apps/yapms/src/lib/data/elected-officials-map.generated.json');

const stateData = JSON.parse(await fs.readFile(stateDataPath, 'utf8'));
const byAbbreviation = new Map(
	Object.values(stateData).map((state) => [state.abbreviation.toLowerCase(), state])
);
const svg = await fs.readFile(svgPath, 'utf8');
const attr = (block, name) =>
	block.match(new RegExp(`${name}="([^"]*)"`))?.[1] ??
	block.match(new RegExp(`${name}='([^']*)'`))?.[1] ??
	'';
const winnerFrom = (block) => (attr(block, 'candidates').includes('"candidate":"0"') ? 'Democratic' : 'Republican');
const stateCodeFrom = (shortName) => shortName.match(/^([a-z]{2})(?:-.+)?$/)?.[1] ?? '';

const byState = new Map();
const atLargeWinners = new Map();

function pushPath(shortName, block, d) {
	if (!d || block.includes('map-type="button"')) return;
	const stateCode = stateCodeFrom(shortName);
	const state = byAbbreviation.get(stateCode);
	if (!state) return;

	const existing = byState.get(state.slug) ?? {
		abbreviation: state.abbreviation,
		name: state.name,
		slug: state.slug,
		electoralVotes: 0,
		paths: []
	};

	existing.paths.push({
		d,
		winner: winnerFrom(block),
		label: shortName
	});
	existing.electoralVotes += Number.parseInt(attr(block, 'value'), 10) || 0;
	byState.set(state.slug, existing);
}

for (const match of svg.matchAll(/<path\b([\s\S]*?)\/>/g)) {
	const block = match[1];
	const shortName = attr(block, 'short-name');
	if (!/^([a-z]{2})(?:-.+)?$/.test(shortName)) continue;
	if (block.includes('map-type="button"') && shortName.endsWith('-al')) {
		const stateCode = stateCodeFrom(shortName);
		const state = byAbbreviation.get(stateCode);
		if (state) atLargeWinners.set(state.slug, winnerFrom(block));
	}
	pushPath(shortName, block, attr(block, 'd'));
}

for (const match of svg.matchAll(/<g\b(?=[^>]*short-name=)([\s\S]*?)>([\s\S]*?)<\/g>/g)) {
	const block = match[1];
	const inner = match[2];
	const shortName = attr(block, 'short-name');
	if (!/^([a-z]{2})(?:-.+)?$/.test(shortName)) continue;

	for (const pathMatch of inner.matchAll(/<path\b([\s\S]*?)(?:\/>|><\/path>)/g)) {
		pushPath(shortName, `${block} ${pathMatch[1]}`, attr(pathMatch[1], 'd'));
	}
}

const states = [...byState.values()]
	.map((state) => ({
		...state,
		electoralVotes:
			state.name === 'Maine' || state.name === 'Nebraska'
				? state.electoralVotes + 2
				: state.electoralVotes,
		winner:
			atLargeWinners.get(state.slug) ??
			(state.paths.filter((piece) => piece.winner === 'Democratic').length >
			state.paths.filter((piece) => piece.winner === 'Republican').length
				? 'Democratic'
				: 'Republican')
	}))
	.filter((state) => state.paths.length > 0)
	.sort((a, b) => a.name.localeCompare(b.name));

await fs.writeFile(
	outPath,
	`${JSON.stringify(
		{
			viewBox: attr(svg, 'viewBox') || '0 0 959 593',
			states
		},
		null,
		2
	)}\n`
);
console.log(`Wrote ${states.length} clickable state paths to ${outPath}`);
