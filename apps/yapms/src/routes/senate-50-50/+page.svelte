<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>What Happens in a 50-50 Senate? | Path to Win</title>
	<meta name="description" content="Explanation of 50-50 Senate control and vice presidential tie-breaking power." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb"><a href="/" class="hover:underline">Home</a><span class="mx-1">/</span><span>50-50 Senate</span></nav>
			<h1 class="text-3xl font-black text-[#001666]">What Happens in a 50-50 Senate?</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				When the Senate is evenly divided, the vice president can cast tie-breaking votes. Committee power and scheduling are often governed by an organizing resolution.
			</p>
		</header>
		<section class="grid gap-4 md:grid-cols-3">
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-3xl font-black text-[#001666]">50-50</div><p class="mt-2 text-sm text-neutral-700">Equal party seats in the Senate.</p></div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-3xl font-black text-[#b60b03]">VP</div><p class="mt-2 text-sm text-neutral-700">Vice president breaks floor ties.</p></div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm"><div class="text-3xl font-black text-[#244999]">51</div><p class="mt-2 text-sm text-neutral-700">Functional control threshold in most dashboards.</p></div>
		</section>
		<a class="w-fit rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/2026-senate-interactive-map">Open Senate Map</a>
	</main>
	<SiteFooter />
</div>
