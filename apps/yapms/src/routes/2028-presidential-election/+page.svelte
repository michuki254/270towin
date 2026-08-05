<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	let startMode = $state<'2024map' | 'blank'>('2024map');
	const mapEmbedUrl = $derived(`/app/usa/presidential/2028/${startMode}?embed=1`);
	const mapFullUrl = $derived(`/app/usa/presidential/2028/${startMode}`);

	const forecastBlocks = [
		{ label: 'Democrats', value: 226, color: '#2E5AAC' },
		{ label: 'Toss-up', value: 81, color: '#C8BE9A' },
		{ label: 'Republicans', value: 231, color: '#D83A45' }
	];

	const battlegrounds = [
		{ state: 'Pennsylvania', ev: 19, note: 'The clearest tipping-point target in most paths to 270.' },
		{ state: 'Michigan', ev: 15, note: 'Blue-wall state with a large suburban and union vote.' },
		{ state: 'Wisconsin', ev: 10, note: 'Small margins make it a high-leverage map state.' },
		{ state: 'Georgia', ev: 16, note: 'Metro Atlanta growth keeps the state competitive.' },
		{ state: 'Arizona', ev: 11, note: 'Coalition shifts make it central to western Sun Belt paths.' },
		{ state: 'Nevada', ev: 6, note: 'A compact but decisive state in close national maps.' }
	];

	const candidates = [
		{
			name: 'Kamala Harris',
			party: 'Democratic',
			tag: 'National profile',
			image: '/candidate-headshots/presidential/kamala-harris.jpg'
		},
		{
			name: 'Gavin Newsom',
			party: 'Democratic',
			tag: 'Large-state executive',
			image: '/candidate-headshots/presidential/gavin-newsom.jpg'
		},
		{
			name: 'JD Vance',
			party: 'Republican',
			tag: 'Incumbent VP track',
			image: '/candidate-headshots/presidential/jd-vance.jpg'
		},
		{
			name: 'Ron DeSantis',
			party: 'Republican',
			tag: 'Governor lane',
			image: '/candidate-headshots/presidential/ron-desantis.jpg'
		}
	];

	const tools = [
		{ label: 'Full Interactive Map', href: '/2028-presidential-election-interactive-map' },
		{ label: 'Forecast Dashboard', href: '/forecasts' },
		{ label: 'Polls', href: '/polls' },
		{ label: 'Prediction Markets', href: '/prediction-markets' },
		{ label: 'Tie Scenarios', href: '/electoral-college-tie' },
		{ label: 'Split Electoral Votes', href: '/maine-nebraska-split-electoral-votes' }
	];
</script>

<svelte:head>
	<title>2028 Presidential Election | Interactive Electoral Map | Path to Win</title>
	<meta
		name="description"
		content="Explore the 2028 presidential election with an interactive Electoral College map, battleground states, candidate context, forecasts, polls, and path-to-270 tools."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="flex-1">
		<section class="border-b border-neutral-200 bg-white">
			<div class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[0.9fr_1.4fr]">
				<div class="flex flex-col justify-between gap-5">
					<div>
						<nav class="mb-3 text-xs text-neutral-500" aria-label="Breadcrumb">
							<a href="/" class="hover:underline">Home</a>
							<span class="mx-1">/</span>
							<span>2028 President</span>
						</nav>
						<p class="text-xs font-black uppercase tracking-[0.18em] text-[#b60b03]">
							Interactive Electoral College
						</p>
						<h1 class="mt-2 text-4xl font-black tracking-tight text-[#061a55] md:text-5xl">
							2028 Presidential Election
						</h1>
						<p class="mt-3 max-w-xl text-sm leading-relaxed text-neutral-650">
							Start with the 2024 map or a blank Electoral College board, then test the state-by-state
							path to 270. Use the map beside this panel for quick planning or open the full map for
							the complete editor.
						</p>
					</div>

					<div class="grid grid-cols-3 overflow-hidden rounded-md border border-neutral-200 text-center text-white">
						{#each forecastBlocks as block}
							<div class="px-3 py-4" style={`background:${block.color}`}>
								<div class="text-3xl font-black leading-none">{block.value}</div>
								<div class="mt-1 text-[11px] font-black uppercase tracking-wide opacity-90">
									{block.label}
								</div>
							</div>
						{/each}
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<a
							href={mapFullUrl}
							class="rounded-md bg-[#b60b03] px-4 py-3 text-center text-sm font-black text-white shadow-sm hover:bg-[#8f0802]"
						>
							Open Full Map
						</a>
						<a
							href="/2028-presidential-election-interactive-map"
							class="rounded-md border border-[#244999] bg-white px-4 py-3 text-center text-sm font-black text-[#244999] hover:bg-[#f3f6fd]"
						>
							View Forecast Hub
						</a>
					</div>
				</div>

				<div class="min-w-0">
					<div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">
								Build Your 2028 Map
							</h2>
							<p class="text-xs text-neutral-500">Switch the starting point and click states inside the map.</p>
						</div>
						<div class="inline-flex w-fit overflow-hidden rounded-md border border-neutral-300 text-sm">
							<button
								type="button"
								class={`px-3 py-1.5 font-bold ${
									startMode === '2024map'
										? 'bg-[#244999] text-white'
										: 'bg-white text-neutral-700 hover:bg-neutral-100'
								}`}
								aria-pressed={startMode === '2024map'}
								onclick={() => (startMode = '2024map')}
							>
								2024 Result
							</button>
							<button
								type="button"
								class={`border-l border-neutral-300 px-3 py-1.5 font-bold ${
									startMode === 'blank'
										? 'bg-[#244999] text-white'
										: 'bg-white text-neutral-700 hover:bg-neutral-100'
								}`}
								aria-pressed={startMode === 'blank'}
								onclick={() => (startMode = 'blank')}
							>
								Blank Map
							</button>
						</div>
					</div>
					<div class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
						{#key startMode}
							<iframe
								src={mapEmbedUrl}
								title="2028 Presidential Election Interactive Electoral College Map"
								class="block w-full"
								style="height: min(68vh, 650px); min-height: 430px; border: 0;"
							></iframe>
						{/key}
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 xl:grid-cols-[1.35fr_0.75fr]">
			<div class="space-y-5">
				<section>
					<div class="mb-3 flex items-end justify-between gap-3">
						<div>
							<h2 class="text-xl font-black text-[#061a55]">Battleground States</h2>
							<p class="text-sm text-neutral-600">The highest-leverage states in early 2028 scenarios.</p>
						</div>
						<div class="hidden text-xs font-bold uppercase tracking-wide text-neutral-500 sm:block">
							270 needed to win
						</div>
					</div>
					<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{#each battlegrounds as state}
							<article class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
								<div class="flex items-start justify-between gap-3">
									<div>
										<h3 class="font-black text-[#061a55]">{state.state}</h3>
										<p class="mt-2 text-sm leading-relaxed text-neutral-600">{state.note}</p>
									</div>
									<div class="rounded bg-[#f0ead8] px-2 py-1 text-xs font-black text-[#655c3f]">
										{state.ev} EV
									</div>
								</div>
							</article>
						{/each}
					</div>
				</section>

				<section>
					<div class="mb-3">
						<h2 class="text-xl font-black text-[#061a55]">Candidate Watch</h2>
						<p class="text-sm text-neutral-600">Early-cycle names to track as the 2028 field develops.</p>
					</div>
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{#each candidates as candidate}
							<article class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
								<div class="flex h-36 items-center justify-center bg-[#e9edf5]">
									<img
										src={candidate.image}
										alt=""
										class="h-full w-full object-cover"
										loading="lazy"
										aria-hidden="true"
									/>
								</div>
								<div class="p-3">
									<div
										class={`text-[11px] font-black uppercase tracking-wide ${
											candidate.party === 'Democratic' ? 'text-[#244999]' : 'text-[#b60b03]'
										}`}
									>
										{candidate.party}
									</div>
									<h3 class="mt-1 font-black text-[#061a55]">{candidate.name}</h3>
									<p class="mt-1 text-xs text-neutral-600">{candidate.tag}</p>
								</div>
							</article>
						{/each}
					</div>
				</section>
			</div>

			<aside class="space-y-5">
				<section class="rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="border-b border-neutral-200 px-4 py-3">
						<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Election Tools</h2>
					</div>
					<div class="grid gap-px bg-neutral-200">
						{#each tools as tool}
							<a
								href={tool.href}
								class="bg-white px-4 py-3 text-sm font-bold text-[#244999] hover:bg-[#f7f8fb]"
							>
								{tool.label}
							</a>
						{/each}
					</div>
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#061a55]">Path Math</h2>
					<div class="mt-4 space-y-4">
						<div>
							<div class="flex justify-between text-xs font-bold text-neutral-600">
								<span>Democratic baseline</span>
								<span>226 / 270</span>
							</div>
							<div class="mt-1 h-2 overflow-hidden rounded bg-neutral-200">
								<div class="h-full bg-[#244999]" style="width: 83.7%"></div>
							</div>
						</div>
						<div>
							<div class="flex justify-between text-xs font-bold text-neutral-600">
								<span>Republican baseline</span>
								<span>231 / 270</span>
							</div>
							<div class="mt-1 h-2 overflow-hidden rounded bg-neutral-200">
								<div class="h-full bg-[#d22532]" style="width: 85.6%"></div>
							</div>
						</div>
						<p class="text-sm leading-relaxed text-neutral-600">
							The map starts from a competitive baseline. Move battlegrounds in the editor to see
							which side reaches 270 first.
						</p>
					</div>
				</section>
			</aside>
		</section>
	</main>
	<SiteFooter />
</div>
