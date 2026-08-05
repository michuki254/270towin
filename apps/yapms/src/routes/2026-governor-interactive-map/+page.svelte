<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const mapEmbedUrl = '/app/usa/governors/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/governors/2026/blank';

	type Party = 'Democratic' | 'Republican';
	type Rating = 'Safe' | 'Likely' | 'Lean' | 'Tilt' | 'Toss-Up';
	type GovernorRace = {
		state: string;
		incumbent: string;
		party: Party;
		since: number;
		term: number;
		rating: Rating;
		market: number;
		photo: string;
		initials?: string;
	};

	const partyStyles: Record<Party, { color: string; bg: string; text: string; short: string; logo: string }> = {
		Democratic: {
			color: '#2E5AAC',
			bg: 'bg-[#eaf0fb]',
			text: 'text-[#2E5AAC]',
			short: 'D',
			logo: '/party-logos/democrats.png'
		},
		Republican: {
			color: '#D83A45',
			bg: 'bg-[#fdebed]',
			text: 'text-[#D83A45]',
			short: 'R',
			logo: '/party-logos/republicans.png'
		}
	};

	const ratingStyles: Record<Rating, string> = {
		Safe: 'bg-[#e8eef8] text-[#244999] border-[#b6c7e8]',
		Likely: 'bg-[#eef3fb] text-[#2E5AAC] border-[#c9d6ef]',
		Lean: 'bg-[#f6f2e3] text-[#7a6e43] border-[#d9d0ab]',
		Tilt: 'bg-[#fff3d8] text-[#8a6500] border-[#ead394]',
		'Toss-Up': 'bg-[#f0ead8] text-[#655c3f] border-[#C8BE9A]'
	};

	const summaryCards = [
		{
			label: 'Current Governor Count',
			value: '27 R - 23 D',
			detail: 'Republicans hold a narrow national edge',
			accent: '#D83A45'
		},
		{
			label: 'Consensus Forecast',
			value: '26 R - 23 D - 1 T',
			detail: 'One race remains inside toss-up range',
			accent: '#C8BE9A'
		},
		{
			label: 'Prediction Market Forecast',
			value: '52.8% GOP',
			detail: 'Market-implied chance of GOP majority',
			accent: '#1f9d55'
		},
		{
			label: 'Interactive Map Projection',
			value: '26 Needed',
			detail: 'Build your own 2026 governor map',
			accent: '#2E5AAC'
		}
	];

	const forecastBlocks = [
		{ label: 'Democrats', value: 23, color: '#2E5AAC', width: 46 },
		{ label: 'Toss-ups', value: 1, color: '#C8BE9A', width: 8 },
		{ label: 'Republicans', value: 26, color: '#D83A45', width: 52 }
	];

	const upcomingElections = [
		{
			year: 2026,
			races: 36,
			demHeld: 18,
			repHeld: 18,
			competitive: 9,
			states: 'AK, AZ, GA, IA, KS, ME, MI, MN, NH and more',
			note: 'Full midterm governor cycle'
		},
		{
			year: 2027,
			races: 3,
			demHeld: 1,
			repHeld: 2,
			competitive: 2,
			states: 'KY, LA, MS',
			note: 'Off-year Southern governor cycle'
		},
		{
			year: 2028,
			races: 11,
			demHeld: 5,
			repHeld: 6,
			competitive: 4,
			states: 'DE, IN, MO, MT, NC, ND, UT, VT, WA, WV',
			note: 'Presidential-year governor cycle'
		},
		{
			year: 2029,
			races: 2,
			demHeld: 1,
			repHeld: 1,
			competitive: 2,
			states: 'NJ, VA',
			note: 'High-attention off-year races'
		}
	];

	const races: GovernorRace[] = [
		{
			state: 'AK',
			incumbent: 'Mike Dunleavy',
			party: 'Republican' as Party,
			since: 2018,
			term: 2,
			rating: 'Likely' as Rating,
			market: 68,
			photo: '/candidate-headshots/governors/2026/mike-dunleavy.jpg'
		},
		{
			state: 'AZ',
			incumbent: 'Katie Hobbs',
			party: 'Democratic' as Party,
			since: 2023,
			term: 1,
			rating: 'Toss-Up' as Rating,
			market: 51,
			photo: '/candidate-headshots/governors/2026/katie-hobbs.jpg'
		},
		{
			state: 'GA',
			incumbent: 'Brian Kemp',
			party: 'Republican' as Party,
			since: 2019,
			term: 2,
			rating: 'Lean' as Rating,
			market: 56,
			photo: '/candidate-headshots/governors/2026/brian-kemp.jpg'
		},
		{
			state: 'IA',
			incumbent: 'Kim Reynolds',
			party: 'Republican' as Party,
			since: 2017,
			term: 2,
			rating: 'Tilt' as Rating,
			market: 53,
			photo: '/candidate-headshots/governors/2026/kim-reynolds.jpg'
		},
		{
			state: 'KS',
			incumbent: 'Laura Kelly',
			party: 'Democratic' as Party,
			since: 2019,
			term: 2,
			rating: 'Toss-Up' as Rating,
			market: 50,
			photo: '/candidate-headshots/governors/2026/laura-kelly.jpg'
		},
		{
			state: 'ME',
			incumbent: 'Janet Mills',
			party: 'Democratic' as Party,
			since: 2019,
			term: 2,
			rating: 'Lean' as Rating,
			market: 57,
			photo: '/candidate-headshots/governors/2026/janet-mills.jpg'
		},
		{
			state: 'MI',
			incumbent: 'Gretchen Whitmer',
			party: 'Democratic' as Party,
			since: 2019,
			term: 2,
			rating: 'Toss-Up' as Rating,
			market: 49,
			photo: '/candidate-headshots/governors/2026/gretchen-whitmer.jpg'
		},
		{
			state: 'MN',
			incumbent: 'Tim Walz',
			party: 'Democratic' as Party,
			since: 2019,
			term: 2,
			rating: 'Likely' as Rating,
			market: 64,
			photo: '/candidate-headshots/governors/2026/tim-walz.jpg'
		},
		{
			state: 'NH',
			incumbent: 'Kelly Ayotte',
			party: 'Republican' as Party,
			since: 2025,
			term: 1,
			rating: 'Tilt' as Rating,
			market: 54,
			photo: '/candidate-headshots/governors/2026/kelly-ayotte.jpg'
		}
	];

	const ratingFilters = ['All', 'Safe', 'Likely', 'Lean', 'Tilt', 'Toss-Up'];
	const yearTabs = [2026, 2027, 2028, 2029] as const;
	type ForecastYear = (typeof yearTabs)[number];

	const racesByYear: Record<ForecastYear, GovernorRace[]> = {
		2026: races,
		2027: [
			{
				state: 'KY',
				incumbent: 'Andy Beshear',
				party: 'Democratic',
				since: 2019,
				term: 2,
				rating: 'Likely',
				market: 62,
				photo: '/candidate-headshots/governors/future/andy-beshear.jpg',
				initials: 'AB'
			},
			{
				state: 'LA',
				incumbent: 'Jeff Landry',
				party: 'Republican',
				since: 2024,
				term: 1,
				rating: 'Likely',
				market: 65,
				photo: '/candidate-headshots/governors/future/jeff-landry.jpg',
				initials: 'JL'
			},
			{
				state: 'MS',
				incumbent: 'Tate Reeves',
				party: 'Republican',
				since: 2020,
				term: 2,
				rating: 'Lean',
				market: 58,
				photo: '/candidate-headshots/governors/future/tate-reeves.jpg',
				initials: 'TR'
			}
		],
		2028: [
			{
				state: 'DE',
				incumbent: 'Matt Meyer',
				party: 'Democratic',
				since: 2025,
				term: 1,
				rating: 'Likely',
				market: 66,
				photo: '/candidate-headshots/governors/future/matt-meyer.jpg',
				initials: 'MM'
			},
			{
				state: 'IN',
				incumbent: 'Mike Braun',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Safe',
				market: 78,
				photo: '/candidate-headshots/governors/future/mike-braun.jpg',
				initials: 'MB'
			},
			{
				state: 'MO',
				incumbent: 'Mike Kehoe',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Safe',
				market: 75,
				photo: '/candidate-headshots/governors/future/mike-kehoe.jpg',
				initials: 'MK'
			},
			{
				state: 'MT',
				incumbent: 'Greg Gianforte',
				party: 'Republican',
				since: 2021,
				term: 2,
				rating: 'Likely',
				market: 67,
				photo: '/candidate-headshots/governors/future/greg-gianforte.jpg',
				initials: 'GG'
			},
			{
				state: 'NC',
				incumbent: 'Josh Stein',
				party: 'Democratic',
				since: 2025,
				term: 1,
				rating: 'Lean',
				market: 56,
				photo: '/candidate-headshots/governors/future/josh-stein.jpg',
				initials: 'JS'
			},
			{
				state: 'ND',
				incumbent: 'Kelly Armstrong',
				party: 'Republican',
				since: 2024,
				term: 1,
				rating: 'Safe',
				market: 82,
				photo: '/candidate-headshots/governors/future/kelly-armstrong.jpg',
				initials: 'KA'
			},
			{
				state: 'UT',
				incumbent: 'Spencer Cox',
				party: 'Republican',
				since: 2021,
				term: 2,
				rating: 'Safe',
				market: 84,
				photo: '/candidate-headshots/governors/future/spencer-cox.jpg',
				initials: 'SC'
			},
			{
				state: 'VT',
				incumbent: 'Phil Scott',
				party: 'Republican',
				since: 2017,
				term: 4,
				rating: 'Likely',
				market: 63,
				photo: '/candidate-headshots/governors/future/phil-scott.png',
				initials: 'PS'
			},
			{
				state: 'WA',
				incumbent: 'Bob Ferguson',
				party: 'Democratic',
				since: 2025,
				term: 1,
				rating: 'Safe',
				market: 80,
				photo: '/candidate-headshots/governors/future/bob-ferguson.jpg',
				initials: 'BF'
			},
			{
				state: 'WV',
				incumbent: 'Patrick Morrisey',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Safe',
				market: 81,
				photo: '/candidate-headshots/governors/future/patrick-morrisey.jpg',
				initials: 'PM'
			}
		],
		2029: [
			{
				state: 'NJ',
				incumbent: 'Mikie Sherrill',
				party: 'Democratic',
				since: 2026,
				term: 1,
				rating: 'Lean',
				market: 57,
				photo: '/candidate-headshots/governors/future/mikie-sherrill.jpg',
				initials: 'MS'
			},
			{
				state: 'VA',
				incumbent: 'Abigail Spanberger',
				party: 'Democratic',
				since: 2026,
				term: 1,
				rating: 'Toss-Up',
				market: 51,
				photo: '/candidate-headshots/governors/future/abigail-spanberger.jpg',
				initials: 'AS'
			}
		]
	};

	let selectedRating = $state('All');
	let selectedForecastYear = $state<ForecastYear>(2026);

	const filteredRaces = $derived(
		selectedRating === 'All'
			? racesByYear[selectedForecastYear]
			: racesByYear[selectedForecastYear].filter((race) => race.rating === selectedRating)
	);

	const faqs = [
		{
			q: 'How many governorships are needed for a majority?',
			a: 'There are 50 state governorships, so 26 is a majority.'
		},
		{
			q: 'How many governor races are up in 2026?',
			a: 'Thirty-six states are scheduled to hold governor elections in 2026. The remaining governorships are holdovers already counted on the map.'
		},
		{
			q: 'How should I read the forecast table?',
			a: 'The table combines incumbent party, tenure, consensus rating and modeled market probability to show where the competitive 2026 governor map currently stands.'
		},
		{
			q: 'Can I share my governor forecast?',
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
		{ label: '2024 Governor Election Results', href: '/2024-governor-election-results' },
		{ label: 'Historical Governor Elections', href: '/historical-governor-elections' },
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' }
	];
</script>

<svelte:head>
	<title>2026 Governor Election Forecast | Interactive U.S. Governor Map</title>
	<meta
		name="description"
		content="Forecast the 2026 U.S. gubernatorial elections with ratings, prediction-market probabilities, an upcoming election calendar and an interactive governor map."
	/>
	<link rel="canonical" href="/2026-governor-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 Governor Election Forecast" />
	<meta
		property="og:description"
		content="Track 2026 governor races with consensus ratings, prediction-market probabilities and an interactive state-by-state map."
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
				<span>2026 Governor Forecast</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. Governor Elections 2026
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2026 Governor Election Forecast
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						A political forecasting dashboard for the fight over state executive power, combining
						consensus ratings, modeled market probabilities and an editable interactive map.
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
						Click into the full map to assign states and build a custom 2026 governor forecast.
					</p>
				</div>
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
						National Governor Balance Projection
					</h2>
					<p class="text-xs text-neutral-500">Consensus forecast with toss-up pressure marked in beige.</p>
				</div>
				<div class="text-xs font-semibold text-neutral-500">26 governorships needed for majority</div>
			</div>
			<div class="grid grid-cols-3 overflow-hidden rounded border border-neutral-200 text-center text-white">
				{#each forecastBlocks as block}
					<div class="py-3" style={`background:${block.color}; flex-basis:${block.width}%`}>
						<div class="text-2xl font-black leading-none">{block.value}</div>
						<div class="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-90">{block.label}</div>
					</div>
				{/each}
			</div>
			<div class="mt-3 grid grid-cols-5 gap-px overflow-hidden rounded border border-neutral-200 bg-neutral-200 text-center text-[11px] font-bold uppercase">
				<div class="bg-[#e8eef8] px-2 py-2 text-[#244999]">Safe</div>
				<div class="bg-[#eef3fb] px-2 py-2 text-[#2E5AAC]">Likely</div>
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
								Governor Forecast Workspace
							</h2>
							<p class="text-xs text-neutral-500">
								Choose a governor election year. Each tab uses the same forecast table format.
							</p>
						</div>
						<div class="inline-flex rounded-md border border-neutral-200 bg-[#f7f8fb] p-1">
							{#each yearTabs as year}
								<button
									type="button"
									onclick={() => {
										selectedForecastYear = year;
										selectedRating = 'All';
									}}
									class={`rounded px-3 py-1.5 text-xs font-black ${
										selectedForecastYear === year
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
								{selectedForecastYear} Governor Race Table
							</h3>
							<p class="text-xs text-neutral-500">
								Filter by rating category. Probability shows the incumbent party's modeled hold chance.
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
									<th class="px-4 py-3">State</th>
									<th class="px-4 py-3">Photo</th>
									<th class="px-4 py-3">Incumbent</th>
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
											<span class="inline-flex h-8 w-10 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]">
												{race.state}
											</span>
										</td>
										<td class="px-4 py-3">
											{#if race.photo}
												<img
													src={race.photo}
													alt={`${race.incumbent} headshot`}
													class="h-11 w-11 rounded-full border border-neutral-200 object-cover"
													loading="lazy"
												/>
											{:else}
												<div
													class="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-xs font-black text-white"
													style={`background:${partyStyles[race.party].color}`}
													aria-label={`${race.incumbent} avatar`}
												>
													{race.initials}
												</div>
											{/if}
										</td>
										<td class="px-4 py-3 font-bold text-neutral-900">{race.incumbent}</td>
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
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
							Market Signal
						</h2>
						<p class="text-xs text-neutral-500">Modeled probability bands for majority control.</p>
					</div>
					<span class="rounded-full bg-[#e7f7ee] px-3 py-1 text-xs font-black text-[#157347]">
						Live-style model
					</span>
				</div>
				<div class="space-y-3">
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#D83A45]">Republican majority</span><span>52.8%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:52.8%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#2E5AAC]">Democratic majority</span><span>43.6%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:43.6%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#655c3f]">Split/tie scenario</span><span>3.6%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#C8BE9A]" style="width:3.6%"></div>
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
						<li><strong>50</strong> state governorships</li>
						<li><strong>26</strong> needed for a majority</li>
						<li><strong>36</strong> governor races in 2026</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Forecast ratings and probabilities are presented as modeled dashboard indicators for the
			interactive 2026 governor map.
		</footer>
	</article>
	<SiteFooter />
</div>
