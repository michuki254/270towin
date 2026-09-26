<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import ElectionDataNotes from '$lib/components/electiondata/ElectionDataNotes.svelte';

	const links = [
		{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' },
		{ label: 'Governor Forecasts', href: '/forecasts' },
		{ label: 'State Trifectas', href: '/state-trifectas' },
		{ label: 'State Voting History', href: '/state-voting-history' },
		{ label: 'Historical Governor Elections', href: '/historical-governor-elections' },
		{ label: 'State Elected Officials', href: '/states' }
	];
</script>

<svelte:head>
	<title>2026 Governor Elections | Interactive Map &amp; Race Guide</title>
	<meta name="description" content="Explore the 36 U.S. state governor elections in 2026, compare live market prices for eligible races, and build your own map." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2026 Governors</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2026 Governor Elections</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Thirty-six of the 50 states elect a governor in 2026. Twenty-six governorships are needed for a majority. The interactive page lets you assign each state yourself and shows live Democratic and Republican market prices where both parties can be identified.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
				<div class="rounded bg-[#244999] p-5 text-white"><div class="text-4xl font-black">50</div><div class="text-xs font-black uppercase">state governorships</div></div>
				<div class="rounded bg-[#001666] p-5 text-white"><div class="text-4xl font-black">26</div><div class="text-xs font-black uppercase">for a majority</div></div>
				<div class="rounded bg-[#d22532] p-5 text-white"><div class="text-4xl font-black">36</div><div class="text-xs font-black uppercase">on the 2026 ballot</div></div>
			</div>
			<p class="mt-3 text-sm leading-relaxed text-neutral-600">
				“Competitive” on the market board is a defined filter: the Democratic and Republican prices are within 20 percentage points. The board includes states where both party prices can be identified; California&rsquo;s candidate market has no party labels. Prices come from separate contracts and may not add to 100%.
			</p>
		</section>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each links as link}
				<a href={link.href} class="rounded-md border border-neutral-200 bg-white p-5 font-black text-[#061a55] shadow-sm hover:border-[#244999]">{link.label}</a>
			{/each}
		</section>
		<ElectionDataNotes kind="governor" />
	</main>
	<SiteFooter />
</div>
