<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Contact | Path to Win</title>
	<meta name="description" content="Contact Path to Win for feedback, data corrections, partnerships, and advertising." />
</svelte:head>

<div class="flex h-full flex-col overflow-y-auto bg-[#eef1f5] text-neutral-900">
	<main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
		<nav class="text-xs text-neutral-500" aria-label="Breadcrumb">
			<a href="/" class="hover:underline">Home</a>
			<span class="mx-1">/</span>
			<span>Contact</span>
		</nav>
		<section class="rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
			<h1 class="text-3xl font-black text-[#001666]">Contact Path to Win</h1>
			<p class="mt-4 leading-relaxed text-neutral-700">
				Use this page for feedback, data corrections, feature requests, partnerships, and media
				inquiries.
			</p>
			<div class="mt-6 grid gap-4 sm:grid-cols-2">
				<a class="rounded-md border border-neutral-200 p-4 hover:border-[#244999]" href="mailto:contact@pathtowin.com">
					<div class="text-sm font-black uppercase tracking-wide text-[#001666]">General</div>
					<div class="mt-1 text-sm text-neutral-700">contact@pathtowin.com</div>
				</a>
				<a class="rounded-md border border-neutral-200 p-4 hover:border-[#b60b03]" href="mailto:advertising@pathtowin.com">
					<div class="text-sm font-black uppercase tracking-wide text-[#001666]">Advertising</div>
					<div class="mt-1 text-sm text-neutral-700">advertising@pathtowin.com</div>
				</a>
			</div>
		</section>
	</main>
	<SiteFooter />
</div>
