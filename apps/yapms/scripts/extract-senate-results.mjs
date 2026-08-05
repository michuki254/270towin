import fs from 'node:fs';
import path from 'node:path';

const WIKI_RAW_URL =
	'https://en.wikipedia.org/w/index.php?title=List_of_United_States_Senate_election_results_by_state&action=raw';
const SENATE_PARTY_DIVISION_URL = 'https://www.senate.gov/history/partydiv.htm';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_FILE = path.join(ROOT, 'src/lib/data/historical-senate-results.json');
const MAP_DIR = path.join(ROOT, 'src/lib/assets/maps/usa');
const TEMPLATE_FILE = path.join(MAP_DIR, 'usa-senate-2024310-results.svg');

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

const PARTY_INFO = {
	PA: { id: 'pa', name: 'Pro-Administration', color: '#c9b458' },
	AA: { id: 'aa', name: 'Anti-Administration', color: '#8b6f47' },
	F: { id: 'f', name: 'Federalists', color: '#d99a2b' },
	DR: { id: 'dr', name: 'Democratic-Republicans', color: '#2f8f5b' },
	J: { id: 'j', name: 'Jacksonians', color: '#2856a3' },
	AJ: { id: 'aj', name: 'Anti-Jacksonians', color: '#d8b365' },
	W: { id: 'w', name: 'Whigs', color: '#c9842b' },
	D: { id: '0', name: 'Democrats', color: '#1C408C' },
	R: { id: '1', name: 'Republicans', color: '#BF1D29' },
	I: { id: '2', name: 'Independents', color: '#1c8c28' },
	FS: { id: 'fs', name: 'Free Soil', color: '#7bb6d6' },
	A: { id: 'a', name: 'American', color: '#b7a57a' },
	Po: { id: 'po', name: 'Populists', color: '#9a7ac2' },
	U: { id: 'u', name: 'Unionists', color: '#7d7d7d' },
	Nu: { id: 'nu', name: 'Nullifiers', color: '#a65c5c' },
	SR: { id: 'sr', name: 'Silver Republicans', color: '#9ba8b5' },
	FL: { id: 'fl', name: 'Farmer-Labor', color: '#7aa35a' },
	AM: { id: 'am', name: 'American', color: '#b7a57a' },
	C: { id: 'c', name: 'Constitutional Union', color: '#8f8fbd' },
	LR: { id: 'lr', name: 'Liberal Republicans', color: '#b55a7a' },
	Pr: { id: 'pr', name: 'Progressives', color: '#d66f40' },
	Ra: { id: 'ra', name: 'Readjusters', color: '#7070a8' },
	Si: { id: 'si', name: 'Silver', color: '#aeb7c2' }
};

const PARTY_NAME_TO_CODE = {
	'Anti-Administration': 'AA',
	'Pro-Administration': 'PA',
	Federalists: 'F',
	Republicans: 'R',
	Democrats: 'D',
	Whigs: 'W',
	Independents: 'I',
	Independent: 'I',
	Jacksonians: 'J',
	'Anti-Jacksons': 'AJ',
	Nullifiers: 'Nu',
	Populists: 'Po',
	Silvers: 'Si',
	Silver: 'Si',
	'Free Soilers': 'FS',
	'Free Soil': 'FS',
	'Farmer-Labor': 'FL',
	Progressives: 'Pr'
};

function cleanCell(cell) {
	return cell
		.replace(/<!--.*?-->/gs, '')
		.replace(/<ref[^>]*>.*?<\/ref>/gs, '')
		.replace(/<ref[^/]*\/>/g, '')
		.replace(/\{\{[^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*\}\}/g, '')
		.replace(/\[\[[^|\]]*\|([^\]]+)\]\]/g, '$1')
		.replace(/\[\[([^\]]+)\]\]/g, '$1')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\]\]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function dataCells(row) {
	const cells = [];
	for (const line of row.split('\n')) {
		if (!line.startsWith('|') || line.startsWith('|-')) {
			continue;
		}
		const part = line.slice(1).trim();
		const colspan = Number(part.match(/colspan\s*=\s*(\d+)/)?.[1] ?? 1);
		const value = part.includes('|') ? part.slice(part.lastIndexOf('|') + 1) : part;
		const text = cleanCell(value);
		if (text === '' && !/colspan\s*=/.test(part)) {
			continue;
		}
		for (let i = 0; i < colspan; i += 1) {
			cells.push(text);
		}
	}
	return cells;
}

function parsePartyCell(value) {
	const code = value.replace(/[^A-Za-z0-9—]/g, '');
	if (code === '' || code === '—') {
		return [];
	}
	if (code === 'Sp') {
		return [
			{ party: 'D', count: 1 },
			{ party: 'R', count: 1 }
		];
	}
	const match = code.match(/^(\d+)?([A-Za-z]+)$/);
	if (!match) {
		return [];
	}
	const count = Number(match[1] ?? 1);
	const party = match[2];
	if (!PARTY_INFO[party]) {
		return [];
	}
	return [{ party, count }];
}

function expandPartyResults(results) {
	const seats = [];
	for (const result of results) {
		for (let i = 0; i < result.count; i += 1) {
			seats.push(result.party);
		}
	}
	return seats;
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

function congressForElectionYear(year) {
	const startYear = year === '1788' ? 1789 : Number(year) + 1;
	return Math.floor((startYear - 1789) / 2) + 1;
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

function partyCodeFromSenateName(name, congress) {
	const cleanName = decodeHtml(name)
		.replace(/\(.+?\)/g, '')
		.replace(/\ball caucus.+$/i, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (cleanName === 'Republicans' && congress >= 4 && congress <= 18) {
		return 'DR';
	}
	return PARTY_NAME_TO_CODE[cleanName] ?? null;
}

function parsePartyDivision(html) {
	const balances = {};
	const blocks = html.split(/-{20,}/);
	for (const block of blocks) {
		const congressMatch = decodeHtml(block).match(/(\d+)(?:st|nd|rd|th) Congress/);
		if (!congressMatch) {
			continue;
		}
		const congress = Number(congressMatch[1]);
		const counts = {};

		for (const lineMatch of block.matchAll(
			/(Majority Party|Minority Party):\s*([^<(]+(?:&amp;[^<(]+)?)\s*(?:\(|:)\s*(\d+)/g
		)) {
			const code = partyCodeFromSenateName(lineMatch[2], congress);
			if (code) {
				addCounts(counts, code, Number(lineMatch[3]));
			}
		}

		const otherMatch = block.match(/Other Parties:\s*([\s\S]*?)(?:<br>|<\/p>)/);
		if (otherMatch) {
			for (const part of decodeHtml(otherMatch[1]).split(';')) {
				const match = part.trim().match(/^(\d+)\s+(.+?)s?(?:\s+\(|$)/);
				if (!match) {
					continue;
				}
				const code = partyCodeFromSenateName(match[2], congress);
				if (code) {
					addCounts(counts, code, Number(match[1]));
				}
			}
		}

		if (Object.keys(counts).length > 0) {
			balances[String(congress)] = counts;
		}
	}
	return balances;
}

function totalsFromSeats(seatsBySlot) {
	const totals = {};
	for (const party of Object.values(seatsBySlot)) {
		addCounts(totals, party, 1);
	}
	return totals;
}

function sourceColumns(table) {
	const header = table.slice(0, table.indexOf('! nowrap | [[List of United States senators from Alabama'));
	const matches = [
		...header.matchAll(
			/\[\[United States Senate elections,[^|\]]+\|(\d{4})\]\]<br\/>(\d)<br\/>/g
		)
	];
	return matches.map((match, index) => ({
		index,
		sourceYear: match[1],
		year: match[1] === '1789' ? '1788' : match[1],
		classNumber: match[2]
	}));
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
		.replace(/title="[^"]*"/, `title="USA ${year} Senate Results"`)
		.replace(/candidates='[^']*'/, `candidates='${candidateAttr}'`);
}

function addRegionResults(svg, regionResults, partyIdByCode) {
	const seen = new Set();
	return svg.replace(/<([a-zA-Z][\w:-]*)\b(?=[^>]*\bregion="[^"]+")[^>]*>/g, (tagText) => {
		const region = tagText.match(/region="([^"]+)"/)?.[1];
		if (!region || seen.has(region)) {
			return tagText;
		}
		if (!regionResults[region]) {
			if (tagText.endsWith('/>')) {
				return tagText.replace(/\s*\/>$/, '\n\t\t\tdisabled="true"\n\t\t/>');
			}
			return tagText.replace(/>$/, '\n\t\t\tdisabled="true"\n\t\t>');
		}
		seen.add(region);
		const candidates = regionResults[region]
			.map((result) => ({
				candidate: partyIdByCode[result.party],
				count: result.count,
				margin: 0
			}))
			.filter((result) => result.candidate !== undefined);
		if (candidates.length === 0) {
			return tagText;
		}
		const attr = JSON.stringify(candidates);
		const cleaned = tagText
			.replace(/\s+(?:permaLocked|permalocked|locked|disabled)="[^"]*"/g, '')
			.replace(/\s+(?:permaLocked|permalocked|locked|disabled)(?=[\s/>])/g, '');
		return cleaned.replace(/^<([a-zA-Z][\w:-]*)\b/, `<$1\n\t\t\tcandidates='${attr}'`);
	});
}

async function main() {
	const [raw, partyDivisionHtml] = await Promise.all([
		fetch(WIKI_RAW_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch ${WIKI_RAW_URL}: ${response.status}`);
			}
			return response.text();
		}),
		fetch(SENATE_PARTY_DIVISION_URL).then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch ${SENATE_PARTY_DIVISION_URL}: ${response.status}`);
			}
			return response.text();
		})
	]);
	const partyDivisionBalances = parsePartyDivision(partyDivisionHtml);
	const start = raw.indexOf('{| class=wikitable style="text-align:center"');
	const end = raw.indexOf('\n|}', start);
	const table = raw.slice(start, end);
	const columns = sourceColumns(table);
	const rows = table.split('\n|-').filter((row) => row.includes('List of United States senators from'));
	const seatsBySlot = {};
	const cycles = {};

	for (const column of columns) {
		cycles[column.year] ??= { year: column.year, races: {}, defaultCounts: {}, seatTotals: {} };
	}

	for (const row of rows) {
		const state = row.match(/\[\[List of United States senators from ([^|\]]+)/)?.[1];
		const abbr = STATE_ABBR[state];
		if (!abbr) {
			continue;
		}
		const cells = dataCells(row).slice(0, columns.length);
		for (const [index, column] of columns.entries()) {
			const results = parsePartyCell(cells[index] ?? '');
			if (results.length === 0) {
				continue;
			}
			const cycle = cycles[column.year];
			cycle.races[abbr] ??= [];
			cycle.races[abbr].push(...results);
		}
	}

	const columnsByYear = Object.groupBy(columns, (column) => column.year);
	for (const [year, yearColumns] of Object.entries(columnsByYear)) {
		const cycle = cycles[year];
		const defaultCounts = totalsFromSeats(seatsBySlot);
		const contestedSlots = {};

		for (const column of yearColumns) {
			for (const row of rows) {
				const state = row.match(/\[\[List of United States senators from ([^|\]]+)/)?.[1];
				const abbr = STATE_ABBR[state];
				if (!abbr) {
					continue;
				}
				const cells = dataCells(row).slice(0, columns.length);
				const results = parsePartyCell(cells[column.index] ?? '');
				if (results.length === 0) {
					continue;
				}
				const parties = expandPartyResults(results);
				const slots = [`${abbr}-${column.classNumber}`];
				for (let i = 1; i < parties.length; i += 1) {
					const emptyClass = ['1', '2', '3'].find(
						(classNumber) => !seatsBySlot[`${abbr}-${classNumber}`] && !slots.includes(`${abbr}-${classNumber}`)
					);
					slots.push(emptyClass ? `${abbr}-${emptyClass}` : `${abbr}-${column.classNumber}-${i}`);
				}
				contestedSlots[abbr] ??= [];
				contestedSlots[abbr].push(...slots);
				for (const slot of slots) {
					addCounts(defaultCounts, seatsBySlot[slot], -1);
				}
				for (const [slotIndex, party] of parties.entries()) {
					seatsBySlot[slots[slotIndex]] = party;
				}
			}
		}

		cycle.defaultCounts = defaultCounts;
		cycle.seatTotals = totalsFromSeats(seatsBySlot);
		cycle.contestedSlots = contestedSlots;
		cycle.congress = congressForElectionYear(year);
		cycle.officialBalance = partyDivisionBalances[String(cycle.congress)] ?? null;
	}

	const output = {
		source: WIKI_RAW_URL,
		generatedAt: new Date().toISOString(),
		parties: PARTY_INFO,
		cycles: Object.fromEntries(Object.entries(cycles).sort(([a], [b]) => Number(a) - Number(b)))
	};

	fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
	fs.writeFileSync(DATA_FILE, `${JSON.stringify(output, null, '\t')}\n`);

	if (process.argv.includes('--write-maps')) {
		const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
		for (const [year, cycle] of Object.entries(output.cycles)) {
			const file = path.join(MAP_DIR, `usa-senate-${year}-results.svg`);
			if (year === '2022' && fs.existsSync(file) && !process.argv.includes('--force-existing')) {
				continue;
			}
			if (fs.existsSync(file) && !process.argv.includes('--force')) {
				continue;
			}
			const balanceCodes = Object.keys(cycle.officialBalance ?? {});
			const partyCodes = [
				...new Set([
					...(balanceCodes.length > 0 ? balanceCodes : Object.keys(cycle.defaultCounts)),
					...Object.values(cycle.races).flatMap((results) => results.map((result) => result.party))
				])
			].filter((party) => PARTY_INFO[party]);
			const raceCounts = {};
			for (const results of Object.values(cycle.races)) {
				for (const result of results) {
					addCounts(raceCounts, result.party, result.count);
				}
			}
			const candidates = partyCodes.map((party) => ({
				...PARTY_INFO[party],
				defaultCount:
					cycle.officialBalance?.[party] !== undefined
						? Math.max(0, cycle.officialBalance[party] - (raceCounts[party] ?? 0))
						: (cycle.defaultCounts[party] ?? 0)
			}));
			const partyIdByCode = Object.fromEntries(candidates.map((candidate) => [candidate.id === '0' ? 'D' : candidate.id === '1' ? 'R' : candidate.id === '2' ? 'I' : Object.entries(PARTY_INFO).find(([, info]) => info.id === candidate.id)?.[0], candidate.id]));
			for (const party of partyCodes) {
				partyIdByCode[party] = PARTY_INFO[party].id;
			}
			const svg = addRegionResults(normalizeTemplate(template, year, candidates), cycle.races, partyIdByCode);
			fs.writeFileSync(file, svg);
		}
	}

	console.log(`Wrote ${Object.keys(output.cycles).length} Senate cycles to ${path.relative(process.cwd(), DATA_FILE)}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
