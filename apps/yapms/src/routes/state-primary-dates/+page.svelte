<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const primaryWindows = [
		{ month: 'February', note: 'Early presidential caucus and primary contests begin the nomination calendar.' },
		{ month: 'March', note: 'Super Tuesday and major delegate allocation windows usually occur here.' },
		{ month: 'May', note: 'Large state congressional and statewide primaries accelerate.' },
		{ month: 'June', note: 'Many states hold federal, gubernatorial, and state legislative primaries.' },
		{ month: 'August', note: 'Late-cycle primaries often decide competitive general-election nominees.' },
		{ month: 'September', note: 'Final primary states and runoffs close the nomination calendar.' }
	];
</script>

<svelte:head>
	<title>State Primary Dates | Path to Win</title>
	<meta name="description" content="State primary date reference page for U.S. elections." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>State Primary Dates</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">State Primary Dates</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				A routing page for state primary calendars. It is structured for official state election
				date feeds and cycle-specific primary tables.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-2">
			{#each primaryWindows as item}
				<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<div class="text-xl font-black text-[#061a55]">{item.month}</div>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{item.note}</p>
				</div>
			{/each}
		</section>
	</main>
	<SiteFooter />
</div>
