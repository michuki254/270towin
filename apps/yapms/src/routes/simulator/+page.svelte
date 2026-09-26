<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const simulators = [
		{
			label: 'Presidential Simulator',
			href: '/2028-presidential-election-interactive-map',
			description: 'Build Electoral College paths to 270.',
			stats: '538 electoral votes'
		},
		{
			label: 'Senate Simulator',
			href: '/2026-senate-interactive-map',
			description: 'Model holdovers, contested seats, and chamber control.',
			stats: '100 Senate seats'
		},
		{
			label: 'House Simulator',
			href: '/2026-house-interactive-map',
			description: 'Track the district-level path to a House majority.',
			stats: '435 House seats'
		},
		{
			label: 'Governor Simulator',
			href: '/2026-governor-interactive-map',
			description: 'Forecast gubernatorial control and state executive races.',
			stats: '50 governorships'
		}
	];
</script>

<svelte:head>
	<title>Election Simulator | Path to Win</title>
	<meta name="description" content="Election simulator hub for presidential, Senate, House, and governor maps." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Simulator</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">Election Simulator</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Choose a simulator to build your own election control scenario.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-2">
			{#each simulators as simulator}
				<a href={simulator.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="text-xs font-black uppercase tracking-wide text-[#d83a45]">{simulator.stats}</div>
					<h2 class="mt-2 text-xl font-black text-[#061a55]">{simulator.label}</h2>
					<p class="mt-2 text-sm leading-relaxed text-neutral-600">{simulator.description}</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
