<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	let startMode = $state<'2024map' | 'blank'>('2024map');
	const mapEmbedUrl = $derived(`/app/usa/presidential/2028/${startMode}?embed=1`);
	const mapFullUrl = $derived(`/app/usa/presidential/2028/${startMode}`);

	type Party = 'Democratic' | 'Republican';
	type Rating = 'Safe' | 'Likely' | 'Lean' | 'Tilt' | 'Toss-Up';
	type PresidentialCandidate = {
		state: string;
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
		Safe: 'bg-[#e8eef8] text-[#244999] border-[#b6c7e8]',
		Likely: 'bg-[#eef3fb] text-[#2E5AAC] border-[#c9d6ef]',
		Lean: 'bg-[#f6f2e3] text-[#7a6e43] border-[#d9d0ab]',
		Tilt: 'bg-[#fff3d8] text-[#8a6500] border-[#ead394]',
		'Toss-Up': 'bg-[#f0ead8] text-[#655c3f] border-[#C8BE9A]'
	};

	const summaryCards = [
		{
			label: 'Electoral Votes Needed',
			value: '270',
			detail: 'Majority of 538 electoral votes',
			accent: '#2E5AAC'
		},
		{
			label: 'Consensus Forecast',
			value: 'Toss-Up',
			detail: 'Early cycle model shows no clear favorite',
			accent: '#C8BE9A'
		},
		{
			label: 'Prediction Market Forecast',
			value: '52.1% GOP',
			detail: 'Market-style edge in the early field',
			accent: '#1f9d55'
		},
		{
			label: 'Interactive Map Projection',
			value: '538 EV',
			detail: 'Build your own path to 270',
			accent: '#D83A45'
		}
	];

	const forecastBlocks = [
		{ label: 'Democrats', value: 226, color: '#2E5AAC' },
		{ label: 'Toss-up', value: 81, color: '#C8BE9A' },
		{ label: 'Republicans', value: 231, color: '#D83A45' }
	];

	const candidatesByYear: Record<number, PresidentialCandidate[]> = {
		2028: [
			{
				state: 'CA',
				candidate: 'Kamala Harris',
				party: 'Democratic',
				since: 2021,
				term: 1,
				rating: 'Toss-Up',
				market: 18,
				photo: '/candidate-headshots/presidential/kamala-harris.jpg',
				initials: 'KH'
			},
			{
				state: 'CA',
				candidate: 'Gavin Newsom',
				party: 'Democratic',
				since: 2019,
				term: 2,
				rating: 'Lean',
				market: 17,
				photo: '/candidate-headshots/presidential/gavin-newsom.jpg',
				initials: 'GN'
			},
			{
				state: 'MI',
				candidate: 'Gretchen Whitmer',
				party: 'Democratic',
				since: 2019,
				term: 2,
				rating: 'Lean',
				market: 11,
				photo: '/candidate-headshots/presidential/gretchen-whitmer.jpg',
				initials: 'GW'
			},
			{
				state: 'PA',
				candidate: 'Josh Shapiro',
				party: 'Democratic',
				since: 2023,
				term: 1,
				rating: 'Tilt',
				market: 9,
				photo: '/candidate-headshots/presidential/josh-shapiro.jpg',
				initials: 'JS'
			},
			{
				state: 'IN',
				candidate: 'Pete Buttigieg',
				party: 'Democratic',
				since: 2021,
				term: 1,
				rating: 'Tilt',
				market: 7,
				photo: '/candidate-headshots/presidential/pete-buttigieg.jpg',
				initials: 'PB'
			},
			{
				state: 'OH',
				candidate: 'JD Vance',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Likely',
				market: 24,
				photo: '/candidate-headshots/presidential/jd-vance.jpg',
				initials: 'JV'
			},
			{
				state: 'FL',
				candidate: 'Marco Rubio',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Lean',
				market: 16,
				photo: '/candidate-headshots/presidential/marco-rubio.jpg',
				initials: 'MR'
			},
			{
				state: 'FL',
				candidate: 'Ron DeSantis',
				party: 'Republican',
				since: 2019,
				term: 2,
				rating: 'Lean',
				market: 10,
				photo: '/candidate-headshots/presidential/ron-desantis.jpg',
				initials: 'RD'
			},
			{
				state: 'SC',
				candidate: 'Nikki Haley',
				party: 'Republican',
				since: 2011,
				term: 2,
				rating: 'Tilt',
				market: 6,
				photo: '/candidate-headshots/presidential/nikki-haley.jpg',
				initials: 'NH'
			},
			{
				state: 'OH',
				candidate: 'Vivek Ramaswamy',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Tilt',
				market: 5,
				photo: '/candidate-headshots/presidential/vivek-ramaswamy.jpg',
				initials: 'VR'
			}
		],
		2032: [
			{
				state: 'MD',
				candidate: 'Wes Moore',
				party: 'Democratic',
				since: 2023,
				term: 1,
				rating: 'Lean',
				market: 12,
				photo: '/candidate-headshots/presidential/wes-moore.jpg',
				initials: 'WM'
			},
			{
				state: 'IL',
				candidate: 'JB Pritzker',
				party: 'Democratic',
				since: 2019,
				term: 2,
				rating: 'Lean',
				market: 10,
				photo: '/candidate-headshots/presidential/jb-pritzker.jpg',
				initials: 'JP'
			},
			{
				state: 'NY',
				candidate: 'Alexandria Ocasio-Cortez',
				party: 'Democratic',
				since: 2019,
				term: 7,
				rating: 'Tilt',
				market: 8,
				photo: '/candidate-headshots/presidential/alexandria-ocasio-cortez.jpg',
				initials: 'AOC'
			},
			{
				state: 'PA',
				candidate: 'Josh Shapiro',
				party: 'Democratic',
				since: 2023,
				term: 1,
				rating: 'Tilt',
				market: 7,
				photo: '/candidate-headshots/presidential/josh-shapiro.jpg',
				initials: 'JS'
			},
			{
				state: 'VA',
				candidate: 'Glenn Youngkin',
				party: 'Republican',
				since: 2022,
				term: 1,
				rating: 'Lean',
				market: 11,
				photo: '/candidate-headshots/presidential/glenn-youngkin.jpg',
				initials: 'GY'
			},
			{
				state: 'FL',
				candidate: 'Ron DeSantis',
				party: 'Republican',
				since: 2019,
				term: 2,
				rating: 'Lean',
				market: 10,
				photo: '/candidate-headshots/presidential/ron-desantis.jpg',
				initials: 'RD'
			},
			{
				state: 'SC',
				candidate: 'Nikki Haley',
				party: 'Republican',
				since: 2011,
				term: 2,
				rating: 'Tilt',
				market: 8,
				photo: '/candidate-headshots/presidential/nikki-haley.jpg',
				initials: 'NH'
			},
			{
				state: 'OH',
				candidate: 'Vivek Ramaswamy',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Tilt',
				market: 6,
				photo: '/candidate-headshots/presidential/vivek-ramaswamy.jpg',
				initials: 'VR'
			}
		]
	};

	const yearTabs = [2028, 2032] as const;
	const ratingFilters = ['All', 'Safe', 'Likely', 'Lean', 'Tilt', 'Toss-Up'];
	let selectedYear = $state<(typeof yearTabs)[number]>(2028);
	let selectedRating = $state('All');

	const filteredCandidates = $derived(
		selectedRating === 'All'
			? candidatesByYear[selectedYear]
			: candidatesByYear[selectedYear].filter((candidate) => candidate.rating === selectedRating)
	);

	const faqs = [
		{
			q: 'How many electoral votes are needed to win?',
			a: 'A presidential candidate needs at least 270 of the 538 electoral votes to win.'
		},
		{
			q: 'Are these official presidential candidates?',
			a: 'No. This dashboard is an early forecasting interface using modeled contenders and probabilities until the official field is settled.'
		},
		{
			q: 'Can I share my 2028 forecast?',
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
		{ label: '2024 Presidential Election Results', href: '/2024-presidential-election-results' },
		{ label: 'Historical Presidential Elections', href: '/historical-presidential-elections' },
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' }
	];
</script>

<svelte:head>
	<title>2028 Presidential Election Forecast | Interactive Electoral College Map</title>
	<meta
		name="description"
		content="Forecast the 2028 presidential election with an interactive electoral college map, contender table, party logos, headshots, ratings and prediction-market style probabilities."
	/>
	<link rel="canonical" href="/2028-presidential-election-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2028 Presidential Election Forecast" />
	<meta
		property="og:description"
		content="Build your own path to 270 with a presidential forecast dashboard and interactive electoral map."
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
				<span>2028 Presidential Forecast</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. Presidential Election
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2028 Presidential Election Forecast
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						An electoral college forecasting dashboard with map controls, contender headshots,
						party logos, ratings and market-style probabilities for the road to 270.
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
			<div class="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
						Interactive Map Projection
					</h2>
					<p class="text-xs text-neutral-500">
						Start from the 2024 result or a blank map, then build your own path to 270.
					</p>
				</div>
				<div class="inline-flex overflow-hidden rounded-md border border-neutral-300 text-sm">
					<button
						type="button"
						class={`px-3 py-1.5 font-bold ${
							startMode === '2024map'
								? 'bg-[#2E5AAC] text-white'
								: 'bg-white text-neutral-700 hover:bg-neutral-100'
						}`}
						aria-pressed={startMode === '2024map'}
						onclick={() => (startMode = '2024map')}
					>
						2024 Result
					</button>
					<button
						type="button"
						class={`border-l border-neutral-300 px-3 py-1.5 font-bold ${
							startMode === 'blank'
								? 'bg-[#2E5AAC] text-white'
								: 'bg-white text-neutral-700 hover:bg-neutral-100'
						}`}
						aria-pressed={startMode === 'blank'}
						onclick={() => (startMode = 'blank')}
					>
						Blank Map
					</button>
				</div>
			</div>
			<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				{#key startMode}
					<iframe
						src={mapEmbedUrl}
						title="2028 Presidential Election Interactive Electoral College Map"
						class="block w-full"
						style="height: 610px; border: 0;"
					></iframe>
				{/key}
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
						Electoral College Projection
					</h2>
					<p class="text-xs text-neutral-500">Modeled baseline with competitive states held as toss-ups.</p>
				</div>
				<div class="text-xs font-semibold text-neutral-500">270 electoral votes needed to win</div>
			</div>
			<div class="grid grid-cols-3 overflow-hidden rounded border border-neutral-200 text-center text-white">
				{#each forecastBlocks as block}
					<div class="py-3" style={`background:${block.color}`}>
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
								Presidential Forecast Workspace
							</h2>
							<p class="text-xs text-neutral-500">
								Choose a presidential cycle. Each tab uses the same forecast table format.
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
							{selectedYear} Presidential Contender Table
						</h3>
						<p class="text-xs text-neutral-500">
							Filter by rating category. Probability shows modeled nomination/general-election strength.
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
								<th class="px-4 py-3">Base</th>
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
							{#each filteredCandidates as candidate}
								<tr class="hover:bg-[#f9fafc]">
									<td class="px-4 py-3">
										<span class="inline-flex h-8 w-10 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]">
											{candidate.state}
										</span>
									</td>
									<td class="px-4 py-3">
										{#if candidate.photo}
											<img
												src={candidate.photo}
												alt={`${candidate.candidate} headshot`}
												class="h-11 w-11 rounded-full border border-neutral-200 object-cover"
												loading="lazy"
											/>
										{:else}
											<div
												class="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-xs font-black text-white"
												style={`background:${partyStyles[candidate.party].color}`}
												aria-label={`${candidate.candidate} avatar`}
											>
												{candidate.initials}
											</div>
										{/if}
									</td>
									<td class="px-4 py-3 font-bold text-neutral-900">{candidate.candidate}</td>
									<td class="px-4 py-3">
										<span
											class={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-black ${partyStyles[candidate.party].bg} ${partyStyles[candidate.party].text}`}
										>
											<img
												src={partyStyles[candidate.party].logo}
												alt={`${candidate.party} Party logo`}
												class="h-5 w-5 rounded-full object-contain"
												loading="lazy"
											/>
											{candidate.party}
										</span>
									</td>
									<td class="px-4 py-3 text-right font-semibold">{candidate.since}</td>
									<td class="px-4 py-3 text-right font-semibold">{candidate.term}</td>
									<td class="px-4 py-3">
										<span class={`inline-flex rounded border px-2.5 py-1 text-xs font-black ${ratingStyles[candidate.rating]}`}>
											{candidate.rating}
										</span>
									</td>
									<td class="px-4 py-3">
										<div class="flex items-center gap-3">
											<div class="h-2 w-28 rounded-full bg-neutral-100">
												<div
													class="h-2 rounded-full bg-[#1f9d55]"
													style={`width:${candidate.market}%`}
												></div>
											</div>
											<span class="w-12 text-right font-black text-[#157347]">{candidate.market}%</span>
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
						<p class="text-xs text-neutral-500">Modeled probability bands for the White House.</p>
					</div>
					<span class="rounded-full bg-[#e7f7ee] px-3 py-1 text-xs font-black text-[#157347]">
						Live-style model
					</span>
				</div>
				<div class="space-y-3">
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#D83A45]">Republican win</span><span>52.1%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:52.1%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#2E5AAC]">Democratic win</span><span>45.2%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:45.2%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#655c3f]">Contested/no clear path</span><span>2.7%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#C8BE9A]" style="width:2.7%"></div>
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
						<li><strong>538</strong> total electoral votes</li>
						<li><strong>270</strong> needed to win</li>
						<li><strong>269-269</strong> tie decided by the House</li>
						<li>Election Day: <strong>November 7, 2028</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Forecast ratings and probabilities are presented as modeled dashboard indicators for the
			interactive presidential map.
		</footer>
	</article>
	<SiteFooter />
</div>
