<script lang="ts">
	/* This page had the same invented apparatus as the Senate and House pages —
	 * a "Prediction Market Forecast" card of 52.8% GOP, a 23/1/26 seat
	 * projection, an unattributed "Consensus Forecast", a hand-written market
	 * percentage on every row, and tabs for 2027, 2028 and 2029 filled with
	 * ratings for races years away.
	 *
	 * It is the one page where the per-race numbers can be real: Polymarket
	 * prices the individual 2026 governor races even though it prices no
	 * individual Senate or House ones. So the table is now the market, read in a
	 * single tagged request and sorted by how close each race is, which puts the
	 * genuinely competitive states at the top instead of leaving them in
	 * alphabetical order.
	 *
	 * The stale fact was the headline: "27 R - 23 D" predates Virginia, where
	 * Spanberger was inaugurated in January 2026. It is 26-24.
	 *
	 * California is absent from the table on purpose. Its market is a list of 23
	 * candidate names with no party marker, so classifying them would be
	 * guesswork; the page says so rather than quietly dropping the biggest state.
	 *
	 * The map is untouched.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const mapEmbedUrl = '/app/usa/governors/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/governors/2026/blank';

	const GOP_NOW = 26;
	const DEM_NOW = 24;
	const FOR_MAJORITY = 26;
	const RACES_2026 = 36;

	const DEM = '#2E5AAC';
	const GOP = '#D83A45';

	function readAt(iso: string): string {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return 'unknown';
		const month = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		][d.getUTCMonth()];
		const hh = String(d.getUTCHours()).padStart(2, '0');
		const mm = String(d.getUTCMinutes()).padStart(2, '0');
		return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
	}

	const races = $derived(data.governors.races);
	const gap = (r: PageData['governors']['races'][number]) =>
		Math.abs(r.democratic.pct - r.republican.pct);

	/* "Competitive" here is defined, not asserted: the two prices within 20
	   points of each other. */
	const COMPETITIVE_GAP = 20;
	const competitive = $derived(races.filter((r) => gap(r) <= COMPETITIVE_GAP));
	const demFavoured = $derived(races.filter((r) => r.democratic.pct > r.republican.pct).length);
	const closest = $derived(races[0] ?? null);

	const views = ['Competitive', 'All priced races'] as const;
	let view = $state<(typeof views)[number]>('Competitive');
	const shown = $derived(view === 'Competitive' ? competitive : races);

	const faqs = [
		{
			q: 'How many governorships are needed for a majority?',
			a: `26 of the 50 states. The Republicans currently hold ${GOP_NOW} and the Democrats ${DEM_NOW}, so the two sides are one state apart.`
		},
		{
			q: 'How many governor races are up in 2026?',
			a: `${RACES_2026} states. The other 14 governorships are holdovers not on the ballot this year, and they are already counted on the map.`
		},
		{
			q: 'Where do the percentages come from?',
			a: "They are live Polymarket prices for each state's 2026 governor market, not a forecast produced by this site. A contract pays out if that party wins the state, so its price reads as the market's implied probability. The two sides are separate contracts, which is why a state's pair does not always total exactly 100."
		},
		{
			q: 'Why is California missing from the table?',
			a: 'Because its market cannot be read by party. Most states trade as a simple Democratic-versus-Republican pair, but California runs a list of 23 individual candidates with no party marker attached, so sorting them into parties would mean guessing at the data. It is left out rather than filled in.'
		},
		{
			q: 'Can I build my own governor map?',
			a: 'Yes. Open the full interactive map, assign each state, and use the Share button for a link or embed code.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};

	const relatedMaps = [
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
		{ label: '2024 Governor Election Results', href: '/2024-governor-election-results' },
		{ label: 'Elected Officials', href: '/elected-officials' }
	];
</script>

<svelte:head>
	<title>2026 Governor Elections | Interactive Map &amp; Live Market Odds</title>
	<meta
		name="description"
		content="All 36 governor races in 2026: an interactive map you can fill in yourself, and live Polymarket prices for each state, sorted by how close the race is."
	/>
	<link rel="canonical" href="/2026-governor-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 Governor Elections | Interactive Map" />
	<meta
		property="og:description"
		content="Build your own 2026 governor map, with live market odds for every priced race."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="h-full overflow-y-auto bg-[#f3f5f8] text-neutral-900">
	<article class="mx-auto w-full max-w-7xl px-4 py-6">
		<header class="border-b border-neutral-200 pb-4">
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>2026 Governors</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. Governor Elections
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2026 Governor Elections
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						{RACES_2026} of the 50 governorships are on the ballot, and the two parties start one
						state apart at {GOP_NOW}&ndash;{DEM_NOW}. Fill in the map yourself, or see what the
						markets make of each race below.
					</p>
				</div>
				<a
					href={mapFullUrl}
					class="inline-flex items-center justify-center rounded-md bg-[#D83A45] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#b92f39]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</header>

		<section class="mt-5">
			<div class="mb-3">
				<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
					Interactive Map Projection
				</h2>
				<p class="text-xs text-neutral-500">
					Click into the full map to assign states and build your own governor map.
				</p>
			</div>
			<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				<iframe
					src={mapEmbedUrl}
					title="2026 U.S. Governor Interactive Election Map"
					class="block w-full"
					style="height: 610px; border: 0;"
				></iframe>
			</div>
			<div class="mt-3 flex flex-wrap gap-2 text-sm">
				<a
					href={mapFullUrl}
					class="rounded bg-[#D83A45] px-4 py-2 font-bold text-white hover:bg-[#b92f39]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Key numbers">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style={`background:${GOP}`}></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					Governorships now
				</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
					{GOP_NOW} R &ndash; {DEM_NOW} D
				</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					Virginia and New Jersey both flipped Democratic in 2025
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#061a55"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					For a majority
				</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{FOR_MAJORITY}</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">Of the 50 states</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#7a6e43"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					On the ballot
				</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{RACES_2026}</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					{#if data.governors.ok}
						{races.length} of them carry a market
					{:else}
						States voting for governor in 2026
					{/if}
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div
					class="mb-3 h-1.5 w-12 rounded-full"
					style={`background:${closest && closest.democratic.pct > closest.republican.pct ? DEM : GOP}`}
				></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					Closest race
				</div>
				{#if closest}
					<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{closest.state}</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						{closest.democratic.pct}% D &ndash; {closest.republican.pct}% R on the market
					</div>
				{:else}
					<div class="mt-1 text-2xl font-black tracking-tight text-neutral-400">&mdash;</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">
						Market data unavailable right now
					</div>
				{/if}
			</div>
		</section>

		<div class="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
			<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
				<div
					class="flex flex-col gap-3 border-b border-neutral-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
				>
					<div>
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
							Every race the market prices
						</h2>
						<p class="text-xs text-neutral-500">
							{#if data.governors.ok}
								Closest first. Polymarket, read {readAt(data.governors.fetchedAt)}.
							{:else}
								Live prices are unavailable right now.
							{/if}
						</p>
					</div>
					{#if data.governors.ok}
						<div class="flex flex-wrap gap-2">
							{#each views as v}
								<button
									type="button"
									onclick={() => (view = v)}
									class={`rounded border px-3 py-1.5 text-xs font-black ${
										view === v
											? 'border-[#061a55] bg-[#061a55] text-white'
											: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
									}`}
								>
									{v}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				{#if data.governors.ok}
					<div class="overflow-x-auto">
						<table class="w-full min-w-[620px] border-collapse text-sm">
							<thead
								class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500"
							>
								<tr class="border-b border-neutral-200">
									<th class="px-4 py-3" scope="col">State</th>
									<th class="px-4 py-3" scope="col">Market</th>
									<th class="px-4 py-3 text-right" scope="col">Democratic</th>
									<th class="px-4 py-3 text-right" scope="col">Republican</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-neutral-100">
								{#each shown as r (r.state)}
									<tr class="hover:bg-[#f9fafc]">
										<td class="px-4 py-3">
											<div class="font-black text-[#061a55]">{r.state}</div>
											{#if r.democratic.name || r.republican.name}
												<div class="mt-0.5 text-xs text-neutral-500">
													{r.democratic.name ?? '?'} v {r.republican.name ?? '?'}
												</div>
											{/if}
										</td>
										<td class="px-4 py-3">
											<!-- One bar, split at the Democratic price: the gap between the
											     two ends is the market's read on how close the race is. -->
											<div class="flex h-2.5 w-full min-w-[120px] overflow-hidden rounded-full bg-neutral-100">
												<div style={`width:${r.democratic.pct}%;background:${DEM}`}></div>
												<div class="ml-auto" style={`width:${r.republican.pct}%;background:${GOP}`}></div>
											</div>
										</td>
										<td
											class="px-4 py-3 text-right font-black"
											style={`color:${r.democratic.pct >= r.republican.pct ? DEM : '#8a8f98'}`}
										>
											{r.democratic.pct}%
										</td>
										<td
											class="px-4 py-3 text-right font-black"
											style={`color:${r.republican.pct > r.democratic.pct ? GOP : '#8a8f98'}`}
										>
											{r.republican.pct}%
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<p class="border-t border-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-500">
						&ldquo;Competitive&rdquo; means the two prices are within {COMPETITIVE_GAP} points of each
						other &mdash; {competitive.length} of the {races.length} priced races. Candidate names
						appear only where the market names them; the rest trade as a straight party pair.
						{#if data.governors.skipped.length}
							No party-readable market for {data.governors.skipped.join(', ')}, so
							{data.governors.skipped.length === 1 ? 'it is' : 'they are'} left out.
						{/if}
					</p>
				{:else}
					<p class="px-4 py-8 text-center text-sm text-neutral-500">
						Polymarket could not be reached, so no prices are shown rather than stale ones. The map
						above is unaffected.
					</p>
				{/if}
			</section>

			<div class="flex flex-col gap-5">
				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						What the board looks like
					</h2>
					{#if data.governors.ok}
						<p class="mt-3 text-sm leading-relaxed text-neutral-600">
							Of the {races.length} races carrying a market, the Democrats are the favourite in
							<strong>{demFavoured}</strong> and the Republicans in
							<strong>{races.length - demFavoured}</strong>. Only
							<strong>{competitive.length}</strong>
							are inside {COMPETITIVE_GAP} points, so most of the board is priced as already decided
							and the majority turns on a short list of states.
						</p>
					{:else}
						<p class="mt-3 text-sm text-neutral-600">
							Market prices are unavailable, so no summary is shown. The {RACES_2026} races and the
							{GOP_NOW}&ndash;{DEM_NOW} starting split are unaffected.
						</p>
					{/if}
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Key Facts</h2>
					<ul class="mt-3 flex list-inside list-disc flex-col gap-1 text-sm text-neutral-700">
						<li><strong>50</strong> governorships, <strong>{FOR_MAJORITY}</strong> for a majority</li>
						<li>Now: <strong>{GOP_NOW} R &ndash; {DEM_NOW} D</strong></li>
						<li><strong>{RACES_2026}</strong> on the ballot in 2026</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</section>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<section class="lg:col-span-2">
				<h2 class="mb-3 text-sm font-black uppercase tracking-wide text-[#061a55]">
					Frequently Asked Questions
				</h2>
				<div class="grid gap-2">
					{#each faqs as f}
						<details class="rounded-md border border-neutral-200 bg-white p-3 shadow-sm">
							<summary class="cursor-pointer font-bold text-[#2E5AAC]">{f.q}</summary>
							<p class="mt-2 text-sm leading-relaxed text-neutral-700">{f.a}</p>
						</details>
					{/each}
				</div>
			</section>

			<aside>
				<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="bg-[#061a55] px-3 py-2 text-sm font-bold text-white">Related Maps</div>
					<ul class="divide-y divide-neutral-100">
						{#each relatedMaps as m}
							<li>
								<a
									href={m.href}
									class="block px-3 py-2 text-sm font-semibold text-[#2E5AAC] hover:bg-[#f7f8fb]"
								>
									{m.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
			Percentages are live Polymarket prices carrying the time they were read, not a forecast
			produced by this site. Governorship counts are the current standing as of January 2026.
		</footer>
	</article>
	<SiteFooter />
</div>
