import { getMapBasenames } from '$lib/server/mapSvgFiles';

export function entries() {
	const result = [];
	for (const map of getMapBasenames()) {
		const params = map.split('-');
		if (params.length !== 2) {
			continue;
		}
		result.push({
			country: params[0],
			map: params[1]
		});
	}
	return result;
}

export const prerender = false;
