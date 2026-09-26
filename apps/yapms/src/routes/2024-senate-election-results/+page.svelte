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
			q: 'Who won control of the Senate in 2024?',
			a: 'Republicans won control of the U.S. Senate in the 2024 elections, reaching 53 seats after the full chamber result.'
		},
		{
			q: 'How many seats are needed to control the Senate?',
			a: 'A party needs 51 seats for an outright Senate majority. A 50-50 Senate is controlled by the party of the Vice President, who can break ties.'
		},
		{
			q: 'How often are Senate seats elected?',
			a: 'Senators serve six-year terms, with seats divided into three classes. About one-third of the Senate is up for election every two years.'
		},
		{
			q: 'Can I change the 2024 Senate results map?',
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
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: 'Historical Senate Elections', href: '/historical-senate-elections' },
		{ label: '2028 Presidential Interactive Map', href: '/2028-presidential-election-interactive-map' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' }
	];
</script>

<svelte:head>
	<title>2024 Senate Election Results | Interactive U.S. Senate Map</title>
	<meta
		name="description"
		content="Full results of the 2024 U.S. Senate elections. Republicans won Senate control with 53 seats. Explore the interactive state-by-state Senate map."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content="2024 Senate Election Results" />
	<meta
		property="og:description"
		content="Republicans won control of the U.S. Senate in 2024. Explore the interactive results map."
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
				<a href="/historical-senate-elections" class="hover:underline">Historical Senate Elections</a>
				<span class="mx-1">/</span>
				<span>2024 Results</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">2024 Senate Election Results</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				<strong>{election.controlName}</strong> won control of the U.S. Senate with
				<strong>{election.controlSeats}</strong> seats. The interactive map below shows the full
				state-by-state result, including holdover seats and the seats contested in 2024.
			</p>
		</header>

		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">{democrats?.seats ?? 0}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">{election.majority} for control</div>
				<div class="text-[11px] opacity-70">{election.totalSeats} Senate seats</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">{republicans?.seats ?? 0}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans</div>
			</div>
		</div>

		<section class="mt-5 bg-white rounded-md border border-neutral-200 p-4">
			<h2 class="text-sm font-bold text-[#001666] uppercase tracking-wide mb-3">Seat Results</h2>
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
								<span class="shrink-0 ml-2">{c.seats} seats</span>
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
				{election.totalSeats} total Senate seats &middot; {election.majority} needed for control.
			</p>
		</section>

		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src={mapEmbed}
					title="2024 Senate Election Results Interactive Map"
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
					<h2 class="text-xl font-bold text-[#001666] mb-2">About the 2024 Senate Elections</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The 2024 Senate elections decided control of the chamber alongside the presidential race.
						Republicans gained the majority, while Democratic seats and holdovers combined for the
						opposing caucus total. Use the interactive map to inspect each state, adjust any result,
						and build alternate paths to Senate control.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How Senate Control Works</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The Senate has 100 members, two from each state. Senators serve six-year terms, with
						elections staggered so only one class of seats is normally on the ballot every two years.
						A party needs 51 seats for an outright majority. If the chamber is split 50-50, the Vice
						President can cast tie-breaking votes.
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
						<li><strong>{election.controlSeats}</strong> seats for the controlling side</li>
						<li><strong>{election.majority}</strong> needed for outright control</li>
						<li>Election Day: <strong>November 5, 2024</strong></li>
					</ul>
				</div>
			</aside>
		</div>
	</article>
	<SiteFooter />
</div>
