import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import historicalHouseResults from '$lib/data/historical-house-results.json';

export type HouseResult = {
	id: string;
	name: string;
	color: string;
	seats: number;
	mapSeats: number;
	logo: string | null;
};

export type HouseElectionData = {
	year: string;
	token: string;
	mapRoute: string | null;
	hasMap: boolean;
	candidates: HouseResult[];
	totalSeats: number;
	seatsDecided: number;
	mapUnit: 'districts' | 'states';
	majority: number;
	winner: HouseResult | null;
	controlName: string;
	controlSeats: number;
	details: HouseElectionDetails;
};

export type HouseElectionDetails = {
	overview: string;
	keyPoints: string[];
	sources: {
		label: string;
		href: string;
	}[];
};

const PARTY_CODE_TO_LOGO: Record<string, string> = {
	D: '/party-logos/democrats.png',
	R: '/party-logos/republicans.png',
	I: '/party-logos/independents.png'
};

function fileForToken(token: string): string {
	return `./src/lib/assets/maps/usa/usa-house-${token}-results.svg`;
}

function logoFor(name: string): string | null {
	if (name === 'Democrats') {
		return PARTY_CODE_TO_LOGO.D;
	}
	if (name === 'Republicans') {
		return PARTY_CODE_TO_LOGO.R;
	}
	if (name === 'Independents') {
		return PARTY_CODE_TO_LOGO.I;
	}
	return null;
}

function yearForHouseToken(token: string): string {
	const generatedYear = Object.entries(
		historicalHouseResults.cycles as Record<string, { token?: string }>
	).find(([, cycle]) => cycle.token === token)?.[0];
	if (generatedYear !== undefined) {
		return generatedYear;
	}
	if (/^\d{7}$/.test(token) && token.endsWith('003')) {
		return String(Number(token.slice(0, 4)) - 1);
	}
	return token.slice(0, 4);
}

export function listHouseElectionYears(): { year: string; token: string }[] {
	const generatedYears = new Map(
		Object.entries(historicalHouseResults.cycles as Record<string, { token: string }>).map(([year, cycle]) => [
			year,
			cycle.token
		])
	);
	const mapYears = new Map(
		globSync('./src/lib/assets/maps/usa/usa-house-*-results.svg')
			.map((f) => {
				const m = path.basename(f).match(/usa-house-(.+)-results\.svg/);
				const token = m ? m[1] : '';
				return { token, year: yearForHouseToken(token) };
			})
			.filter((x) => /^\d{4}$/.test(x.year))
			.map((x) => [x.year, x.token])
	);
	return [...new Set([...generatedYears.keys(), ...mapYears.keys()])]
		.sort((a, b) => Number(a) - Number(b))
		.map((year) => ({ year, token: generatedYears.get(year) ?? mapYears.get(year) ?? year }));
}

function houseDetailsForYear(
	year: string,
	hasMap: boolean,
	mapUnit: 'districts' | 'states' = 'districts'
): HouseElectionDetails {
	const mapDescription = mapUnit === 'states' ? 'state-level results map' : 'district map';
	const mapInspection = mapUnit === 'states' ? 'state-level winners' : 'district-level winners';
	return {
		overview: `The ${year} U.S. House election chose members for the House of Representatives for the Congress beginning the following January. ${hasMap ? `The app includes an interactive ${mapDescription} for this cycle.` : 'The app does not yet include an interactive map for this cycle.'}`,
		keyPoints: [
			'Unlike the Senate, every voting House seat is normally up for election every two years.',
			'District boundaries can change after each census, so historical House maps depend on the correct district geography for that cycle.',
			hasMap
				? `Use the interactive map above to inspect ${mapInspection} in this election cycle.`
				: 'This page currently shows the official chamber balance; a district map can be added when matching historical district geography and returns are available.'
		],
		sources: [
			{
				label: 'MIT Election Lab',
				href: 'https://electionlab.mit.edu/data'
			},
			{
				label: 'House Party Divisions',
				href: 'https://history.house.gov/Institution/Party-Divisions/Party-Divisions/'
			}
		]
	};
}

function parseMapCandidates(svg: string): HouseResult[] {
	const header = svg.match(/<svg\b[\s\S]*?candidates='([^']*)'/);
	const candidates: Record<string, HouseResult> = {};
	if (header === null) {
		return [];
	}
	try {
		const parsed = JSON.parse(header[1]) as {
			id: string | number;
			name: string;
			defaultCount?: number;
			margins?: { color?: string }[];
		}[];
		for (const c of parsed) {
			candidates[String(c.id)] = {
				id: String(c.id),
				name: c.name,
				color: (c.margins?.[0]?.color ?? '#888888').replace('##', '#'),
				seats: c.defaultCount ?? 0,
				mapSeats: c.defaultCount ?? 0,
				logo: logoFor(c.name)
			};
		}
	} catch {
		return [];
	}

	const regionRe = /"candidate":"([^"]+)"\s*,\s*"count":(\d+)/g;
	let match: RegExpExecArray | null;
	while ((match = regionRe.exec(svg)) !== null) {
		const candidate = candidates[match[1]];
		if (candidate !== undefined) {
			candidate.mapSeats += Number(match[2]);
		}
	}
	return Object.values(candidates);
}

function candidatesFromOfficialBalance(
	year: string,
	mapCandidates: HouseResult[]
): HouseResult[] {
	const cycle = (historicalHouseResults.cycles as Record<string, { officialBalance?: Record<string, number> | null }>)[year];
	const officialBalance = cycle?.officialBalance;
	if (!officialBalance) {
		return mapCandidates.map((candidate) => ({ ...candidate, seats: candidate.mapSeats }));
	}
	const parties = historicalHouseResults.parties as Record<string, { id: string; name: string; color: string }>;
	const mapByName = new Map(mapCandidates.map((candidate) => [candidate.name, candidate]));
	return Object.entries(officialBalance)
		.map(([party, seats]) => {
			const info = parties[party];
			if (!info) {
				return null;
			}
			const mapCandidate = mapByName.get(info.name);
			return {
				id: info.id,
				name: info.name,
				color: info.color,
				seats,
				mapSeats: mapCandidate?.mapSeats ?? 0,
				logo: logoFor(info.name)
			};
		})
		.filter((candidate): candidate is HouseResult => candidate !== null);
}

function candidatesForBalance(year: string): HouseResult[] {
	return candidatesFromOfficialBalance(year, []).sort((a, b) => b.seats - a.seats);
}

export function getHouseElection(year: string): HouseElectionData | null {
	const entry = listHouseElectionYears().find((y) => y.year === year);
	if (entry === undefined) {
		return null;
	}

	const file = fileForToken(entry.token);
	if (!fs.existsSync(file)) {
		const cycle = (historicalHouseResults.cycles as Record<
			string,
			{ officialTotalSeats?: number | null; mapUnit?: 'districts' | 'states' }
		>)[entry.year];
		const candidates = candidatesForBalance(entry.year);
		const candidateTotalSeats = candidates.reduce((sum, candidate) => sum + candidate.seats, 0);
		const totalSeats = cycle?.officialTotalSeats ?? (candidateTotalSeats || 435);
		const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;
		return {
			year: entry.year,
			token: entry.token,
			mapRoute: null,
			hasMap: false,
			candidates: candidates.filter((candidate) => candidate.seats > 0),
			totalSeats,
			seatsDecided: 0,
			mapUnit: cycle?.mapUnit === 'states' ? 'states' : 'districts',
			majority: Math.floor(totalSeats / 2) + 1,
			winner,
			controlName: winner?.name ?? 'Historical House cycle',
			controlSeats: winner?.seats ?? 0,
			details: houseDetailsForYear(entry.year, false, cycle?.mapUnit === 'states' ? 'states' : 'districts')
		};
	}

	const svg = fs.readFileSync(file, 'utf8');
	const mapCandidates = parseMapCandidates(svg);
	const candidates = candidatesFromOfficialBalance(entry.year, mapCandidates).sort((a, b) => b.seats - a.seats);
	const cycle = (historicalHouseResults.cycles as Record<
		string,
		{ races?: Record<string, unknown>; officialTotalSeats?: number | null; mapUnit?: 'districts' | 'states' }
	>)[entry.year];
	const cycleRaceCount = Object.keys(cycle?.races ?? {}).length;
	const seatsDecided =
		cycleRaceCount > 0
			? cycleRaceCount
			: mapCandidates.reduce((sum, candidate) => sum + candidate.mapSeats, 0);
	const mapUnit = cycle?.mapUnit === 'states' ? 'states' : 'districts';
	const candidateTotalSeats = candidates.reduce((sum, candidate) => sum + candidate.seats, 0);
	const totalSeats = cycle?.officialTotalSeats ?? (candidateTotalSeats || 435);
	const majority = Math.floor(totalSeats / 2) + 1;
	const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;

	return {
		year: entry.year,
		token: entry.token,
		mapRoute: `/app/usa/house/${entry.token}/results`,
		hasMap: true,
		candidates: candidates.filter((candidate) => candidate.seats > 0),
		totalSeats,
		seatsDecided,
		mapUnit,
		majority,
		winner,
		controlName: winner?.name ?? 'Historical House cycle',
		controlSeats: winner?.seats ?? 0,
		details: houseDetailsForYear(entry.year, true, mapUnit)
	};
}
