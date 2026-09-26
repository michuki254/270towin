<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	type MapSnapshot = {
		office: string;
		year: string;
		kicker: string;
		control: string;
		href: string;
		left: number;
		leftLabel: string;
		middle: number;
		middleLabel: string;
		middleNote: string;
		right: number;
		rightLabel: string;
		basis: string;
		summary: string;
		scope: string;
		thresholdNote: string;
		sourceLabel: string;
		sourceHref: string;
		additionalSource?: { label: string; href: string };
	};

	const snapshots: MapSnapshot[] = [
		{
			office: 'President',
			year: '2028',
			kicker: 'Last certified result',
			control: '270 electoral votes',
			href: '/2028-presidential-election',
			left: 226,
			leftLabel: 'Harris · Democratic',
			middle: 0,
			middleLabel: 'Other',
			middleNote: 'No other electoral votes in the 2024 result.',
			right: 312,
			rightLabel: 'Trump · Republican',
			basis: 'The official 2024 Electoral College result is the starting point for the 2028 map.',
			summary:
				'No 2028 presidential forecast is published here. Use the map to explore hypothetical paths from the most recent certified result.',
			scope: '2024 Electoral College result: 226 Democratic and 312 Republican electoral votes.',
			thresholdNote: 'A candidate needs 270 of 538 electoral votes to win.',
			sourceLabel: 'Official 2024 results — National Archives',
			sourceHref: 'https://www.archives.gov/electoral-college/2024'
		},
		{
			office: 'Senate',
			year: '2026',
			kicker: 'Current chamber balance',
			control: '51 seats',
			href: '/2026-senate-interactive-map',
			left: 47,
			leftLabel: 'Democratic-aligned',
			middle: 0,
			middleLabel: 'Other',
			middleNote: 'Both independents caucus with Democrats.',
			right: 53,
			rightLabel: 'Republican',
			basis: 'Current Senate roster reviewed September 26, 2026.',
			summary:
				'The balance combines 45 Democrats and two independents who caucus with them, against 53 Republicans. The interactive map lets you test the 2026 races.',
			scope: '35 seats are on the 2026 ballot: 33 regular Class II seats and two special elections.',
			thresholdNote:
				'A party generally needs 51 seats, or 50 with the vice president able to break ties.',
			sourceLabel: 'Current senators and party division — U.S. Senate',
			sourceHref: 'https://www.senate.gov/senators/',
			additionalSource: {
				label: 'Class II roster — U.S. Senate',
				href: 'https://www.senate.gov/senators/Class_II.htm'
			}
		},
		{
			office: 'House',
			year: '2026',
			kicker: 'Current chamber balance',
			control: '218 seats',
			href: '/2026-house-interactive-map',
			left: 214,
			leftLabel: 'Democratic',
			middle: 3,
			middleLabel: 'Independent + vacant',
			middleNote: 'One independent member and two vacant seats.',
			right: 218,
			rightLabel: 'Republican',
			basis: 'House Clerk member and vacancy records reviewed September 26, 2026.',
			summary:
				'The Clerk lists 218 Republicans, 214 Democrats, one independent, and two vacancies. The map covers all 435 districts and can be assigned to explore possible outcomes.',
			scope: 'All 435 voting House seats are up in the 2026 general election.',
			thresholdNote: 'With all 435 seats filled, a party needs 218 seats for a majority.',
			sourceLabel: 'Member list and vacancies — Office of the House Clerk',
			sourceHref: 'https://clerk.house.gov/Members/ViewMemberList',
			additionalSource: {
				label: 'Current vacancies — Office of the House Clerk',
				href: 'https://clerk.house.gov/Members/ViewVacancies'
			}
		},
		{
			office: 'Governor',
			year: '2026',
			kicker: 'Current state balance',
			control: '26 governorships',
			href: '/2026-governor-interactive-map',
			left: 24,
			leftLabel: 'Democratic',
			middle: 0,
			middleLabel: 'Other',
			middleNote: 'No other-party governors in the current 50-state balance.',
			right: 26,
			rightLabel: 'Republican',
			basis: 'Current governor roster reviewed September 26, 2026.',
			summary:
				'Twenty-four states have Democratic governors and 26 have Republican governors. Democrats need a net gain of two states to reach a majority.',
			scope: 'Thirty-six of the 50 states elect a governor in 2026.',
			thresholdNote: 'A party needs 26 of the 50 state governorships for a majority.',
			sourceLabel: 'Current governors — National Governors Association',
			sourceHref: 'https://www.nga.org/governors/'
		}
	];

	const total = (item: MapSnapshot) => item.left + item.middle + item.right;
	const currentCycle = snapshots.filter((item) => item.year === '2026');
	const closestCurrentBalance = currentCycle.reduce((closest, item) =>
		Math.abs(item.left - item.right) < Math.abs(closest.left - closest.right) ? item : closest
	);
</script>

<svelte:head>
	<title>Election Forecast Tools &amp; Interactive Maps | Path to Win</title>
	<meta
		name="description"
		content="Use interactive election forecast tools to explore paths to control. Compare current Senate, House, and governor balances with the official 2024 presidential result."
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
						<span>Election maps</span>
					</nav>
					<p class="text-xs font-black uppercase tracking-[0.18em] text-[#b60b03]">
						Election control
					</p>
					<h1 class="mt-2 text-4xl font-black tracking-tight text-[#061a55] md:text-5xl">
						Election Forecast Tools &amp; Control Scenarios
					</h1>
					<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
						Use the interactive maps to test paths to control. The 2026 bars show current officeholder
						balances, and the 2028 presidential map starts from the official 2024 result. These starting
						points are not forecasts or win probabilities. Current rosters were reviewed
						<time datetime="2026-09-26">September 26, 2026</time>.
					</p>
					<div class="mt-5 grid gap-3 sm:grid-cols-3">
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#061a55]">{snapshots.length}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
								Interactive maps
							</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-3xl font-black text-[#655c3f]">{currentCycle.length}</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
								2026 election maps
							</div>
						</div>
						<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4">
							<div class="text-2xl font-black text-[#b60b03]">
								{closestCurrentBalance.office} · {Math.abs(closestCurrentBalance.left - closestCurrentBalance.right)}
							</div>
							<div class="mt-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
								Closest current 2026 party balance (seats or governorships)
							</div>
						</div>
					</div>
				</div>
				<aside class="overflow-hidden rounded-md border border-neutral-200 bg-[#061a55] text-white shadow-sm">
					<div class="p-5">
						<div class="text-xs font-black uppercase tracking-wide text-[#9db8e0]">
							2028 presidential map starting point
						</div>
						<div class="mt-2 grid grid-cols-2 gap-3 text-center">
							<div class="rounded bg-[#244999] p-3">
								<div class="text-3xl font-black">226</div>
								<div class="text-xs font-bold">Harris · D</div>
							</div>
							<div class="rounded bg-[#d22532] p-3">
								<div class="text-3xl font-black">312</div>
								<div class="text-xs font-bold">Trump · R</div>
							</div>
						</div>
						<p class="mt-3 text-sm leading-relaxed text-[#dce6fb]">
							Official 2024 Electoral College result. No 2028 candidate forecast is published on this page.
						</p>
						<a
							href="/2028-presidential-election"
							class="mt-4 inline-flex rounded bg-[#b60b03] px-4 py-2 text-sm font-black text-white hover:bg-[#8f0802]"
						>
							Explore the 2028 map
						</a>
					</div>
				</aside>
			</div>
		</section>

		<section class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6">
			{#each snapshots as item}
				<article class="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
					<div class="p-4 md:p-5">
						<div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
							<div>
								<div class="text-xs font-black uppercase tracking-wide text-[#b60b03]">
									{item.year} {item.kicker}
								</div>
								<h2 class="mt-1 text-2xl font-black text-[#061a55]">{item.office} map scenario</h2>
								<p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{item.summary}</p>
							</div>
							<div class="rounded-md bg-[#f7f8fb] px-3 py-2 text-sm font-black text-[#061a55]">
								{item.control}
							</div>
						</div>

						<p class="mt-4 text-xs font-semibold text-neutral-500">{item.basis}</p>
						<div
							class="mt-3 flex h-9 overflow-hidden rounded bg-neutral-200 text-center text-sm font-black text-white"
							role="img"
							aria-label={`${item.leftLabel}: ${item.left}; ${item.middleLabel}: ${item.middle}; ${item.rightLabel}: ${item.right}`}
						>
							<div
								class="flex items-center justify-center bg-[#244999]"
								style={`width:${(item.left / total(item)) * 100}%`}
							>
								{item.left}
							</div>
							{#if item.middle > 0}
								<div
									class="flex items-center justify-center bg-[#c8be9a] text-[#302a18]"
									style={`width:${(item.middle / total(item)) * 100}%`}
								>
									{item.middle}
								</div>
							{/if}
							<div
								class="flex items-center justify-center bg-[#d22532]"
								style={`width:${(item.right / total(item)) * 100}%`}
							>
								{item.right}
							</div>
						</div>
						<div class="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs font-semibold text-neutral-600">
							<span>{item.leftLabel}: {item.left}</span>
							{#if item.middle > 0}
								<span>{item.middleLabel}: {item.middle} ({item.middleNote})</span>
							{/if}
							<span>{item.rightLabel}: {item.right}</span>
						</div>

						<div class="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
							<div class="rounded-md bg-[#f7f8fb] p-3">
								<div class="text-xs font-black uppercase tracking-wide text-neutral-500">
									What the map covers
								</div>
								<p class="mt-1 text-sm leading-relaxed text-neutral-700">{item.scope}</p>
								<div class="mt-2 flex flex-col items-start gap-2">
									<a
										href={item.sourceHref}
										target="_blank"
										rel="noreferrer"
										class="text-xs font-semibold text-[#244999] underline hover:text-[#001666]"
									>
										{item.sourceLabel}
									</a>
									{#if item.additionalSource}
										<a
											href={item.additionalSource.href}
											target="_blank"
											rel="noreferrer"
											class="text-xs font-semibold text-[#244999] underline hover:text-[#001666]"
										>
											{item.additionalSource.label}
										</a>
									{/if}
								</div>
							</div>
							<div class="rounded-md border border-neutral-200 bg-white p-3">
								<div class="text-xs font-black uppercase tracking-wide text-neutral-500">Control math</div>
								<p class="mt-1 text-sm leading-relaxed text-neutral-700">{item.thresholdNote}</p>
							</div>
						</div>

						<div class="mt-5 flex flex-wrap gap-2">
							<a
								href={item.href}
								class="rounded bg-[#244999] px-4 py-2 text-sm font-black text-white hover:bg-[#183a78]"
							>
								Open interactive map
							</a>
							<a
								href="/maps"
								class="rounded border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-100"
							>
								Browse all maps
							</a>
						</div>
					</div>
				</article>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
