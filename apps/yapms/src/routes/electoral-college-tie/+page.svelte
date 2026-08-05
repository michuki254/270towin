<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Electoral College Tie Scenarios | Path to Win</title>
	<meta
		name="description"
		content="Explore what happens if the Electoral College ends in a 269-269 tie."
	/>
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Electoral College Tie</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Electoral College Tie Scenarios</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				If no presidential candidate receives a majority of electoral votes, the election moves
				to a contingent election in Congress under the Twelfth Amendment.
			</p>
		</header>

		<section class="grid gap-4 md:grid-cols-3">
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-3xl font-black text-[#001666]">269</div>
				<p class="mt-2 text-sm text-neutral-700">Common Electoral College tie number in the current 538-vote system.</p>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-3xl font-black text-[#b60b03]">House</div>
				<p class="mt-2 text-sm text-neutral-700">The House chooses the president by state delegation vote.</p>
			</div>
			<div class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
				<div class="text-3xl font-black text-[#244999]">Senate</div>
				<p class="mt-2 text-sm text-neutral-700">The Senate chooses the vice president if needed.</p>
			</div>
		</section>

		<a class="w-fit rounded bg-[#b60b03] px-4 py-2 text-sm font-bold text-white hover:bg-[#8f0802]" href="/2028-presidential-election-interactive-map">
			Build a Tie Scenario
		</a>
	</main>
	<SiteFooter />
</div>
