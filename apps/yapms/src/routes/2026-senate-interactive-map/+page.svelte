<script lang="ts">
	// SEO-friendly landing page for the 2026 U.S. Senate interactive map.
	const mapEmbedUrl = '/app/usa/senate/2026/blank?embed=1';
	const mapFullUrl = '/app/usa/senate/2026/blank';

	const faqs = [
		{
			q: 'How many seats are needed to control the Senate in 2026?',
			a: 'It takes 51 seats for an outright Senate majority. With a 50–50 split, the Vice President casts the tie-breaking vote, so the party that holds the White House would control a tied chamber.'
		},
		{
			q: 'How many Senate seats are up for election in 2026?',
			a: 'Roughly one-third of the Senate is contested every two years. In 2026 the Class 2 seats are up, along with any special elections. The seats that are not up for election are already counted for each party as holdovers on the map.'
		},
		{
			q: 'How do I use the interactive Senate map?',
			a: 'Pick a party near the seat counter, then click a state that has a 2026 race to assign that seat. Click again to change the margin or set it back to a toss-up. The running totals include both the contested seats and the holdovers.'
		},
		{
			q: 'What are the Senate battlegrounds in 2026?',
			a: 'A handful of competitive states usually decide control of the Senate. Flip the closest races between the parties to test different paths to a 51-seat majority.'
		},
		{
			q: 'Can I share my Senate forecast?',
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
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
		{ label: '2024 Senate Election Results', href: '/app/usa/senate/2024310/results' }
	];
</script>

<svelte:head>
	<title>2026 Senate Interactive Map | Predict Control of the U.S. Senate</title>
	<meta
		name="description"
		content="Forecast the 2026 U.S. Senate elections with our interactive map. Click states to assign seats and see which party reaches the 51 seats needed for a majority."
	/>
	<link rel="canonical" href="/2026-senate-interactive-map" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="2026 Senate Interactive Map" />
	<meta
		property="og:description"
		content="Create your own 2026 Senate forecast. Click states to reach 51 seats and win the majority."
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
				<span>2026 Senate Interactive Map</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">2026 Senate Interactive Map</h1>
			<p class="italic text-neutral-500 mt-1">Predict the fight for the U.S. Senate</p>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				It takes <strong>51 seats</strong> to control the U.S. Senate. Use the interactive map below to
				forecast the 2026 Senate elections — click a state with a race to assign its seat to a party and
				watch the running totals update. Seats that are not up for election in 2026 are already counted
				as holdovers, so you only need to call the competitive contests.
			</p>
		</header>

		<div class="mt-5 grid grid-cols-3 text-center text-white font-bold rounded-md overflow-hidden border border-neutral-300">
			<div class="bg-[#244999] py-2">
				<div class="text-2xl leading-none">51</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats to control</div>
			</div>
			<div class="bg-[#001666] py-2 flex flex-col justify-center">
				<div class="text-xs uppercase tracking-wide opacity-80">100 Senate seats</div>
				<div class="text-[11px] opacity-70">51 for a majority</div>
			</div>
			<div class="bg-[#d22532] py-2">
				<div class="text-2xl leading-none">51</div>
				<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans to control</div>
			</div>
		</div>

		<section class="mt-5">
			<div class="rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src={mapEmbedUrl}
					title="2026 U.S. Senate Interactive Election Map"
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
					<h2 class="text-xl font-bold text-[#001666] mb-2">How to Use the 2026 Senate Map</h2>
					<ol class="list-decimal list-inside text-sm text-neutral-700 leading-relaxed flex flex-col gap-1">
						<li>Pick a party (Democrats or Republicans) near the seat counter above the map.</li>
						<li>Click a state with a 2026 race to assign its Senate seat to that party.</li>
						<li>Click again to change the margin or reset the seat to a toss-up.</li>
						<li>Watch the totals — the first party to 51 seats wins control.</li>
						<li>Use the Share button on the full map to save or embed your forecast.</li>
					</ol>
				</section>

				<section>
					<h2 class="text-xl font-bold text-[#001666] mb-2">How Senate Elections Work</h2>
					<p class="text-sm text-neutral-700 leading-relaxed">
						The U.S. Senate has 100 members — two from each state — who each serve six-year terms. The
						terms are staggered into three classes, so only about a third of the Senate is up for
						election every two years. In 2026 the Class 2 seats are contested. Because the remaining
						seats carry over, control of the chamber often comes down to a small number of competitive
						races. A party needs 51 seats for a clear majority; in a 50–50 chamber the Vice President
						breaks ties.
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
						<li><strong>100</strong> total Senate seats</li>
						<li><strong>51</strong> needed for control</li>
						<li><strong>50–50</strong> tie broken by the Vice President</li>
						<li>About <strong>1/3</strong> of seats up each cycle</li>
						<li>Election Day: <strong>November 3, 2026</strong></li>
					</ul>
				</div>
			</aside>
		</div>

		<footer class="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
			It takes 51 seats to control the U.S. Senate. Build, share and embed your 2026 forecast with the
			interactive map above.
		</footer>
	</article>
</div>
