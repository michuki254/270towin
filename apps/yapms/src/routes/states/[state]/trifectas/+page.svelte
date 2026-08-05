<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const state = data.state;
	const stateRows = state.composition.filter((row) => row.body.startsWith('State '));
	const governorParty = state.governor.party;
	const senate = stateRows.find((row) => row.body === 'State Senate');
	const house = stateRows.find((row) => row.body === 'State House of Representatives');
	const chamberLeader = (row: typeof stateRows[number] | undefined) => {
		if (!row) return 'Unknown';
		if (row.democrat > row.republican) return 'Democratic';
		if (row.republican > row.democrat) return 'Republican';
		return 'Split';
	};
	const senateLeader = chamberLeader(senate);
	const houseLeader = chamberLeader(house);
	const trifecta =
		governorParty === senateLeader && governorParty === houseLeader ? `${governorParty} trifecta` : 'Divided government';
</script>

<svelte:head>
	<title>{state.name} State Trifecta | Path to Win</title>
	<meta name="description" content={`State government trifecta and legislative control dashboard for ${state.name}.`} />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span>
				<a href="/states" class="hover:underline">States</a><span class="mx-1">/</span>
				<a href={`/states/${state.slug}`} class="hover:underline">{state.name}</a><span class="mx-1">/</span>
				<span>Trifecta</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">{state.name} State Trifecta</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Trifecta status based on governor party and current state legislative chamber composition.
			</p>
		</header>
		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Current status</div>
			<div class="mt-2 text-4xl font-black text-[#001666]">{trifecta}</div>
			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<div class="rounded bg-[#f7f8fb] p-4"><div class="text-sm font-black text-neutral-500">Governor</div><div class="mt-1 text-xl font-black">{governorParty}</div></div>
				<div class="rounded bg-[#f7f8fb] p-4"><div class="text-sm font-black text-neutral-500">State Senate</div><div class="mt-1 text-xl font-black">{senateLeader}</div></div>
				<div class="rounded bg-[#f7f8fb] p-4"><div class="text-sm font-black text-neutral-500">State House</div><div class="mt-1 text-xl font-black">{houseLeader}</div></div>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
