<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import { stateOfficials } from '$lib/data/stateOfficials';

	const states = Object.values(stateOfficials).sort((a, b) => a.name.localeCompare(b.name));

	const partyClass = (party: string) => {
		if (party === 'Democratic') return 'bg-[#eaf0fb] text-[#244999] border-[#b6c7e8]';
		if (party === 'Republican') return 'bg-[#fdebed] text-[#c12735] border-[#f0b4ba]';
		return 'bg-neutral-100 text-neutral-700 border-neutral-300';
	};
</script>

<svelte:head>
	<title>State Elected Officials | Path to Win</title>
	<meta
		name="description"
		content="Browse state-by-state elected officials dashboards with Congress members, governors, and state legislature composition."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>States</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">State Elected Officials</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Open a state dashboard for current U.S. senators, House members, governor information,
				and state legislative partisan composition.
			</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<a class="rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/elected-officials">
					Open Interactive Map
				</a>
				<a class="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-[#001666] hover:bg-neutral-50" href="/site-map">
					View Site Map
				</a>
			</div>
		</header>

		<section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each states as state}
				<a
					href={`/states/${state.slug}`}
					class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#244999] hover:shadow-md"
				>
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-lg font-black text-[#001666]">{state.name}</div>
							<div class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
								{state.abbreviation} · {state.capital}
							</div>
						</div>
						<span class={`rounded-full border px-2 py-1 text-xs font-black ${partyClass(state.governor.party)}`}>
							{state.governor.party}
						</span>
					</div>
					<div class="mt-4 flex items-center gap-3">
						<img
							src={state.governor.photo}
							alt=""
							class="h-12 w-12 rounded-full border border-neutral-200 object-cover"
							loading="lazy"
						/>
						<div class="min-w-0">
							<div class="truncate text-sm font-bold text-neutral-900">{state.governor.name}</div>
							<div class="truncate text-xs text-neutral-500">Governor · Next election {state.governor.nextElection}</div>
						</div>
					</div>
					<div class="mt-4 grid grid-cols-2 gap-2 text-xs font-bold">
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-[#244999]">Voting history</span>
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-[#244999]">Results</span>
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-[#244999]">Primaries</span>
						<span class="rounded bg-[#f7f8fb] px-2 py-1 text-[#244999]">Trifecta</span>
					</div>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
