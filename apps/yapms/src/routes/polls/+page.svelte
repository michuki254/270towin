<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const pollingSections = [
		{
			title: 'President',
			description: 'National and battleground state polling for the presidential race.',
			href: '/2028-presidential-election-interactive-map',
			color: '#244999'
		},
		{
			title: 'Senate',
			description: 'State-level Senate polling and chamber control signals.',
			href: '/2026-senate-interactive-map',
			color: '#d22532'
		},
		{
			title: 'House',
			description: 'Generic ballot, district polling, and competitive House race indicators.',
			href: '/2026-house-interactive-map',
			color: '#001666'
		},
		{
			title: 'Governor',
			description: 'Governor race polling, approval signals, and state forecast inputs.',
			href: '/2026-governor-interactive-map',
			color: '#c8be9a'
		}
	];

	const methodology = [
		'Poll averages should weight recency, sample quality, mode, population, and pollster reliability.',
		'State and district polling should be compared with fundamentals, historical partisanship, and candidate strength.',
		'Late-cycle polling changes should be surfaced separately from long-term trend movement.'
	];
</script>

<svelte:head>
	<title>Election Polls | Path to Win</title>
	<meta
		name="description"
		content="Election polling dashboard for presidential, Senate, House, and governor races on Path to Win."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Polls</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Election Polls</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				A polling hub for race-level signals across presidential, Senate, House, and governor
				elections. This page is ready for live polling averages and pollster-grade data feeds.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-2">
			{#each pollingSections as section}
				<a href={section.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="h-1.5 w-16 rounded-full" style={`background:${section.color}`}></div>
					<h2 class="mt-4 text-xl font-black text-[#061a55]">{section.title} Polls</h2>
					<p class="mt-2 text-sm leading-relaxed text-neutral-600">{section.description}</p>
				</a>
			{/each}
		</section>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-black text-[#061a55]">Polling Methodology Checklist</h2>
			<ul class="mt-4 grid gap-3 md:grid-cols-3">
				{#each methodology as item}
					<li class="rounded-md bg-[#f7f8fb] p-4 text-sm leading-relaxed text-neutral-700">{item}</li>
				{/each}
			</ul>
		</section>
	</main>
	<SiteFooter />
</div>
