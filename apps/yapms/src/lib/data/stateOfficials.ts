import generatedStateOfficials from './state-officials.generated.json';

export type Party = 'Democratic' | 'Republican' | 'Independent' | 'Other';

export type SourceLink = {
	name: string;
	url: string;
};

export type CompositionRow = {
	body: string;
	democrat: number;
	republican: number;
	other: number;
	vacant: number;
	total: number;
};

export type Official = {
	district: string;
	title: string;
	name: string;
	party: Party;
	since: string;
	currentTerm: string;
	nextElection: string;
	photo: string;
	address: string;
	phone: string;
	website: string;
	contact: string;
	social?: {
		facebook?: string;
		x?: string;
	};
	source?: SourceLink;
	bioguide?: string;
};

export type StateOfficialsData = {
	name: string;
	abbreviation: string;
	slug: string;
	capital: string;
	updated: string;
	composition: CompositionRow[];
	congress: Official[];
	governor: Official;
	stateLegislature: Official[];
	sources: SourceLink[];
};

const data = generatedStateOfficials as Record<string, StateOfficialsData>;

const titleCaseSlug = (slug: string) =>
	slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

export function getStateOfficials(slug: string): StateOfficialsData {
	const normalized = slug.toLowerCase();
	const found = data[normalized];

	if (found) {
		return found;
	}

	return {
		name: titleCaseSlug(slug),
		abbreviation: 'US',
		slug: normalized,
		capital: 'Capital',
		updated: new Date().toISOString(),
		composition: [
			{ body: 'U.S. Senate', democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 },
			{ body: 'U.S. House', democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 },
			{ body: 'Governor', democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 },
			{ body: 'State Senate', democrat: 0, republican: 0, other: 0, vacant: 0, total: 0 },
			{
				body: 'State House of Representatives',
				democrat: 0,
				republican: 0,
				other: 0,
				vacant: 0,
				total: 0
			}
		],
		congress: [],
		governor: {
			district: 'Statewide',
			title: 'Governor',
			name: 'Not available',
			party: 'Other',
			since: '',
			currentTerm: '',
			nextElection: '',
			photo: '/favicon.svg',
			address: '',
			phone: '',
			website: '#',
			contact: '#'
		},
		stateLegislature: [],
		sources: []
	};
}

export const stateOfficials = data;
