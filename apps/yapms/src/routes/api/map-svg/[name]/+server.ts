import { error, type RequestHandler } from '@sveltejs/kit';
import { getMapSvg } from '$lib/server/mapSvgFiles';

export const GET: RequestHandler = ({ params }) => {
	if (!params.name) throw error(404, 'Map not found');
	const svg = getMapSvg(params.name);
	if (svg === undefined) {
		throw error(404, 'Map not found');
	}

	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml; charset=utf-8',
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};
