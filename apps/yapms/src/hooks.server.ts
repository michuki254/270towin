import type { Handle } from '@sveltejs/kit';

/* Cache policy for rendered HTML.
 *
 * max-age=0 keeps browsers honest (prices and odds change continuously),
 * while s-maxage + stale-while-revalidate lets any CDN put in front of
 * this origin (Cloudflare once the domain is proxied) serve from edge for
 * five minutes and refresh in the background. Static assets already ship
 * immutable headers from the adapter; API and share routes are excluded.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const path = event.url.pathname;
	const isPage =
		event.request.method === 'GET' &&
		response.headers.get('content-type')?.includes('text/html') &&
		!path.startsWith('/api') &&
		!path.startsWith('/view');
	if (isPage && !response.headers.has('cache-control')) {
		response.headers.set('cache-control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
	}
	return response;
};
