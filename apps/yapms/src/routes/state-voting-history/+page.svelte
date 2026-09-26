<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const states = [
		{ state: 'Arizona', trend: 'Competitive', recent: 'Republican-leaning with recent Democratic wins', color: '#c8be9a' },
		{ state: 'Georgia', trend: 'Competitive', recent: 'Fast-changing presidential and Senate battleground', color: '#c8be9a' },
		{ state: 'Michigan', trend: 'Blue wall', recent: 'Democratic advantage with close recent margins', color: '#244999' },
		{ state: 'North Carolina', trend: 'Republican lean', recent: 'Competitive statewide races, Republican presidential edge', color: '#d22532' },
		{ state: 'Pennsylvania', trend: 'Blue wall', recent: 'Core presidential battleground', color: '#244999' },
		{ state: 'Wisconsin', trend: 'Blue wall', recent: 'Narrow presidential margins across cycles', color: '#244999' }
	];
</script>

<svelte:head>
	<title>State Voting History | Path to Win</title>
	<meta name="description" content="State voting history and recent partisan trends for U.S. elections." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>State Voting History</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">State Voting History</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Track recent partisan trends, battleground status, and long-term voting patterns by state.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each states as item}
				<a href={`/states/${item.state.toLowerCase().replaceAll(' ', '-')}`} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="h-1.5 w-16 rounded-full" style={`background:${item.color}`}></div>
					<h2 class="mt-4 text-xl font-black text-[#061a55]">{item.state}</h2>
					<div class="mt-1 text-sm font-bold text-neutral-600">{item.trend}</div>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{item.recent}</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
