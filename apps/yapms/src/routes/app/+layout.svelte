<script lang="ts">
	import '$lib/styles/global.css';
	import { browser } from '$app/environment';
	import ClearMapModal from '$lib/components/modals/clearmapmodal/ClearMapModal.svelte';
	import SplitRegionModal from '$lib/components/modals/splitregionmodal/SplitRegionModal.svelte';
	import EditRegionModal from '$lib/components/modals/editregionmodal/EditRegionModal.svelte';
	import OptionsModal from '$lib/components/modals/optionsmodal/OptionsModal.svelte';
	import ModeModal from '$lib/components/modals/modemodal/ModeModal.svelte';
	import LoadingErrorModal from '$lib/components/modals/loadingerrormodal/LoadingErrorModal.svelte';
	import ShareModal from '$lib/components/modals/sharemodal/ShareModal.svelte';
	import CandidateModal from '$lib/components/modals/candidatemodal/CandidateModal.svelte';
	import { InteractionStore } from '$lib/stores/Interaction';
	import {
		CandidatesStore,
		TossupCandidateStore,
		handleCandidateSelectionShortcut
	} from '$lib/stores/Candidates';
	import { CandidateCounts } from '$lib/stores/regions/Regions';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import { reapplyPanZoom } from '$lib/utils/applyPanZoom';
	import MapChartContainer from '$lib/components/mapchartcontainer/MapChartContainer.svelte';
	import EditCandidateModal from '$lib/components/modals/candidatemodal/EditCandidateModal.svelte';
	import EditTossupModal from '$lib/components/modals/candidatemodal/EditTossupModal.svelte';
	import AddCandidateModal from '$lib/components/modals/candidatemodal/AddCandidateModal.svelte';
	import AddCustomColorModal from '$lib/components/modals/candidatemodal/customcolors/AddCustomColorModal.svelte';
	import EditCustomColorModal from '$lib/components/modals/candidatemodal/customcolors/EditCustomColorModal.svelte';
	import RegionTooltip from '$lib/components/tooltips/RegionTooltip.svelte';
	import NavigateHomeModal from '$lib/components/modals/navigatehomemodal/NavigateHomeModal.svelte';
	import { PresentationModeStore } from '$lib/stores/PresentationMode';
	import PresentationNavBar from '$lib/components/navbar/PresentationNavBar.svelte';
	import ToolsModal from '$lib/components/modals/toolsmodal/ToolsModal.svelte';
	import {
		ModeModalStore,
		handleModeInteractions,
		handleModalOpenInteractions
	} from '$lib/stores/Modals';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	function handleKeyDown(event: KeyboardEvent) {
		$InteractionStore.set(event.code, true);

		if (event.target instanceof Element && event.target.id === 'map-div') {
			if (event.code === 'KeyR') {
				reapplyPanZoom();
			}
			handleCandidateSelectionShortcut(event.code);
		}

		if (event.target instanceof Element && event.target.tagName !== 'INPUT') {
			if (!event.ctrlKey && !$ModeModalStore.open) {
				handleModalOpenInteractions(event.code);
			}
			if ($ModeModalStore.open) {
				handleModeInteractions(event.code);
			}
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		$InteractionStore.delete(event.code);
	}

	function handleOnFocusOut() {
		$InteractionStore.clear();
	}

	$effect(() => {
		if (!browser || window.parent === window) {
			return;
		}

		window.parent.postMessage(
			{
				type: 'yapms:candidate-counts',
				tossup: $CandidateCounts.get($TossupCandidateStore.id) ?? 0,
				candidates: $CandidatesStore.map((candidate) => ({
					id: candidate.id,
					name: candidate.name,
					count: $CandidateCounts.get(candidate.id) ?? 0
				}))
			},
			window.location.origin
		);
	});
</script>

<svelte:head>
	<title>YAPms</title>
	<meta name="robots" content="nosnippet" />
</svelte:head>

<svelte:window
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:resize={reapplyPanZoom}
	on:focusout={handleOnFocusOut}
	on:beforeunload|preventDefault
/>

<div class="flex flex-col h-full">
	{#if $PresentationModeStore.enabled}
		<PresentationNavBar />
	{:else}
		<NavBar />
	{/if}
	<div class="flex flex-row h-full overflow-hidden">
		<MapChartContainer>
			{@render children()}
		</MapChartContainer>
	</div>
</div>

<NavigateHomeModal />

<ClearMapModal />

<CandidateModal />

<AddCandidateModal />

<EditCandidateModal />

<EditTossupModal />

<EditRegionModal />

<SplitRegionModal />

<AddCustomColorModal />

<EditCustomColorModal />

<OptionsModal />

<ModeModal />

<LoadingErrorModal />

<ShareModal />

<ToolsModal />

<RegionTooltip />
