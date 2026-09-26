/* The 2026 primary calendar.
 *
 * The page using this listed six month names — February through September —
 * with notes about "Super Tuesday and major delegate allocation windows". That
 * described a presidential nomination race, which 2026 is not, and it named no
 * state and no date on a page titled "State Primary Dates". February and March
 * carry no congressional primaries at all bar Texas, Arkansas and the Carolinas.
 *
 * Transcribed from the Federal Voting Assistance Program's 2026 chart, which
 * covers every state, DC and the territories in one table:
 * https://www.fvap.gov/uploads/FVAP/VAO/PrimaryElectionsCalendar.pdf
 *
 * Arizona's primary was subsequently moved from 4 August to 21 July by HB2022;
 * that correction is verified against the Arizona Secretary of State's 2026
 * election information page:
 * https://azsos.gov/elections/election-information/2026-election-info
 *
 * Dates are stored ISO so they can be sorted and compared rather than only
 * printed. There is no runoff column ambiguity to resolve: FVAP lists
 * congressional runoffs, so South Dakota's July gubernatorial runoff is
 * correctly absent.
 */

export type PrimaryRow = {
	name: string;
	/** Kebab slug matching /states/<slug>. Absent for non-state rows. */
	slug?: string;
	/** ISO date of the primary, or null where none is held. */
	primary: string | null;
	/** ISO date of the congressional runoff, where the state holds one. */
	runoff: string | null;
	/** Whether a U.S. Senate seat is on the ballot. */
	senate: boolean;
	/** Number of U.S. House seats up. */
	houseSeats: number;
	/** Set for DC and the territories, which elect a delegate rather than a member. */
	delegate?: boolean;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function row(
	name: string,
	primary: string | null,
	runoff: string | null,
	senate: boolean,
	houseSeats: number,
	delegate = false
): PrimaryRow {
	return {
		name,
		...(delegate ? {} : { slug: slugify(name) }),
		primary,
		runoff,
		senate,
		houseSeats,
		...(delegate ? { delegate: true } : {})
	};
}

export const STATES: PrimaryRow[] = [
	row('Alabama', '2026-05-19', '2026-06-16', true, 7),
	row('Alaska', '2026-08-18', null, true, 1),
	row('Arizona', '2026-07-21', null, false, 9),
	row('Arkansas', '2026-03-03', '2026-03-31', true, 4),
	row('California', '2026-06-02', null, false, 52),
	row('Colorado', '2026-06-30', null, true, 8),
	row('Connecticut', '2026-08-11', null, false, 5),
	row('Delaware', '2026-09-15', null, true, 1),
	row('Florida', '2026-08-18', null, true, 28),
	row('Georgia', '2026-05-19', '2026-06-16', true, 14),
	row('Hawaii', '2026-08-08', null, false, 2),
	row('Idaho', '2026-05-19', null, true, 2),
	row('Illinois', '2026-03-17', null, true, 17),
	row('Indiana', '2026-05-05', null, false, 9),
	row('Iowa', '2026-06-02', null, true, 4),
	row('Kansas', '2026-08-04', null, true, 4),
	row('Kentucky', '2026-05-19', null, true, 6),
	row('Louisiana', '2026-05-16', '2026-06-27', true, 6),
	row('Maine', '2026-06-09', null, true, 2),
	row('Maryland', '2026-06-23', null, false, 8),
	row('Massachusetts', '2026-09-01', null, true, 9),
	row('Michigan', '2026-08-04', null, true, 13),
	row('Minnesota', '2026-08-11', null, true, 8),
	row('Mississippi', '2026-03-10', '2026-04-07', true, 4),
	row('Missouri', '2026-08-04', null, false, 8),
	row('Montana', '2026-06-02', null, true, 2),
	row('Nebraska', '2026-05-12', null, true, 3),
	row('Nevada', '2026-06-09', null, false, 4),
	row('New Hampshire', '2026-09-08', null, true, 2),
	row('New Jersey', '2026-06-02', null, true, 12),
	row('New Mexico', '2026-06-02', null, true, 3),
	row('New York', '2026-06-23', null, false, 26),
	row('North Carolina', '2026-03-03', '2026-05-12', true, 14),
	row('North Dakota', '2026-06-09', null, false, 1),
	row('Ohio', '2026-05-05', null, true, 15),
	row('Oklahoma', '2026-06-16', '2026-08-25', true, 5),
	row('Oregon', '2026-05-19', null, true, 6),
	// The FVAP chart marks Pennsylvania as having a Senate race; it does not.
	// Its seats are Class I, last contested in 2024, and Class III, next in 2028,
	// so neither is on the 2026 ballot. The U.S. Senate's 2026 election roster
	// lists 33 regular Class II seats plus the Florida and Ohio specials, for 35
	// contests total; Pennsylvania is not among them.
	row('Pennsylvania', '2026-05-19', null, false, 17),
	row('Rhode Island', '2026-09-09', null, true, 2),
	row('South Carolina', '2026-06-09', '2026-06-23', true, 7),
	row('South Dakota', '2026-06-02', null, true, 1),
	row('Tennessee', '2026-08-06', null, true, 9),
	row('Texas', '2026-03-03', '2026-05-26', true, 38),
	row('Utah', '2026-06-23', null, false, 4),
	row('Vermont', '2026-08-11', null, false, 1),
	row('Virginia', '2026-08-04', null, true, 11),
	row('Washington', '2026-08-04', null, false, 10),
	row('West Virginia', '2026-05-12', null, true, 2),
	row('Wisconsin', '2026-08-11', null, false, 8),
	row('Wyoming', '2026-08-18', null, true, 1)
];

/** DC and the territories, which send a delegate or resident commissioner. */
export const TERRITORIES: PrimaryRow[] = [
	row('District of Columbia', '2026-06-16', null, false, 1, true),
	row('Guam', '2026-08-01', null, false, 1, true),
	row('American Samoa', null, null, false, 1, true),
	row('Virgin Islands', '2026-08-01', null, false, 1, true),
	row('Puerto Rico', null, null, false, 1, true)
];

export const GENERAL_ELECTION = '2026-11-03';

export type CalendarDay = {
	/** ISO date. */
	date: string;
	/** Primaries held this day. */
	primaries: PrimaryRow[];
	/** Runoffs held this day, which may fall on another state's primary date. */
	runoffs: PrimaryRow[];
};

/**
 * The calendar as it actually runs: one entry per date, chronological, with
 * primaries and runoffs that share a date grouped together.
 *
 * Grouping by date rather than listing states alphabetically is the point of
 * the page — it is what shows that 3 March carries Texas, Arkansas and North
 * Carolina at once while 15 September carries only Delaware.
 */
export function calendar(rows: PrimaryRow[] = [...STATES, ...TERRITORIES]): CalendarDay[] {
	const byDate = new Map<string, CalendarDay>();
	const day = (d: string) => {
		let e = byDate.get(d);
		if (!e) byDate.set(d, (e = { date: d, primaries: [], runoffs: [] }));
		return e;
	};
	for (const r of rows) {
		if (r.primary) day(r.primary).primaries.push(r);
		if (r.runoff) day(r.runoff).runoffs.push(r);
	}
	return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Totals worth stating, all counted rather than asserted. */
export function summary(today: string) {
	const dated = STATES.filter((s) => s.primary);
	const held = dated.filter((s) => s.primary! < today);
	const days = calendar();
	const upcoming = days.filter((d) => d.date >= today);
	return {
		states: STATES.length,
		firstDate: dated.reduce((a, s) => (s.primary! < a ? s.primary! : a), dated[0].primary!),
		lastDate: dated.reduce((a, s) => (s.primary! > a ? s.primary! : a), dated[0].primary!),
		heldCount: held.length,
		remainingCount: dated.length - held.length,
		nextDay: upcoming[0] ?? null,
		daysToGeneral: Math.max(
			0,
			Math.round(
				(Date.parse(`${GENERAL_ELECTION}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000
			)
		)
	};
}
