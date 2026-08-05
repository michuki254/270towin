/* Resolve candidate headshots to files that actually exist.
 *
 * Two reasons this is not just a string built from the name. The contender
 * list is now driven by a live market, so it contains people we hold no photo
 * of ("Jon Ossoff", "Thomas Massie") and the roster changes without a deploy —
 * emitting /candidate-headshots/<name>.jpg unconditionally would render a
 * broken-image icon for them. And the obvious existence check,
 * fs.existsSync('./static/...'), is the bug that kept every historical
 * portrait hidden in production: the server runs from /app, where there is no
 * ./static directory, so it answers false for files that are being served
 * perfectly well.
 *
 * import.meta.glob is resolved by Vite at build time, so the set of available
 * files is baked into the bundle and no filesystem call happens per request.
 * Only the keys are read, which leaves the images as static assets rather than
 * inlining them.
 */
const names = (glob: Record<string, unknown>) =>
	new Set(
		Object.keys(glob).map((p) => p.slice(p.lastIndexOf('/') + 1).replace(/\.jpg$/, ''))
	);

const HEADSHOTS = names(import.meta.glob('/static/candidate-headshots/presidential/*.jpg'));

/* Anyone who has already been president has an official portrait on the
   historical-elections page. Falling back to it saves showing a monogram for
   Trump, who is priced in the 2028 market but has no contender headshot. */
const PORTRAITS = names(import.meta.glob('/static/portraits/*.jpg'));

/** "J.D. Vance" and "JD Vance" must both reach jd-vance.jpg. */
function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/\./g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function headshotFor(name: string): string | null {
	const slug = slugify(name);
	if (HEADSHOTS.has(slug)) return `/candidate-headshots/presidential/${slug}.jpg`;
	if (PORTRAITS.has(slug)) return `/portraits/${slug}.jpg`;
	return null;
}

/** Fallback monogram for contenders with no photo on file. */
export function initialsFor(name: string): string {
	const words = name.replace(/[^A-Za-z\s'-]/g, '').split(/\s+/).filter(Boolean);
	if (!words.length) return '?';
	const first = words[0][0] ?? '';
	const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : '';
	return (first + last).toUpperCase();
}
