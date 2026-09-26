import fs from 'node:fs';
import path from 'node:path';

const HOUSE_RESULTS_URL =
	'https://raw.githubusercontent.com/MEDSL/constituency-returns/master/1976-2018-house.csv';
const HOUSE_PARTY_DIVISION_URL =
	'https://history.house.gov/Institution/Party-Divisions/Party-Divisions/';
const HOUSE_WIKI_RAW_BASE = 'https://en.wikipedia.org/w/index.php?title=';
const PRESERVED_RESULT_MAP_YEARS = new Set(['2022', '2024']);

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/lib/data/historical-house-results.json');
const MAP_DIR = path.join(ROOT, 'src/lib/assets/maps/usa');

const PARTY_INFO = {
	D: { id: '0', name: 'Democrats', color: '#1C408C' },
	R: { id: '1', name: 'Republicans', color: '#BF1D29' },
	I: { id: '2', name: 'Independents', color: '#1c8c28' },
	O: { id: '3', name: 'Other', color: '#7d7d7d' },
	Pr: { id: 'pr', name: 'Progressives', color: '#75a843' },
	KN: { id: 'kn', name: 'Know Nothing', color: '#b7a57a' },
	Pop: { id: 'pop', name: 'Populists', color: '#9a7ac2' },
	Sil: { id: 'sil', name: 'Silver', color: '#aeb7c2' },
	Soc: { id: 'soc', name: 'Socialists', color: '#c13c6b' },
	Proh: { id: 'proh', name: 'Prohibition', color: '#6f8f3a' },
	PA: { id: 'pa', name: 'Pro-Administration', color: '#c9b458' },
	AA: { id: 'aa', name: 'Anti-Administration', color: '#8b6f47' },
	F: { id: 'f', name: 'Federalists', color: '#d99a2b' },
	DR: { id: 'dr', name: 'Democratic-Republicans', color: '#2f8f5b' },
	J: { id: 'j', name: 'Jacksonians', color: '#2856a3' },
	AJ: { id: 'aj', name: 'Anti-Jacksonians', color: '#d8b365' },
	W: { id: 'w', name: 'Whigs', color: '#c9842b' },
	A: { id: 'a', name: 'American', color: '#b7a57a' }
};

const PARTY_NAME_TO_CODE = {
	Democrat: 'D',
	Democratic: 'D',
	Democrats: 'D',
	democrat: 'D',
	Republican: 'R',
	Republicans: 'R',
	republican: 'R',
	Independent: 'I',
	Independents: 'I',
	independent: 'I',
	'Pro-Administration': 'PA',
	'Anti-Administration': 'AA',
	Federalists: 'F',
	Federalist: 'F',
	'Democratic Republicans': 'DR',
	'Democratic-Republicans': 'DR',
	'Democratic Republican': 'DR',
	Jacksonians: 'J',
	Jacksonian: 'J',
	'Anti-Jacksonians': 'AJ',
	'Anti-Jacksonian': 'AJ',
	Whigs: 'W',
	Whig: 'W',
	American: 'A',
	Americans: 'A',
	Progressive: 'Pr',
	Progressives: 'Pr',
	'Know Nothing': 'KN',
	'Know Nothings': 'KN',
	Populist: 'Pop',
	Populists: 'Pop',
	Silver: 'Sil',
	Socialist: 'Soc',
	Socialists: 'Soc',
	Prohibition: 'Proh',
	Prohibitionist: 'Proh'
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

function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = '';
	let quoted = false;

	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];
		const next = text[i + 1];
		if (quoted) {
			if (char === '"' && next === '"') {
				cell += '"';
				i += 1;
			} else if (char === '"') {
				quoted = false;
			} else {
				cell += char;
			}
		} else if (char === '"') {
			quoted = true;
		} else if (char === ',') {
			row.push(cell);
			cell = '';
		} else if (char === '\n') {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
		} else if (char !== '\r') {
			cell += char;
		}
	}
	if (cell !== '' || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}
	const header = rows.shift() ?? [];
	return rows.filter((r) => r.length === header.length).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

function decodeHtml(value) {
	return value
		.replace(/&ndash;/g, '-')
		.replace(/&mdash;/g, '-')
		.replace(/&amp;/g, '&')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function addCounts(counts, party, delta) {
	if (!party || delta === 0) {
		return;
	}
	counts[party] = (counts[party] ?? 0) + delta;
	if (counts[party] === 0) {
		delete counts[party];
	}
}

function normalizeParty(value) {
	const clean = String(value ?? '').trim();
	if (clean === '' || clean === 'NA') {
		return null;
	}
	return PARTY_NAME_TO_CODE[clean] ?? 'O';
}

function congressForElectionYear(year) {
	const startYear = Number(year) + 1;
	return Math.floor((startYear - 1789) / 2) + 1;
}

function extractCells(rowHtml) {
	return [...rowHtml.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/g)].map((m) => decodeHtml(m[1]));
}

function rawCells(row) {
	const cells = [];
	for (const line of row.split('\n')) {
		if ((!line.startsWith('|') && !line.startsWith('!')) || line.startsWith('|-')) {
			continue;
		}
		const part = line.slice(1).trim();
		const value = part.includes('|') ? part.slice(part.indexOf('|') + 1) : part;
		cells.push(cleanWikiCell(value));
	}
	return cells;
}

function cleanWikiCell(value) {
	return value
		.replace(/\{\{[^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*\}\}/g, '')
		.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
		.replace(/<ref[^/]*\/>/g, '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\[\[[^|\]]*\|([^\]]+)\]\]/g, '$1')
		.replace(/\[\[([^\]]+)\]\]/g, '$1')
		.replace(/'''/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseNumberCell(value) {
	return Number(String(value ?? '').match(/\d+/)?.[0] ?? 0);
}

function partyCodeFromLabel(label) {
	const clean = cleanWikiCell(label)
		.replace(/\(.+?\)/g, '')
		.replace(/\bParty\b/gi, '')
		.replace(/\bUnited States\b/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
	return PARTY_NAME_TO_CODE[clean] ?? PARTY_NAME_TO_CODE[`${clean}s`] ?? null;
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

function parseHeaderParties(header) {
	const parties = [];
	const colspanRows = [...header.matchAll(/!\s*colspan\s*=\s*"?2"?[\s\S]*?\|\s*([^\n]+)/gi)];
	for (const match of colspanRows) {
		const code = partyCodeFromLabel(match[1]);
		if (code) {
			parties.push(code);
		}
	}
	if (parties.length > 0) {
		return { parties, step: 2 };
	}

	for (const line of header.split('\n')) {
		if (!/Party shading|party shading/i.test(line) || !line.includes('|')) {
			continue;
		}
		const code = partyCodeFromLabel(line.slice(line.lastIndexOf('|') + 1));
		if (code) {
			parties.push(code);
		}
	}
	return { parties: [...new Set(parties)], step: 1 };
}

function findStateSummaryTable(raw) {
	return tableBlocks(raw).find(
		(table) =>
			/wikitable/i.test(table) &&
			/!\s*(?:rowspan=\d+\s*\|\s*)?State/i.test(table) &&
			/Total\s*<br\s*\/?\s*>\s*seats/i.test(table) &&
			/!\s*\[\[#/.test(table)
	);
}

function parseStateSummary(raw) {
	const table = findStateSummaryTable(raw);
	if (!table) {
		return null;
	}
	const firstStateIndex = table.search(/\n\|-\n!\s*\[\[#/);
	if (firstStateIndex === -1) {
		return null;
	}
	const { parties, step } = parseHeaderParties(table.slice(0, firstStateIndex));
	if (parties.length < 2) {
		return null;
	}

	const races = {};
	const raceCounts = {};
	for (const row of table.slice(firstStateIndex).split('\n|-')) {
		const stateMatch = row.match(/!\s*\[\[#([^|\]]+)\|([^\]]+)\]\]/);
		if (!stateMatch) {
			continue;
		}
		const state = stateMatch[2];
		const abbr = STATE_ABBR[state];
		if (!abbr) {
			continue;
		}
		const cells = rawCells(row);
		let bestResults = null;
		for (let totalIndex = 1; totalIndex < cells.length; totalIndex += 1) {
			const total = parseNumberCell(cells[totalIndex]);
			if (total <= 0) {
				continue;
			}
			const results = parties
				.map((party, index) => ({
					party,
					count: parseNumberCell(cells[totalIndex + 1 + index * step])
				}))
				.filter((result) => result.count > 0);
			const sum = results.reduce((totalSeats, result) => totalSeats + result.count, 0);
			if (sum === total) {
				bestResults = results;
				break;
			}
		}
		if (!bestResults || bestResults.length === 0) {
			continue;
		}
		races[abbr] = bestResults;
		for (const result of bestResults) {
			addCounts(raceCounts, result.party, result.count);
		}
	}

	if (Object.keys(races).length < 10) {
		return null;
	}
	return { races, raceCounts };
}

async function fetchHouseWikiRaw(year) {
	const title = `${year}_United_States_House_of_Representatives_elections`;
	let raw = await fetch(`${HOUSE_WIKI_RAW_BASE}${encodeURIComponent(title)}&action=raw`).then((response) =>
		response.text()
	);
	const redirect = raw.match(/^#REDIRECT\s+\[\[(.+?)\]\]/i);
	if (redirect) {
		raw = await fetch(
			`${HOUSE_WIKI_RAW_BASE}${encodeURIComponent(redirect[1].replaceAll(' ', '_'))}&action=raw`
		).then((response) => response.text());
	}
	return raw;
}

function parsePartyDivision(html) {
	const table = html.slice(html.indexOf('<table'), html.indexOf('</table>') + 8);
	const divisions = {};
	let partyHeaders = [];

	for (const rowMatch of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
		const rowHtml = rowMatch[1];
		const cells = extractCells(rowHtml);
		if (cells.length < 4) {
			continue;
		}
		if (/Congress \(Years\)/.test(cells[0])) {
			partyHeaders = cells.slice(2, -1).map((name) => PARTY_NAME_TO_CODE[name] ?? (name === 'Other' ? 'O' : null));
			continue;
		}
		const congressMatch = cells[0].match(/^(\d+)(?:st|nd|rd|th)/);
		if (!congressMatch) {
			continue;
		}
		const totalSeats = Number(cells[1].match(/\d+/)?.[0] ?? 0);
		const counts = {};
		for (const [index, party] of partyHeaders.entries()) {
			const value = Number((cells[index + 2] ?? '').match(/\d+/)?.[0] ?? 0);
			if (party && value > 0) {
				addCounts(counts, party, value);
			}
		}
		if (Object.keys(counts).length > 0) {
			divisions[congressMatch[1]] = { totalSeats, balance: counts };
		}
	}
	return divisions;
}

function availableHouseMaps() {
	const maps = {};
	for (const file of fs.readdirSync(MAP_DIR)) {
		const match = file.match(/^usa-house-(.+)-blank\.svg$/);
		if (!match) {
			continue;
		}
		const token = match[1];
		const svg = fs.readFileSync(path.join(MAP_DIR, file), 'utf8');
		const date = svg.match(/date="([^"]+)"/)?.[1] ?? token;
		const mapYear = Number(date.slice(0, 4));
		const year = /^\d{7}$/.test(token) && token.endsWith('003')
			? String(mapYear - 1)
			: String(mapYear);
		const regions = new Set([...svg.matchAll(/\bregion="([^"]+)"/g)].map((m) => m[1]));
		const aliases = {};
		for (const tag of svg.matchAll(/<[^>]+\bregion="([^"]+)"[^>]*>/g)) {
			const region = tag[1];
			const shortName = tag[0].match(/\bshort-name="([^"]+)"/)?.[1];
			if (shortName) {
				aliases[shortName] = region;
				const normalized = shortName.replace(/-(\d)$/, '-0$1');
				aliases[normalized] = region;
			}
		}
		maps[year] = { token, file: path.join(MAP_DIR, file), regions, aliases };
	}
	return maps;
}

function regionForRace(state, district, map) {
	const numeric = Number(district);
	const padded = Number.isFinite(numeric) ? String(numeric).padStart(2, '0') : district;
	const plain = Number.isFinite(numeric) ? String(numeric) : district;
	const candidates = numeric === 0 || district === 'AL'
		? [`${state}-AL`, `${state}-00`, `${state}-0`]
		: [`${state}-${padded}`, `${state}-${plain}`];
	return candidates.map((region) => map.aliases[region] ?? region).find((region) => map.regions.has(region)) ?? candidates[0];
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
		.replace(/\n\t\t\tcandidates='\[[^\n]*?\]'/g, '')
		.replace(/\s+(?:permaLocked|permalocked|locked|disabled)="[^"]*"/g, '')
		.replace(/\s+(?:permaLocked|permalocked|locked|disabled)(?=[\s/>])/g, '')
		.replace(/date="[^"]*"/, `date="${year}"`)
		.replace(/variant="[^"]*"/, 'variant="results"')
		.replace(/title="[^"]*"/, `title="USA ${year} House Results"`)
		.replace(/candidates='[^']*'/, `candidates='${candidateAttr}'`);
}

function addRegionResults(svg, regionResults, partyIdByCode) {
	return svg.replace(/<([a-zA-Z][\w:-]*)\b(?=[^>]*\bregion="[^"]+")[^>]*>/g, (tagText) => {
		const region = tagText.match(/region="([^"]+)"/)?.[1];
		if (!region || !regionResults[region]) {
			return tagText;
		}
		const candidate = partyIdByCode[regionResults[region].party];
		if (!candidate) {
			return tagText;
		}
		const attr = JSON.stringify([{ candidate, count: 1, margin: 0 }]);
		const cleaned = tagText
			.replace(/\s+(?:permaLocked|permalocked|locked|disabled)="[^"]*"/g, '')
			.replace(/\s+(?:permaLocked|permalocked|locked|disabled)(?=[\s/>])/g, '')
			.replace(/\s+candidates='[^']*'/g, '');
		return cleaned.replace(/^<([a-zA-Z][\w:-]*)\b/, `<$1\n\t\t\tcandidates='${attr}'`);
	});
}

async function main() {
	const [csvText, partyDivisionHtml] = await Promise.all([
		fetch(HOUSE_RESULTS_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch ${HOUSE_RESULTS_URL}: ${response.status}`);
			}
			return response.text();
		}),
		fetch(HOUSE_PARTY_DIVISION_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch ${HOUSE_PARTY_DIVISION_URL}: ${response.status}`);
			}
			return response.text();
		})
	]);
	const maps = availableHouseMaps();
	const partyDivisionBalances = parsePartyDivision(partyDivisionHtml);
	const racesByKey = {};

	for (const row of parseCsv(csvText)) {
		if (row.office !== 'US House' || row.stage !== 'gen' || row.mode !== 'total' || row.writein === 'TRUE') {
			continue;
		}
		const year = row.year;
		const map = maps[year];
		if (!map) {
			continue;
		}
		const region = regionForRace(row.state_po, row.district, map);
		if (!map.regions.has(region)) {
			continue;
		}
		const key = `${year}:${region}`;
		const votes = Number(row.candidatevotes);
		if (!Number.isFinite(votes)) {
			continue;
		}
		const party = normalizeParty(row.party);
		if (!party) {
			continue;
		}
		if (!racesByKey[key] || votes > racesByKey[key].votes) {
			racesByKey[key] = {
				year,
				region,
				party,
				candidate: row.candidate === 'NA' ? null : row.candidate,
				votes
			};
		}
	}
	const districtRaceYears = new Set(Object.values(racesByKey).map((race) => race.year));

	const cycles = {};
	for (let year = 1788; year <= 2024; year += 2) {
		const congress = congressForElectionYear(String(year));
		const division = partyDivisionBalances[String(congress)];
		if (!division) {
			continue;
		}
		cycles[String(year)] = {
			year: String(year),
			token: String(year),
			races: {},
			raceCounts: {},
			mapUnit: 'districts',
			congress,
			officialBalance: division.balance,
			officialTotalSeats: division.totalSeats
		};
	}

	for (const year of Object.keys(cycles)) {
		if (districtRaceYears.has(year)) {
			continue;
		}
		if (PRESERVED_RESULT_MAP_YEARS.has(year) && fs.existsSync(path.join(MAP_DIR, `usa-house-${year}-results.svg`))) {
			continue;
		}
		try {
			const stateSummary = parseStateSummary(await fetchHouseWikiRaw(year));
			if (!stateSummary) {
				continue;
			}
			cycles[year] = {
				...cycles[year],
				races: stateSummary.races,
				raceCounts: stateSummary.raceCounts,
				mapUnit: 'states',
				source: `${HOUSE_WIKI_RAW_BASE}${encodeURIComponent(`${year}_United_States_House_of_Representatives_elections`)}&action=raw`
			};
		} catch (error) {
			console.warn(`Skipped ${year} state summary: ${error.message}`);
		}
	}

	for (const race of Object.values(racesByKey)) {
		const map = maps[race.year];
		cycles[race.year] = {
			...(cycles[race.year] ?? {}),
			year: race.year,
			token: map.token,
			races: cycles[race.year]?.races ?? {},
			raceCounts: cycles[race.year]?.raceCounts ?? {},
			mapUnit: 'districts',
			congress: congressForElectionYear(race.year),
			officialBalance: partyDivisionBalances[String(congressForElectionYear(race.year))]?.balance ?? null,
			officialTotalSeats: partyDivisionBalances[String(congressForElectionYear(race.year))]?.totalSeats ?? null
		};
		cycles[race.year].races[race.region] = { party: race.party, candidate: race.candidate };
		addCounts(cycles[race.year].raceCounts, race.party, 1);
	}

	const output = {
		source: HOUSE_RESULTS_URL,
		balanceSource: HOUSE_PARTY_DIVISION_URL,
		generatedAt: new Date().toISOString(),
		parties: PARTY_INFO,
		cycles: Object.fromEntries(Object.entries(cycles).sort(([a], [b]) => Number(a) - Number(b)))
	};

	fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(output, null, '\t')}\n`);

	if (process.argv.includes('--write-maps')) {
		for (const [year, cycle] of Object.entries(output.cycles)) {
			const map = maps[year];
			const stateTemplate = cycle.mapUnit === 'states'
				? { token: '1916', file: path.join(MAP_DIR, 'usa-senate-1916-results.svg') }
				: null;
			if (!map && stateTemplate === null) {
				continue;
			}
			const file = path.join(MAP_DIR, `usa-house-${cycle.token}-results.svg`);
			if (PRESERVED_RESULT_MAP_YEARS.has(year) && fs.existsSync(file)) {
				continue;
			}
			if (fs.existsSync(file) && !process.argv.includes('--force')) {
				continue;
			}
			const balanceCodes = Object.keys(cycle.officialBalance ?? {});
			const raceCodes = Object.keys(cycle.raceCounts);
			const partyCodes = [...new Set([...(balanceCodes.length > 0 ? balanceCodes : raceCodes), ...raceCodes])]
				.filter((party) => PARTY_INFO[party]);
			const candidates = partyCodes.map((party) => ({
				...PARTY_INFO[party],
				defaultCount:
					cycle.mapUnit === 'states'
						? 0
						:
					cycle.officialBalance?.[party] !== undefined
						? Math.max(0, cycle.officialBalance[party] - (cycle.raceCounts[party] ?? 0))
						: 0
			}));
			const partyIdByCode = Object.fromEntries(candidates.map((candidate) => [
				Object.entries(PARTY_INFO).find(([, info]) => info.id === candidate.id)?.[0],
				candidate.id
			]));
			const svg = addRegionResults(
				normalizeTemplate(fs.readFileSync((map ?? stateTemplate).file, 'utf8'), year, candidates)
					.replace(/type="[^"]*"/, 'type="house"')
					.replace(/title="[^"]*"/, `title="USA ${year} House Results"`),
				cycle.races,
				partyIdByCode
			);
			fs.writeFileSync(file, svg);
		}
	}

	console.log(`Wrote ${Object.keys(output.cycles).length} House cycles to ${path.relative(process.cwd(), DATA_FILE)}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
