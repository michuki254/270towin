<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Privacy Policy | Path to Win</title>
	<meta name="description" content="Privacy policy for Path to Win election maps and data dashboards." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
		<nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-1">/</span>
			<span>Privacy</span>
		</nav>
		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h1 class="text-3xl font-black text-[#001666]">Privacy Policy</h1>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Path to Win is designed around public election information, map interactions, and
				forecasting tools. We avoid requesting personal information unless it is needed for a
				user-initiated action such as contacting us.
			</p>
			<h2 class="mt-6 text-lg font-black text-[#001666]">Information We May Collect</h2>
			<p class="mt-2 leading-relaxed text-neutral-700">
				Basic analytics, browser information, and voluntary contact details may be used to
				improve site reliability, understand page usage, respond to messages, and protect the
				service from abuse.
			</p>
			<h2 class="mt-6 text-lg font-black text-[#001666]">Data Sources</h2>
			<p class="mt-2 leading-relaxed text-neutral-700">
				Election and elected-official data shown on the site is drawn from public sources and
				third-party datasets. Forecast-style indicators are informational and are not official
				election results.
			</p>
		</section>
	</main>
	<SiteFooter />
</div>
