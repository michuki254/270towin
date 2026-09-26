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
	 * below it gave the Republicans 208. Both are gone. The current snapshot
	 * reflects the Clerk's roster and vacancy list: 218 Republicans, 214
	 * Democrats, one Independent, and two vacancies.
	 *
	 * Every row carried a "Prediction market" percentage between 49 and 57.
	 * There are no per-district markets to quote — re-checked against the open
	 * Polymarket catalogue — so the column is gone rather than invented.
	 *
	 * The rating column is gone too, for a different reason: the ratings were
	 * unattributed and undated, and the sources that publish them (Crystal Ball,
	 * and 270toWin's own table) both refuse automated fetches, so there was no
	 * way to verify or refresh them. Sabato's public summary of this cycle is
	 * that the Democrats are favoured on a small battlefield. The current table
	 * is labelled as a selected set of officeholders, not a rating or forecast.
	 *
	 * Since/Term went the same way as on the Senate page: it mixed up service in
	 * different offices, and the 2028 tab listed Yadira Caraveo as a sitting
	 * member two years after she lost the seat. What remains is verifiable —
	 * which selected districts' current officeholders appear in the table.
	 *
	 * The map opens with the current House roster as an editable starting point.
	 */
	import ElectionPageShell from '$lib/components/electionpage/ElectionPageShell.svelte';
	import ChamberOdds from '$lib/components/marketodds/ChamberOdds.svelte';
	import ElectionDataNotes from '$lib/components/electiondata/ElectionDataNotes.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const mapEmbedUrl = '/app/usa/house/2026128/blank?embed=1&current-house=1';
	const mapFullUrl = '/app/usa/house/2026128/blank?current-house=1';

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

	/* Current standing, checked against the House Clerk on 26 September 2026. */
	const GOP_NOW = 218;
	const DEM_NOW = 214;
	const INDEPENDENT_NOW = 1;
	const VACANT = 2;
	const TOTAL_SEATS = 435;
	const FOR_MAJORITY = 218;

	/* Twelve selected districts and their current seat holders. This is not a
	   complete list of 2026 nominees or an official district rating. */
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

	const DEM_NET_GAIN_TO_MAJORITY = FOR_MAJORITY - DEM_NOW;

	const faqs = [
		{
			q: 'How many seats are needed to control the House?',
			a: `${FOR_MAJORITY} of ${TOTAL_SEATS}. As of September 26, 2026, Republicans hold ${GOP_NOW}, Democrats hold ${DEM_NOW}, one seat is held by an independent, and ${VACANT} seats are vacant. Republicans are at the 218-seat threshold.`
		},
		{
			q: 'Are all House seats up in 2026?',
			a: `Yes. All ${TOTAL_SEATS} voting seats are elected every two years, which is why the House can change hands in a single night while the Senate turns over a third at a time.`
		},
		{
			q: 'Why are there no ratings or percentages next to each district?',
			a: 'This page does not publish a district-level rating or probability. The table is a selected set of districts and their current seat holders, not a complete ballot or numerical ranking. Polymarket has a House-control market, but no market for individual districts.'
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
</script>

<svelte:head>
	<title>2026 House Elections | District Map, Selected Seats &amp; Market Odds</title>
	<meta
		name="description"
		content="Build a 2026 House district map, review selected current officeholders, and see live Polymarket odds on which party will control the chamber."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 House Elections | District Map and Selected Seats" />
	<meta
		property="og:description"
		content="Build your own path to 218 seats, review selected officeholders, and check live market odds on House control."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<ElectionPageShell
	active="House"
	eyebrow="2026 Midterms · U.S. House"
	title="2026 House Elections"
	tagline="435 seats. One path to a House majority."
	intro="All 435 seats are on the ballot. With every seat filled, 218 seats make a majority; Democrats need a net gain of four to reach it. Use the map to explore district-by-district outcomes."
	baseline="Current House roster by district number; the two vacant seats remain unassigned."
>
	<section class="mt-5">
		<div class="mb-3">
			<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
				Build a House scenario
			</h2>
			<p class="text-xs text-neutral-500">
				The map starts with the current member&rsquo;s party by district number. The two vacant
				seats remain toss-ups. The 2026 map may use changed district boundaries, so colors follow
				the current roster&rsquo;s district labels. Roster checked September 26, 2026 against the
				<a
					class="font-semibold underline"
					href="https://clerk.house.gov/Members/ViewMemberList"
					target="_blank"
					rel="noreferrer">House Clerk&rsquo;s member list</a
				>
				and
				<a
					class="font-semibold underline"
					href="https://clerk.house.gov/Members/ViewVacancies"
					target="_blank"
					rel="noreferrer">vacancy list</a
				>.
			</p>
		</div>
		<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
			<iframe
				src={mapEmbedUrl}
				title="2026 U.S. House Interactive Election Map"
				class="block w-full"
				style="height: 760px; border: 0;"
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
				{GOP_NOW} R &ndash; {DEM_NOW} D &ndash; {INDEPENDENT_NOW} I
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
				Democrats&rsquo; net gain needed
			</div>
			<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">
				{DEM_NET_GAIN_TO_MAJORITY}
			</div>
			<div class="mt-1 text-xs leading-relaxed text-neutral-500">
				To reach {FOR_MAJORITY} seats
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
						Selected districts to follow
					</h2>
					<p class="text-xs text-neutral-500">
						Current seat holders, not 2026 nominees. {gopHeld} of these {districts.length} are Republican-held.
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
				These are current officeholders, not 2026 match-ups. The district selection is editorial and
				is not an official rating or an exhaustive battleground list. Some sitting members will not
				be on the ballot. Sabato&rsquo;s Crystal Ball&rsquo;s overall House outlook says
				<a
					class="underline hover:text-neutral-700"
					href="https://centerforpolitics.org/crystalball/the-house-democrats-favored-on-what-starts-as-a-small-battlefield/"
					rel="noopener"
					target="_blank">the Democrats favoured on a small battlefield</a
				>.
			</p>
		</section>

		<div class="flex flex-col gap-5">
			<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
					Seats needed for a majority
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-neutral-600">
					With all 435 seats filled, 218 seats are a majority. Democrats currently hold {DEM_NOW}
					and need a net gain of <strong>{DEM_NET_GAIN_TO_MAJORITY}</strong> to reach that number.
					Republicans hold {GOP_NOW}. The Clerk lists two vacancies, so the membership can change
					when special-election winners take office.
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
			<div
				class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm"
			>
				<h2 class="mb-1 text-base font-black text-[#061a55]">Key Facts</h2>
				<ul class="flex list-inside list-disc flex-col gap-1">
					<li>
						<strong>{TOTAL_SEATS}</strong> voting seats, <strong>{FOR_MAJORITY}</strong> for control
					</li>
					<li>
						Now: <strong>{GOP_NOW} R &ndash; {DEM_NOW} D &ndash; {INDEPENDENT_NOW} I</strong>, {VACANT}
						vacant
					</li>
					<li><strong>All</strong> seats elected every two years</li>
					<li>Election Day: <strong>November 3, 2026</strong></li>
				</ul>
				<a
					class="mt-3 inline-block text-sm font-semibold text-[#2E5AAC]"
					href="/historical-house-elections">Historical House elections →</a
				>
			</div>
		</aside>
	</div>

	<ElectionDataNotes kind="house" />
	<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
		Control percentages are live Polymarket prices carrying the time they were read, not a forecast
		produced by this site. The seat counts are a September 26, 2026 snapshot from the House
		Clerk&rsquo;s member and vacancy records; they can change after a special election or a
		member&rsquo;s departure.
	</footer>
	{#snippet sidebar()}
		<ChamberOdds
			panel={data.house}
			title="House control market"
			question="Which party will win the House in 2026?"
		/>
		<section class="border-t-[3px] border-[#294f83] pt-4">
			<p class="text-[10px] font-bold uppercase tracking-[1px] text-[#a72932]">
				The House at a glance
			</p>
			<h2 class="text-2xl font-bold text-[#262626]">218 seats to control</h2>
			<p class="mt-2 text-sm leading-relaxed text-neutral-600">
				Republicans hold {GOP_NOW}. Democrats need {DEM_NET_GAIN_TO_MAJORITY} more seats to reach a majority.
				One seat is held by an independent and two districts are vacant.
			</p>
		</section>
	{/snippet}
</ElectionPageShell>
