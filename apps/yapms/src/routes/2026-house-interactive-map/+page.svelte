<script lang="ts">
	// SEO-friendly landing page for the 2026 U.S. House interactive map.
	const mapEmbedUrl = '/app/usa/house/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/house/2026/blank';

	const faqs = [
		{
			q: 'How many seats are needed to control the House in 2026?',
			a: 'The House of Representatives has 435 voting seats, so a party needs 218 to hold a majority. Every seat is up for election in 2026.'
		},
		{
			q: 'How do I use the interactive House map?',
			a: 'Pick a party near the seat counter, then click a congressional district to assign that seat. Click again to change the margin or set it back to a toss-up. The running total updates as you fill in districts.'
		},
		{
			q: 'Why are the districts shaped so unevenly?',
			a: 'House districts are drawn to contain roughly equal populations, so geographically small but dense urban areas can hold many districts while large rural areas hold just one. The map reflects the current congressional district boundaries.'
		},
		{
			q: 'What decides control of the House?',
			a: 'Because all 435 seats are contested every cycle, control usually hinges on a few dozen competitive districts. Flip those swing seats to test different routes to a 218-seat majority.'
		},
		{
			q: 'Can I share my House forecast?',
			a: 'Yes. Open the full interactive map and use the Share button to generate a link or embed code for your prediction.'
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
		{ label: '2024 Presidential Election Results', href: '/2024-presidential-election-results' }
	];
</script>

<svelte:head>
	<title>2026 House Interactive Map | Predict Control of the U.S. House</title>
	<meta
		name="description"
		content="Forecast the 2026 U.S. House of Representatives elections with our interactive map. Click districts to assign seats and see which party reaches the 218 needed for a majority."
	/>
	<link rel="canonical" href="/2026-house-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 House Interactive Map" />
	<meta
		property="og:description"
		content="Create your own 2026 House forecast. Click districts to reach 218 seats and win the majority."
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
				<span>2026 House Interactive Map</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">2026 House Interactive Map</h1>
			<p class="italic text-neutral-500 mt-1">Predict the fight for the U.S. House</p>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				It takes <strong>218 seats</strong> to control the U.S. House of Representatives. All 435 seats
				are on the ballot in 2026 — use the interactive map below to assign each congressional district
				to a party and watch the running totals reveal which side wins the majority.
			</p>
		</header>

		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">218</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats to control</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">435 House seats</div>
				<div class="text-[11px] opacity-70">218 for a majority</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">218</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans to control</div>
			</div>
		</div>

		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src={mapEmbedUrl}
					title="2026 U.S. House Interactive Election Map"
					class="w-full block"
					style="height: 620px; border: 0;"
				></iframe>
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

		<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 flex flex-col gap-8">
				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How to Use the 2026 House Map</h2>
					<ol class="list-decimal list-inside text-sm text-neutral-700 leading-relaxed flex flex-col gap-1">
						<li>Pick a party (Democrats or Republicans) near the seat counter above the map.</li>
						<li>Click a congressional district to assign its seat to that party.</li>
						<li>Click again to change the margin or reset the district to a toss-up.</li>
						<li>Watch the totals — the first party to 218 seats wins control.</li>
						<li>Use the Share button on the full map to save or embed your forecast.</li>
					</ol>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How House Elections Work</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The House of Representatives has 435 voting members, each elected from a single
						congressional district to a two-year term. Because every seat is contested in each
						election, the entire chamber can change hands in a single cycle. Seats are apportioned to
						states by population and redrawn after each census, so the balance of competitive districts
						shifts over time. A party needs 218 seats for a majority and the power to set the chamber&rsquo;s
						agenda.
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
						<li><strong>435</strong> voting House seats</li>
						<li><strong>218</strong> needed for control</li>
						<li><strong>All</strong> seats up every 2 years</li>
						<li><strong>2-year</strong> terms</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			It takes 218 seats to control the U.S. House. Build, share and embed your 2026 forecast with the
			interactive map above.
		</footer>
	</article>
</div>
