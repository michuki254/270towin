<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import mapData from '$lib/data/elected-officials-map.generated.json';

	type Winner = 'Democratic' | 'Republican';
	type MapState = {
		abbreviation: string;
		name: string;
		slug: string;
		electoralVotes: number;
		winner: Winner;
		paths: { d: string; winner: Winner; label: string }[];
	};

	const states = mapData.states as MapState[];
	const demStates = states.filter((state) => state.winner === 'Democratic').length;
	const repStates = states.filter((state) => state.winner === 'Republican').length;
	const demEV = states
		.filter((state) => state.winner === 'Democratic')
		.reduce((sum, state) => sum + state.electoralVotes, 0);
	const repEV = states
		.filter((state) => state.winner === 'Republican')
		.reduce((sum, state) => sum + state.electoralVotes, 0);

	const fillFor = (winner: Winner) => (winner === 'Democratic' ? '#2e5aac' : '#d83a45');
</script>

<svelte:head>
	<title>Elected Officials Interactive Map | Path to Win</title>
	<meta
		name="description"
		content="Click any U.S. state on the 2024 presidential result map to open its elected officials dashboard."
	/>
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<section class="border-b border-[#2f5bbf] bg-[#001666] text-white">
		<div class="mx-auto max-w-7xl px-4 py-8">
			<nav class="text-xs font-semibold text-[#9db8e0]" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Elected Officials</span>
			</nav>
			<div class="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
				<div>
					<p class="text-xs font-black uppercase tracking-[0.2em] text-[#9db8e0]">
						State-by-state officials
					</p>
					<h1 class="mt-2 text-4xl font-black leading-tight md:text-5xl">
						Elected Officials Interactive Map
					</h1>
					<p class="mt-3 max-w-3xl text-sm leading-relaxed text-[#d7e2f7]">
						Click a state on the 2024 presidential result map to open its elected officials
						dashboard with current Congress members, governor details, and state legislature
						composition.
					</p>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-md border border-[#2f5bbf] bg-[#061a55] p-4">
						<div class="flex items-center gap-3">
							<img
								src="/party-logos/democrats.png"
								alt=""
								class="h-12 w-12 rounded-full bg-white object-contain"
								aria-hidden="true"
							/>
							<div>
								<div class="text-xs font-black uppercase tracking-wide text-[#9db8e0]">Democratic</div>
								<div class="mt-1 text-3xl font-black">{demEV}</div>
								<div class="text-xs text-[#d7e2f7]">{demStates} states won</div>
							</div>
						</div>
					</div>
					<div class="rounded-md border border-[#2f5bbf] bg-[#061a55] p-4">
						<div class="flex items-center gap-3">
							<img
								src="/party-logos/republicans.png"
								alt=""
								class="h-12 w-12 rounded-full bg-white object-contain"
								aria-hidden="true"
							/>
							<div>
								<div class="text-xs font-black uppercase tracking-wide text-[#9db8e0]">Republican</div>
								<div class="mt-1 text-3xl font-black">{repEV}</div>
								<div class="text-xs text-[#d7e2f7]">{repStates} states won</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<main class="mx-auto max-w-7xl px-4 py-7">
		<section class="grid gap-5 xl:grid-cols-[1fr_320px]">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 class="text-lg font-black text-[#061a55]">Click a State</h2>
						<p class="text-sm text-neutral-600">
							Map colors reflect the 2024 presidential winner. Maine and Nebraska show split
							district pieces where applicable.
						</p>
					</div>
					<div class="flex flex-wrap gap-2 text-xs font-black">
						<span class="inline-flex items-center gap-2 rounded border border-[#b6c7e8] bg-[#eaf0fb] px-3 py-1 text-[#2e5aac]">
							<span class="h-3 w-3 rounded-sm bg-[#2e5aac]"></span>
							Democrat
						</span>
						<span class="inline-flex items-center gap-2 rounded border border-[#f0b4ba] bg-[#fdebed] px-3 py-1 text-[#d83a45]">
							<span class="h-3 w-3 rounded-sm bg-[#d83a45]"></span>
							Republican
						</span>
					</div>
				</div>

				<div class="overflow-hidden rounded-md border border-neutral-200 bg-[#f7f8fb] p-3">
					<svg
						viewBox={mapData.viewBox}
						role="img"
						aria-label="Clickable United States map linking to elected officials pages"
						class="usa-officials-map h-auto w-full"
					>
						<g>
							{#each states as state}
								<a href={`/states/${state.slug}`} class="state-link" aria-label={`${state.name} elected officials`}>
									<title>{state.name} elected officials</title>
									{#each state.paths as piece}
										<path
											d={piece.d}
											fill={fillFor(piece.winner)}
											stroke="#ffffff"
											stroke-width="1.1"
											vector-effect="non-scaling-stroke"
										/>
									{/each}
								</a>
							{/each}
						</g>
					</svg>
				</div>
			</div>

			<aside class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h2 class="text-lg font-black text-[#061a55]">State Dashboards</h2>
				<p class="mt-1 text-sm text-neutral-600">
					Open a state page directly from this list.
				</p>
				<div class="mt-4 max-h-[620px] space-y-2 overflow-y-auto pr-1">
					{#each states as state}
						<a
							href={`/states/${state.slug}`}
							class="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-[#f7f8fb] px-3 py-2 text-sm hover:border-[#2e5aac] hover:bg-white"
						>
							<span class="font-black text-[#061a55]">{state.name}</span>
							<span
								class={`rounded px-2 py-1 text-xs font-black text-white ${
									state.winner === 'Democratic' ? 'bg-[#2e5aac]' : 'bg-[#d83a45]'
								}`}
							>
								{state.abbreviation} · {state.electoralVotes}
							</span>
						</a>
					{/each}
				</div>
			</aside>
		</section>

		<section class="mt-6 grid gap-4 md:grid-cols-3">
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h3 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Officials Data</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-600">
					State pages use public data for current members of Congress, governors, and legislative
					partisan composition.
				</p>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h3 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Presidential Baseline</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-600">
					The map shading comes from the 2024 presidential result SVG already used by the app.
				</p>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
				<h3 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Direct Routing</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-600">
					Every state path links to <span class="font-mono">/states/[state]</span>, so it works
					with browser navigation and SEO-friendly state pages.
				</p>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>

<style>
	.usa-officials-map .state-link path {
		cursor: pointer;
		transition:
			filter 140ms ease,
			opacity 140ms ease,
			stroke-width 140ms ease;
	}

	.usa-officials-map .state-link:hover path,
	.usa-officials-map .state-link:focus path {
		filter: brightness(1.12);
		opacity: 0.92;
		stroke-width: 2.2;
	}
</style>
