import { calendar, GENERAL_ELECTION, STATES, TERRITORIES, summary } from '$lib/server/primaryCalendar';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async () => {
	// "Held" versus "upcoming" is relative to today, so this is computed per
	// request rather than baked in at build time. No network calls, so it is
	// cheap enough not to need the cache the market pages use.
	const today = new Date().toISOString().slice(0, 10);
	return {
		today,
		days: calendar(),
		states: STATES,
		territories: TERRITORIES,
		generalElection: GENERAL_ELECTION,
		summary: summary(today)
	};
};
