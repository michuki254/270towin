import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import historicalSenateResults from '$lib/data/historical-senate-results.json';

export type SenateResult = {
	id: string;
	name: string;
	color: string;
	seats: number;
	defaultSeats: number;
	logo: string | null;
};

export type SenateElectionData = {
	year: string;
	token: string;
	mapRoute: string | null;
	hasMap: boolean;
	candidates: SenateResult[];
	totalSeats: number;
	seatsDecided: number;
	majority: number;
	winner: SenateResult | null;
	controlName: string;
	controlSeats: number;
	isControlMap: boolean;
	details: SenateElectionDetails;
};

export type SenateElectionDetails = {
	overview: string;
	keyPoints: string[];
	sources: {
		label: string;
		href: string;
	}[];
};

function fileForToken(token: string): string {
	return `./src/lib/assets/maps/usa/usa-senate-${token}-results.svg`;
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

export function listSenateElectionYears(): { year: string; token: string }[] {
	const mapYears = new Map(
		globSync('./src/lib/assets/maps/usa/usa-senate-*-results.svg')
		.map((f) => {
			const m = path.basename(f).match(/usa-senate-(.+)-results\.svg/);
			const token = m ? m[1] : '';
			return { token, year: token.slice(0, 4) };
		})
		.filter((x) => /^\d{4}$/.test(x.year))
		.map((x) => [x.year, x.token])
	);
	const years = [{ year: '1788', token: mapYears.get('1788') ?? '1788' }];
	for (let year = 1790; year <= 2024; year += 2) {
		const yearString = String(year);
		years.push({ year: yearString, token: mapYears.get(yearString) ?? yearString });
	}
	return years;
}

const stateAdmissionYears = [
	1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788, 1788,
	1791, 1792, 1796, 1803, 1812, 1816, 1817, 1818, 1819, 1820, 1821, 1836, 1837,
	1845, 1845, 1846, 1848, 1850, 1858, 1859, 1861, 1863, 1864, 1867, 1876, 1889,
	1889, 1889, 1889, 1890, 1890, 1896, 1907, 1912, 1912, 1959, 1959
];

function totalSenateSeatsForYear(year: string): number {
	const numericYear = Number(year);
	return stateAdmissionYears.filter((admissionYear) => admissionYear <= numericYear).length * 2;
}

function senateDetailsForYear(year: string, hasMap: boolean, isControlMap = false): SenateElectionDetails {
	const numericYear = Number(year);
	const directElectionText =
		numericYear >= 1914
			? 'This cycle was held under the direct-election system created by the Seventeenth Amendment.'
			: 'This cycle was before the Seventeenth Amendment, when senators were generally chosen by state legislatures.';
	const mapText = hasMap
		? isControlMap
			? 'The app includes an interactive state-by-state Senate results map with chamber control totals for this cycle.'
			: 'The app includes an interactive state-by-state map of the Senate seats decided in this cycle.'
		: 'The app does not yet include a state-by-state interactive Senate map for this cycle.';

	return {
		overview: `The ${year} U.S. Senate election cycle was part of the regular staggered Senate election schedule. ${directElectionText} ${mapText}`,
		keyPoints: [
			'Only about one-third of Senate seats normally stand for election in a regular cycle.',
			'Each state has two senators, with seats divided into three staggered classes.',
			numericYear >= 1914
				? 'From 1914 forward, Senate elections were generally decided by statewide popular vote.'
				: 'Before 1914, state legislatures usually selected U.S. senators.',
			hasMap && isControlMap
				? 'Use the interactive map above to inspect the state-by-state result.'
				: hasMap
					? 'Use the interactive map above to inspect the regular Senate seats decided in this cycle.'
				: 'A future map file can be added for this year without changing the archive route.'
		],
		sources: [
			{
				label: 'U.S. Senate',
				href: 'https://www.senate.gov/about/origins-foundations/electing-appointing-senators.htm'
			},
			{
				label: 'National Archives',
				href: 'https://www.archives.gov/milestone-documents/17th-amendment'
			},
			{
				label: 'Senate Election List',
				href:
					numericYear < 1914
						? 'https://en.wikipedia.org/wiki/List_of_United_States_Senate_elections_(1788%E2%80%931913)'
						: 'https://en.wikipedia.org/wiki/List_of_United_States_Senate_elections_(1914%E2%80%93present)'
			}
		]
	};
}

export function getSenateElection(year: string): SenateElectionData | null {
	const entry = listSenateElectionYears().find((y) => y.year === year);
	if (entry === undefined) {
		return null;
	}

	const file = fileForToken(entry.token);
	if (!fs.existsSync(file)) {
		const totalSeats = totalSenateSeatsForYear(entry.year);
		return {
			year: entry.year,
			token: entry.token,
			mapRoute: null,
			hasMap: false,
			candidates: [],
			totalSeats,
			seatsDecided: 0,
			majority: Math.floor(totalSeats / 2) + 1,
			winner: null,
			controlName: 'Historical Senate cycle',
			controlSeats: 0,
			isControlMap: false,
			details: senateDetailsForYear(entry.year, false)
		};
	}

	const svg = fs.readFileSync(file, 'utf8');
	const header = svg.match(/<svg\b[\s\S]*?candidates='([^']*)'/);
	const candidates: Record<string, SenateResult> = {};

	if (header !== null) {
		try {
			const parsed = JSON.parse(header[1]) as {
				id: string | number;
				name: string;
				defaultCount?: number;
				margins?: { color?: string }[];
			}[];
			for (const c of parsed) {
				const defaultSeats = c.defaultCount ?? 0;
				candidates[String(c.id)] = {
					id: String(c.id),
					name: c.name,
					color: (c.margins?.[0]?.color ?? '#888888').replace('##', '#'),
					seats: defaultSeats,
					defaultSeats,
					logo: logoFor(c.name)
				};
			}
		} catch {
			return null;
		}
	}

	const regionRe = /"candidate":"([^"]+)"\s*,\s*"count":(\d+)/g;
	let match: RegExpExecArray | null;
	let seatsDecided = 0;
	while ((match = regionRe.exec(svg)) !== null) {
		const candidate = candidates[match[1]];
		const count = Number(match[2]);
		seatsDecided += count;
		if (candidate !== undefined) {
			candidate.seats += count;
		}
	}

	const sorted = Object.values(candidates).sort((a, b) => b.seats - a.seats);
	const totalMappedSeats = sorted.reduce((sum, c) => sum + c.seats, 0);
	const hasExtractedHistoricalData =
		Object.hasOwn(historicalSenateResults.cycles, entry.year) && entry.year !== '2022';
	const isControlMap = !hasExtractedHistoricalData;
	const officialBalance =
		hasExtractedHistoricalData
			? (historicalSenateResults.cycles as Record<string, { officialBalance?: Record<string, number> | null }>)[
					entry.year
				]?.officialBalance
			: null;
	const officialTotal =
		officialBalance !== null && officialBalance !== undefined
			? Object.values(officialBalance).reduce((sum, count) => sum + count, 0)
			: 0;
	const totalSeats = isControlMap
		? totalMappedSeats
		: officialTotal > 0
			? officialTotal
			: totalSenateSeatsForYear(entry.year);
	const majority = Math.floor(totalSeats / 2) + 1;
	const democrats = sorted.find((c) => c.name === 'Democrats')?.seats ?? 0;
	const republicans = sorted.find((c) => c.name === 'Republicans')?.seats ?? 0;
	const independents = sorted.find((c) => c.name === 'Independents')?.seats ?? 0;
	const democraticCaucus = democrats + independents;
	const topCandidate = sorted.find((c) => c.seats > 0) ?? null;
	const topNonCaucusSeats = topCandidate?.seats ?? 0;
	const controlSeats = Math.max(democraticCaucus, republicans, topNonCaucusSeats);
	const controlName =
		democraticCaucus >= republicans && democraticCaucus >= topNonCaucusSeats
			? 'Democratic caucus'
			: republicans >= topNonCaucusSeats
				? 'Republicans'
				: (topCandidate?.name ?? 'Historical Senate cycle');
	const winner =
		controlName === 'Republicans'
			? (sorted.find((c) => c.name === 'Republicans') ?? null)
			: controlName === 'Democratic caucus'
				? (sorted.find((c) => c.name === 'Democrats') ?? null)
				: topCandidate;

	return {
		year: entry.year,
		token: entry.token,
		mapRoute: `/app/usa/senate/${entry.token}/results`,
		hasMap: true,
		candidates: sorted.filter((c) => c.seats > 0),
		totalSeats,
		seatsDecided,
		majority,
		winner,
		controlName,
		controlSeats,
		isControlMap,
		details: senateDetailsForYear(entry.year, true, isControlMap)
	};
}
