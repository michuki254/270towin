<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const headlines = [
		{
			title: '2028 presidential map starts with seven core battlegrounds',
			date: 'June 18, 2026',
			href: '/2028-presidential-election'
		},
		{
			title: 'Senate control path runs through class II contests in 2026',
			date: 'June 18, 2026',
			href: '/2026-senate-election'
		},
		{
			title: 'House majority remains narrow heading into the next cycle',
			date: 'June 18, 2026',
			href: '/2026-house-election'
		},
		{
			title: 'Governor races will shape state trifectas before 2028',
			date: 'June 18, 2026',
			href: '/2026-governor-election'
		}
	];
</script>

<svelte:head>
	<title>Election News | Path to Win</title>
	<meta name="description" content="Election news, race analysis, and Path to Win dashboard updates." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>News</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Election News</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Race analysis, map updates, historical context, and election dashboard notes.
			</p>
		</header>

		<section class="grid gap-4">
			{#each headlines as item}
				<a href={item.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="text-xs font-black uppercase tracking-wide text-[#d83a45]">{item.date}</div>
					<h2 class="mt-2 text-xl font-black text-[#061a55]">{item.title}</h2>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
