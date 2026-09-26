<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>States Voting the Same Since | Path to Win</title>
	<meta name="description" content="States grouped by repeated presidential voting behavior across election cycles." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>States Voting Same Since</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">States Voting the Same Since</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				A quick reference for electoral consistency based on the bundled presidential map files.
				The grouping uses the winner color family encoded in each map.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-3">
			{#each data.groups as group}
				<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-4xl font-black text-[#001666]">{group.count}</div><p class="mt-2 text-sm font-bold text-neutral-700">{group.label}</p></div>
			{/each}
		</section>
		<section class="grid gap-4 lg:grid-cols-2">
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">Same Since 2008</h2>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each data.sameSince2008 as state}
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-xs font-bold text-neutral-700">{state.region} {state.partyFamily}</span>
					{/each}
				</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">Changed Since 2008</h2>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each data.changedSince2008 as state}
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-xs font-bold text-neutral-700">{state.region}</span>
					{/each}
				</div>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
