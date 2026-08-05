import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const outPath = path.resolve('apps/yapms/src/lib/data/state-officials.generated.json');

const states = [
	['Alabama', 'AL', 'Montgomery'],
	['Alaska', 'AK', 'Juneau'],
	['Arizona', 'AZ', 'Phoenix'],
	['Arkansas', 'AR', 'Little Rock'],
	['California', 'CA', 'Sacramento'],
	['Colorado', 'CO', 'Denver'],
	['Connecticut', 'CT', 'Hartford'],
	['Delaware', 'DE', 'Dover'],
	['Florida', 'FL', 'Tallahassee'],
	['Georgia', 'GA', 'Atlanta'],
	['Hawaii', 'HI', 'Honolulu'],
	['Idaho', 'ID', 'Boise'],
	['Illinois', 'IL', 'Springfield'],
	['Indiana', 'IN', 'Indianapolis'],
	['Iowa', 'IA', 'Des Moines'],
	['Kansas', 'KS', 'Topeka'],
	['Kentucky', 'KY', 'Frankfort'],
	['Louisiana', 'LA', 'Baton Rouge'],
	['Maine', 'ME', 'Augusta'],
	['Maryland', 'MD', 'Annapolis'],
	['Massachusetts', 'MA', 'Boston'],
	['Michigan', 'MI', 'Lansing'],
	['Minnesota', 'MN', 'Saint Paul'],
	['Mississippi', 'MS', 'Jackson'],
	['Missouri', 'MO', 'Jefferson City'],
	['Montana', 'MT', 'Helena'],
	['Nebraska', 'NE', 'Lincoln'],
	['Nevada', 'NV', 'Carson City'],
	['New Hampshire', 'NH', 'Concord'],
	['New Jersey', 'NJ', 'Trenton'],
	['New Mexico', 'NM', 'Santa Fe'],
	['New York', 'NY', 'Albany'],
	['North Carolina', 'NC', 'Raleigh'],
	['North Dakota', 'ND', 'Bismarck'],
	['Ohio', 'OH', 'Columbus'],
	['Oklahoma', 'OK', 'Oklahoma City'],
	['Oregon', 'OR', 'Salem'],
	['Pennsylvania', 'PA', 'Harrisburg'],
	['Rhode Island', 'RI', 'Providence'],
	['South Carolina', 'SC', 'Columbia'],
	['South Dakota', 'SD', 'Pierre'],
	['Tennessee', 'TN', 'Nashville'],
	['Texas', 'TX', 'Austin'],
	['Utah', 'UT', 'Salt Lake City'],
	['Vermont', 'VT', 'Montpelier'],
	['Virginia', 'VA', 'Richmond'],
	['Washington', 'WA', 'Olympia'],
	['West Virginia', 'WV', 'Charleston'],
	['Wisconsin', 'WI', 'Madison'],
	['Wyoming', 'WY', 'Cheyenne']
];

const stateByName = new Map(states.map(([name, abbreviation, capital]) => [name, { name, abbreviation, capital }]));
const stateByAbbr = new Map(states.map(([name, abbreviation, capital]) => [abbreviation, { name, abbreviation, capital }]));

const slug = (value) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const partyName = (value) => {
	const normalized = String(value || '').toLowerCase();
	if (normalized.startsWith('d')) return 'Democratic';
	if (normalized.startsWith('r')) return 'Republican';
	if (normalized.startsWith('i')) return 'Independent';
	return 'Other';
};

const strip = (html) =>
	html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();

async function fetchText(url) {
	const response = await fetch(url, {
		headers: {
			'user-agent': 'PathToWinDataBuilder/1.0'
		}
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	return response.text();
}

function parseOptionalCounts(tokens, index, totalSeats) {
	const counts = { independent: 0, other: 0, vacant: 0 };
	let used = 0;
	let remainder = totalSeats;

	while (used < 4 && index + used < tokens.length) {
		const token = tokens[index + used];
		if (/^\d+v$/.test(token)) {
			counts.vacant += Number.parseInt(token, 10);
			used += 1;
			continue;
		}
		if (/^\d+$/.test(token)) {
			const value = Number.parseInt(token, 10);
			if (value <= remainder) {
				counts.other += value;
				used += 1;
				continue;
			}
		}
		break;
	}

	return { counts, used };
}

function parseLegislatures(text) {
	const start = text.indexOf('Alabama House');
	const end = text.indexOf('Subscribe to the Stateside', start);
	const body = text.slice(start, end > start ? end : undefined);
	const tokens = body.split(/\s+/);
	const rows = new Map();

	for (let i = 0; i < tokens.length; i += 1) {
		const one = tokens[i];
		const two = `${tokens[i]} ${tokens[i + 1]}`;
		const three = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
		const match = stateByName.get(three) ?? stateByName.get(two) ?? stateByName.get(one);
		if (!match) continue;

		const stateTokenCount = match.name.split(' ').length;
		const chamber = tokens[i + stateTokenCount];
		if (!['House', 'Assembly', 'Senate'].includes(chamber)) continue;

		let cursor = i + stateTokenCount + 1;
		const control = tokens[cursor];
		cursor += 1;
		if (control === 'Coalition*') {
			// Nothing extra to consume. Kept for readability.
		}

		const democrat = Number.parseInt(tokens[cursor], 10);
		const republican = Number.parseInt(tokens[cursor + 1], 10);
		cursor += 2;
		if (!Number.isFinite(democrat) || !Number.isFinite(republican)) continue;

		let total = Number.parseInt(tokens[cursor], 10);
		const optional = Number.isFinite(total)
			? { counts: { independent: 0, other: 0, vacant: 0 }, used: 0 }
			: parseOptionalCounts(tokens, cursor, 999);

		if (!Number.isFinite(total)) {
			cursor += optional.used;
			total = Number.parseInt(tokens[cursor], 10);
		}

		if (!Number.isFinite(total)) continue;

		const existing = rows.get(match.name) ?? {
			house: null,
			senate: null
		};
		const chamberData = {
			body: chamber === 'Senate' ? 'State Senate' : 'State House of Representatives',
			democrat,
			republican,
			other: optional.counts.independent + optional.counts.other,
			vacant: optional.counts.vacant,
			total
		};

		if (chamber === 'Senate') existing.senate = chamberData;
		else existing.house = chamberData;
		rows.set(match.name, existing);
	}

	return rows;
}

function parseGovernors(text) {
	const start = text.indexOf('Alabama Kay Ivey');
	const end = text.indexOf('A Red State', start);
	const body = text.slice(start, end > start ? end : undefined);
	const rows = new Map();

	for (const [name] of states) {
		const stateStart = body.indexOf(`${name} `);
		if (stateStart === -1) continue;
		let nextStart = body.length;
		for (const [otherName] of states) {
			if (otherName === name) continue;
			const possible = body.indexOf(`${otherName} `, stateStart + name.length + 1);
			if (possible !== -1 && possible < nextStart) nextStart = possible;
		}
		const row = body.slice(stateStart + name.length + 1, nextStart).trim();
		const match = row.match(/^(.+?)\s+([A-Z][A-Z0-9]*)\s+(\d{4})/);
		if (!match) continue;
		rows.set(name, {
			name: match[1].replace(/\*/g, '').trim(),
			party: partyName(match[2]),
			nextElection: match[3]
		});
	}

	return rows;
}

function currentTerm(terms) {
	return terms[terms.length - 1];
}

function congressOfficial(member) {
	const term = currentTerm(member.terms);
	const firstSameOfficeTerm =
		member.terms.find((candidate) => candidate.type === term.type && candidate.state === term.state) || term;
	const bioguide = member.id?.bioguide;
	const govtrack = member.id?.govtrack;
	const title = term.type === 'sen' ? 'U.S. Senator' : 'Representative';
	const district = term.type === 'sen' ? 'At-large' : `${term.state}-${String(term.district).padStart(2, '0')}`;
	const nextElectionYear = term.type === 'sen' ? Number.parseInt(term.end, 10) - 1 : Number.parseInt(term.end, 10) - 1;
	return {
		district,
		title,
		name: member.name?.official_full || [member.name?.first, member.name?.last].filter(Boolean).join(' '),
		party: partyName(term.party),
		since: firstSameOfficeTerm.start?.slice(0, 4) || '',
		currentTerm: `${term.start?.slice(0, 4) || ''}-${term.end?.slice(0, 4) || ''}`,
		nextElection: String(nextElectionYear || ''),
		photo: govtrack ? `https://www.govtrack.us/static/legislator-photos/${govtrack}-200px.jpeg` : '/favicon.svg',
		address: term.address || 'Washington, DC office',
		phone: term.phone || '',
		website: term.url || '#',
		contact: term.contact_form || term.url || '#',
		social: {
			facebook: member.social?.facebook || '',
			x: member.social?.twitter || ''
		},
		source: {
			name: 'unitedstates/congress-legislators',
			url: 'https://github.com/unitedstates/congress-legislators'
		},
		bioguide
	};
}

const [congressYaml, governorsHtml, legislaturesHtml, governorMetadataJson] = await Promise.all([
	fetchText('https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml'),
	fetchText('https://www.stateside.com/state-resource/governors-2026'),
	fetchText('https://www.stateside.com/state-resource/legislative-partisan-splits'),
	fetchText('https://raw.githubusercontent.com/5calls/us-governors/master/us-governors/data/us-governors.json')
]);

const members = yaml.load(congressYaml);
const governors = parseGovernors(strip(governorsHtml));
const legislatures = parseLegislatures(strip(legislaturesHtml));
const governorMetadata = JSON.parse(governorMetadataJson);

const byState = {};

for (const [name, abbreviation, capital] of states) {
	const congress = members
		.filter((member) => currentTerm(member.terms)?.state === abbreviation)
		.map(congressOfficial)
		.sort((a, b) => {
			if (a.title !== b.title) return a.title === 'U.S. Senator' ? -1 : 1;
			return a.district.localeCompare(b.district);
		});

	const governorSource = governors.get(name);
	const governorDetails = governorMetadata.find(
		(record) => record.state_name === name && record.name === governorSource?.name
	);
	const legislature = legislatures.get(name);
	const senatorCounts = congress.filter((official) => official.title === 'U.S. Senator').reduce(
		(acc, official) => {
			if (official.party === 'Democratic') acc.democrat += 1;
			else if (official.party === 'Republican') acc.republican += 1;
			else acc.other += 1;
			return acc;
		},
		{ democrat: 0, republican: 0, other: 0, vacant: Math.max(0, 2 - congress.filter((official) => official.title === 'U.S. Senator').length), total: 2 }
	);

	const houseMembers = congress.filter((official) => official.title === 'Representative');
	const houseCounts = houseMembers.reduce(
		(acc, official) => {
			if (official.party === 'Democratic') acc.democrat += 1;
			else if (official.party === 'Republican') acc.republican += 1;
			else acc.other += 1;
			return acc;
		},
		{ democrat: 0, republican: 0, other: 0, vacant: 0, total: houseMembers.length }
	);

	const governor = {
		district: 'Statewide',
		title: 'Governor',
		name: governorSource?.name || `${name} Governor`,
		party: governorSource?.party || 'Other',
		since: governorDetails?.entered_office?.slice(0, 4) || '',
		currentTerm:
			governorDetails?.entered_office && governorSource?.nextElection
				? `${governorDetails.entered_office.slice(0, 4)}-${governorSource.nextElection}`
				: '',
		nextElection: governorSource?.nextElection || '',
		photo: governorDetails?.photo_url || '/favicon.svg',
		address: governorDetails?.address_complete || `${capital}, ${abbreviation}`,
		phone: governorDetails?.phone || '',
		website: governorDetails?.website || '#',
		contact: governorDetails?.contact_page || governorDetails?.website || '#',
		social: {
			facebook: governorDetails?.facebook_url || '',
			x: governorDetails?.twitter_url || ''
		},
		source: {
			name: governorDetails
				? 'Stateside Governors 2026 and 5Calls governor metadata'
				: 'Stateside Governors 2026',
			url: governorDetails
				? 'https://github.com/5calls/us-governors'
				: 'https://www.stateside.com/state-resource/governors-2026'
		}
	};

	byState[slug(name)] = {
		name,
		abbreviation,
		slug: slug(name),
		capital,
		updated: new Date().toISOString(),
		composition: [
			{ body: 'U.S. Senate', ...senatorCounts },
			{ body: 'U.S. House', ...houseCounts },
			{
				body: 'Governor',
				democrat: governor.party === 'Democratic' ? 1 : 0,
				republican: governor.party === 'Republican' ? 1 : 0,
				other: governor.party !== 'Democratic' && governor.party !== 'Republican' ? 1 : 0,
				vacant: 0,
				total: 1
			},
			legislature?.senate ?? { body: 'State Senate', democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 },
			legislature?.house ?? {
				body: 'State House of Representatives',
				democrat: 0,
				republican: 0,
				other: 0,
				vacant: 0,
				total: 0
			}
		],
		congress,
		governor,
		stateLegislature: [],
		sources: [
			{
				name: 'unitedstates/congress-legislators',
				url: 'https://github.com/unitedstates/congress-legislators'
			},
			{
				name: 'Stateside Governors 2026',
				url: 'https://www.stateside.com/state-resource/governors-2026'
			},
			{
				name: 'Stateside Legislative Partisan Splits',
				url: 'https://www.stateside.com/state-resource/legislative-partisan-splits'
			},
			{
				name: '5Calls governor metadata',
				url: 'https://github.com/5calls/us-governors'
			}
		]
	};
}

await fs.writeFile(outPath, `${JSON.stringify(byState, null, 2)}\n`);
console.log(`Wrote ${Object.keys(byState).length} states to ${outPath}`);
