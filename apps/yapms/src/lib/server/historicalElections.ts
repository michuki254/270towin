import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';

export type CandidateResult = {
	id: string;
	name: string;
	color: string;
	ev: number;
	portrait: string | null;
};

/** Build a portrait URL for a candidate name, or null if no image is bundled. */
function portraitFor(name: string): string | null {
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return fs.existsSync(`./static/portraits/${slug}.jpg`) ? `/portraits/${slug}.jpg` : null;
}
export type ElectionData = {
	year: string; // display year, e.g. "1860"
	token: string; // file token, e.g. "1860" or "2024310"
	mapRoute: string; // interactive results map route
	candidates: CandidateResult[]; // sorted by electoral votes, descending
	totalEV: number;
	winner: CandidateResult | null;
	details: ElectionDetails | null;
};

export type ElectionDetails = {
	overview: string;
	date?: string;
	popularVote?: {
		winner: string;
		runnerUp: string;
		total: string;
	};
	runningMates?: {
		winner: string;
		runnerUp: string;
	};
	keyPoints: string[];
	sources: {
		label: string;
		href: string;
	}[];
};

const electionDetailsByYear: Record<string, ElectionDetails> = {
	'1956': {
		overview:
			'The 1956 presidential election was a rematch of 1952. Incumbent Republican Dwight D. Eisenhower defeated Democrat Adlai Stevenson II in a larger landslide while the country weighed Cold War crises, civil rights, and Eisenhower\'s first-term health.',
		date: 'November 6, 1956',
		popularVote: {
			winner: 'Dwight D. Eisenhower: 35,590,472 votes, 57.4%',
			runnerUp: 'Adlai Stevenson II: 26,022,752 votes, 42.0%',
			total: '62,026,908 votes reported'
		},
		runningMates: {
			winner: 'Richard M. Nixon',
			runnerUp: 'Estes Kefauver'
		},
		keyPoints: [
			'Eisenhower carried 41 states and won 457 electoral votes, while Stevenson won 73.',
			'The campaign took place during the Suez Crisis and the Hungarian Revolution, two major Cold War-era foreign policy events shortly before Election Day.',
			'Stevenson pushed a domestic program he called a New America, while Eisenhower campaigned from a position of broad personal popularity and a strong economy.',
			'One Alabama elector who was pledged to Stevenson cast an electoral vote for Walter B. Jones for president and Herman Talmadge for vice president.',
			'This was the second consecutive Eisenhower-Stevenson race and one of the rare presidential rematches won by the incumbent.'
		],
		sources: [
			{
				label: 'American Presidency Project',
				href: 'https://www.presidency.ucsb.edu/statistics/elections/1956'
			},
			{
				label: 'National Archives',
				href: 'https://www.archives.gov/electoral-college/1956'
			},
			{
				label: 'Britannica',
				href: 'https://www.britannica.com/event/United-States-presidential-election-of-1956'
			}
		]
	}
};

function archivesYear(year: string): string {
	return year === '1788' ? '1789' : year;
}

function defaultDetailsForElection(election: Omit<ElectionData, 'details'>): ElectionDetails {
	const runnerUp = election.candidates[1];
	const margin =
		runnerUp !== undefined && election.winner !== null
			? election.winner.ev - runnerUp.ev
			: election.winner?.ev ?? 0;
	const neededToWin = Math.floor(election.totalEV / 2) + 1;
	const candidateText =
		election.candidates.length === 1
			? '1 candidate with electoral votes'
			: `${election.candidates.length} candidates with electoral votes`;
	const outcome =
		election.winner !== null
			? `${election.winner.name} won the ${election.year} presidential election with ${election.winner.ev} electoral votes.`
			: `The ${election.year} presidential election results are available in the historical map.`;
	const runnerUpText =
		runnerUp !== undefined
			? ` ${runnerUp.name} finished second with ${runnerUp.ev} electoral votes.`
			: '';

	return {
		overview: `${outcome}${runnerUpText} This page combines the interactive historical electoral map with a compact election summary.`,
		keyPoints: [
			`The map records ${election.totalEV} total electoral votes and ${candidateText}.`,
			`${neededToWin} electoral votes were needed for a majority in this election.`,
			`The electoral vote margin between the top two candidates was ${margin}.`,
			'Use the interactive map above to inspect the state-by-state electoral result and explore alternate outcomes.'
		],
		sources: [
			{
				label: 'National Archives',
				href: `https://www.archives.gov/electoral-college/${archivesYear(election.year)}`
			},
			{
				label: 'American Presidency Project',
				href: `https://www.presidency.ucsb.edu/statistics/elections/${election.year}`
			}
		]
	};
}

function fileForToken(token: string): string {
	return `./src/lib/assets/maps/usa/usa-presidential-${token}-results.svg`;
}

/** All presidential election years that have a results map, sorted ascending. */
export function listElectionYears(): { year: string; token: string }[] {
	const files = globSync('./src/lib/assets/maps/usa/usa-presidential-*-results.svg');
	const out = files
		.map((f) => {
			const m = path.basename(f).match(/usa-presidential-(.+)-results\.svg/);
			const token = m ? m[1] : '';
			return { token, year: token.slice(0, 4) };
		})
		.filter((x) => /^\d{4}$/.test(x.year));
	out.sort((a, b) => Number(a.year) - Number(b.year));
	return out;
}

/** Parse a single election's results map into structured data. */
export function getElection(year: string): ElectionData | null {
	const entry = listElectionYears().find((y) => y.year === year);
	if (entry === undefined) {
		return null;
	}
	const file = fileForToken(entry.token);
	if (!fs.existsSync(file)) {
		return null;
	}
	const svg = fs.readFileSync(file, 'utf8');

	// The candidate roster lives in the first candidates='...' attribute on the <svg> element.
	const header = svg.match(/<svg\b[\s\S]*?candidates='([^']*)'/);
	const candidates: Record<string, CandidateResult> = {};
	if (header !== null) {
		try {
			const parsed = JSON.parse(header[1]) as {
				id: string | number;
				name: string;
				margins?: { color?: string }[];
			}[];
			for (const c of parsed) {
				const color = (c.margins?.[0]?.color ?? '#888888').replace('##', '#');
				candidates[String(c.id)] = {
					id: String(c.id),
					name: c.name,
					color,
					ev: 0,
					portrait: portraitFor(c.name)
				};
			}
		} catch {
			return null;
		}
	}

	// Each region encodes its electoral votes via "candidate"/"count" pairs.
	const regionRe = /"candidate":"(\d+)"\s*,\s*"count":(\d+)/g;
	let match: RegExpExecArray | null;
	while ((match = regionRe.exec(svg)) !== null) {
		const candidate = candidates[match[1]];
		if (candidate !== undefined) {
			candidate.ev += Number(match[2]);
		}
	}

	const sorted = Object.values(candidates).sort((a, b) => b.ev - a.ev);
	const totalEV = sorted.reduce((sum, c) => sum + c.ev, 0);
	const winner = sorted.find((c) => c.ev > 0) ?? null;

	const election = {
		year: entry.year,
		token: entry.token,
		mapRoute: `/app/usa/presidential/${entry.token}/results`,
		candidates: sorted.filter((c) => c.ev > 0),
		totalEV,
		winner
	};

	return {
		...election,
		details: electionDetailsByYear[entry.year] ?? defaultDetailsForElection(election)
	};
}
