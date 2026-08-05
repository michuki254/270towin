import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import historicalGovernorResults from '$lib/data/historical-governor-results.json';

export type GovernorResult = {
	id: string;
	name: string;
	color: string;
	seats: number;
	mapSeats: number;
	logo: string | null;
};

export type GovernorElectionData = {
	year: string;
	token: string;
	mapRoute: string | null;
	hasMap: boolean;
	candidates: GovernorResult[];
	totalSeats: number;
	seatsDecided: number;
	majority: number;
	winner: GovernorResult | null;
	controlName: string;
	controlSeats: number;
	details: GovernorElectionDetails;
};

export type GovernorElectionDetails = {
	overview: string;
	keyPoints: string[];
	sources: {
		label: string;
		href: string;
	}[];
};

function fileForToken(token: string): string {
	return `./src/lib/assets/maps/usa/usa-governors-${token}-results.svg`;
}

function logoFor(name: string): string | null {
	if (name === 'Democrats') {
		return '/party-logos/democrats.png';
	}
	if (name === 'Republicans') {
		return '/party-logos/republicans.png';
	}
	if (name === 'Independents') {
		return '/party-logos/independents.png';
	}
	return null;
}

function yearForGovernorToken(token: string): string {
	const generatedYear = Object.entries(
		historicalGovernorResults.cycles as Record<string, { token?: string }>
	).find(([, cycle]) => cycle.token === token)?.[0];
	if (generatedYear !== undefined) {
		return generatedYear;
	}
	return token.slice(0, 4);
}

export function listGovernorElectionYears(): { year: string; token: string }[] {
	const generatedYears = new Map(
		Object.entries(historicalGovernorResults.cycles as Record<string, { token: string }>).map(([year, cycle]) => [
			year,
			cycle.token
		])
	);
	const mapYears = new Map(
		globSync('./src/lib/assets/maps/usa/usa-governors-*-results.svg')
			.map((f) => {
				const m = path.basename(f).match(/usa-governors-(.+)-results\.svg/);
				const token = m ? m[1] : '';
				return { token, year: yearForGovernorToken(token) };
			})
			.filter((x) => /^\d{4}$/.test(x.year))
			.map((x) => [x.year, x.token])
	);
	return [...new Set([...generatedYears.keys(), ...mapYears.keys()])]
		.sort((a, b) => Number(a) - Number(b))
		.map((year) => ({ year, token: generatedYears.get(year) ?? mapYears.get(year) ?? year }));
}

function governorDetailsForYear(year: string, hasMap: boolean): GovernorElectionDetails {
	return {
		overview: `The ${year} U.S. gubernatorial election cycle decided governorships in the states holding regular or special elections that year. ${hasMap ? 'The app includes an interactive state-by-state governor results map for this cycle.' : 'The app does not yet include an interactive governor map for this cycle.'}`,
		keyPoints: [
			'Governor elections are staggered by state, so most years include only a subset of states.',
			'The map colors states with governor elections in that cycle; non-election states are counted as holdovers in the balance totals.',
			hasMap
				? 'Use the interactive map above to inspect the states decided in this gubernatorial cycle.'
				: 'A future map file can be added for this year without changing the archive route.'
		],
		sources: [
			{
				label: 'Wikipedia Gubernatorial Elections',
				href: `https://en.wikipedia.org/wiki/${year}_United_States_gubernatorial_elections`
			}
		]
	};
}

function parseMapCandidates(svg: string): GovernorResult[] {
	const header = svg.match(/<svg\b[\s\S]*?candidates='([^']*)'/);
	const candidates: Record<string, GovernorResult> = {};
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
				mapSeats: 0,
				logo: logoFor(c.name)
			};
		}
	} catch {
		return [];
	}

	const regionRe = /"candidate":"([^"]+)"\s*,\s*"count":(\d+)/g;
	let match: RegExpExecArray | null;
	const seenRegions = new Set<string>();
	while ((match = regionRe.exec(svg)) !== null) {
		const tagStart = svg.lastIndexOf('<', match.index);
		const tagEnd = svg.indexOf('>', match.index);
		const tagText = tagStart >= 0 && tagEnd >= 0 ? svg.slice(tagStart, tagEnd + 1) : '';
		const region = tagText.match(/\sregion="([^"]+)"/)?.[1] ?? `${match.index}`;
		if (seenRegions.has(region)) {
			continue;
		}
		seenRegions.add(region);
		const candidate = candidates[match[1]];
		if (candidate !== undefined) {
			candidate.mapSeats += Number(match[2]);
		}
	}
	return Object.values(candidates);
}

function candidatesFromOfficialBalance(year: string, mapCandidates: GovernorResult[]): GovernorResult[] {
	const cycle = (historicalGovernorResults.cycles as Record<string, { officialBalance?: Record<string, number> | null }>)[
		year
	];
	const officialBalance = cycle?.officialBalance;
	if (!officialBalance) {
		return mapCandidates.map((candidate) => ({ ...candidate, seats: candidate.mapSeats }));
	}
	const parties = historicalGovernorResults.parties as Record<string, { id: string; name: string; color: string }>;
	const mapByName = new Map(mapCandidates.map((candidate) => [candidate.name, candidate]));
	return Object.entries(officialBalance)
		.map(([party, seats]) => {
			if (seats <= 0) {
				return null;
			}
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
		.filter((candidate): candidate is GovernorResult => candidate !== null);
}

export function getGovernorElection(year: string): GovernorElectionData | null {
	const entry = listGovernorElectionYears().find((y) => y.year === year);
	if (entry === undefined) {
		return null;
	}

	const cycle = (historicalGovernorResults.cycles as Record<
		string,
		{ races?: Record<string, unknown>; officialTotalSeats?: number | null }
	>)[entry.year];
	const totalSeats = cycle?.officialTotalSeats ?? 50;
	const file = fileForToken(entry.token);
	if (!fs.existsSync(file)) {
		const candidates = candidatesFromOfficialBalance(entry.year, []).sort((a, b) => b.seats - a.seats);
		const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;
		return {
			year: entry.year,
			token: entry.token,
			mapRoute: null,
			hasMap: false,
			candidates,
			totalSeats,
			seatsDecided: 0,
			majority: Math.floor(totalSeats / 2) + 1,
			winner,
			controlName: winner?.name ?? 'Historical governor cycle',
			controlSeats: winner?.seats ?? 0,
			details: governorDetailsForYear(entry.year, false)
		};
	}

	const svg = fs.readFileSync(file, 'utf8');
	const mapCandidates = parseMapCandidates(svg);
	const candidates = candidatesFromOfficialBalance(entry.year, mapCandidates).sort((a, b) => b.seats - a.seats);
	const cycleRaceCount = Object.keys(cycle?.races ?? {}).length;
	const seatsDecided =
		cycleRaceCount > 0 ? cycleRaceCount : mapCandidates.reduce((sum, candidate) => sum + candidate.mapSeats, 0);
	const majority = Math.floor(totalSeats / 2) + 1;
	const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;

	return {
		year: entry.year,
		token: entry.token,
		mapRoute: `/app/usa/governors/${entry.token}/results`,
		hasMap: true,
		candidates: candidates.filter((candidate) => candidate.seats > 0),
		totalSeats,
		seatsDecided,
		majority,
		winner,
		controlName: winner?.name ?? 'Historical governor cycle',
		controlSeats: winner?.seats ?? 0,
		details: governorDetailsForYear(entry.year, true)
	};
}
