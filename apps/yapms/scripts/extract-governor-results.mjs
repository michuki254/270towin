import fs from 'fs';
import path from 'path';

const DATA_FILE = 'apps/yapms/src/lib/data/historical-governor-results.json';
const MAP_DIR = 'apps/yapms/src/lib/assets/maps/usa';
const WIKI_RAW_BASE = 'https://en.wikipedia.org/w/index.php?title=';
const PRESERVED_RESULT_MAP_YEARS = new Set(['2022']);

const PARTY_INFO = {
	D: { id: '0', name: 'Democrats', color: '#1C408C' },
	R: { id: '1', name: 'Republicans', color: '#BF1D29' },
	I: { id: '2', name: 'Independents', color: '#6b7280' },
	O: { id: '3', name: 'Other', color: '#8a6f45' }
};

const STATE_ABBR = {
	Alabama: 'AL',
	Alaska: 'AK',
	Arizona: 'AZ',
	Arkansas: 'AR',
	California: 'CA',
	Colorado: 'CO',
	Connecticut: 'CT',
	Delaware: 'DE',
	Florida: 'FL',
	Georgia: 'GA',
	Hawaii: 'HI',
	Idaho: 'ID',
	Illinois: 'IL',
	Indiana: 'IN',
	Iowa: 'IA',
	Kansas: 'KS',
	Kentucky: 'KY',
	Louisiana: 'LA',
	Maine: 'ME',
	Maryland: 'MD',
	Massachusetts: 'MA',
	Michigan: 'MI',
	Minnesota: 'MN',
	Mississippi: 'MS',
	Missouri: 'MO',
	Montana: 'MT',
	Nebraska: 'NE',
	Nevada: 'NV',
	'New Hampshire': 'NH',
	'New Jersey': 'NJ',
	'New Mexico': 'NM',
	'New York': 'NY',
	'North Carolina': 'NC',
	'North Dakota': 'ND',
	Ohio: 'OH',
	Oklahoma: 'OK',
	Oregon: 'OR',
	Pennsylvania: 'PA',
	'Rhode Island': 'RI',
	'South Carolina': 'SC',
	'South Dakota': 'SD',
	Tennessee: 'TN',
	Texas: 'TX',
	Utah: 'UT',
	Vermont: 'VT',
	Virginia: 'VA',
	Washington: 'WA',
	'West Virginia': 'WV',
	Wisconsin: 'WI',
	Wyoming: 'WY'
};

function cleanWiki(text) {
	return text
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<ref[\s\S]*?<\/ref>/gi, '')
		.replace(/<ref[^>]*\/>/gi, '')
		.replace(/\{\{efn[\s\S]*?\}\}/gi, '')
		.replace(/\{\{small\|([^{}]*)\}\}/gi, '$1')
		.replace(/\{\{sortname\|([^|{}]+)\|([^|{}]+)(?:\|[^{}]*)?\}\}/gi, '$1 $2')
		.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1')
		.replace(/\[\[([^\]]+)\]\]/g, '$1')
		.replace(/'''/g, '')
		.replace(/''/g, '')
		.replace(/<br\s*\/?\s*>/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseNumber(text) {
	const match = String(text).replace(/'''/g, '').match(/-?\d+/);
	return match ? Number(match[0]) : 0;
}

function partyCodeFromText(text) {
	const clean = cleanWiki(text).toLowerCase();
	if (/democratic|democrat|\bdf[lm]\b/.test(clean)) {
		return 'D';
	}
	if (/republican|\bgop\b/.test(clean)) {
		return 'R';
	}
	if (/independent|a connecticut party|nonpartisan/.test(clean)) {
		return 'I';
	}
	if (/(libertarian|green|reform|united we stand|constitution|american|progressive|conservative)/.test(clean)) {
		return 'O';
	}
	return null;
}

function tableBlocks(raw) {
	const blocks = [];
	let index = 0;
	while (index < raw.length) {
		const start = raw.indexOf('{|', index);
		if (start === -1) {
			break;
		}
		const end = raw.indexOf('\n|}', start);
		if (end === -1) {
			break;
		}
		blocks.push(raw.slice(start, end));
		index = end + 3;
	}
	return blocks;
}

function stateFromRow(row) {
	const header = row.split('\n').find((line) => line.trim().startsWith('!')) ?? '';
	const link = header.match(/\[\[(?:#[^|\]]+|[^|\]]+gubernatorial election)\|([^\]]+)\]\]/i);
	const state = cleanWiki(link?.[1] ?? header.replace(/^!+/, ''));
	return STATE_ABBR[state] ? state : null;
}

function winnerTextFromCandidates(row) {
	const lines = row.split('\n').filter((line) => line.trim().startsWith('*'));
	return lines.find((line) => /\{\{\s*aye\s*\}\}/i.test(line)) ?? null;
}

function resultCell(row) {
	const cells = row
		.split('\n')
		.filter((line) => line.trim().startsWith('|') && !line.trim().startsWith('|-'));
	return cells.at(-1) ?? '';
}

function findStateTable(raw) {
	const tables = tableBlocks(raw).filter(
		(table) =>
			/wikitable/i.test(table) &&
			/!\s*States?\b/i.test(table) &&
			/(Candidates|Result)/i.test(table) &&
			/\[\[(?:#|[0-9]{4} [^\]]*gubernatorial election)/i.test(table)
	);
	return tables.find((table) => /!\s*Candidates\b/i.test(table)) ?? tables.find((table) => /!\s*Result\b/i.test(table));
}

function parseRaces(raw) {
	const table = findStateTable(raw);
	if (!table) {
		return null;
	}

	const races = {};
	const raceCounts = {};
	for (const row of table.split('\n|-')) {
		const state = stateFromRow(row);
		if (!state) {
			continue;
		}
		const party = partyCodeFromText(winnerTextFromCandidates(row) ?? resultCell(row));
		if (!party) {
			continue;
		}
		const abbr = STATE_ABBR[state];
		races[abbr] = { party };
		raceCounts[party] = (raceCounts[party] ?? 0) + 1;
	}

	return Object.keys(races).length > 0 ? { races, raceCounts } : null;
}

function parseBalance(raw) {
	const infobox = raw.match(/\{\{Infobox election[\s\S]*?\n\}\}/)?.[0] ?? '';
	const byIndex = {};
	for (const match of infobox.matchAll(/\|\s*(party|seats_after|2data)(\d+)\s*=\s*([^\n]+)/g)) {
		const [, key, index, value] = match;
		byIndex[index] ??= {};
		byIndex[index][key] = value;
	}

	const balance = {};
	const seatsWon = {};
	for (const row of Object.values(byIndex)) {
		const party = partyCodeFromText(row.party ?? '');
		if (!party) {
			continue;
		}
		balance[party] = (balance[party] ?? 0) + parseNumber(row.seats_after ?? 0);
		seatsWon[party] = (seatsWon[party] ?? 0) + parseNumber(row['2data'] ?? 0);
	}
	const total = Object.values(balance).reduce((sum, count) => sum + count, 0);
	if (total > 0 && total < 50) {
		balance.O = (balance.O ?? 0) + (50 - total);
	}
	return Object.keys(balance).length > 0 ? { balance, seatsWon } : null;
}

async function fetchWikiRaw(year) {
	const title = `${year}_United_States_gubernatorial_elections`;
	const url = `${WIKI_RAW_BASE}${encodeURIComponent(title)}&action=raw`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	const raw = await response.text();
	const redirect = raw.match(/^#REDIRECT\s*\[\[([^\]]+)\]\]/i);
	if (!redirect) {
		return raw;
	}
	const redirectUrl = `${WIKI_RAW_BASE}${encodeURIComponent(redirect[1])}&action=raw`;
	const redirectResponse = await fetch(redirectUrl);
	if (!redirectResponse.ok) {
		throw new Error(`Failed to fetch ${redirectUrl}: ${redirectResponse.status}`);
	}
	return redirectResponse.text();
}

function normalizeTemplate(template, year, candidates) {
	const candidateAttr = JSON.stringify(
		candidates.map((candidate) => ({
			id: candidate.id,
			name: candidate.name,
			defaultCount: candidate.defaultCount,
			margins: [
				{ color: candidate.color },
				{ color: candidate.color },
				{ color: candidate.color },
				{ color: candidate.color }
			]
		}))
	).replace(/'/g, '&apos;');

	return template
		.replace(/date="[^"]*"/, `date="${year}"`)
		.replace(/variant="[^"]*"/, 'variant="results"')
		.replace(/title="[^"]*"/, `title="USA ${year} Gubernatorial Results"`)
		.replace(/candidates='[^']*'/, `candidates='${candidateAttr}'`)
		.replace(/\s+(?:permaLocked|permalocked|locked|disabled)="[^"]*"/g, '')
		.replace(/\s+(?:permaLocked|permalocked|locked|disabled)(?=[\s/>])/g, '');
}

function addRegionResults(svg, races, partyIdByCode) {
	return svg.replace(/<([a-zA-Z][\w:-]*)\b(?=[^>]*\sregion="[^"]+")[^>]*>/g, (tagText) => {
		const region = tagText.match(/\sregion="([^"]+)"/)?.[1];
		const race = region ? races[region] : null;
		if (!region || !race) {
			return tagText.replace(/\s+candidates='[^']*'/g, '').replace(/\s+disabled="[^"]*"/g, ' disabled="true"');
		}
		const candidate = partyIdByCode[race.party];
		if (!candidate) {
			return tagText;
		}
		const attr = JSON.stringify([{ candidate, count: 1, margin: 0 }]);
		const cleaned = tagText
			.replace(/\s+candidates='[^']*'/g, '')
			.replace(/\s+disabled="[^"]*"/g, '')
			.replace(/\s+disabled(?=[\s/>])/g, '');
		return cleaned.replace(/^<([a-zA-Z][\w:-]*)\b/, `<$1\n\t\t\tcandidates='${attr}'`);
	});
}

async function main() {
	const cycles = {};
	for (let year = 1976; year <= 2024; year += 1) {
		try {
			const raw = await fetchWikiRaw(year);
			const raceData = parseRaces(raw);
			const balanceData = parseBalance(raw);
			if (!raceData || !balanceData) {
				continue;
			}
			cycles[String(year)] = {
				year: String(year),
				token: String(year),
				races: raceData.races,
				raceCounts: raceData.raceCounts,
				officialBalance: balanceData.balance,
				seatsWon: balanceData.seatsWon,
				officialTotalSeats: Object.values(balanceData.balance).reduce((sum, count) => sum + count, 0),
				source: `${WIKI_RAW_BASE}${encodeURIComponent(`${year}_United_States_gubernatorial_elections`)}&action=raw`
			};
		} catch (error) {
			console.warn(`Skipped ${year}: ${error.message}`);
		}
	}

	const output = {
		source: 'https://en.wikipedia.org/wiki/United_States_gubernatorial_elections',
		generatedAt: new Date().toISOString(),
		parties: PARTY_INFO,
		cycles: Object.fromEntries(Object.entries(cycles).sort(([a], [b]) => Number(a) - Number(b)))
	};

	fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(output, null, '\t')}\n`);

	if (process.argv.includes('--write-maps')) {
		const template = fs.readFileSync(path.join(MAP_DIR, 'usa-governors-2024-blank.svg'), 'utf8');
		for (const [year, cycle] of Object.entries(output.cycles)) {
			const file = path.join(MAP_DIR, `usa-governors-${year}-results.svg`);
			if (PRESERVED_RESULT_MAP_YEARS.has(year) && fs.existsSync(file)) {
				continue;
			}
			if (fs.existsSync(file) && !process.argv.includes('--force')) {
				continue;
			}
			const partyCodes = [
				...new Set([...Object.keys(cycle.officialBalance ?? {}), ...Object.keys(cycle.raceCounts ?? {})])
			].filter((party) => PARTY_INFO[party]);
			const candidates = partyCodes.map((party) => ({
				...PARTY_INFO[party],
				defaultCount: Math.max(0, (cycle.officialBalance[party] ?? 0) - (cycle.raceCounts[party] ?? 0))
			}));
			const partyIdByCode = Object.fromEntries(candidates.map((candidate) => [
				Object.entries(PARTY_INFO).find(([, info]) => info.id === candidate.id)?.[0],
				candidate.id
			]));
			const svg = addRegionResults(normalizeTemplate(template, year, candidates), cycle.races, partyIdByCode);
			fs.writeFileSync(file, svg);
		}
	}

	console.log(`Wrote ${Object.keys(output.cycles).length} governor cycles to ${DATA_FILE}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
