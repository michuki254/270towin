<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const windows = [
		{ time: '7:00 PM ET', states: 'Georgia, Indiana, Kentucky, South Carolina, Vermont, Virginia' },
		{ time: '7:30 PM ET', states: 'North Carolina, Ohio, West Virginia' },
		{ time: '8:00 PM ET', states: 'Alabama, Connecticut, Florida, Maine, Maryland, Massachusetts, Mississippi, Missouri, New Hampshire, New Jersey, Oklahoma, Pennsylvania, Rhode Island, Tennessee' },
		{ time: '9:00 PM ET', states: 'Arizona, Colorado, Kansas, Louisiana, Michigan, Minnesota, Nebraska, New Mexico, New York, North Dakota, South Dakota, Texas, Wisconsin, Wyoming' },
		{ time: '10:00 PM ET', states: 'Iowa, Montana, Nevada, Utah' },
		{ time: '11:00 PM ET', states: 'California, Idaho, Oregon, Washington' },
		{ time: '12:00 AM ET', states: 'Alaska, Hawaii' }
	];
</script>

<svelte:head>
	<title>Poll Closing Times | Path to Win</title>
	<meta name="description" content="Election night poll closing times by state for U.S. elections." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
		<header>
			<nav class="mb-2 text-xs text-neutral-500" aria-label="Breadcrumb">
				<a href="/" class="hover:underline">Home</a>
				<span class="mx-1">/</span>
				<span>Poll Closing Times</span>
			</nav>
			<h1 class="text-3xl font-black text-[#001666]">Poll Closing Times</h1>
			<p class="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
				Election night timing reference by Eastern Time. Some states span multiple time zones or
				have local exceptions, so final official guidance should come from election authorities.
			</p>
		</header>

		<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
			<div class="divide-y divide-neutral-100">
				{#each windows as window}
					<div class="grid gap-2 py-4 md:grid-cols-[150px_1fr]">
						<div class="font-black text-[#b60b03]">{window.time}</div>
						<div class="text-sm leading-relaxed text-neutral-700">{window.states}</div>
					</div>
				{/each}
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
