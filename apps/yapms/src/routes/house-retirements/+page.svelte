<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const rows = [
		{ party: 'Democratic', openSeats: 18, color: '#244999' },
		{ party: 'Republican', openSeats: 21, color: '#d22532' },
		{ party: 'Other / Vacant', openSeats: 0, color: '#c8be9a' }
	];
</script>

<svelte:head>
	<title>House Retirements | Path to Win</title>
	<meta name="description" content="House retirements and open-seat dashboard for U.S. House election cycles." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>House Retirements</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">House Retirements</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Track open seats, incumbent retirements, and party exposure heading into House elections.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-3">
			{#each rows as row}
				<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<div class="text-4xl font-black" style={`color:${row.color}`}>{row.openSeats}</div>
					<div class="mt-2 text-sm font-black uppercase tracking-wide text-neutral-600">{row.party}</div>
				</div>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
