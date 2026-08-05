import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';

type CandidateMeta = {
	name: string;
	color: string;
	partyFamily: 'Democratic' | 'Republican' | 'Other';
};

export type StatePresidentialResult = {
	year: string;
	state: string;
	region: string;
	winner: string;
	color: string;
	partyFamily: 'Democratic' | 'Republican' | 'Other';
	ev: number;
};

function colorFamily(color: string): CandidateMeta['partyFamily'] {
	const hex = color.replace('#', '');
	if (hex.length !== 6) {
		return 'Other';
	}
	const red = Number.parseInt(hex.slice(0, 2), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);
	if (red > blue + 20) return 'Republican';
	if (blue > red + 20) return 'Democratic';
	return 'Other';
}

function parseCandidates(svg: string): Record<string, CandidateMeta> {
	const header = svg.match(/<svg\b[\s\S]*?candidates='([^']*)'/);
	if (header === null) {
		return {};
	}
	const parsed = JSON.parse(header[1]) as {
		id: string | number;
		name: string;
		margins?: { color?: string }[];
	}[];
	return Object.fromEntries(
		parsed.map((candidate) => {
			const color = (candidate.margins?.[0]?.color ?? '#888888').replace('##', '#');
			return [
				String(candidate.id),
				{
					name: candidate.name,
					color,
					partyFamily: colorFamily(color)
				}
			];
		})
	);
}

export function listStatePresidentialResults(sinceYear = 1900): StatePresidentialResult[] {
	const files = globSync('./src/lib/assets/maps/usa/usa-presidential-*-results.svg').sort();
	const results: StatePresidentialResult[] = [];

	for (const file of files) {
		const token = path.basename(file).match(/usa-presidential-(.+)-results\.svg/)?.[1] ?? '';
		const year = token.slice(0, 4);
		if (!/^\d{4}$/.test(year) || Number(year) < sinceYear) {
			continue;
		}

		const svg = fs.readFileSync(file, 'utf8');
		const candidates = parseCandidates(svg);
		const regionRe =
			/<path\b[\s\S]*?long-name="([^"]+)"[\s\S]*?region="([^"]+)"[\s\S]*?candidates='([^']*)'/g;
		let match: RegExpExecArray | null;
		while ((match = regionRe.exec(svg)) !== null) {
			const [, state, region, encodedCandidates] = match;
			if (!/^[a-z]{2}$/.test(region) || region === 'dc') {
				continue;
			}

			const parsed = JSON.parse(encodedCandidates) as { candidate: string; count: number }[];
			const winner = parsed[0];
			const meta = candidates[winner?.candidate];
			if (winner === undefined || meta === undefined) {
				continue;
			}

			results.push({
				year,
				state,
				region,
				winner: meta.name,
				color: meta.color,
				partyFamily: meta.partyFamily,
				ev: winner.count
			});
		}
	}

	return results;
}

export function stateConsistencySummary(sinceYear: number) {
	const byState = new Map<string, StatePresidentialResult[]>();
	for (const result of listStatePresidentialResults(sinceYear)) {
		const current = byState.get(result.region) ?? [];
		current.push(result);
		byState.set(result.region, current);
	}

	const states = [...byState.values()].map((results) => {
		const sorted = results.sort((a, b) => Number(a.year) - Number(b.year));
		const families = new Set(sorted.map((result) => result.partyFamily));
		const last = sorted.at(-1)!;
		return {
			state: last.state,
			region: last.region.toUpperCase(),
			partyFamily: last.partyFamily,
			changed: families.size > 1,
			cycles: sorted.length,
			results: sorted
		};
	});

	return states.sort((a, b) => a.state.localeCompare(b.state));
}
