/**
 * Current party of the incumbent seat on each 2026 Senate ballot contest,
 * as of September 26, 2026. The 33 regular Class II seats comprise 13 D and
 * 20 R; the Florida and Ohio special-election seats add two R seats (35 total:
 * 13 D, 22 R). The map's `FL-S` and `OH-S` regions are those special contests.
 *
 * Sources: Senate.gov Class II roster
 * (https://www.senate.gov/senators/Class_II.htm), current roster
 * (https://www.senate.gov/senators/index.htm), and Florida/Ohio Senate histories
 * (https://www.senate.gov/states/FL/senators.htm,
 * https://www.senate.gov/states/OH/senators.htm).
 * Only contest regions are listed; non-contest map regions are intentionally omitted.
 */
export type Senate2026Party = 'D' | 'R';

export type Senate2026RegionId =
	| 'AK'
	| 'AL'
	| 'AR'
	| 'CO'
	| 'DE'
	| 'FL-S'
	| 'GA'
	| 'IA'
	| 'ID'
	| 'IL'
	| 'KS'
	| 'KY'
	| 'LA'
	| 'MA'
	| 'ME'
	| 'MI'
	| 'MN'
	| 'MS'
	| 'MT'
	| 'NC'
	| 'NE'
	| 'NH'
	| 'NJ'
	| 'NM'
	| 'OH-S'
	| 'OK'
	| 'OR'
	| 'RI'
	| 'SC'
	| 'SD'
	| 'TN'
	| 'TX'
	| 'VA'
	| 'WV'
	| 'WY';

export const currentSenate2026PartyByRegion = {
	AK: 'R',
	AL: 'R',
	AR: 'R',
	CO: 'D',
	DE: 'D',
	'FL-S': 'R',
	GA: 'D',
	IA: 'R',
	ID: 'R',
	IL: 'D',
	KS: 'R',
	KY: 'R',
	LA: 'R',
	MA: 'D',
	ME: 'R',
	MI: 'D',
	MN: 'D',
	MS: 'R',
	MT: 'R',
	NC: 'R',
	NE: 'R',
	NH: 'D',
	NJ: 'D',
	NM: 'D',
	'OH-S': 'R',
	OK: 'R',
	OR: 'D',
	RI: 'D',
	SC: 'R',
	SD: 'R',
	TN: 'R',
	TX: 'R',
	VA: 'D',
	WV: 'R',
	WY: 'R'
} as const satisfies Record<Senate2026RegionId, Senate2026Party>;
