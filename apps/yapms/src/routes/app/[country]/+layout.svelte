<script lang="ts">
	import { MapInsetsStore } from '$lib/stores/MapInsetsStore';
	import { applyAutoStroke, applyPanZoom } from '$lib/utils/applyPanZoom';
	import { loadRegionsForApp } from '$lib/utils/loadRegions';
	import { loadSidebarTitle, loadSidebarSources } from '$lib/stores/SideBar';
	import { loadMapIdentifier } from '$lib/stores/MapIdentifier';
	import { loadActionGroups } from '$lib/stores/ActionGroups';
	import { RegionTextsStore } from '$lib/stores/RegionTextsStore';
	import { setRegionStrokeColor } from '$lib/stores/RegionStrokeColorStore';
	import { page } from '$app/state';
	import {
		getMap,
		drawLoadedMap,
		getUserMap,
		setLoadedMapFromJson,
		gotoLoadedMap
	} from '$lib/stores/LoadedMap';
	import { browser } from '$app/environment';

	let { children } = $props();

	const requestedMap = $derived(page.url.pathname.replace('/app/', '').replaceAll('/', '-'));

	const map = $derived.by(() => {
		if (browser === false) {
			return undefined;
		}

		return fetch(`/api/map-svg/${requestedMap}`).then((response) =>
			response.ok ? response.text() : undefined
		);
	});

	function setupMap(node: HTMLDivElement) {
		const svg = node.querySelector<SVGElement>('svg');
		if (svg !== null) {
			applyPanZoom(svg);
			applyAutoStroke(svg);
			setRegionStrokeColor(svg);
			loadSidebarTitle(svg);
			loadSidebarSources(svg);
			loadMapIdentifier(svg);
			loadActionGroups(svg);
		}
		loadRegionsForApp(node);

		const mapID = page.url.searchParams.get('m');
		const userMapID = page.url.searchParams.get('um');
		const useStore = page.url.searchParams.has('s');
		if (mapID) {
			getMap(mapID)
				.then(setLoadedMapFromJson)
				.then(() => gotoLoadedMap())
				.then(drawLoadedMap);
		} else if (userMapID) {
			getUserMap(userMapID)
				.then(setLoadedMapFromJson)
				.then(() => gotoLoadedMap())
				.then(drawLoadedMap);
		} else if (useStore) {
			drawLoadedMap();
		}
	}
</script>

{#if map !== undefined}
	{#await map}
		<div class="flex justify-center w-full h-full">
			<span class="loading loading-ring loading-lg text-primary"></span>
		</div>
	{:then map}
		{#if map !== undefined}
			<div
				use:setupMap
				id="map-div"
				class="overflow-hidden h-full outline-none"
				class:insets-hidden={$MapInsetsStore.hidden}
				class:texts-hidden={$RegionTextsStore.hidden}
			>
				{@html map}
			</div>
		{:else}
			<div class="flex justify-center items-center w-full h-full">
				<h1>Map "{requestedMap}" not found!</h1>
			</div>
		{/if}
	{/await}
{:else}
	<div class="flex justify-center items-center w-full h-full">
		<span class="loading loading-ring loading-lg text-primary"></span>
	</div>
{/if}

{@render children()}
