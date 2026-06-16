<script lang="ts">
	// SEO-friendly landing page for the 2028 Presidential Election interactive map.
	// The map is embedded from the live simulator. Users can choose between starting
	// from the 2024 result (pre-coloured) or a blank map.
	let startMode: '2024map' | 'blank' = '2024map';
	$: mapEmbedUrl = `/app/usa/presidential/2028/${startMode}?embed=1`;
	$: mapFullUrl = `/app/usa/presidential/2028/${startMode}`;

	const faqs = [
		{
			q: 'How many electoral votes are needed to win the 2028 presidential election?',
			a: 'A candidate needs to win at least 270 of the 538 electoral votes to win the presidency. If neither candidate reaches 270 — for example in a 269–269 tie — the election is decided by the U.S. House of Representatives.'
		},
		{
			q: 'How do I use the interactive map?',
			a: 'Select a party near the electoral vote counter, then click any state to assign it to that party. Click again to cycle through the available margins or to mark it as a toss-up. The electoral vote total updates automatically as you build your forecast.'
		},
		{
			q: 'Why does the map start coloured?',
			a: 'The map opens with the 2024 presidential result as a baseline so you have a realistic starting point. Change any state you expect to flip in 2028 and the totals recalculate instantly.'
		},
		{
			q: 'Can I share my 2028 forecast?',
			a: 'Yes. Open the full interactive map and use the Share button to generate a link or embed code for your prediction.'
		},
		{
			q: 'How are Maine and Nebraska handled?',
			a: 'Maine and Nebraska award some of their electoral votes by congressional district rather than winner-take-all, so the map lets you colour each of those districts individually.'
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
		{ label: '2026 Senate Interactive Map', href: '/app/usa/senate/2026/blank' },
		{ label: '2026 House Interactive Map', href: '/#maps' },
		{ label: 'Blank 2028 Map (start from scratch)', href: '/app/usa/presidential/2028/blank' }
	];
</script>

<svelte:head>
	<title>2028 Presidential Election Interactive Map | Create Your 270 Forecast</title>
	<meta
		name="description"
		content="Build your own 2028 presidential election forecast with our interactive electoral college map. Click states to predict the winner — it takes 270 electoral votes to win the White House."
	/>
	<link rel="canonical" href="/2028-presidential-election-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2028 Presidential Election Interactive Map" />
	<meta
		property="og:description"
		content="Create your own 2028 electoral college forecast. Click states to reach 270 and win the presidency."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<article class="max-w-6xl mx-auto w-full px-4 py-6">
		<!-- Hero -->
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>2028 Presidential Election Interactive Map</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">
				2028 Presidential Election Interactive Map
			</h1>
			<p class="italic text-neutral-500 mt-1">This isn&rsquo;t a popularity contest&trade;</p>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				It will take <strong>270 electoral votes</strong> to win the 2028 presidential election. Use the
				interactive map below to create your own 2028 forecast — click any state to assign it to a party,
				watch the electoral vote counter update, and share your prediction when you&rsquo;re done. The map
				starts from the 2024 result so you can quickly flip the states you expect to change.
			</p>
		</header>

		<!-- Electoral vote primer -->
		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">270</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats to win</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">538 electoral votes</div>
				<div class="text-[11px] opacity-70">270 needed for the win</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">270</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans to win</div>
			</div>
		</div>

		<!-- Interactive map -->
		<section class="mt-5">
			<!-- Starting-map toggle -->
			<div class="mb-3 flex items-center gap-2 text-sm">
				<span class="font-semibold text-neutral-600">Start from:</span>
				<div class="inline-flex rounded-md overflow-hidden border border-neutral-300">
					<button
						type="button"
						class="px-3 py-1.5 font-semibold transition-colors {startMode === '2024map'
							? 'bg-[#244999] text-white'
							: 'bg-white text-neutral-700 hover:bg-neutral-100'}"
						aria-pressed={startMode === '2024map'}
						on:click={() => (startMode = '2024map')}
					>
						2024 Result
					</button>
					<button
						type="button"
						class="px-3 py-1.5 font-semibold border-l border-neutral-300 transition-colors {startMode ===
						'blank'
							? 'bg-[#244999] text-white'
							: 'bg-white text-neutral-700 hover:bg-neutral-100'}"
						aria-pressed={startMode === 'blank'}
						on:click={() => (startMode = 'blank')}
					>
						Blank Map
					</button>
				</div>
			</div>

			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				{#key startMode}
					<iframe
						src={mapEmbedUrl}
						title="2028 Presidential Election Interactive Electoral College Map"
						class="w-full block"
						style="height: 620px; border: 0;"
					></iframe>
				{/key}
			</div>
			<div class="mt-3 flex flex-wrap gap-2 text-sm">
				<a
					href={mapFullUrl}
					class="px-4 py-2 rounded bg-[#b60b03] text-white font-semibold hover:bg-[#8a0802]"
				>
					Open Full Interactive Map
				</a>
			</div>
		</section>

		<!-- Content sections -->
		<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 flex flex-col gap-8">
				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How to Use the 2028 Election Map</h2>
					<ol class="list-decimal list-inside text-sm text-neutral-700 leading-relaxed flex flex-col gap-1">
						<li>Pick a party (Democrat or Republican) near the electoral vote counter above the map.</li>
						<li>Click a state to colour it for that party. Click again to change its margin or set it back to a toss-up.</li>
						<li>Watch the running electoral vote totals — the first party to 270 wins.</li>
						<li>Adjust Maine and Nebraska by congressional district, since they split their votes.</li>
						<li>Use the Share button on the full map to save or embed your forecast.</li>
					</ol>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How the Electoral College Works</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The president is not chosen by national popular vote but by the Electoral College. Each
						state is assigned electoral votes equal to its number of members in Congress — its two
						senators plus its representatives — for a national total of 538. The District of Columbia
						receives three. Forty-eight states and D.C. award all of their electoral votes to the
						statewide winner, while Maine and Nebraska allocate some votes by congressional district.
						A candidate who secures a majority — <strong>270 electoral votes</strong> — becomes president.
					</p>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">Building Your 2028 Forecast</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						Most presidential elections are decided by a handful of competitive battleground states.
						Start from the 2024 baseline shown on the map and focus on the states most likely to flip —
						places like Pennsylvania, Michigan, Wisconsin, Arizona, Georgia, Nevada and North Carolina
						have decided recent elections. Flip them between parties to test different paths to 270 and
						see how the math changes in real time.
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

			<!-- Sidebar -->
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
						<li><strong>538</strong> total electoral votes</li>
						<li><strong>270</strong> needed to win</li>
						<li><strong>269–269</strong> tie is decided by the House</li>
						<li><strong>2</strong> states split votes (ME &amp; NE)</li>
						<li>Election Day: <strong>November 7, 2028</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<!-- Footer -->
		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			It will take 270 electoral votes to win the 2028 presidential election. Build, share and embed
			your forecast with the interactive map above.
		</footer>
	</article>
</div>
