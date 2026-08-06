<script lang="ts">
	/* Nothing quantitative on this page was sourced, and the invented figures
	 * pointed the wrong way.
	 *
	 * It published a "Prediction Market Forecast" of 51.6% GOP and a "Market
	 * Signal" panel of 51.6/47.2/1.2 badged "Live-style model". Polymarket's
	 * actual House-control market has the Democrats as heavy favourites, so the
	 * page was not merely unsourced but close to the opposite of the market it
	 * claimed to be quoting. That market is now loaded in +page.server.ts.
	 *
	 * The two invented seat figures also contradicted each other on screen: a
	 * card read "Consensus Forecast 218 R - 217 D" while the strip immediately
	 * below it gave the Republicans 208. Neither was attributed. Both are gone;
	 * the real current standing is 219 R - 212 D with four vacancies.
	 *
	 * Every row carried a "Prediction market" percentage between 49 and 57.
	 * There are no per-district markets to quote — re-checked against the open
	 * Polymarket catalogue — so the column is gone rather than invented.
	 *
	 * The rating column is gone too, for a different reason: the ratings were
	 * unattributed and undated, and the sources that publish them (Crystal Ball,
	 * and 270toWin's own table) both refuse automated fetches, so there was no
	 * way to verify or refresh them. Sabato's public summary of this cycle is
	 * that the Democrats are favoured on a small battlefield, which is stated
	 * and linked instead of dressed up as twelve per-district calls.
	 *
	 * Since/Term went the same way as on the Senate page: it mixed up service in
	 * different offices, and the 2028 tab listed Yadira Caraveo as a sitting
	 * member two years after she lost the seat. What remains is verifiable —
	 * which districts are competitive, and who holds each one now.
	 *
	 * The map is untouched.
	 */
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import ChamberOdds from '$lib/components/marketodds/ChamberOdds.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const mapEmbedUrl = '/app/usa/house/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/house/2026/blank';

	type Party = 'Democratic' | 'Republican';
	type District = {
		district: string;
		holder: string;
		party: Party;
		/** Year they first took this seat. */
		since: number;
		photo: string;
		initials: string;
	};

	const partyStyles: Record<Party, { color: string; bg: string; logo: string }> = {
		Democratic: { color: '#2E5AAC', bg: 'bg-[#eaf0fb]', logo: '/party-logos/democrats.png' },
		Republican: { color: '#D83A45', bg: 'bg-[#fdebed]', logo: '/party-logos/republicans.png' }
	};

	/* Current standing, 431 voting members with 4 vacancies. */
	const GOP_NOW = 219;
	const DEM_NOW = 212;
	const VACANT = 4;
	const TOTAL_SEATS = 435;
	const FOR_MAJORITY = 218;

	/* The most competitive districts and who holds each one today. This is a list
	   of seats, not of 2026 nominees — most primaries are still to come. */
	const districts: District[] = [
		{
			district: 'CA-22',
			holder: 'David Valadao',
			party: 'Republican',
			since: 2021,
			photo: '/candidate-headshots/house/david-valadao.jpg',
			initials: 'DV'
		},
		{
			district: 'NY-17',
			holder: 'Mike Lawler',
			party: 'Republican',
			since: 2023,
			photo: '/candidate-headshots/house/mike-lawler.jpg',
			initials: 'ML'
		},
		{
			district: 'WA-03',
			holder: 'Marie Gluesenkamp Perez',
			party: 'Democratic',
			since: 2023,
			photo: '/candidate-headshots/house/marie-gluesenkamp-perez.jpg',
			initials: 'MGP'
		},
		{
			district: 'NE-02',
			holder: 'Don Bacon',
			party: 'Republican',
			since: 2017,
			photo: '',
			initials: 'DB'
		},
		{
			district: 'VA-02',
			holder: 'Jen Kiggans',
			party: 'Republican',
			since: 2023,
			photo: '',
			initials: 'JK'
		},
		{
			district: 'PA-01',
			holder: 'Brian Fitzpatrick',
			party: 'Republican',
			since: 2017,
			photo: '/candidate-headshots/house/brian-fitzpatrick.jpg',
			initials: 'BF'
		},
		{
			district: 'PA-07',
			holder: 'Ryan Mackenzie',
			party: 'Republican',
			since: 2025,
			photo: '',
			initials: 'RM'
		},
		{
			district: 'PA-10',
			holder: 'Scott Perry',
			party: 'Republican',
			since: 2013,
			photo: '',
			initials: 'SP'
		},
		{
			district: 'IA-01',
			holder: 'Mariannette Miller-Meeks',
			party: 'Republican',
			since: 2021,
			photo: '',
			initials: 'MMM'
		},
		{
			district: 'CO-08',
			holder: 'Gabe Evans',
			party: 'Republican',
			since: 2025,
			photo: '',
			initials: 'GE'
		},
		{
			district: 'NY-04',
			holder: 'Laura Gillen',
			party: 'Democratic',
			since: 2025,
			photo: '/candidate-headshots/house/laura-gillen.jpg',
			initials: 'LG'
		},
		{
			district: 'ME-02',
			holder: 'Jared Golden',
			party: 'Democratic',
			since: 2019,
			photo: '',
			initials: 'JG'
		}
	];

	const partyFilters = ['All', 'Republican-held', 'Democratic-held'] as const;
	let selectedFilter = $state<(typeof partyFilters)[number]>('All');
	const shown = $derived(
		selectedFilter === 'All'
			? districts
			: districts.filter((d) => `${d.party}-held` === selectedFilter)
	);

	const gopHeld = districts.filter((d) => d.party === 'Republican').length;

	/** The cushion is currently one seat, so "1 seats" needs guarding. */
	const CUSHION = GOP_NOW - FOR_MAJORITY;
	const FLIPS_CHAMBER = CUSHION + 1;
	const seats = (n: number) => `${n} seat${n === 1 ? '' : 's'}`;

	const faqs = [
		{
			q: 'How many seats are needed to control the House?',
			a: `${FOR_MAJORITY} of ${TOTAL_SEATS}. The Republicans currently hold ${GOP_NOW} and the Democrats ${DEM_NOW}, with ${VACANT} seats vacant, so the working majority is a handful of seats either way.`
		},
		{
			q: 'Are all House seats up in 2026?',
			a: `Yes. All ${TOTAL_SEATS} voting seats are elected every two years, which is why the House can change hands in a single night while the Senate turns over a third at a time.`
		},
		{
			q: 'Why are there no ratings or percentages next to each district?',
			a: 'Because we do not produce them and cannot verify a borrowed set here. Polymarket runs a market on House control, shown above, but none on individual districts. Sabato’s Crystal Ball rates the districts and its assessment of this cycle is linked below; rather than reproduce twelve of its calls without a date on them, the table sticks to which seats are competitive and who holds them.'
		},
		{
			q: 'Can I share a map I have built?',
			a: 'Yes. Open the full interactive map, assign the districts, and use the Share button for a link or embed code.'
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
		{
			label: '2028 Presidential Interactive Map',
			href: '/2028-presidential-election-interactive-map'
		},
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' },
		{ label: 'Historical House Elections', href: '/historical-house-elections' }
	];
</script>

<svelte:head>
	<title>2026 House Elections | Interactive District Map &amp; Market Odds</title>
	<meta
		name="description"
		content="The 2026 fight for the House: an interactive district map you can fill in yourself, the most competitive seats and who holds them, and live Polymarket odds on which party wins control."
	/>
	<link rel="canonical" href="/2026-house-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 House Elections | Interactive District Map" />
	<meta
		property="og:description"
		content="Build your own path to 218 seats, with the competitive districts and live market odds on House control."
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
				<span>2026 House</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. House Elections
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2026 House Elections
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						All {TOTAL_SEATS} seats are on the ballot and the Republicans are defending a majority of {seats(CUSHION)}. Assign districts in the map to see who reaches {FOR_MAJORITY}.
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
					Click into the full map to assign districts and build your own House.
				</p>
			</div>
			<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				<iframe
					src={mapEmbedUrl}
					title="2026 U.S. House Interactive Election Map"
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
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#D83A45"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">House now</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
					{GOP_NOW} R &ndash; {DEM_NOW} D
				</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					{VACANT} seats vacant of {TOTAL_SEATS}
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#061a55"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">For control</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{FOR_MAJORITY}</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					A majority of the {TOTAL_SEATS} voting seats
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#7a6e43"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
					Republican cushion
				</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
					{seats(CUSHION)}
				</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					A net loss of {FLIPS_CHAMBER} flips the chamber
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-3 h-1.5 w-12 rounded-full" style="background:#2E5AAC"></div>
				<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Seats up</div>
				<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">All {TOTAL_SEATS}</div>
				<div class="mt-1 text-xs leading-relaxed text-neutral-500">
					Every voting seat, every two years
				</div>
			</div>
		</section>

		<div class="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
			<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
				<div
					class="flex flex-col gap-3 border-b border-neutral-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
				>
					<div>
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
							The competitive districts
						</h2>
						<p class="text-xs text-neutral-500">
							Who holds each seat today. {gopHeld} of these {districts.length} are Republican-held.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each partyFilters as f}
							<button
								type="button"
								onclick={() => (selectedFilter = f)}
								class={`rounded border px-3 py-1.5 text-xs font-black ${
									selectedFilter === f
										? 'border-[#061a55] bg-[#061a55] text-white'
										: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
								}`}
							>
								{f}
							</button>
						{/each}
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full min-w-[560px] border-collapse text-sm">
						<thead
							class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500"
						>
							<tr class="border-b border-neutral-200">
								<th class="px-4 py-3" scope="col">District</th>
								<th class="px-4 py-3" scope="col">Currently held by</th>
								<th class="px-4 py-3" scope="col">Party</th>
								<th class="px-4 py-3 text-right" scope="col">In the seat since</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-100">
							{#each shown as d (d.district)}
								<tr class="hover:bg-[#f9fafc]">
									<td class="px-4 py-3">
										<span
											class="inline-flex h-8 w-14 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]"
										>
											{d.district}
										</span>
									</td>
									<td class="px-4 py-3">
										<div class="flex items-center gap-3">
											{#if d.photo}
												<img
													src={d.photo}
													alt=""
													class="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover object-top"
													loading="lazy"
												/>
											{:else}
												<div
													class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-xs font-black text-white"
													style={`background:${partyStyles[d.party].color}`}
													aria-hidden="true"
												>
													{d.initials}
												</div>
											{/if}
											<span class="font-bold text-neutral-900">{d.holder}</span>
										</div>
									</td>
									<td class="px-4 py-3">
										<span
											class={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-black ${partyStyles[d.party].bg}`}
											style={`color:${partyStyles[d.party].color}`}
										>
											<img
												src={partyStyles[d.party].logo}
												alt=""
												class="h-5 w-5 rounded-full object-contain"
												loading="lazy"
											/>
											{d.party}
										</span>
									</td>
									<td class="px-4 py-3 text-right font-semibold text-neutral-700">{d.since}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<p class="border-t border-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-500">
					These are seats, not 2026 match-ups: most primaries are still to come, and some sitting
					members will not be on the ballot. Sabato&rsquo;s Crystal Ball rates the districts
					individually and currently has
					<a
						class="underline hover:text-neutral-700"
						href="https://centerforpolitics.org/crystalball/the-house-democrats-favored-on-what-starts-as-a-small-battlefield/"
						rel="noopener"
						target="_blank">the Democrats favoured on a small battlefield</a
					>.
				</p>
			</section>

			<div class="flex flex-col gap-5">
				<ChamberOdds
					panel={data.house}
					title="Who controls the House"
					question="Which party will win the House in 2026?"
				/>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						How little has to move
					</h2>
					<p class="mt-3 text-sm leading-relaxed text-neutral-600">
						With {GOP_NOW} seats against {DEM_NOW}, the Republican majority is {seats(CUSHION)} deep.
						A net loss of {FLIPS_CHAMBER} hands the chamber over — fewer than the {gopHeld}
						Republican-held competitive districts listed here, which is why the whole chamber turns
						on a couple of dozen seats out of {TOTAL_SEATS}.
					</p>
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

			<aside class="flex flex-col gap-4">
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

				<div
					class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm"
				>
					<h2 class="mb-1 text-base font-black text-[#061a55]">Key Facts</h2>
					<ul class="flex list-inside list-disc flex-col gap-1">
						<li><strong>{TOTAL_SEATS}</strong> voting seats, <strong>{FOR_MAJORITY}</strong> for control</li>
						<li>Now: <strong>{GOP_NOW} R &ndash; {DEM_NOW} D</strong>, {VACANT} vacant</li>
						<li><strong>All</strong> seats elected every two years</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
			Control percentages are live Polymarket prices carrying the time they were read, not a
			forecast produced by this site. Seat counts are the current standing of the 119th Congress and
			change with each special election.
		</footer>
	</article>
	<SiteFooter />
</div>
