<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const mapEmbedUrl = '/app/usa/house/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/house/2026/blank';

	type Party = 'Democratic' | 'Republican';
	type Rating = 'Lean' | 'Tilt' | 'Toss-Up';
	type HouseRace = {
		district: string;
		candidate: string;
		party: Party;
		since: number;
		term: number;
		rating: Rating;
		market: number;
		photo: string;
		initials: string;
	};

	const partyStyles: Record<Party, { color: string; bg: string; text: string; logo: string }> = {
		Democratic: {
			color: '#2E5AAC',
			bg: 'bg-[#eaf0fb]',
			text: 'text-[#2E5AAC]',
			logo: '/party-logos/democrats.png'
		},
		Republican: {
			color: '#D83A45',
			bg: 'bg-[#fdebed]',
			text: 'text-[#D83A45]',
			logo: '/party-logos/republicans.png'
		}
	};

	const ratingStyles: Record<Rating, string> = {
		Lean: 'bg-[#f6f2e3] text-[#7a6e43] border-[#d9d0ab]',
		Tilt: 'bg-[#fff3d8] text-[#8a6500] border-[#ead394]',
		'Toss-Up': 'bg-[#f0ead8] text-[#655c3f] border-[#C8BE9A]'
	};

	const summaryCards = [
		{
			label: 'Current House Count',
			value: '220 R - 215 D',
			detail: 'Republicans hold a narrow House majority',
			accent: '#D83A45'
		},
		{
			label: 'Consensus Forecast',
			value: '218 R - 217 D',
			detail: 'Control is inside the margin of a few seats',
			accent: '#C8BE9A'
		},
		{
			label: 'Prediction Market Forecast',
			value: '51.6% GOP',
			detail: 'Market-style edge for House control',
			accent: '#1f9d55'
		},
		{
			label: 'Interactive Map Projection',
			value: '218 Needed',
			detail: 'Build your own district-by-district map',
			accent: '#2E5AAC'
		}
	];

	const forecastBlocks = [
		{ label: 'Democrats', value: 215, color: '#2E5AAC' },
		{ label: 'Toss-ups', value: 12, color: '#C8BE9A' },
		{ label: 'Republicans', value: 208, color: '#D83A45' }
	];

	const racesByYear: Record<number, HouseRace[]> = {
		2026: [
			{
				district: 'CA-22',
				candidate: 'David Valadao',
				party: 'Republican',
				since: 2021,
				term: 3,
				rating: 'Toss-Up',
				market: 50,
				photo: '/candidate-headshots/house/david-valadao.jpg',
				initials: 'DV'
			},
			{
				district: 'NY-17',
				candidate: 'Mike Lawler',
				party: 'Republican',
				since: 2023,
				term: 2,
				rating: 'Toss-Up',
				market: 51,
				photo: '/candidate-headshots/house/mike-lawler.jpg',
				initials: 'ML'
			},
			{
				district: 'WA-03',
				candidate: 'Marie Gluesenkamp Perez',
				party: 'Democratic',
				since: 2023,
				term: 2,
				rating: 'Toss-Up',
				market: 50,
				photo: '/candidate-headshots/house/marie-gluesenkamp-perez.jpg',
				initials: 'MGP'
			},
			{
				district: 'NE-02',
				candidate: 'Don Bacon',
				party: 'Republican',
				since: 2017,
				term: 5,
				rating: 'Toss-Up',
				market: 49,
				photo: '',
				initials: 'DB'
			},
			{
				district: 'VA-02',
				candidate: 'Jen Kiggans',
				party: 'Republican',
				since: 2023,
				term: 2,
				rating: 'Lean',
				market: 54,
				photo: '',
				initials: 'JK'
			},
			{
				district: 'PA-01',
				candidate: 'Brian Fitzpatrick',
				party: 'Republican',
				since: 2017,
				term: 5,
				rating: 'Lean',
				market: 57,
				photo: '/candidate-headshots/house/brian-fitzpatrick.jpg',
				initials: 'BF'
			},
			{
				district: 'PA-10',
				candidate: 'Scott Perry',
				party: 'Republican',
				since: 2013,
				term: 7,
				rating: 'Tilt',
				market: 53,
				photo: '',
				initials: 'SP'
			},
			{
				district: 'PA-07',
				candidate: 'Ryan Mackenzie',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Toss-Up',
				market: 50,
				photo: '',
				initials: 'RM'
			},
			{
				district: 'IA-01',
				candidate: 'Mariannette Miller-Meeks',
				party: 'Republican',
				since: 2021,
				term: 3,
				rating: 'Tilt',
				market: 52,
				photo: '',
				initials: 'MMM'
			},
			{
				district: 'CO-08',
				candidate: 'Gabe Evans',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Toss-Up',
				market: 50,
				photo: '',
				initials: 'GE'
			},
			{
				district: 'NY-04',
				candidate: 'Laura Gillen',
				party: 'Democratic',
				since: 2025,
				term: 1,
				rating: 'Lean',
				market: 56,
				photo: '/candidate-headshots/house/laura-gillen.jpg',
				initials: 'LG'
			},
			{
				district: 'ME-02',
				candidate: 'Jared Golden',
				party: 'Democratic',
				since: 2019,
				term: 4,
				rating: 'Toss-Up',
				market: 51,
				photo: '',
				initials: 'JG'
			}
		],
		2028: [
			{
				district: 'AZ-06',
				candidate: 'Juan Ciscomani',
				party: 'Republican',
				since: 2023,
				term: 3,
				rating: 'Toss-Up',
				market: 50,
				photo: '',
				initials: 'JC'
			},
			{
				district: 'CO-08',
				candidate: 'Yadira Caraveo',
				party: 'Democratic',
				since: 2023,
				term: 2,
				rating: 'Toss-Up',
				market: 50,
				photo: '',
				initials: 'YC'
			},
			{
				district: 'NJ-07',
				candidate: 'Tom Kean Jr.',
				party: 'Republican',
				since: 2023,
				term: 3,
				rating: 'Lean',
				market: 55,
				photo: '',
				initials: 'TK'
			},
			{
				district: 'NY-18',
				candidate: 'Pat Ryan',
				party: 'Democratic',
				since: 2022,
				term: 4,
				rating: 'Lean',
				market: 57,
				photo: '',
				initials: 'PR'
			},
			{
				district: 'TX-28',
				candidate: 'Henry Cuellar',
				party: 'Democratic',
				since: 2005,
				term: 12,
				rating: 'Tilt',
				market: 53,
				photo: '',
				initials: 'HC'
			},
			{
				district: 'TX-37',
				candidate: 'Greg Casar',
				party: 'Democratic',
				since: 2023,
				term: 3,
				rating: 'Lean',
				market: 56,
				photo: '',
				initials: 'GC'
			}
		]
	};

	const yearTabs = [2026, 2028] as const;
	const ratingFilters = ['All', 'Lean', 'Tilt', 'Toss-Up'];
	let selectedYear = $state<(typeof yearTabs)[number]>(2026);
	let selectedRating = $state('All');

	const filteredRaces = $derived(
		selectedRating === 'All'
			? racesByYear[selectedYear]
			: racesByYear[selectedYear].filter((race) => race.rating === selectedRating)
	);

	const faqs = [
		{
			q: 'How many seats are needed to control the House?',
			a: 'The House has 435 voting seats, so a party needs 218 seats for a majority.'
		},
		{
			q: 'Are all House seats up in 2026?',
			a: 'Yes. Every voting House seat is elected every two years.'
		},
		{
			q: 'Can I share my House forecast?',
			a: 'Yes. Open the full interactive map and use the Share button to generate a link or embed code.'
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
		{ label: '2028 Presidential Interactive Map', href: '/2028-presidential-election-interactive-map' },
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' },
		{ label: 'Historical House Elections', href: '/historical-house-elections' }
	];
</script>

<svelte:head>
	<title>2026 House Election Forecast | Interactive U.S. House Map</title>
	<meta
		name="description"
		content="Forecast the 2026 U.S. House elections with an interactive district map, competitive race table, candidate headshots, party logos, ratings and prediction-market style probabilities."
	/>
	<link rel="canonical" href="/2026-house-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 House Election Forecast" />
	<meta
		property="og:description"
		content="Build a 2026 House control forecast with a district map, year tabs and competitive race table."
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
				<span>2026 House Forecast</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. House Elections
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2026 House Election Forecast
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						A House control dashboard with a district map, competitive race table, candidate
						headshots, party logos, consensus ratings and market-style probabilities.
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
			<div class="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Interactive Map Projection
					</h2>
					<p class="text-xs text-neutral-500">
						Click into the full map to assign districts and build a custom House control forecast.
					</p>
				</div>
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

		<section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Forecast summary">
			{#each summaryCards as card}
				<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<div class="mb-3 h-1.5 w-12 rounded-full" style={`background:${card.accent}`}></div>
					<div class="text-[11px] font-bold uppercase tracking-wide text-neutral-500">{card.label}</div>
					<div class="mt-1 text-2xl font-black tracking-tight text-[#061a55]">{card.value}</div>
					<div class="mt-1 text-xs leading-relaxed text-neutral-500">{card.detail}</div>
				</div>
			{/each}
		</section>

		<section class="mt-5 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
			<div class="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						National House Control Projection
					</h2>
					<p class="text-xs text-neutral-500">Modeled seat balance with the closest races held as toss-ups.</p>
				</div>
				<div class="text-xs font-semibold text-neutral-500">218 seats needed for control</div>
			</div>
			<div class="grid grid-cols-3 overflow-hidden rounded border border-neutral-200 text-center text-white">
				{#each forecastBlocks as block}
					<div class="py-3" style={`background:${block.color}`}>
						<div class="text-2xl font-black leading-none">{block.value}</div>
						<div class="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-90">{block.label}</div>
					</div>
				{/each}
			</div>
			<div class="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded border border-neutral-200 bg-neutral-200 text-center text-[11px] font-bold uppercase">
				<div class="bg-[#f6f2e3] px-2 py-2 text-[#7a6e43]">Lean</div>
				<div class="bg-[#fff3d8] px-2 py-2 text-[#8a6500]">Tilt</div>
				<div class="bg-[#f0ead8] px-2 py-2 text-[#655c3f]">Toss-Up</div>
			</div>
		</section>

		<div class="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
			<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
				<div class="border-b border-neutral-200 px-4 py-3">
					<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
								House Forecast Workspace
							</h2>
							<p class="text-xs text-neutral-500">
								Choose a House election year. Each tab uses the same forecast table format.
							</p>
						</div>
						<div class="inline-flex rounded-md border border-neutral-200 bg-[#f7f8fb] p-1">
							{#each yearTabs as year}
								<button
									type="button"
									onclick={() => {
										selectedYear = year;
										selectedRating = 'All';
									}}
									class={`rounded px-3 py-1.5 text-xs font-black ${
										selectedYear === year
											? 'bg-[#061a55] text-white shadow-sm'
											: 'text-neutral-600 hover:bg-white'
									}`}
								>
									{year}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-3 border-b border-neutral-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h3 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
							{selectedYear} House Race Table
						</h3>
						<p class="text-xs text-neutral-500">
							Filter by rating category. Probability shows the candidate or incumbent party's modeled edge.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each ratingFilters as rating}
							<button
								type="button"
								onclick={() => (selectedRating = rating)}
								class={`rounded border px-3 py-1.5 text-xs font-black ${
									selectedRating === rating
										? 'border-[#061a55] bg-[#061a55] text-white'
										: 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
								}`}
							>
								{rating}
							</button>
						{/each}
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full min-w-[920px] border-collapse text-sm">
						<thead class="bg-[#f7f8fb] text-left text-[11px] uppercase tracking-wide text-neutral-500">
							<tr class="border-b border-neutral-200">
								<th class="px-4 py-3">District</th>
								<th class="px-4 py-3">Photo</th>
								<th class="px-4 py-3">Candidate</th>
								<th class="px-4 py-3">Party</th>
								<th class="px-4 py-3 text-right">Since</th>
								<th class="px-4 py-3 text-right">Term</th>
								<th class="px-4 py-3">Consensus</th>
								<th class="px-4 py-3">Prediction market</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-100">
							{#each filteredRaces as race}
								<tr class="hover:bg-[#f9fafc]">
									<td class="px-4 py-3">
										<span class="inline-flex h-8 w-14 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]">
											{race.district}
										</span>
									</td>
									<td class="px-4 py-3">
										{#if race.photo}
											<img
												src={race.photo}
												alt={`${race.candidate} headshot`}
												class="h-11 w-11 rounded-full border border-neutral-200 object-cover"
												loading="lazy"
											/>
										{:else}
											<div
												class="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-xs font-black text-white"
												style={`background:${partyStyles[race.party].color}`}
												aria-label={`${race.candidate} avatar`}
											>
												{race.initials}
											</div>
										{/if}
									</td>
									<td class="px-4 py-3 font-bold text-neutral-900">{race.candidate}</td>
									<td class="px-4 py-3">
										<span
											class={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-black ${partyStyles[race.party].bg} ${partyStyles[race.party].text}`}
										>
											<img
												src={partyStyles[race.party].logo}
												alt={`${race.party} Party logo`}
												class="h-5 w-5 rounded-full object-contain"
												loading="lazy"
											/>
											{race.party}
										</span>
									</td>
									<td class="px-4 py-3 text-right font-semibold">{race.since}</td>
									<td class="px-4 py-3 text-right font-semibold">{race.term}</td>
									<td class="px-4 py-3">
										<span class={`inline-flex rounded border px-2.5 py-1 text-xs font-black ${ratingStyles[race.rating]}`}>
											{race.rating}
										</span>
									</td>
									<td class="px-4 py-3">
										<div class="flex items-center gap-3">
											<div class="h-2 w-28 rounded-full bg-neutral-100">
												<div
													class="h-2 rounded-full bg-[#1f9d55]"
													style={`width:${race.market}%`}
												></div>
											</div>
											<span class="w-12 text-right font-black text-[#157347]">{race.market}%</span>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<div>
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Market Signal</h2>
						<p class="text-xs text-neutral-500">Modeled probability bands for House control.</p>
					</div>
					<span class="rounded-full bg-[#e7f7ee] px-3 py-1 text-xs font-black text-[#157347]">
						Live-style model
					</span>
				</div>
				<div class="space-y-3">
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#D83A45]">Republican control</span><span>51.6%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:51.6%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#2E5AAC]">Democratic control</span><span>47.2%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:47.2%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#655c3f]">Exact-tie/unclear path</span><span>1.2%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#C8BE9A]" style="width:1.2%"></div>
						</div>
					</div>
				</div>
			</section>
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
								<a href={m.href} class="block px-3 py-2 text-sm font-semibold text-[#2E5AAC] hover:bg-[#f7f8fb]">
									{m.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-700 shadow-sm">
					<h2 class="mb-1 text-base font-black text-[#061a55]">Key Facts</h2>
					<ul class="flex list-inside list-disc flex-col gap-1">
						<li><strong>435</strong> voting House seats</li>
						<li><strong>218</strong> needed for control</li>
						<li><strong>All</strong> seats are elected every two years</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Forecast ratings and probabilities are presented as modeled dashboard indicators for the
			interactive House map.
		</footer>
	</article>
	<SiteFooter />
</div>
