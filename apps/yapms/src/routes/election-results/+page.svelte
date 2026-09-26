<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const results = [
		{ label: '2024 Election Results Hub', href: '/2024-election-results', party: 'Republican', count: '4 offices' },
		{ label: '2024 Presidential Results', href: '/2024-presidential-election-results', party: 'Republican', count: '312 EV' },
		{ label: '2024 Senate Results', href: '/2024-senate-election-results', party: 'Republican', count: '53 seats' },
		{ label: '2024 House Results', href: '/2024-house-election-results', party: 'Republican', count: '220 seats' },
		{ label: '2024 Governor Results', href: '/2024-governor-election-results', party: 'Republican', count: '27 govs' },
		{ label: '2022 Election Results Hub', href: '/2022-election-results', party: 'Republican', count: 'midterms' },
		{ label: '2022 Senate Results', href: '/2022-senate-election-results', party: 'Democratic', count: '51 seats' },
		{ label: '2022 House Results', href: '/2022-house-election-results', party: 'Republican', count: '222 seats' },
		{ label: '2022 Governor Results', href: '/2022-governor-election-results', party: 'Republican', count: '26 govs' },
		{ label: '2020 Presidential Results', href: '/2020-presidential-election-results', party: 'Democratic', count: '306 EV' },
		{ label: '2020 Senate Results', href: '/2020-senate-election-results', party: 'Democratic', count: '50 seats + VP' },
		{ label: '2020 House Results', href: '/2020-house-election-results', party: 'Democratic', count: '222 seats' },
		{ label: '2020 Governor Results', href: '/2020-governor-election-results', party: 'Republican', count: '27 govs' },
		{ label: '2016 Presidential Results', href: '/2016-presidential-election-results', party: 'Republican', count: '304 EV' }
	];

	const color = (party: string) => (party === 'Democratic' ? '#244999' : '#d22532');
</script>

<svelte:head>
	<title>Election Results Archive | Path to Win</title>
	<meta name="description" content="Election results archive for presidential, Senate, House, and governor races." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>Election Results</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Election Results Archive</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Browse result dashboards by year and office, with links into historical interactive maps.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each results as result}
				<a href={result.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="h-1.5 w-16 rounded-full" style={`background:${color(result.party)}`}></div>
					<h2 class="mt-4 text-xl font-black text-[#061a55]">{result.label}</h2>
					<p class="mt-2 text-sm font-bold" style={`color:${color(result.party)}`}>{result.party} advantage · {result.count}</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
