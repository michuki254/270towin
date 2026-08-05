import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getMapBasenames } from '$lib/server/mapSvgFiles';

export function entries() {
	const result = [];
	for (const map of getMapBasenames()) {
		const params = map.split('-');
		if (params.length !== 4) {
			continue;
		}
		result.push({
			country: params[0],
			map: params[1],
			year: params[2],
			variant: params[3]
		});
	}
	return result;
}

export const load: PageServerLoad = ({ params, url }) => {
	if (
		params.country === 'usa' &&
		params.map === 'presidential' &&
		params.variant === 'results' &&
		url.searchParams.has('embed') === false &&
		url.searchParams.has('interactive') === false
	) {
		throw redirect(308, `/historical-presidential-elections/${params.year}`);
	}
};

export const prerender = false;
