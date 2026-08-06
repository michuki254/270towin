<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<!-- A bare <title> in the body is invalid HTML and was being rendered
	     as visible-ish markup inside the 404 page; svelte:head hoists it. -->
	{#if $page.error?.message === 'Not Found'}
		<title>Page Not Found</title>
	{:else}
		<title>Error</title>
	{/if}
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex flex-col gap-y-12 w-full h-full justify-center items-center px-12">
	{#if $page.error?.message === 'Not Found'}
		<h1 class="text-5xl lg:text-6xl">Sorry, we couldn't find that page.</h1>
	{:else}
		<h1 class="text-5xl lg:text-6xl">Sorry, an unexpected error occured.</h1>
	{/if}
	<div class="flex flex-col w-full lg:w-auto lg:flex-row-reverse justify-center lg:gap-x-6 gap-y-6">
		<a href="/" class="btn btn-primary btn-lg btn-block max-w-xl">Home</a>
		<button
			on:click={() => {
				history.back();
			}}
			class="btn btn-lg btn-block max-w-xl">Previous Page</button
		>
	</div>
</div>
