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
};

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

	return {
		year: entry.year,
		token: entry.token,
		mapRoute: `/app/usa/presidential/${entry.token}/results`,
		candidates: sorted.filter((c) => c.ev > 0),
		totalEV,
		winner
	};
}
