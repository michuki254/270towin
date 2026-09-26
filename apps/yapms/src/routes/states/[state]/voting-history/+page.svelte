<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const state = data.state;

	const federalRows = state.composition.filter((row) => row.body === 'U.S. Senate' || row.body === 'U.S. House');
	const stateRows = state.composition.filter((row) => row.body.startsWith('State '));
	const pct = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
</script>

<svelte:head>
	<title>{state.name} Voting History | Path to Win</title>
	<meta name="description" content={`Voting history and partisan composition dashboard for ${state.name}.`} />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span>
				<a href="/states" class="hover:underline">States</a><span class="mx-1">/</span>
				<a href={`/states/${state.slug}`} class="hover:underline">{state.name}</a><span class="mx-1">/</span>
				<span>Voting History</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">{state.name} Voting History</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Current partisan composition and links into the historical election archive for deeper
				state-by-state voting history.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-2">
			{#each [...federalRows, ...stateRows] as row}
				<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<div class="mb-3 flex items-center justify-between gap-3">
						<h2 class="font-black text-[#061a55]">{row.body}</h2>
						<span class="text-xs font-black uppercase tracking-wide text-neutral-500">{row.total} total</span>
					</div>
					<div class="flex h-5 overflow-hidden rounded-full bg-neutral-200">
						<div class="bg-[#244999]" style={`width:${pct(row.democrat, row.total)}%`}></div>
						<div class="bg-[#d22532]" style={`width:${pct(row.republican, row.total)}%`}></div>
						<div class="bg-[#c8be9a]" style={`width:${pct(row.other + row.vacant, row.total)}%`}></div>
					</div>
					<div class="mt-3 grid grid-cols-3 text-sm font-bold">
						<div class="text-[#244999]">D {row.democrat}</div>
						<div class="text-[#d22532]">R {row.republican}</div>
						<div class="text-neutral-600">Other {row.other + row.vacant}</div>
					</div>
				</div>
			{/each}
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-black text-[#061a55]">Historical Archives</h2>
			<div class="mt-4 flex flex-wrap gap-2">
				<a class="rounded bg-[#244999] px-4 py-2 text-sm font-bold text-white" href="/historical-presidential-elections">Presidential</a>
				<a class="rounded bg-[#244999] px-4 py-2 text-sm font-bold text-white" href="/historical-senate-elections">Senate</a>
				<a class="rounded bg-[#244999] px-4 py-2 text-sm font-bold text-white" href="/historical-house-elections">House</a>
				<a class="rounded bg-[#244999] px-4 py-2 text-sm font-bold text-white" href="/historical-governor-elections">Governor</a>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
