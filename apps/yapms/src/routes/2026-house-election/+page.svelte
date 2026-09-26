<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import ElectionDataNotes from '$lib/components/electiondata/ElectionDataNotes.svelte';

	const links = [
		{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
		{ label: 'House Forecasts', href: '/forecasts' },
		{ label: 'House Retirements', href: '/house-retirements' },
		{ label: 'House Crossover Districts', href: '/house-crossover-districts' },
		{ label: 'Uncontested House Races', href: '/uncontested-house-races' },
		{ label: 'Historical House Elections', href: '/historical-house-elections' }
	];
</script>

<svelte:head>
	<title>2026 U.S. House Elections | Interactive District Map &amp; Guide</title>
	<meta name="description" content="Explore the 2026 U.S. House elections with an interactive district map, the majority threshold, selected seats to follow, and live market odds on chamber control." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2026 House</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2026 House Election</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				All 435 voting seats are up in the November 3, 2026 general election. A party needs 218 seats for a majority when every seat is filled. Build your own district map, review selected current officeholders, and follow the live market on House control.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
				<div class="rounded bg-[#244999] p-5 text-white"><div class="text-4xl font-black">435</div><div class="text-xs font-black uppercase">voting seats</div></div>
				<div class="rounded bg-[#001666] p-5 text-white"><div class="text-4xl font-black">218</div><div class="text-xs font-black uppercase">for a majority</div></div>
				<div class="rounded bg-[#d22532] p-5 text-white"><div class="text-4xl font-black">Nov 3</div><div class="text-xs font-black uppercase">general election</div></div>
			</div>
			<p class="mt-3 text-sm leading-relaxed text-neutral-600">
				The current seat count can change when a member leaves office or a special-election winner is sworn in. The detailed map links to the House Clerk’s current member and vacancy records.
			</p>
		</section>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each links as link}
				<a href={link.href} class="rounded-md border border-neutral-200 bg-white p-5 font-black text-[#061a55] shadow-sm hover:border-[#244999]">{link.label}</a>
			{/each}
		</section>
		<ElectionDataNotes kind="house" />
	</main>
	<SiteFooter />
</div>
