<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

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
	<title>2026 Governor Elections | Path to Win</title>
	<meta name="description" content="2026 governor election hub with interactive map, forecasts, state trifectas, and historical results." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2026 Governors</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2026 Governor Elections</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Track gubernatorial races, future elections, and how state executive races affect trifecta control.</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid grid-cols-3 overflow-hidden rounded text-center text-white">
				<div class="bg-[#244999] p-5"><div class="text-4xl font-black">23</div><div class="text-xs font-black uppercase">Democrats</div></div>
				<div class="bg-[#c8be9a] p-5 text-[#061a55]"><div class="text-4xl font-black">4</div><div class="text-xs font-black uppercase">toss-up</div></div>
				<div class="bg-[#d22532] p-5"><div class="text-4xl font-black">23</div><div class="text-xs font-black uppercase">Republicans</div></div>
			</div>
		</section>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each links as link}
				<a href={link.href} class="rounded-md border border-neutral-200 bg-white p-5 font-black text-[#061a55] shadow-sm hover:border-[#244999]">{link.label}</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
