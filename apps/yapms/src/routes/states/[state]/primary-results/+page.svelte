<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const state = data.state;
	const cycles = ['2026', '2024', '2022', '2020'];
</script>

<svelte:head>
	<title>{state.name} Primary Results | Path to Win</title>
	<meta name="description" content={`Primary result archive page for ${state.name}.`} />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span>
				<a href="/states" class="hover:underline">States</a><span class="mx-1">/</span>
				<a href={`/states/${state.slug}`} class="hover:underline">{state.name}</a><span class="mx-1">/</span>
				<span>Primary Results</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">{state.name} Primary Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Cycle-level primary result landing page for statewide, congressional, and state races.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-4">
			{#each cycles as cycle}
				<div class="rounded-md border border-neutral-200 bg-white p-5 text-center shadow-sm">
					<div class="text-3xl font-black text-[#001666]">{cycle}</div>
					<div class="mt-2 text-sm font-bold text-neutral-600">{state.abbreviation} primary results</div>
				</div>
			{/each}
		</section>
		<a class="w-fit rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/state-primary-results">
			All State Primary Results
		</a>
	</main>
	<SiteFooter />
</div>
