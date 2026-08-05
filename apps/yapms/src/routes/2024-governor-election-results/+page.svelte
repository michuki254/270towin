<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	$: election = data.election;
	$: republicans = election.candidates.find((c) => c.name === 'Republicans');
	$: democrats = election.candidates.find((c) => c.name === 'Democrats');
	$: mapEmbed = `${election.mapRoute}?embed=1`;

	const faqs = [
		{
			q: 'Who held the most governorships after the 2024 elections?',
			a: 'Republicans held the most governorships after the 2024 gubernatorial elections, with 27 of the 50 state governorships.'
		},
		{
			q: 'How many governor races were held in 2024?',
			a: 'Eleven states held governor elections in 2024. The remaining governorships were holdovers from earlier cycles.'
		},
		{
			q: 'Why are some states not active on the map?',
			a: 'Governor elections are staggered by state. States without a 2024 governor election are already counted in the balance totals as holdovers.'
		},
		{
			q: 'Can I change the 2024 governor results map?',
			a: 'Yes. Open the full interactive map to recolor states, test alternate outcomes, and share or embed your scenario.'
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
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' },
		{ label: 'Historical Governor Elections', href: '/historical-governor-elections' },
		{ label: '2024 Senate Election Results', href: '/2024-senate-election-results' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' }
	];
</script>

<svelte:head>
	<title>2024 Governor Election Results | Interactive U.S. Governor Map</title>
	<meta
		name="description"
		content="Full results of the 2024 U.S. gubernatorial elections. Republicans held 27 governorships after the cycle. Explore the interactive state-by-state governor map."
	/>
	<link rel="canonical" href="/2024-governor-election-results" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="2024 Governor Election Results" />
	<meta
		property="og:description"
		content="Explore the 2024 U.S. governor election results with an interactive state-by-state map."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<a href="/historical-governor-elections" class="hover:underline">Historical Governor Elections</a>
				<span class="mx-1">/</span>
				<span>2024 Results</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">2024 Governor Election Results</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				<strong>{election.controlName}</strong> held the most governorships after the 2024
				gubernatorial elections, with <strong>{election.controlSeats}</strong> of {election.totalSeats}
				state governorships. The interactive map below shows the states decided in 2024, with
				holdover governorships included in the totals.
			</p>
		</header>

		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">{democrats?.seats ?? 0}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">{election.majority} for control</div>
				<div class="text-[11px] opacity-70">{election.totalSeats} governorships</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">{republicans?.seats ?? 0}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans</div>
			</div>
		</div>

		<section class="mt-5 bg-white rounded-md border border-neutral-200 p-4">
			<h2 class="text-sm font-bold text-[#001666] uppercase tracking-wide mb-3">Governor Results</h2>
			<div class="flex flex-col gap-3">
				{#each election.candidates as c}
					<div class="flex items-center gap-3">
						{#if c.logo}
							<img
								src={c.logo}
								alt={c.name}
								loading="lazy"
								class="w-12 h-12 rounded-full shrink-0 border border-neutral-200 bg-white"
							/>
						{:else}
							<span
								class="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
								style={`background:${c.color}`}
							>
								{c.name
									.split(' ')
									.map((p) => p[0])
									.slice(0, 2)
									.join('')}
							</span>
						{/if}
						<div class="flex-1 min-w-0">
							<div class="flex justify-between text-sm font-semibold text-neutral-700">
								<span class="truncate">{c.name}</span>
								<span class="shrink-0 ml-2">{c.seats} governorships</span>
							</div>
							<div class="mt-1 h-2.5 rounded bg-neutral-200 overflow-hidden">
								<div
									class="h-full"
									style={`width:${(c.seats / election.totalSeats) * 100}%;background:${c.color}`}
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs text-neutral-500">
				{election.seatsDecided} governor races mapped &middot; {election.totalSeats} total
				governorships &middot; {election.majority} needed for a majority.
			</p>
		</section>

		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src={mapEmbed}
					title="2024 U.S. Governor Election Results Interactive Map"
					class="w-full block"
					style="height: 620px; border: 0;"
				></iframe>
			</div>
			<div class="mt-3">
				<a
					href={election.mapRoute}
					class="inline-block px-4 py-2 rounded bg-[#b60b03] text-white text-sm font-semibold hover:bg-[#8a0802]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 flex flex-col gap-8">
				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">About the 2024 Governor Elections</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						Eleven states held gubernatorial elections in 2024. Because governorships are staggered,
						the national balance also includes governors elected in earlier cycles who continued in
						office after the 2024 elections.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-3">Frequently Asked Questions</h2>
					<div class="flex flex-col gap-2">
						{#each faqs as f}
							<details class="bg-white rounded-md border border-neutral-200 p-3">
								<summary class="font-semibold text-[#244999] cursor-pointer">{f.q}</summary>
								<p class="mt-2 text-sm text-neutral-700 leading-relaxed">{f.a}</p>
							</details>
						{/each}
					</div>
				</section>
			</div>

			<aside class="flex flex-col gap-6">
				<div class="bg-white rounded-md border border-neutral-200 overflow-hidden">
					<div class="bg-[#001666] text-white px-3 py-2 font-semibold text-sm">Related Maps</div>
					<ul class="divide-y divide-neutral-100">
						{#each relatedMaps as m}
							<li>
								<a href={m.href} class="block px-3 py-2 text-sm text-[#244999] hover:bg-[#eef1f5]">
									{m.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="bg-white rounded-md border border-neutral-200 p-3 text-sm text-neutral-700">
					<h2 class="font-bold text-[#001666] mb-1 text-base">Key Facts</h2>
					<ul class="list-disc list-inside flex flex-col gap-1">
						<li>Control: <strong>{election.controlName}</strong></li>
						<li><strong>{election.controlSeats}</strong> governorships for the leading party</li>
						<li><strong>{election.seatsDecided}</strong> governor races in 2024</li>
						<li>Election Day: <strong>November 5, 2024</strong></li>
					</ul>
				</div>
			</aside>
		</div>
	</article>
	<SiteFooter />
</div>
