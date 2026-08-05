<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const sections = [
		{
			title: 'Interactive Maps',
			links: [
				{ label: '2028 Presidential Election Hub', href: '/2028-presidential-election' },
				{ label: '2026 Senate Election Hub', href: '/2026-senate-election' },
				{ label: '2026 House Election Hub', href: '/2026-house-election' },
				{ label: '2026 Governor Election Hub', href: '/2026-governor-election' },
				{ label: '2028 Presidential Interactive Map', href: '/2028-presidential-election-interactive-map' },
				{ label: '2026 Senate Interactive Map', href: '/2026-senate-interactive-map' },
				{ label: '2026 House Interactive Map', href: '/2026-house-interactive-map' },
				{ label: '2026 Governor Interactive Map', href: '/2026-governor-interactive-map' },
				{ label: 'Elected Officials Interactive Map', href: '/elected-officials' },
				{ label: 'Map Library', href: '/maps' }
			]
		},
		{
			title: 'Current Results',
			links: [
				{ label: 'Election Results Archive', href: '/election-results' },
				{ label: '2024 Election Results Hub', href: '/2024-election-results' },
				{ label: '2024 Presidential Election Results', href: '/2024-presidential-election-results' },
				{ label: '2024 Senate Election Results', href: '/2024-senate-election-results' },
				{ label: '2024 House Election Results', href: '/2024-house-election-results' },
				{ label: '2024 Governor Election Results', href: '/2024-governor-election-results' },
				{ label: '2022 Election Results Hub', href: '/2022-election-results' },
				{ label: '2022 Senate Election Results', href: '/2022-senate-election-results' },
				{ label: '2022 House Election Results', href: '/2022-house-election-results' },
				{ label: '2022 Governor Election Results', href: '/2022-governor-election-results' },
				{ label: '2020 Presidential Election Results', href: '/2020-presidential-election-results' },
				{ label: '2020 Senate Election Results', href: '/2020-senate-election-results' },
				{ label: '2020 House Election Results', href: '/2020-house-election-results' },
				{ label: '2020 Governor Election Results', href: '/2020-governor-election-results' },
				{ label: '2016 Presidential Election Results', href: '/2016-presidential-election-results' }
			]
		},
		{
			title: 'Historical Elections',
			links: [
				{ label: 'Historical Presidential Elections', href: '/historical-presidential-elections' },
				{ label: 'Historical Senate Elections', href: '/historical-senate-elections' },
				{ label: 'Historical House Elections', href: '/historical-house-elections' },
				{ label: 'Historical Governor Elections', href: '/historical-governor-elections' },
				{ label: 'Historical Election Timeline', href: '/historical-timeline' },
				{ label: 'Presidential Election Margins', href: '/presidential-election-margins' },
				{ label: 'States Voting the Same Since', href: '/states-voting-same-since' },
				{ label: 'State Voting Since 1900', href: '/state-voting-since-1900' }
			]
		},
		{
			title: 'State Officials',
			links: [
				{ label: 'All State Elected Officials', href: '/states' },
				{ label: 'State Voting History', href: '/state-voting-history' },
				{ label: 'State Government Trifectas', href: '/state-trifectas' },
				{ label: 'State Primary Results', href: '/state-primary-results' },
				{ label: 'State Election Results', href: '/state-election-results' },
				{ label: 'Arkansas Officials', href: '/states/arkansas' },
				{ label: 'California Officials', href: '/states/california' },
				{ label: 'Florida Officials', href: '/states/florida' },
				{ label: 'Texas Officials', href: '/states/texas' }
			]
		},
		{
			title: 'Tools',
			links: [
				{ label: 'Election Simulator', href: '/simulator' },
				{ label: 'Election Countdown Clock', href: '/election-countdown-clock' },
				{ label: 'Poll Closing Times', href: '/poll-closing-times' },
				{ label: 'State Primary Dates', href: '/state-primary-dates' },
				{ label: 'Electoral College Tie Scenarios', href: '/electoral-college-tie' },
				{
					label: 'Maine and Nebraska Split Electoral Votes',
					href: '/maine-nebraska-split-electoral-votes'
				},
				{ label: 'Open Full App', href: '/app' }
			]
		},
		{
			title: 'House & Senate',
			links: [
				{ label: 'House Retirements', href: '/house-retirements' },
				{ label: 'House Crossover Districts', href: '/house-crossover-districts' },
				{ label: 'Uncontested House Races', href: '/uncontested-house-races' },
				{ label: 'What Happens in a 50-50 Senate?', href: '/senate-50-50' },
				{ label: 'Contact U.S. Senators', href: '/contact-senators' }
			]
		},
		{
			title: 'Map Utilities',
			links: [
				{ label: 'States Visited Map', href: '/states-visited-map' },
				{ label: 'Fantasy Election Maps', href: '/fantasy-election-maps' }
			]
		},
		{
			title: 'Forecasting',
			links: [
				{ label: 'Forecasts', href: '/forecasts' },
				{ label: 'Polls', href: '/polls' },
				{ label: 'Prediction Markets', href: '/prediction-markets' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'Election News', href: '/news' },
				{ label: 'About Path to Win', href: '/about' },
				{ label: 'Contact', href: '/contact' },
				{ label: 'Advertising', href: '/advertising' },
				{ label: 'Privacy Policy', href: '/privacy' }
			]
		}
	];
</script>

<svelte:head>
	<title>Site Map | Path to Win</title>
	<meta
		name="description"
		content="Browse Path to Win election maps, historical results, state officials dashboards, tools, and company pages."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Site Map</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Path to Win Site Map</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Quick access to election maps, results archives, historical data, state officials, and
				forecasting tools.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each sections as section}
				<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<h2 class="text-sm font-black uppercase tracking-wide text-[#001666]">{section.title}</h2>
					<ul class="mt-4 space-y-3 text-sm">
						{#each section.links as link}
							<li>
								<a class="font-semibold text-[#244999] hover:text-[#b60b03] hover:underline" href={link.href}>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
