<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const results = [
		{ office: 'President', winner: 'Republicans', total: '312 electoral votes', href: '/2024-presidential-election-results', color: '#d22532' },
		{ office: 'Senate', winner: 'Republicans', total: '53 seats', href: '/2024-senate-election-results', color: '#d22532' },
		{ office: 'House', winner: 'Republicans', total: '220 seats', href: '/2024-house-election-results', color: '#d22532' },
		{ office: 'Governor', winner: 'Republicans', total: '27 governorships', href: '/2024-governor-election-results', color: '#d22532' }
	];
</script>

<svelte:head>
	<title>2024 Election Results | Path to Win</title>
	<meta name="description" content="2024 U.S. election results hub for president, Senate, House, and governor races." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>2024 Results</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">2024 Election Results</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">Result hub for the 2024 presidential, congressional, and gubernatorial election cycle.</p>
		</header>
		<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#each results as result}
				<a href={result.href} class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#244999]">
					<div class="h-1.5 w-14 rounded-full" style={`background:${result.color}`}></div>
					<h2 class="mt-4 text-xl font-black text-[#061a55]">{result.office}</h2>
					<p class="mt-2 text-sm font-bold" style={`color:${result.color}`}>{result.winner} · {result.total}</p>
				</a>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
