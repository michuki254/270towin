import type { RequestHandler } from './$types';

// Domain-agnostic on purpose: the sitemap URL follows whatever host serves
// the request, so moving to the permanent domain needs no code change.
export const GET: RequestHandler = ({ url }) => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /api/',
		'Disallow: /view/',
		'',
		`Sitemap: ${url.origin}/sitemap.xml`,
		''
	].join('\n');
	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
