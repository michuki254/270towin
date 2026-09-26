import { fetchMovers } from '$lib/server/polymarket';
import type { PageServerLoad } from './$types';

export const prerender = false;

/** Windows the CLOB history endpoint supports, and that we offer as links. */
const WINDOWS = [1, 7, 30] as const;
type Window = (typeof WINDOWS)[number];

function parseWindow(raw: string | null): Window {
	const n = Number(raw);
	return (WINDOWS as readonly number[]).includes(n) ? (n as Window) : 7;
}

export const load: PageServerLoad = async ({ url }) => {
	// Window comes from the query string so the switcher is plain links and works
	// with no client JavaScript.
	const windowDays = parseWindow(url.searchParams.get('window'));
	const board = await fetchMovers({ windowDays, minDelta: 1 });
	return { board, windows: WINDOWS };
};
