<script lang="ts">
	import MapCardGrid from '$lib/components/mapcard/MapCardGrid.svelte';
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
	import MoreMapsModal from '$lib/components/modals/moremapsmodal/MoreMapsModal.svelte';
	import UsaMapCard from '$lib/components/mapcard/mapcards/USAMapCard.svelte';
	import CanMapCard from '$lib/components/mapcard/mapcards/CANMapCard.svelte';
	import BraMapCard from '$lib/components/mapcard/mapcards/BRAMapCard.svelte';
	import MexMapCard from '$lib/components/mapcard/mapcards/MEXMapCard.svelte';
	import DeuMapCard from '$lib/components/mapcard/mapcards/DEUMapCard.svelte';
	import DnkMapCard from '$lib/components/mapcard/mapcards/DNKMapCard.svelte';
	import FraMapCard from '$lib/components/mapcard/mapcards/FRAMapCard.svelte';
	import GbrMapCard from '$lib/components/mapcard/mapcards/GBRMapCard.svelte';
	import ItaMapCard from '$lib/components/mapcard/mapcards/ITAMapCard.svelte';
	import NldMapCard from '$lib/components/mapcard/mapcards/NLDMapCard.svelte';
	import NzlMapCard from '$lib/components/mapcard/mapcards/NZLMapCard.svelte';
	import AusMapCard from '$lib/components/mapcard/mapcards/AUSMapCard.svelte';
	import UsaCongressionalMapCard from '$lib/components/mapcard/mapcards/USACongressionalMapCard.svelte';
	import UsaPresidentialMapCard from '$lib/components/mapcard/mapcards/USAPresidentialMapCard.svelte';
	import UsaStateSenateMapCard from '$lib/components/mapcard/mapcards/USAStateSenateMapCard.svelte';
	import UsaStateHouseMapCard from '$lib/components/mapcard/mapcards/USAStateHouseMapCard.svelte';
	import CanProvincesMapCard from '$lib/components/mapcard/mapcards/CANProvincesMapCard.svelte';
	import ZafMapCard from '$lib/components/mapcard/mapcards/ZAFMapCard.svelte';
	import GlbMapCard from '$lib/components/mapcard/mapcards/GLBMapCard.svelte';
	import KorMapCard from '$lib/components/mapcard/mapcards/KORMapCard.svelte';
	import JpnMapCard from '$lib/components/mapcard/mapcards/JPNMapCard.svelte';
	import CanHistoricalMapCard from '$lib/components/mapcard/mapcards/CANHistoricalMapCard.svelte';
	import PrtMapCard from '$lib/components/mapcard/mapcards/PRTMapCard.svelte';
	import IrlMapCard from '$lib/components/mapcard/mapcards/IRLMapCard.svelte';
	import GrcMapCard from '$lib/components/mapcard/mapcards/GRCMapCard.svelte';
	import NorMapCard from '$lib/components/mapcard/mapcards/NORMapCard.svelte';
	import SvnMapCard from '$lib/components/mapcard/mapcards/SVNMapCard.svelte';
	import IndMapCard from '$lib/components/mapcard/mapcards/INDMapCard.svelte';
	import UsaCanMapCard from '$lib/components/mapcard/mapcards/USACANMapCard.svelte';
	import EspMapCard from '$lib/components/mapcard/mapcards/ESPMapCard.svelte';
	import PolMapCard from '$lib/components/mapcard/mapcards/POLMapCard.svelte';
	import AusStatesMapCard from '$lib/components/mapcard/mapcards/AUSStatesMapCard.svelte';
	import GbrHistoricalMapCard from '$lib/components/mapcard/mapcards/GBRHistoricalMapCard.svelte';
	import YapMapCard from '$lib/components/mapcard/mapcards/YAPMapCard.svelte';
	import AutMapCard from '$lib/components/mapcard/mapcards/AUTMapCard.svelte';
	import YRCMapCard from '$lib/components/mapcard/mapcards/YRCMapCard.svelte';
	import HUNMapCard from '$lib/components/mapcard/mapcards/HUNMapCard.svelte';
	import SweMapCard from '$lib/components/mapcard/mapcards/SWEMapCard.svelte';
</script>

<svelte:head>
	<title>Interactive Map Library | 270 to Win</title>
	<meta
		name="description"
		content="Browse interactive political and election maps for countries, states, historical elections, and fantasy scenarios."
	/>
</svelte:head>

<div class="h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
		<header>
			<nav class="text-xs text-neutral-500 mb-2" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Maps</span>
			</nav>
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">Explore Interactive Maps</h1>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700 max-w-3xl">
				Browse interactive election maps, political geography maps, historical maps, and fantasy
				scenarios.
			</p>
		</header>

		<section>
			<MapCardGrid>
				<UsaMapCard />
				<GbrMapCard />
				<AusMapCard />
				<CanMapCard />

				<AutMapCard />
				<BraMapCard />
				<DnkMapCard />
				<FraMapCard />
				<DeuMapCard />
				<GrcMapCard />
				<HUNMapCard />
				<IndMapCard />
				<IrlMapCard />
				<ItaMapCard />
				<JpnMapCard />
				<MexMapCard />
				<NldMapCard />
				<NzlMapCard />
				<NorMapCard />
				<PolMapCard />
				<PrtMapCard />
				<SvnMapCard />
				<ZafMapCard />
				<KorMapCard />
				<EspMapCard />
				<SweMapCard />

				<GlbMapCard />
			</MapCardGrid>
		</section>

		<section id="state-maps">
			<MapCardGrid title="State & Provincial Maps">
				<UsaStateHouseMapCard />
				<UsaStateSenateMapCard />
				<CanProvincesMapCard />
				<AusStatesMapCard />
			</MapCardGrid>
		</section>

		<section id="historical">
			<MapCardGrid title="Historical Maps">
				<UsaCongressionalMapCard />
				<UsaPresidentialMapCard />
				<GbrHistoricalMapCard />
				<CanHistoricalMapCard />
			</MapCardGrid>
		</section>

		<section id="fantasy">
			<MapCardGrid title="Fantasy">
				<UsaCanMapCard />
				<YapMapCard />
				<YRCMapCard />
			</MapCardGrid>
		</section>
	</main>
	<SiteFooter />
</div>

<MoreMapsModal />
