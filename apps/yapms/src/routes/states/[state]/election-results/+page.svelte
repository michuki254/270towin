<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const state = data.state;
	const senators = state.congress.filter((official) => official.title === 'Senator');
	const representatives = state.congress.filter((official) => official.title !== 'Senator');
</script>

<svelte:head>
	<title>{state.name} Election Results | Path to Win</title>
	<meta name="description" content={`Election results and current federal delegation dashboard for ${state.name}.`} />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span>
				<a href="/states" class="hover:underline">States</a><span class="mx-1">/</span>
				<a href={`/states/${state.slug}`} class="hover:underline">{state.name}</a><span class="mx-1">/</span>
				<span>Election Results</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">{state.name} Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Current elected officials and result archive links for statewide and congressional races.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-3">
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Governor</div>
				<div class="mt-2 text-xl font-black text-[#061a55]">{state.governor.name}</div>
				<div class="text-sm font-bold text-neutral-600">{state.governor.party} · Next {state.governor.nextElection}</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">U.S. Senate</div>
				<div class="mt-2 text-xl font-black text-[#061a55]">{senators.length} seats</div>
				<div class="text-sm font-bold text-neutral-600">{senators.map((senator) => senator.party.charAt(0)).join(' / ')}</div>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-xs font-black uppercase tracking-wide text-neutral-500">U.S. House</div>
				<div class="mt-2 text-xl font-black text-[#061a55]">{representatives.length} districts</div>
				<div class="text-sm font-bold text-neutral-600">Current delegation</div>
			</div>
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-black text-[#061a55]">Result Archive Links</h2>
			<div class="mt-4 grid gap-3 md:grid-cols-2">
				<a class="rounded bg-[#f7f8fb] p-4 font-bold text-[#244999]" href="/2024-presidential-election-results">2024 Presidential Results</a>
				<a class="rounded bg-[#f7f8fb] p-4 font-bold text-[#244999]" href="/2024-senate-election-results">2024 Senate Results</a>
				<a class="rounded bg-[#f7f8fb] p-4 font-bold text-[#244999]" href="/2024-house-election-results">2024 House Results</a>
				<a class="rounded bg-[#f7f8fb] p-4 font-bold text-[#244999]" href="/2024-governor-election-results">2024 Governor Results</a>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
