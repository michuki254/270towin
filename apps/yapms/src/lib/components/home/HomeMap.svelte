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
	import senateResults from '$lib/data/senate2026Results.json';

	let {
		children,
		election = 'presidential',
		resultBaseline = false
	}: {
		children: Snippet;
		election?: 'presidential' | 'senate';
		resultBaseline?: boolean;
	} = $props();
	let customScenario = $state(false);
	const showingResults = $derived(resultBaseline && !customScenario);
	const selectedResult = $derived(
		senateResults.races.find((race) => race.region === selectedRegion)
	);
	const uncalledStates = senateResults.races
		.filter((race) => race.party === null)
		.map((race) => race.state)
		.join(' and ');
	const resultsChecked =
		new Date(senateResults.checkedAt).toLocaleString('en-US', {
			timeZone: 'UTC',
			dateStyle: 'medium',
			timeStyle: 'short'
		}) + ' UTC';
	const isSenate = $derived(election === 'senate');
	const totalSeats = $derived(isSenate ? 100 : 538);
	const majority = $derived(isSenate ? 51 : 270);
	const editorUrl = $derived(
		isSenate ? '/2026-senate-interactive-map' : '/2028-presidential-election-interactive-map'
	);
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
	const ready = $derived(total === totalSeats);
	const editableRegions = $derived(
		$RegionsStore.filter((region) => !region.disabled && !region.locked && !region.permaLocked)
	);

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
		if (showingResults) {
			if (editableRegions.some((region) => region.id === regionID)) selectedRegion = regionID;
			return;
		}
		RegionsStore.update((regions) =>
			regions.map((region) =>
				region.id === regionID && !region.locked && !region.disabled && !region.permaLocked
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
		customScenario = blank;
		RegionsStore.update((regions) =>
			regions.map((region) =>
				region.disabled || region.locked || region.permaLocked
					? region
					: {
							...region,
							candidates: blank
								? [{ candidate: $TossupCandidateStore, count: region.value, margin: 0 }]
								: (baseline.get(region.id) ?? region.candidates).map((c) => ({ ...c }))
						}
			)
		);
	}
</script>

<div class="home-map" class:results-map={resultBaseline} data-theme="light">
	<div class="map-main" id="map-chart-div">
		{#if resultBaseline}
			<div class="view-status" aria-live="polite">
				<strong>{showingResults ? 'Reported results' : 'Custom scenario'}</strong>
				<span
					>{showingResults
						? `${35 - senateResults.won.uncalled} of 35 races called · ${resultsChecked}`
						: 'Your edits are not reported election results.'}</span
				>
			</div>
		{/if}
		<div
			class="totals"
			aria-live="polite"
			aria-label={isSenate ? 'Senate seat totals' : 'Electoral vote totals'}
		>
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
						style:width={`${(($CandidateCountsMargins.get(candidate.id)?.[i] ?? 0) / totalSeats) * 100}%`}
					></span>{/each}
			{/each}
			<span
				style:background={$TossupCandidateStore.margins[0].color}
				style:width={`${(tossup / totalSeats) * 100}%`}
			></span>
			{#each parties.slice(1) as candidate}
				{#each [...candidate.margins].reverse() as margin, i}<span
						style:background={margin.color}
						style:width={`${(($CandidateCountsMargins.get(candidate.id)?.[candidate.margins.length - i - 1] ?? 0) / totalSeats) * 100}%`}
					></span>{/each}
			{/each}
		</div>
		<div class="threshold">
			<span>{tossup} {showingResults ? 'uncalled' : 'toss-up'}</span><strong
				>▲<br />{majority} {isSenate ? 'for a majority' : 'to win'}</strong
			>
		</div>
		{#if isSenate}<p class="holdover-note">
				Includes 34 Democratic-caucus and 31 Republican seats not on the 2026 ballot.
			</p>{/if}
		<!-- The map's SVG has its own pointer interactions; the select below also supports keyboard editing. -->
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div class="map-canvas" onclickcapture={paintMap}>{@render children()}</div>
		<div class="map-actions">
			{#if showingResults}<button onclick={() => (customScenario = true)} disabled={!ready}
					>Customize scenario</button
				>{/if}
			<button onclick={() => ($ShareModalStore.open = true)} disabled={!ready}
				>Share / export map</button
			>
			{#if !showingResults}
				<button onclick={() => reset()} disabled={!ready}
					>{resultBaseline
						? 'Reset to results'
						: isSenate
							? 'Reset to pre-election'
							: 'Reset to 2024'}</button
				>
				<button onclick={() => reset(true)} disabled={!ready}>Start blank</button>
			{/if}
		</div>
	</div>
	<aside class="palette">
		{#if showingResults}
			<h2>Race results</h2>
			<p>Select a state to see its reported winner.</p>
			<div class="result-legend">
				<span><i style:background="#1C408C"></i>Democratic</span>
				<span><i style:background="#BF1D29"></i>Republican</span>
				{#if senateResults.won.I}<span><i style:background="#766482"></i>Independent / other</span
					>{/if}
				<span><i style:background="#C9C09B"></i>Uncalled</span>
				<span><i style:background="#eeeeee"></i>No election</span>
			</div>
			<div class="result-details">
				<label for="result-state">Race by state</label>
				<select id="result-state" bind:value={selectedRegion}>
					<option value="">Select state</option>
					{#each senateResults.races as race}<option value={race.region}
							>{race.state}{race.region.endsWith('-S') ? ' (special)' : ''}</option
						>{/each}
				</select>
				<div aria-live="polite">
					{#if selectedResult}
						<strong>{selectedResult.state}</strong>
						<p>
							{selectedResult.winner ?? 'Not yet called'}{#if selectedResult.party}<br
								/>{selectedResult.party === 'D'
									? 'Democratic'
									: selectedResult.party === 'R'
										? 'Republican'
										: 'Independent / other'} winner{/if}
						</p>
						<a href={selectedResult.url} target="_blank" rel="noopener noreferrer">Race details ↗</a
						>
					{:else}<p>
							{uncalledStates
								? `${uncalledStates} remain uncalled in this snapshot.`
								: 'All 35 races have been called.'}
						</p>{/if}
				</div>
			</div>
			<p class="result-source">
				Source: <a href={senateResults.referenceUrl} target="_blank" rel="noopener noreferrer"
					>Decision Desk HQ via 270toWin</a
				>. Reported calls, not certified final results.
			</p>
		{:else}
			<h2>Map Color Palette</h2>
			<p>Choose a color,<br />then select a state.</p>
			<div class="palette-head"><span>D</span><span>R</span></div>
			{#each labels as label, margin}
				<div class="palette-row">
					{#each parties as candidate}
						<button
							style:background={candidate.margins[margin]?.color}
							aria-label={`${candidate.name} ${label}`}
							aria-pressed={$SelectedCandidateStore.id === candidate.id &&
								selectedMargin === margin}
							onclick={() => choose(candidate, margin)}
						></button>
					{/each}
					<span>{label}</span>
				</div>
			{/each}
			<button
				class="tossup"
				aria-pressed={$SelectedCandidateStore.id === $TossupCandidateStore.id}
				onclick={() => choose($TossupCandidateStore, 0)}
				><span style:background={$TossupCandidateStore.margins[0].color}></span>Toss-up</button
			>
			<div class="keyboard-edit">
				<label for="home-state">Edit a state</label>
				<select id="home-state" aria-label="Edit a state" bind:value={selectedRegion}
					><option value="">Select state</option>{#each editableRegions as region}<option
							value={region.id}>{region.longName || region.shortName}</option
						>{/each}</select
				>
				<button disabled={!selectedRegion} onclick={() => paint(selectedRegion)}>Apply color</button
				>
			</div>
		{/if}
		<a href="/maps" target="_top">Map Library →</a>
		<a href={editorUrl} target="_top">Full map editor ↗</a>
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
	.view-status {
		display: grid;
		gap: 4px;
		margin-bottom: 14px;
		font-size: 12px;
		color: #62666c;
	}
	.view-status strong {
		color: #245493;
		font-size: 14px;
	}
	.results-map .map-canvas :global([map-type='regions'] [disabled]) {
		fill: #eeeeee !important;
		fill-opacity: 1 !important;
	}
	.result-legend {
		display: grid;
		gap: 9px;
		font-size: 12px;
		margin: 14px 0 18px;
	}
	.result-legend span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.result-legend i {
		display: inline-block;
		width: 18px;
		height: 18px;
		border: 1px solid #0001;
	}
	.result-details {
		display: grid;
		gap: 9px;
		font-size: 12px;
		border-top: 1px solid #ddd;
		padding-top: 14px;
	}
	.result-details label {
		font-weight: 700;
	}
	.result-details strong {
		display: block;
		margin: 4px 0 6px;
	}
	.result-details a {
		margin-top: 4px;
	}
	.palette .result-source {
		margin-top: 20px;
		font-size: 10px;
	}
	.palette .result-source a {
		display: inline;
		font-size: inherit;
	}
	.map-main {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
	}
	.totals {
		display: flex;
		flex-wrap: wrap;
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
	.holdover-note {
		font-size: 11px;
		line-height: 1.5;
		color: #666;
		margin: 0 0 8px;
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
		.result-legend {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin: 0;
		}
		.result-details {
			width: 100%;
		}
		.palette .result-details p,
		.palette .result-source {
			display: block;
		}
		.palette .result-source {
			margin: 0;
		}
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
