<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const mapEmbedUrl = '/app/usa/senate/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/senate/2026/blank';

	type Party = 'Democratic' | 'Republican' | 'Independent';
	type Rating = 'Safe' | 'Likely' | 'Lean' | 'Tilt' | 'Toss-Up';
	type SenateRace = {
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
		},
		Independent: {
			color: '#7a6e43',
			bg: 'bg-[#f3f0e4]',
			text: 'text-[#655c3f]',
			logo: '/party-logos/independents.png'
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
			label: 'Current Senate Count',
			value: '53 R - 47 D',
			detail: 'Republicans hold Senate control after 2024',
			accent: '#D83A45'
		},
		{
			label: 'Consensus Forecast',
			value: '52 R - 48 D',
			detail: 'Republicans retain a narrow projected edge',
			accent: '#D83A45'
		},
		{
			label: 'Prediction Market Forecast',
			value: '56.4% GOP',
			detail: 'Market-style probability of GOP control',
			accent: '#1f9d55'
		},
		{
			label: 'Interactive Map Projection',
			value: '51 Needed',
			detail: 'Build your own Senate control path',
			accent: '#2E5AAC'
		}
	];

	const forecastBlocks = [
		{ label: 'Democrats', value: 48, color: '#2E5AAC' },
		{ label: 'Toss-ups', value: 1, color: '#C8BE9A' },
		{ label: 'Republicans', value: 51, color: '#D83A45' }
	];

	const racesByYear: Record<number, SenateRace[]> = {
		2026: [
			{
				state: 'GA',
				candidate: 'Jon Ossoff',
				party: 'Democratic',
				since: 2021,
				term: 1,
				rating: 'Toss-Up',
				market: 50,
				photo: '/candidate-headshots/senate/jon-ossoff.jpg',
				initials: 'JO'
			},
			{
				state: 'GA',
				candidate: 'Mike Collins',
				party: 'Republican',
				since: 2023,
				term: 1,
				rating: 'Toss-Up',
				market: 49,
				photo: '/candidate-headshots/senate/mike-collins.jpg',
				initials: 'MC'
			},
			{
				state: 'ME',
				candidate: 'Susan Collins',
				party: 'Republican',
				since: 1997,
				term: 5,
				rating: 'Tilt',
				market: 54,
				photo: '/candidate-headshots/senate/susan-collins.jpg',
				initials: 'SC'
			},
			{
				state: 'NC',
				candidate: 'Roy Cooper',
				party: 'Democratic',
				since: 2017,
				term: 2,
				rating: 'Lean',
				market: 56,
				photo: '/candidate-headshots/senate/roy-cooper.jpg',
				initials: 'RC'
			},
			{
				state: 'NC',
				candidate: 'Michael Whatley',
				party: 'Republican',
				since: 2024,
				term: 1,
				rating: 'Lean',
				market: 44,
				photo: '/candidate-headshots/senate/michael-whatley.jpg',
				initials: 'MW'
			},
			{
				state: 'IA',
				candidate: 'Ashley Hinson',
				party: 'Republican',
				since: 2021,
				term: 3,
				rating: 'Tilt',
				market: 53,
				photo: '/candidate-headshots/senate/ashley-hinson.jpg',
				initials: 'AH'
			},
			{
				state: 'IA',
				candidate: 'Josh Turek',
				party: 'Democratic',
				since: 2023,
				term: 1,
				rating: 'Tilt',
				market: 47,
				photo: '/candidate-headshots/senate/josh-turek.jpg',
				initials: 'JT'
			},
			{
				state: 'MI',
				candidate: 'Haley Stevens',
				party: 'Democratic',
				since: 2019,
				term: 4,
				rating: 'Toss-Up',
				market: 51,
				photo: '/candidate-headshots/senate/haley-stevens.jpg',
				initials: 'HS'
			},
			{
				state: 'MI',
				candidate: 'Mike Rogers',
				party: 'Republican',
				since: 2001,
				term: 7,
				rating: 'Toss-Up',
				market: 48,
				photo: '/candidate-headshots/senate/mike-rogers.jpg',
				initials: 'MR'
			},
			{
				state: 'NH',
				candidate: 'Chris Pappas',
				party: 'Democratic',
				since: 2019,
				term: 4,
				rating: 'Lean',
				market: 58,
				photo: '/candidate-headshots/senate/chris-pappas.jpg',
				initials: 'CP'
			},
			{
				state: 'NH',
				candidate: 'John E. Sununu',
				party: 'Republican',
				since: 2003,
				term: 1,
				rating: 'Lean',
				market: 42,
				photo: '/candidate-headshots/senate/john-sununu.jpg',
				initials: 'JS'
			}
		],
		2028: [
			{
				state: 'AZ',
				candidate: 'Mark Kelly',
				party: 'Democratic',
				since: 2020,
				term: 2,
				rating: 'Lean',
				market: 57,
				photo: '/candidate-headshots/senate/mark-kelly.jpg',
				initials: 'MK'
			},
			{
				state: 'GA',
				candidate: 'Raphael Warnock',
				party: 'Democratic',
				since: 2021,
				term: 2,
				rating: 'Lean',
				market: 56,
				photo: '/candidate-headshots/senate/raphael-warnock.jpg',
				initials: 'RW'
			},
			{
				state: 'NC',
				candidate: 'Ted Budd',
				party: 'Republican',
				since: 2023,
				term: 1,
				rating: 'Lean',
				market: 55,
				photo: '/candidate-headshots/senate/ted-budd.jpg',
				initials: 'TB'
			},
			{
				state: 'PA',
				candidate: 'John Fetterman',
				party: 'Democratic',
				since: 2023,
				term: 1,
				rating: 'Tilt',
				market: 52,
				photo: '/candidate-headshots/senate/john-fetterman.jpg',
				initials: 'JF'
			},
			{
				state: 'NV',
				candidate: 'Catherine Cortez Masto',
				party: 'Democratic',
				since: 2017,
				term: 2,
				rating: 'Lean',
				market: 56,
				photo: '/candidate-headshots/senate/catherine-cortez-masto.jpg',
				initials: 'CCM'
			},
			{
				state: 'NH',
				candidate: 'Maggie Hassan',
				party: 'Democratic',
				since: 2017,
				term: 2,
				rating: 'Likely',
				market: 64,
				photo: '/candidate-headshots/senate/maggie-hassan.jpg',
				initials: 'MH'
			},
			{
				state: 'WI',
				candidate: 'Ron Johnson',
				party: 'Republican',
				since: 2011,
				term: 3,
				rating: 'Tilt',
				market: 53,
				photo: '/candidate-headshots/senate/ron-johnson.jpg',
				initials: 'RJ'
			}
		],
		2030: [
			{
				state: 'AZ',
				candidate: 'Ruben Gallego',
				party: 'Democratic',
				since: 2025,
				term: 1,
				rating: 'Lean',
				market: 57,
				photo: '/candidate-headshots/senate/ruben-gallego.jpg',
				initials: 'RG'
			},
			{
				state: 'CA',
				candidate: 'Adam Schiff',
				party: 'Democratic',
				since: 2024,
				term: 1,
				rating: 'Safe',
				market: 82,
				photo: '',
				initials: 'AS'
			},
			{
				state: 'CT',
				candidate: 'Chris Murphy',
				party: 'Democratic',
				since: 2013,
				term: 3,
				rating: 'Safe',
				market: 79,
				photo: '',
				initials: 'CM'
			},
			{
				state: 'FL',
				candidate: 'Rick Scott',
				party: 'Republican',
				since: 2019,
				term: 2,
				rating: 'Likely',
				market: 66,
				photo: '',
				initials: 'RS'
			},
			{
				state: 'HI',
				candidate: 'Mazie Hirono',
				party: 'Democratic',
				since: 2013,
				term: 3,
				rating: 'Safe',
				market: 86,
				photo: '/candidate-headshots/senate/mazie-hirono.jpg',
				initials: 'MH'
			},
			{
				state: 'IN',
				candidate: 'Jim Banks',
				party: 'Republican',
				since: 2025,
				term: 1,
				rating: 'Safe',
				market: 81,
				photo: '',
				initials: 'JB'
			},
			{
				state: 'ME',
				candidate: 'Angus King',
				party: 'Independent',
				since: 2013,
				term: 3,
				rating: 'Likely',
				market: 67,
				photo: '/candidate-headshots/senate/angus-king.jpg',
				initials: 'AK'
			},
			{
				state: 'MA',
				candidate: 'Elizabeth Warren',
				party: 'Democratic',
				since: 2013,
				term: 3,
				rating: 'Safe',
				market: 84,
				photo: '',
				initials: 'EW'
			},
			{
				state: 'MO',
				candidate: 'Josh Hawley',
				party: 'Republican',
				since: 2019,
				term: 2,
				rating: 'Safe',
				market: 78,
				photo: '',
				initials: 'JH'
			}
		]
	};

	const yearTabs = [2026, 2028, 2030] as const;
	const ratingFilters = ['All', 'Safe', 'Likely', 'Lean', 'Tilt', 'Toss-Up'];
	let selectedYear = $state<(typeof yearTabs)[number]>(2026);
	let selectedRating = $state('All');

	const filteredRaces = $derived(
		selectedRating === 'All'
			? racesByYear[selectedYear]
			: racesByYear[selectedYear].filter((race) => race.rating === selectedRating)
	);

	const faqs = [
		{
			q: 'How many seats are needed to control the Senate?',
			a: 'A party needs 51 seats for an outright Senate majority. A 50-50 Senate is controlled by the party of the Vice President.'
		},
		{
			q: 'How many Senate seats are up in 2026?',
			a: 'The 2026 cycle includes the regular Class 2 seats plus any special elections.'
		},
		{
			q: 'Can I change the Senate forecast?',
			a: 'Yes. Open the full interactive map and use the map controls to assign seats and build a custom path to Senate control.'
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
		{ label: '2024 Senate Election Results', href: '/2024-senate-election-results' },
		{ label: 'Historical Senate Elections', href: '/historical-senate-elections' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' }
	];
</script>

<svelte:head>
	<title>2026 Senate Election Forecast | Interactive U.S. Senate Map</title>
	<meta
		name="description"
		content="Forecast U.S. Senate elections with year tabs, race ratings, prediction-market style probabilities, candidate headshots, party logos and an interactive Senate map."
	/>
	<link rel="canonical" href="/2026-senate-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 Senate Election Forecast" />
	<meta
		property="og:description"
		content="Track Senate control with candidate tables, race ratings and an interactive state-by-state map."
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
				<span>2026 Senate Forecast</span>
			</nav>
			<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#2E5AAC]">
						U.S. Senate Elections
					</p>
					<h1 class="mt-1 text-3xl font-black tracking-tight text-[#061a55] md:text-4xl">
						2026 Senate Election Forecast
					</h1>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
						A Senate control dashboard with an interactive map, year-tab race tables, candidate
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
						Click into the full map to assign seats and build a custom Senate control forecast.
					</p>
				</div>
			</div>
			<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				<iframe
					src={mapEmbedUrl}
					title="2026 U.S. Senate Interactive Election Map"
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
						National Senate Control Projection
					</h2>
					<p class="text-xs text-neutral-500">Consensus forecast with the narrowest races marked in beige.</p>
				</div>
				<div class="text-xs font-semibold text-neutral-500">51 seats needed for control</div>
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
								Senate Forecast Workspace
							</h2>
							<p class="text-xs text-neutral-500">
								Choose a Senate election year. Each tab uses the same forecast table format.
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
							{selectedYear} Senate Race Table
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
								<th class="px-4 py-3">State</th>
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
										<span class="inline-flex h-8 w-10 items-center justify-center rounded bg-[#eef1f5] font-black text-[#061a55]">
											{race.state}
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
						<p class="text-xs text-neutral-500">Modeled probability bands for Senate control.</p>
					</div>
					<span class="rounded-full bg-[#e7f7ee] px-3 py-1 text-xs font-black text-[#157347]">
						Live-style model
					</span>
				</div>
				<div class="space-y-3">
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#D83A45]">Republican control</span><span>56.4%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:56.4%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#2E5AAC]">Democratic control</span><span>40.1%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#1f9d55]" style="width:40.1%"></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs font-bold">
							<span class="text-[#655c3f]">50-50 scenario</span><span>3.5%</span>
						</div>
						<div class="h-2 rounded-full bg-neutral-100">
							<div class="h-2 rounded-full bg-[#C8BE9A]" style="width:3.5%"></div>
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
						<li><strong>100</strong> total Senate seats</li>
						<li><strong>51</strong> needed for control</li>
						<li><strong>50-50</strong> tie broken by the Vice President</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Forecast ratings and probabilities are presented as modeled dashboard indicators for the
			interactive Senate map.
		</footer>
	</article>
	<SiteFooter />
</div>
