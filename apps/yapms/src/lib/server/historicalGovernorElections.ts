import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import historicalGovernorResults from '$lib/data/historical-governor-results.json';
import { stateOfficials } from '$lib/data/stateOfficials';

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
	dataSnapshotAt: string;
	mapRoute: string | null;
	hasMap: boolean;
	raceWinners: {
		name: string;
		color: string;
		states: string[];
	}[];
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
	sources: {
		label: string;
		href: string;
	}[];
};

const stateNameByAbbreviation = new Map(
	Object.values(stateOfficials).map((state) => [state.abbreviation, state.name])
);

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
		Object.entries(historicalGovernorResults.cycles as Record<string, { token: string }>).map(
			([year, cycle]) => [year, cycle.token]
		)
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

function governorRaceWinnersForYear(year: string): GovernorElectionData['raceWinners'] {
	const cycles = historicalGovernorResults.cycles as Record<
		string,
		{ races?: Record<string, { party?: string }> }
	>;
	const parties = historicalGovernorResults.parties as Record<
		string,
		{ name: string; color: string }
	>;
	const groupedStates = new Map<string, string[]>();
	for (const [abbreviation, result] of Object.entries(cycles[year]?.races ?? {})) {
		if (!result.party || !parties[result.party]) {
			continue;
		}
		const stateName = stateNameByAbbreviation.get(abbreviation) ?? abbreviation;
		groupedStates.set(result.party, [...(groupedStates.get(result.party) ?? []), stateName]);
	}

	return [...groupedStates.entries()]
		.map(([party, states]) => ({
			name: parties[party].name,
			color: parties[party].color,
			states: states.sort((a, b) => a.localeCompare(b))
		}))
		.sort((a, b) => b.states.length - a.states.length || a.name.localeCompare(b.name));
}

function governorDetailsForYear(
	year: string,
	raceWinners: GovernorElectionData['raceWinners'],
	candidates: GovernorResult[],
	totalSeats: number
): GovernorElectionDetails {
	const raceSummary = raceWinners.map(({ name, states }) => `${name}: ${states.length}`).join(', ');
	const balanceSummary = candidates.map(({ name, seats }) => `${name}: ${seats}`).join(', ');
	const raceCount = raceWinners.reduce((total, group) => total + group.states.length, 0);
	return {
		overview: `The ${year} U.S. gubernatorial cycle included ${raceCount} state races (${raceSummary || 'race outcomes are not available in this dataset'}). After the cycle, the party balance was ${balanceSummary || 'not available'} out of ${totalSeats} governorships. The balance includes governors whose terms continued in states without an election that year; the state list and map show only states with a recorded race.`,
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

function candidatesFromOfficialBalance(
	year: string,
	mapCandidates: GovernorResult[]
): GovernorResult[] {
	const cycle = (
		historicalGovernorResults.cycles as Record<
			string,
			{ officialBalance?: Record<string, number> | null }
		>
	)[year];
	const officialBalance = cycle?.officialBalance;
	if (!officialBalance) {
		return mapCandidates.map((candidate) => ({ ...candidate, seats: candidate.mapSeats }));
	}
	const parties = historicalGovernorResults.parties as Record<
		string,
		{ id: string; name: string; color: string }
	>;
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

	const cycle = (
		historicalGovernorResults.cycles as Record<
			string,
			{ races?: Record<string, { party?: string }>; officialTotalSeats?: number | null }
		>
	)[entry.year];
	const totalSeats = cycle?.officialTotalSeats ?? 50;
	const raceWinners = governorRaceWinnersForYear(entry.year);
	const file = fileForToken(entry.token);
	if (!fs.existsSync(file)) {
		const candidates = candidatesFromOfficialBalance(entry.year, []).sort(
			(a, b) => b.seats - a.seats
		);
		const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;
		return {
			year: entry.year,
			token: entry.token,
			dataSnapshotAt: historicalGovernorResults.generatedAt,
			mapRoute: null,
			hasMap: false,
			raceWinners,
			candidates,
			totalSeats,
			seatsDecided: 0,
			majority: Math.floor(totalSeats / 2) + 1,
			winner,
			controlName: winner?.name ?? 'Historical governor cycle',
			controlSeats: winner?.seats ?? 0,
			details: governorDetailsForYear(entry.year, raceWinners, candidates, totalSeats)
		};
	}

	const svg = fs.readFileSync(file, 'utf8');
	const mapCandidates = parseMapCandidates(svg);
	const candidates = candidatesFromOfficialBalance(entry.year, mapCandidates).sort(
		(a, b) => b.seats - a.seats
	);
	const cycleRaceCount = Object.keys(cycle?.races ?? {}).length;
	const seatsDecided =
		cycleRaceCount > 0
			? cycleRaceCount
			: mapCandidates.reduce((sum, candidate) => sum + candidate.mapSeats, 0);
	const majority = Math.floor(totalSeats / 2) + 1;
	const winner = candidates.find((candidate) => candidate.seats > 0) ?? null;

	return {
		year: entry.year,
		token: entry.token,
		dataSnapshotAt: historicalGovernorResults.generatedAt,
		mapRoute: `/app/usa/governors/${entry.token}/results`,
		hasMap: true,
		raceWinners,
		candidates: candidates.filter((candidate) => candidate.seats > 0),
		totalSeats,
		seatsDecided,
		majority,
		winner,
		controlName: winner?.name ?? 'Historical governor cycle',
		controlSeats: winner?.seats ?? 0,
		details: governorDetailsForYear(entry.year, raceWinners, candidates, totalSeats)
	};
}
