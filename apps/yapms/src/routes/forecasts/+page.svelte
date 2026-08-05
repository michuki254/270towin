<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	type Forecast = {
		office: string;
		year: string;
		control: string;
		href: string;
		dem: number;
		tossup: number;
		rep: number;
		image: string;
		imageAlt: string;
		kicker: string;
		summary: string;
		keyRaces: string[];
		thresholdNote: string;
	};

	const forecasts: Forecast[] = [
		{
			office: 'President',
			year: '2028',
			control: '270 electoral votes',
			href: '/2028-presidential-election',
			dem: 226,
			tossup: 81,
			rep: 231,
			image: '/candidate-headshots/presidential/kamala-harris.jpg',
			imageAlt: 'Kamala Harris',
			kicker: 'Electoral College',
			summary:
				'The early presidential baseline starts with both parties short of 270 and a compact battleground set deciding the map.',
			keyRaces: ['Pennsylvania', 'Michigan', 'Wisconsin', 'Georgia', 'Arizona', 'Nevada'],
			thresholdNote: 'The winner needs 270 of 538 electoral votes.'
		},
		{
			office: 'Senate',
			year: '2026',
			control: '51 seats',
			href: '/2026-senate-interactive-map',
			dem: 47,
			tossup: 0,
			rep: 53,
			image: '/candidate-headshots/senate/jon-ossoff.jpg',
			imageAlt: 'Jon Ossoff',
			kicker: 'Chamber Control',
			summary:
				'Republicans begin with the clearer control position, while Democrats need a near-perfect defensive map plus pickups.',
			keyRaces: ['Georgia', 'North Carolina', 'Maine', 'Michigan', 'Texas', 'Iowa'],
			thresholdNote: 'A party usually needs 51 seats, or 50 with the vice presidency.'
		},
		{
			office: 'House',
			year: '2026',
			control: '218 seats',
			href: '/2026-house-interactive-map',
			dem: 213,
			tossup: 18,
			rep: 204,
			image: '/candidate-headshots/house/mike-lawler.jpg',
			imageAlt: 'Mike Lawler',
			kicker: 'District Map',
			summary:
				'The House forecast is built around a narrow majority environment where a small group of crossover and suburban seats can decide control.',
			keyRaces: ['NY-17', 'WA-03', 'PA-01', 'CA-22', 'NC redraw', 'Frontline suburbs'],
			thresholdNote: 'A majority requires 218 seats when all 435 seats are filled.'
		},
		{
			office: 'Governor',
			year: '2026',
			control: '26 governorships',
			href: '/2026-governor-interactive-map',
			dem: 23,
			tossup: 4,
			rep: 23,
			image: '/party-logos/republicans.png',
			imageAlt: 'Republican Party logo',
			kicker: 'State Executives',
			summary:
				'The governor map is balanced, with control hinging on a few open seats and states where federal partisanship does not fully predict outcomes.',
			keyRaces: ['Georgia', 'Michigan', 'Nevada', 'Wisconsin', 'Arizona', 'Pennsylvania'],
			thresholdNote: 'A party needs 26 governorships for a national majority.'
		}
	];

	const total = (item: { dem: number; tossup: number; rep: number }) => item.dem + item.tossup + item.rep;
	const tossupTotal = forecasts.reduce((sum, item) => sum + item.tossup, 0);
	const activeMaps = forecasts.length;
	const closestRace = forecasts.reduce((closest, item) => {
		const gap = Math.abs(item.dem - item.rep);
		return gap < Math.abs(closest.dem - closest.rep) ? item : closest;
	}, forecasts[0]);
</script>

<svelte:head>
	<title>Election Forecasts | Maps, Ratings and Control Paths | Path to Win</title>
	<meta
		name="description"
		content="Detailed election forecast dashboard for presidential, Senate, House, and governor control scenarios with interactive maps, images, battlegrounds, and path-to-control notes."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="flex-1">
		<section class="border-b border-neutral-200 bg-white">
			<div class="mx-auto grid w-full max-w-7xl gap-6 px-4 py-7 lg:grid-cols-[1fr_420px] lg:items-center">
				<div>
					<nav class="mb-3 text-xs text-neutral-500" aria-label="Breadcrumb">
						<a href="/" class="hover:underline">Home</a>
						<span class="mx-1">/</span>
						<span>Forecasts</span>
					</nav>
					<p class="text-xs font-black uppercase tracking-[0.18em] text-[#b60b03]">Election Control Center</p>
					<h1 class="mt-2 text-4xl font-black tracking-tight text-[#061a55] md:text-5xl">
						Election Forecasts
					</h1>
					<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
						Compare the major election maps in one place. Each forecast combines a control threshold,
						baseline map, toss-up pool, race notes, and a direct path into the interactive editor.
					</p>
					<div class="mt-5 grid gap-3 sm:grid-cols-3">
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#061a55]">{activeMaps}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">Active Maps</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#655c3f]">{tossupTotal}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">Toss-up Units</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#b60b03]">{closestRace.office}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">Closest Balance</div>
						</div>
					</div>
				</div>
				<div class="overflow-hidden rounded-md border border-neutral-200 bg-[#061a55] text-white shadow-sm">
					<div class="grid grid-cols-2">
						<img
							src="/candidate-headshots/presidential/jd-vance.jpg"
							alt=""
							class="h-44 w-full object-cover object-top"
							aria-hidden="true"
						/>
						<img
							src="/candidate-headshots/presidential/gretchen-whitmer.jpg"
							alt=""
							class="h-44 w-full object-cover object-top"
							aria-hidden="true"
						/>
					</div>
					<div class="p-4">
						<div class="text-xs font-black uppercase tracking-wide text-[#9db8e0]">Featured race</div>
						<div class="mt-1 text-xl font-black">2028 Presidential Map</div>
						<p class="mt-2 text-sm leading-relaxed text-[#dce6fb]">
							Start from the 2024 result, move battleground states, and test which coalition reaches 270.
						</p>
						<a
							href="/2028-presidential-election"
							class="mt-4 inline-flex rounded bg-[#b60b03] px-4 py-2 text-sm font-black text-white hover:bg-[#8f0802]"
						>
							Open 2028 Forecast
						</a>
					</div>
				</div>
			</div>
		</section>

		<section class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6">
			{#each forecasts as item}
				<article class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="grid lg:grid-cols-[220px_1fr]">
						<a href={item.href} class="block bg-[#e9edf5]">
							<img
								src={item.image}
								alt={item.imageAlt}
								class="h-56 w-full object-cover object-top lg:h-full"
								loading="lazy"
							/>
						</a>
						<div class="p-4 md:p-5">
							<div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
								<div>
									<div class="text-xs font-black uppercase tracking-wide text-[#b60b03]">
										{item.year} {item.kicker}
									</div>
									<h2 class="mt-1 text-2xl font-black text-[#061a55]">{item.office} Forecast</h2>
									<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{item.summary}</p>
								</div>
								<div class="rounded-md bg-[#f7f8fb] px-3 py-2 text-sm font-black text-[#061a55]">
									{item.control}
								</div>
							</div>

							<div class="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm font-black">
								<span class="text-[#244999]">D {item.dem}</span>
								<div class="flex h-9 overflow-hidden rounded bg-neutral-200 text-center text-white">
									<div
										class="flex items-center justify-center bg-[#244999]"
										style={`width:${(item.dem / total(item)) * 100}%`}
									>
										{item.dem}
									</div>
									<div
										class="flex items-center justify-center bg-[#c8be9a] text-[#302a18]"
										style={`width:${(item.tossup / total(item)) * 100}%`}
									>
										{item.tossup || ''}
									</div>
									<div
										class="flex items-center justify-center bg-[#d22532]"
										style={`width:${(item.rep / total(item)) * 100}%`}
									>
										{item.rep}
									</div>
								</div>
								<span class="text-[#d22532]">R {item.rep}</span>
							</div>

							<div class="mt-5 grid gap-4 lg:grid-cols-[1fr_240px]">
								<div>
									<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Key races</div>
									<div class="mt-2 flex flex-wrap gap-2">
										{#each item.keyRaces as race}
											<span class="rounded bg-[#eef1f5] px-2.5 py-1 text-xs font-bold text-neutral-700">
												{race}
											</span>
										{/each}
									</div>
								</div>
								<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-3">
									<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Control math</div>
									<p class="mt-1 text-sm leading-relaxed text-neutral-700">{item.thresholdNote}</p>
								</div>
							</div>

							<div class="mt-5 flex flex-wrap gap-2">
								<a
									href={item.href}
									class="rounded bg-[#244999] px-4 py-2 text-sm font-black text-white hover:bg-[#183a78]"
								>
									Open Interactive Forecast
								</a>
								<a
									href="/maps"
									class="rounded border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-100"
								>
									All Maps
								</a>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
