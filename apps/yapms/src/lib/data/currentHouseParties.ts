/**
 * Current party affiliation by district label, encoded from the House Clerk's
 * member roster on September 26, 2026. A dot marks a vacant seat.
 */
const partyCodesByState: Record<string, string> = {
	AK: 'AL:R',
	AL: 'RDRRRRD',
	AR: 'RRRR',
	AZ: 'RRDDRRDRR',
	CA: 'RDIDRDDDDDDDDDDDDDDRDRRDDDDDDDDDDDDDDDDRRDDDDDDRDDDD',
	CO: 'DDRRRDDR',
	CT: 'DDDDD',
	DE: 'AL:D',
	FL: 'RRRRRRRRDDRRRDRRRRR.RDDDDRRR',
	GA: 'RDRDDDRRRRRRDR',
	HI: 'DD',
	IA: 'RRRR',
	ID: 'RR',
	IL: 'DDDDDDDDDDDRDDRRD',
	IN: 'DRRRRRDRR',
	KS: 'RRDR',
	KY: 'RRDRRR',
	LA: 'RDRRRD',
	MA: 'DDDDDDDDD',
	MD: 'RDDDDDDD',
	ME: 'DD',
	MI: 'RRDRRDRDRRDDD',
	MN: 'RDDDDRRR',
	MO: 'DRRRDRRR',
	MS: 'RDRR',
	MT: 'RR',
	NC: 'DDRDRRRRRRRDRR',
	ND: 'AL:R',
	NE: 'RRR',
	NH: 'DD',
	NJ: 'DRDRDDRDDDDD',
	NM: 'DDD',
	NV: 'DRDD',
	NY: 'RRDDDDDDDDRDDDDDRDDDRDRRDD',
	OH: 'DRDRRRRRDRDRDRR',
	OK: 'RRRRR',
	OR: 'DRDDDD',
	PA: 'RDDDDDRRRRRDRRRRD',
	RI: 'DD',
	SC: 'RRRRRDR',
	SD: 'AL:R',
	TN: 'RRRRRRRRD',
	TX: 'RRRRRRDRDRRRRRRDRDRDRR.RRRRDDDRDDDDRDR',
	UT: 'RRRR',
	VA: 'RRDDRRDDRDD',
	VT: 'AL:D',
	WA: 'DDDRRDDDDD',
	WI: 'RDRDRRRR',
	WV: 'RR',
	WY: 'AL:R'
};

export type CurrentHouseParty = 'D' | 'R' | 'I';

const partyByDistrict = new Map<string, CurrentHouseParty>();

for (const [state, codes] of Object.entries(partyCodesByState)) {
	if (codes.startsWith('AL:')) {
		partyByDistrict.set(state + '-AL', codes.slice(3) as CurrentHouseParty);
		continue;
	}

	Array.from(codes).forEach((party, index) => {
		if (party !== 'D' && party !== 'R' && party !== 'I') return;
		partyByDistrict.set(state + '-' + (index + 1), party);
	});
}

export const currentHousePartyByDistrict: ReadonlyMap<string, CurrentHouseParty> = partyByDistrict;
