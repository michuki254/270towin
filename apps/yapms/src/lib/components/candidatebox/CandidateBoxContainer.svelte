<script lang="ts">
	import CandidateBox from './CandidateBox.svelte';
	import { TossupCandidateStore, CandidatesStore } from '$lib/stores/Candidates';
	import { CandidateCounts } from '$lib/stores/regions/Regions';
	const {
		selectable = true,
		transitions = true,
		margins = true,
		freezeCounts = false
	}: {
		selectable?: boolean;
		transitions?: boolean;
		margins?: boolean;
		freezeCounts?: boolean;
	} = $props();

	let frozenCountKey = $state('');
	let frozenCounts = $state(new Map<string, number>());

	const candidates = $derived([$TossupCandidateStore, ...$CandidatesStore]);
	const countKey = $derived(candidates.map((candidate) => candidate.id).join('|'));

	$effect(() => {
		if (!freezeCounts) {
			return;
		}

		if (frozenCountKey !== countKey) {
			frozenCountKey = countKey;
			frozenCounts = new Map();
		}

		if (frozenCounts.size === 0) {
			const snapshot = new Map(
				candidates.map((candidate) => [candidate.id, $CandidateCounts.get(candidate.id) ?? 0])
			);
			const total = [...snapshot.values()].reduce((sum, count) => sum + count, 0);
			if (total > 0) {
				frozenCounts = snapshot;
			}
		}
	});
</script>

<div
	class="flex flex-row flex-wrap items-start justify-center relative pointer-events-none gap-1 shrink-0 py-1 z-10"
	class:mx-14={margins}
>
	<CandidateBox
		candidate={$TossupCandidateStore}
		{selectable}
		{transitions}
		countOverride={freezeCounts ? frozenCounts.get($TossupCandidateStore.id) : undefined}
	/>
	{#each $CandidatesStore as candidate}
		<CandidateBox
			{candidate}
			{selectable}
			{transitions}
			countOverride={freezeCounts ? frozenCounts.get(candidate.id) : undefined}
		/>
	{/each}
</div>
