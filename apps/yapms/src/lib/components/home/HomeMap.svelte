<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import {
		CandidatesStore,
		SelectedCandidateStore,
		TossupCandidateStore
	} from '$lib/stores/Candidates';
	import {
		CandidateCounts,
		CandidateCountsMargins,
		RegionsStore
	} from '$lib/stores/regions/Regions';
	import { ShareModalStore } from '$lib/stores/Modals';
	import type { RegionCandidate } from '$lib/types/Region';
	import type { Candidate } from '$lib/types/Candidate';

	let { children }: { children: Snippet } = $props();
	let selectedMargin = $state(0);
	let selectedRegion = $state('');
	let baseline = new Map<string, RegionCandidate[]>();
	const labels = ['Safe', 'Likely', 'Leans', 'Tilt'];
	const parties = $derived(
		[...$CandidatesStore].sort(
			(a, b) =>
				Number(b.name.toLowerCase().startsWith('dem')) -
				Number(a.name.toLowerCase().startsWith('dem'))
		)
	);
	const total = $derived(Array.from($CandidateCounts.values()).reduce((a, b) => a + b, 0));
	const tossup = $derived($CandidateCounts.get($TossupCandidateStore.id) ?? 0);
	const ready = $derived(total === 538);

	onMount(() =>
		RegionsStore.subscribe((regions) => {
			if (!baseline.size && regions.length) {
				baseline = new Map(
					regions.map((region) => [region.id, region.candidates.map((c) => ({ ...c }))])
				);
			}
		})
	);

	function choose(candidate: Candidate, margin: number) {
		SelectedCandidateStore.set(candidate);
		selectedMargin = margin;
	}

	function paint(regionID: string) {
		RegionsStore.update((regions) =>
			regions.map((region) =>
				region.id === regionID && !region.locked
					? {
							...region,
							candidates: [
								{ candidate: $SelectedCandidateStore, count: region.value, margin: selectedMargin }
							]
						}
					: region
			)
		);
	}

	// Capture map clicks so the chosen palette shade is applied exactly.
	function paintMap(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const region = $RegionsStore.find(
			(region) => region.nodes.region.contains(target) || region.nodes.button?.contains(target)
		);
		if (!region) return;
		event.stopPropagation();
		paint(region.id);
	}

	function reset(blank = false) {
		RegionsStore.update((regions) =>
			regions.map((region) => ({
				...region,
				candidates: blank
					? [{ candidate: $TossupCandidateStore, count: region.value, margin: 0 }]
					: (baseline.get(region.id) ?? region.candidates).map((c) => ({ ...c }))
			}))
		);
	}
</script>

<div class="home-map" data-theme="light">
	<div class="map-main" id="map-chart-div">
		<div class="totals" aria-live="polite" aria-label="Electoral vote totals">
			{#each parties as candidate, i}
				<div class:republican={i === 1} style:color={candidate.margins[0].color}>
					<span
						>{candidate.name === 'Democrat'
							? 'Democrats'
							: candidate.name === 'Republican'
								? 'Republicans'
								: candidate.name}</span
					>
					<strong>{ready ? ($CandidateCounts.get(candidate.id) ?? 0) : '—'}</strong>
				</div>
			{/each}
		</div>
		<div class="vote-bar" aria-hidden="true">
			{#each parties.slice(0, 1) as candidate}
				{#each candidate.margins as margin, i}<span
						style:background={margin.color}
						style:width={`${(($CandidateCountsMargins.get(candidate.id)?.[i] ?? 0) / 538) * 100}%`}
					></span>{/each}
			{/each}
			<span style:background="#ccc" style:width={`${(tossup / 538) * 100}%`}></span>
			{#each parties.slice(1) as candidate}
				{#each [...candidate.margins].reverse() as margin, i}<span
						style:background={margin.color}
						style:width={`${(($CandidateCountsMargins.get(candidate.id)?.[candidate.margins.length - i - 1] ?? 0) / 538) * 100}%`}
					></span>{/each}
			{/each}
		</div>
		<div class="threshold"><span>{tossup} toss-up</span><strong>▲<br />270 to win</strong></div>
		<!-- The map's SVG has its own pointer interactions; the select below also supports keyboard editing. -->
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div class="map-canvas" onclickcapture={paintMap}>{@render children()}</div>
		<div class="map-actions">
			<button onclick={() => ($ShareModalStore.open = true)} disabled={!ready}
				>Share / export map</button
			>
			<button onclick={() => reset()} disabled={!ready}>Reset to 2024</button>
			<button onclick={() => reset(true)} disabled={!ready}>Start blank</button>
		</div>
	</div>
	<aside class="palette">
		<h2>Map Color Palette</h2>
		<p>Choose a color,<br />then select a state.</p>
		<div class="palette-head"><span>D</span><span>R</span></div>
		{#each labels as label, margin}
			<div class="palette-row">
				{#each parties as candidate}
					<button
						style:background={candidate.margins[margin]?.color}
						aria-label={`${candidate.name} ${label}`}
						aria-pressed={$SelectedCandidateStore.id === candidate.id && selectedMargin === margin}
						onclick={() => choose(candidate, margin)}
					></button>
				{/each}
				<span>{label}</span>
			</div>
		{/each}
		<button
			class="tossup"
			aria-pressed={$SelectedCandidateStore.id === $TossupCandidateStore.id}
			onclick={() => choose($TossupCandidateStore, 0)}><span></span>Toss-up</button
		>
		<div class="keyboard-edit">
			<label for="home-state">Edit a state</label>
			<select id="home-state" aria-label="Edit a state" bind:value={selectedRegion}
				><option value="">Select state</option>{#each $RegionsStore as region}<option
						value={region.id}>{region.longName || region.shortName}</option
					>{/each}</select
			>
			<button disabled={!selectedRegion} onclick={() => paint(selectedRegion)}>Apply color</button>
		</div>
		<a href="/maps" target="_top">Map Library →</a>
		<a href="/2028-presidential-election-interactive-map" target="_top">Full map editor ↗</a>
	</aside>
</div>

<style>
	:global(html:has(.home-map)),
	:global(body:has(.home-map)) {
		touch-action: pan-y;
	}
	.home-map {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 148px;
		gap: 24px;
		height: 100%;
		background: white;
		color: #222;
		font-family: Arial, sans-serif;
	}
	.map-main {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}
	.totals {
		display: flex;
		justify-content: space-between;
		gap: 16px;
	}
	.totals > div {
		display: flex;
		align-items: baseline;
		gap: 12px;
		font-size: 19px;
		font-weight: 700;
	}
	.totals strong {
		font-size: 32px;
		line-height: 1.2;
	}
	.republican {
		flex-direction: row-reverse;
		text-align: right;
	}
	.vote-bar {
		display: flex;
		height: 23px;
		margin-top: 7px;
		background: #eee;
	}
	.vote-bar span {
		transition: width 180ms ease;
	}
	.threshold {
		position: relative;
		height: 40px;
		font-size: 11px;
		color: #666;
		padding-top: 5px;
	}
	.threshold strong {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		text-align: center;
		line-height: 15px;
		color: #333;
		font-weight: 400;
	}
	.map-canvas {
		flex: 1;
		min-height: 0;
	}
	.map-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-top: 12px;
	}
	button {
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	button:focus-visible,
	a:focus-visible,
	select:focus-visible {
		outline: 3px solid #2764a7;
		outline-offset: 3px;
	}
	.map-actions button,
	.keyboard-edit button {
		border: 1px solid #b9bec5;
		padding: 7px 11px;
		border-radius: 3px;
		font-size: 12px;
		background: #f7f7f7;
	}
	.map-actions button:first-child {
		background: #245493;
		color: white;
		border-color: #245493;
	}
	.palette h2 {
		font-weight: 700;
		font-size: 14px;
		margin: 0 0 6px;
	}
	.palette p {
		font-size: 12px;
		line-height: 1.5;
		color: #777;
		margin: 0 0 12px;
	}
	.palette-head {
		display: grid;
		grid-template-columns: 28px 28px;
		gap: 5px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		margin-bottom: 4px;
	}
	.palette-row {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 7px;
		font-size: 12px;
	}
	.palette-row button {
		width: 28px;
		height: 25px;
		border: 1px solid #0002;
		border-radius: 2px;
	}
	.palette-row span {
		padding-left: 3px;
	}
	button[aria-pressed='true'] {
		outline: 2px solid #222;
		outline-offset: 2px;
	}
	.tossup {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 12px;
		margin: 12px 0 20px;
		padding: 2px;
	}
	.tossup span {
		width: 61px;
		height: 24px;
		background: #ccc;
		border: 1px solid #bbb;
		border-radius: 2px;
	}
	.keyboard-edit {
		border-top: 1px solid #ddd;
		padding-top: 14px;
		display: grid;
		gap: 7px;
		font-size: 12px;
	}
	.keyboard-edit label {
		font-weight: 700;
	}
	select {
		width: 100%;
		border: 1px solid #bbb;
		padding: 6px 2px;
		background: white;
		border-radius: 3px;
	}
	.palette a {
		display: block;
		margin-top: 18px;
		font-size: 12px;
		color: #245493;
		text-decoration: underline;
	}
	@media (max-width: 600px) {
		.home-map {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 1fr) auto;
			gap: 16px;
		}
		.totals > div {
			font-size: 13px;
			gap: 6px;
		}
		.totals strong {
			font-size: 27px;
		}
		.palette {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 10px 12px;
			border-top: 1px solid #ddd;
			padding: 12px 2px 4px;
		}
		.palette h2 {
			width: 100%;
			margin: 0;
		}
		.palette p,
		.palette-head {
			display: none;
		}
		.palette-row {
			margin: 0;
		}
		.palette-row button {
			width: 25px;
			height: 27px;
		}
		.tossup {
			margin: 0;
		}
		.tossup span {
			width: 28px;
		}
		.keyboard-edit {
			width: 100%;
			display: flex;
			align-items: center;
			padding-top: 10px;
		}
		.keyboard-edit select {
			flex: 1;
			min-width: 0;
			width: 90px;
		}
		.keyboard-edit label {
			display: none;
		}
		.palette a {
			margin: 0 10px 0 0;
		}
		.map-actions button {
			padding: 7px;
			font-size: 11px;
		}
	}
</style>
