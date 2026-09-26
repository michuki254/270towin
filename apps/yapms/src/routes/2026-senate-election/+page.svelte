<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import ElectionDataNotes from '$lib/components/electiondata/ElectionDataNotes.svelte';

	const links = [
		{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
		{ label: 'Senate Forecasts', href: '/forecasts' },
		{ label: 'Senate Polls', href: '/polls' },
		{ label: 'What Happens in a 50-50 Senate?', href: '/senate-50-50' },
		{ label: 'Contact U.S. Senators', href: '/contact-senators' },
		{ label: 'Historical Senate Elections', href: '/historical-senate-elections' }
	];
</script>

<svelte:head>
	<title>2026 U.S. Senate Elections | All 35 Races &amp; Interactive Map</title>
	<meta name="description" content="Explore all 35 Senate seats on the 2026 ballot, find the full race tracker with incumbents and primary dates, and compare selected ratings with Senate control odds." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2026 Senate</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2026 Senate Election</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Thirty-five Senate seats are on the 2026 ballot: 33 regular Class II seats and special elections in Florida and Ohio. The interactive page has the full incumbent and primary-date tracker, selected race ratings, official state election links, and a map you can fill in yourself.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
				<div class="rounded bg-[#244999] p-5 text-white"><div class="text-4xl font-black">100</div><div class="text-xs font-black uppercase">Senate seats</div></div>
				<div class="rounded bg-[#001666] p-5 text-white"><div class="text-4xl font-black">51</div><div class="text-xs font-black uppercase">for a majority</div></div>
				<div class="rounded bg-[#d22532] p-5 text-white"><div class="text-4xl font-black">35</div><div class="text-xs font-black uppercase">on the 2026 ballot</div></div>
			</div>
			<p class="mt-3 text-sm leading-relaxed text-neutral-600">
				A 50–50 Senate is controlled by the party of the Vice President, who breaks tied votes. The 2026 map includes two special elections in addition to the regular Class II contests.
			</p>
		</section>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each links as link}
				<a href={link.href} class="rounded-md border border-neutral-200 bg-white p-5 font-black text-[#061a55] shadow-sm hover:border-[#244999]">{link.label}</a>
			{/each}
		</section>
		<ElectionDataNotes kind="senate" />
	</main>
	<SiteFooter />
</div>
