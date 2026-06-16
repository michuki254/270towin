<script lang="ts">
	import MapCardGrid from '$lib/components/mapcard/MapCardGrid.svelte';
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

	// --- 270towin-style home page content ---
	const headlines = [
		{
			title: 'Live Results: Oklahoma and DC Primaries, Georgia and Alabama Primary Runoffs',
			date: 'June 15, 2026',
			blurb:
				'Georgia Republicans will select nominees for competitive U.S. Senate and Governor elections in November'
		},
		{
			title: 'Live Results: California Congressional District 14 and Other June 16 Special Elections',
			date: 'June 15, 2026',
			blurb:
				'The special election winner will complete the term of Democrat Eric Swalwell, who resigned in April'
		},
		{
			title: 'Live Results: Frisco, Texas Mayoral Runoff Election',
			date: 'June 13, 2026',
			blurb: 'No candidate received a majority of the vote on May 2'
		},
		{
			title: 'Live Results: Maine, Nevada, North Dakota, and South Carolina Primaries',
			date: 'June 8, 2026',
			blurb:
				'Several of the more high profile primaries likely to be decided by ranked choice or runoff'
		},
		{
			title:
				'Live Results: California, Iowa, Montana, New Jersey, New Mexico, and South Dakota Primaries',
			date: 'June 1, 2026',
			blurb: 'California holds many of the most consequential primaries of the night'
		}
	];

	const latestHeadline = headlines[0].title;

	const predictionMarkets = [
		{ party: 'Republicans', pct: 54, color: '#d22532' },
		{ party: 'Democrats', pct: 46, color: '#244999' }
	];

	// Electoral vote counter (538 total, 270 to win)
	const evDem = 226;
	const evRep = 219;
	const evTossup = 538 - evDem - evRep;
</script>

<svelte:head>
	<title>270 to Win - 2028 Presidential Election Interactive Map</title>
	<meta
		name="description"
		content="2028 presidential election interactive map. Create your own 2028 election forecast with our interactive map."
	/>
</svelte:head>

<div class="flex flex-col h-full overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<!-- Latest banner -->
	<div class="bg-[#b60b03] text-white text-sm">
		<div class="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-3">
			<span
				class="shrink-0 font-bold uppercase tracking-wide bg-white text-[#b60b03] px-2 py-0.5 rounded text-xs"
			>
				Latest
			</span>
			<a href="#headlines" class="truncate hover:underline">{latestHeadline}</a>
		</div>
	</div>

	<!-- Hero: interactive map + prediction markets -->
	<main class="max-w-6xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
		<section class="flex-1 min-w-0">
			<h1 class="text-2xl md:text-3xl font-bold text-[#001666]">
				2028 Presidential Election Interactive Map
			</h1>
			<p class="italic text-neutral-500 mt-1">This isn&rsquo;t a popularity contest&trade;</p>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700">
				It will take 270 electoral votes to win the 2028 presidential election. Click states on this
				interactive map to create your own 2028 election forecast. Create a specific match-up by
				clicking the party and/or names near the electoral vote counter. Use the buttons below the
				map to share your forecast or embed it into a web page.
			</p>

			<!-- Electoral vote counter -->
			<div class="mt-4 rounded-md overflow-hidden border border-neutral-300 bg-white">
				<div class="grid grid-cols-3 text-center text-white font-bold">
					<div class="bg-[#244999] py-2">
						<div class="text-2xl leading-none">{evDem}</div>
						<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Democrats</div>
					</div>
					<div class="bg-[#001666] py-2 flex flex-col justify-center">
						<div class="text-xs uppercase tracking-wide opacity-80">270 to win</div>
						<div class="text-[11px] opacity-70">{evTossup} toss-up</div>
					</div>
					<div class="bg-[#d22532] py-2">
						<div class="text-2xl leading-none">{evRep}</div>
						<div class="text-xs font-semibold uppercase tracking-wide opacity-90">Republicans</div>
					</div>
				</div>
				<div class="flex h-2">
					<div class="bg-[#244999]" style={`width:${(evDem / 538) * 100}%`}></div>
					<div class="bg-neutral-400" style={`width:${(evTossup / 538) * 100}%`}></div>
					<div class="bg-[#d22532]" style={`width:${(evRep / 538) * 100}%`}></div>
				</div>
			</div>

			<!-- Interactive map centerpiece: live YAPMS 2028 simulator -->
			<div class="mt-4 rounded-md overflow-hidden border border-neutral-300 bg-white shadow-sm">
				<iframe
					src="/app/usa/presidential/2028/2024map?embed=1"
					title="2028 Presidential Election Interactive Map"
					class="w-full block"
					style="height: 560px; border: 0;"
					loading="lazy"
				></iframe>
			</div>

			<!-- Map controls (mirrors 270towin's palette + actions) -->
			<div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
				<span class="font-semibold text-neutral-600 mr-1">Map Color Palette:</span>
				<span class="px-2 py-1 rounded bg-[#001666] text-white">Safe</span>
				<span class="px-2 py-1 rounded bg-[#244999] text-white">Likely</span>
				<span class="px-2 py-1 rounded bg-[#5a7fcc] text-white">Leans</span>
				<span class="px-2 py-1 rounded bg-[#aac4ee] text-neutral-800">Tilt</span>
				<span class="px-2 py-1 rounded bg-neutral-300 text-neutral-800">Toss-up</span>
				<div class="ml-auto flex gap-2">
					<a
						href="/2028-presidential-election-interactive-map"
						class="px-3 py-1 rounded bg-[#b60b03] text-white font-semibold hover:bg-[#8a0802]"
					>
						Open Interactive Map
					</a>
					<a href="#maps" class="px-3 py-1 rounded border border-neutral-400 hover:bg-neutral-100">
						Map Library
					</a>
				</div>
			</div>
		</section>

		<!-- Prediction Markets sidebar -->
		<aside class="lg:w-72 shrink-0 flex flex-col gap-4">
			<div class="border border-neutral-300 rounded-md bg-white overflow-hidden">
				<div class="bg-[#001666] text-white px-3 py-2 font-semibold text-sm">Prediction Markets</div>
				<div class="p-3 text-sm">
					<p class="font-medium text-neutral-800">
						Which party will win the 2028 Presidential Election?
					</p>
					<div class="mt-3 flex flex-col gap-3">
						{#each predictionMarkets as m}
							<div>
								<div class="flex justify-between text-xs font-semibold text-neutral-700">
									<span>{m.party}</span>
									<span>{m.pct}%</span>
								</div>
								<div class="mt-1 h-2.5 rounded bg-neutral-200 overflow-hidden">
									<div
										class="h-full rounded"
										style={`width:${m.pct}%;background:${m.color}`}
									></div>
								</div>
							</div>
						{/each}
					</div>
					<p class="mt-3 text-[11px] text-neutral-500">
						Probability based on the most recent &lsquo;yes&rsquo; trade for each party as of June 16,
						2026. May not total 100%.
					</p>
				</div>
			</div>
		</aside>
	</main>

	<!-- Explore interactive maps (YAPMS map library) -->
	<section id="maps" class="bg-white border-t border-neutral-200">
		<div class="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
			<div>
				<h2 class="text-xl font-bold text-[#001666] mb-4">Explore Interactive Maps</h2>
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
			</div>

			<div id="state-maps">
				<MapCardGrid title="State & Provincial Maps">
					<UsaStateHouseMapCard />
					<UsaStateSenateMapCard />
					<CanProvincesMapCard />
					<AusStatesMapCard />
				</MapCardGrid>
			</div>

			<div id="historical">
				<MapCardGrid title="Historical Maps">
					<UsaCongressionalMapCard />
					<UsaPresidentialMapCard />
					<GbrHistoricalMapCard />
					<CanHistoricalMapCard />
				</MapCardGrid>
			</div>

			<div id="fantasy">
				<MapCardGrid title="Fantasy">
					<UsaCanMapCard />
					<YapMapCard />
					<YRCMapCard />
				</MapCardGrid>
			</div>
		</div>
	</section>

	<!-- Headlines -->
	<section id="headlines" class="bg-[#eef1f5] border-t border-neutral-200">
		<div class="max-w-6xl mx-auto px-4 py-8">
			<h2 class="text-xl font-bold text-[#001666] mb-4">Headlines</h2>
			<ul class="flex flex-col divide-y divide-neutral-200 bg-white rounded-md border border-neutral-200">
				{#each headlines as h}
					<li class="p-4">
						<a href="#headlines" class="font-semibold text-[#244999] hover:underline">{h.title}</a>
						<div class="mt-1 text-xs text-neutral-500">{h.date}</div>
						<p class="mt-1 text-sm text-neutral-700">{h.blurb}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-[#001666] text-[#9db8e0] mt-auto">
		<div class="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
			<div class="flex items-baseline gap-1">
				<span class="text-xl font-extrabold text-white">270</span>
				<span class="text-base font-semibold">toWin</span>
			</div>
			<p class="text-xs text-center">
				It will take 270 electoral votes to win the 2028 presidential election.
			</p>
			<div class="text-xs">&copy; 2026 270toWin &middot; Powered by YAPMS</div>
		</div>
	</footer>
</div>

<MoreMapsModal />
