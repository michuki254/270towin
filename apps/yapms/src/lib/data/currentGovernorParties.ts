/**
 * Incumbent party by region ID for states with a 2026 gubernatorial contest.
 * Roster checked September 26, 2026 against NGA's current governor directory
 * and 2026 election list. The 2026 cycle has 36 state races (18 D, 18 R); the
 * NGA's other three listed races are in territories, which this state map omits.
 * No additional state gubernatorial special election is listed for 2026.
 *
 * IDs match the uppercase two-letter `region` attributes in
 * `usa-governors-2024312-blank.svg`; all 36 contest states have a matching ID.
 * Sources: https://www.nga.org/governors/
 *          https://www.nga.org/governors/elections/
 */
export type CurrentGovernorParty = 'D' | 'R';

export const currentGovernorPartyByRegion: Readonly<Record<string, CurrentGovernorParty>> = {
	AK: 'R',
	AL: 'R',
	AR: 'R',
	AZ: 'D',
	CA: 'D',
	CO: 'D',
	CT: 'D',
	FL: 'R',
	GA: 'R',
	HI: 'D',
	IA: 'R',
	ID: 'R',
	IL: 'D',
	KS: 'D',
	MA: 'D',
	MD: 'D',
	ME: 'D',
	MI: 'D',
	MN: 'D',
	NE: 'R',
	NH: 'R',
	NM: 'D',
	NV: 'R',
	NY: 'D',
	OH: 'R',
	OK: 'R',
	OR: 'D',
	PA: 'D',
	RI: 'D',
	SC: 'R',
	SD: 'R',
	TN: 'R',
	TX: 'R',
	VT: 'R',
	WI: 'D',
	WY: 'R'
};
