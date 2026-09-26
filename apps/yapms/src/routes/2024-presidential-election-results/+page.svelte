<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	$: election = data.election;
	$: winner = election.winner;
	$: runnerUp = election.candidates[1];
	$: margin = winner && runnerUp ? winner.ev - runnerUp.ev : 0;
	$: mapEmbed = `${election.mapRoute}?embed=1`;

	const faqs = [
		{
			q: 'Who won the 2024 presidential election?',
			a: 'Donald Trump won the 2024 presidential election, defeating Vice President Kamala Harris in the electoral college. Use the interactive map to explore the state-by-state result.'
		},
		{
			q: 'How many electoral votes did each candidate receive?',
			a: 'Donald Trump received 312 electoral votes and Kamala Harris received 226. A candidate needs 270 of the 538 electoral votes to win the presidency.'
		},
		{
			q: 'Which states decided the 2024 election?',
			a: 'The seven battleground states — Pennsylvania, Michigan, Wisconsin, Arizona, Georgia, Nevada and North Carolina — were the most closely contested. Click any state on the map to see and change the result.'
		},
		{
			q: 'How do Maine and Nebraska split their electoral votes?',
			a: 'Maine and Nebraska award two electoral votes to the statewide winner and one to the winner of each congressional district, so they can split their votes between candidates.'
		},
		{
			q: 'Can I build my own version of the map?',
			a: 'Yes. Open the full interactive map to recolor any state and create your own scenario, then use the Share button to save or embed it.'
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
		{ label: '2024 Senate Election Results', href: '/2024-senate-election-results' },
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
		{ label: 'All Historical Elections', href: '/historical-presidential-elections' }
	];
</script>

<svelte:head>
	<title>2024 Presidential Election Results | Trump vs Harris Electoral Map</title>
	<meta
		name="description"
		content="Full results of the 2024 U.S. presidential election: Donald Trump defeated Kamala Harris with 312 electoral votes to 226. Explore the interactive electoral college map state by state."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content="2024 Presidential Election Results" />
	<meta
		property="og:description"
		content="Donald Trump won the 2024 presidential election with 312 electoral votes. Explore the interactive map."
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
				<a href="/historical-presidential-elections" class="hover:underline">Historical Elections</a>
				<span class="mx-1">/</span>
				<span>2024 Results</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">
				2024 Presidential Election Results
			</h1>
			{#if winner}
				<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
					<strong>{winner.name}</strong> won the 2024 presidential election with
					<strong>{winner.ev}</strong> of {election.totalEV} electoral votes{#if runnerUp}, defeating
					<strong>{runnerUp.name}</strong> ({runnerUp.ev}) by a margin of {margin} electoral votes{/if}.
					Explore the full state-by-state result on the interactive map below, or recolor it to build your
					own scenario.
				</p>
			{/if}
		</header>

		<!-- Electoral vote primer -->
		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">{runnerUp?.ev ?? 226}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">270 to win</div>
				<div class="text-[11px] opacity-70">538 electoral votes</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">{winner?.ev ?? 312}</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans</div>
			</div>
		</div>

		<!-- Results breakdown with portraits -->
		<section class="mt-5 bg-white rounded-md border border-neutral-200 p-4">
			<h2 class="text-sm font-bold text-[#001666] uppercase tracking-wide mb-3">
				Electoral Vote Results
			</h2>
			<div class="flex flex-col gap-3">
				{#each election.candidates as c}
					<div class="flex items-center gap-3">
						{#if c.portrait}
							<img
								src={c.portrait}
								alt={c.name}
								loading="lazy"
								class="w-12 h-12 rounded-full object-cover object-top border-2 shrink-0"
								style={`border-color:${c.color}`}
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
								<span class="shrink-0 ml-2">{c.ev} EV</span>
							</div>
							<div class="mt-1 h-2.5 rounded bg-neutral-200 overflow-hidden">
								<div
									class="h-full"
									style={`width:${(c.ev / election.totalEV) * 100}%;background:${c.color}`}
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs text-neutral-500">
				{election.totalEV} total electoral votes &middot; 270 needed to win.
			</p>
		</section>

		<!-- Interactive map -->
		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src={mapEmbed}
					title="2024 Presidential Election Results Interactive Map"
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

		<!-- Content -->
		<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 flex flex-col gap-8">
				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">About the 2024 Election</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						In the 2024 presidential election, Republican Donald Trump defeated Democratic nominee and
						sitting Vice President Kamala Harris. Trump swept all seven of the major battleground states,
						assembling {winner?.ev ?? 312} electoral votes to Harris&rsquo;s {runnerUp?.ev ?? 226}. The
						interactive map above shows the result in every state and congressional district; click any
						state to change its color and explore alternative outcomes.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How the Electoral College Works</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The president is chosen not by national popular vote but by the Electoral College. Each
						state holds electoral votes equal to its representation in Congress, for a national total of
						538. Most states award all of their electoral votes to the statewide winner, while Maine and
						Nebraska split theirs by congressional district. A candidate needs a majority — 270 electoral
						votes — to win the presidency.
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
						<li>Winner: <strong>{winner?.name ?? 'Donald Trump'}</strong></li>
						<li><strong>{winner?.ev ?? 312}</strong> electoral votes (winner)</li>
						<li><strong>{runnerUp?.ev ?? 226}</strong> electoral votes (runner-up)</li>
						<li><strong>270</strong> needed to win</li>
						<li>Election Day: <strong>November 5, 2024</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			Explore more interactive maps and the full archive of
			<a href="/historical-presidential-elections" class="text-[#244999] hover:underline">
				historical presidential elections
			</a>.
		</footer>
	</article>
	<SiteFooter />
</div>
