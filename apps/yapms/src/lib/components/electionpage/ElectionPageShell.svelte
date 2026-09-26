<script lang="ts">
	import type { Snippet } from 'svelte';
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	type ElectionTab = 'President' | 'Senate' | 'House' | 'Governor';

	let {
		active,
		eyebrow,
		title,
		tagline,
		intro,
		baseline,
		baselineHref,
		baselineLinkText,
		children,
		sidebar
	}: {
		active: ElectionTab;
		eyebrow: string;
		title: string;
		tagline: string;
		intro: string;
		baseline: string;
		baselineHref?: string;
		baselineLinkText?: string;
		children: Snippet;
		sidebar: Snippet;
	} = $props();

	const tabs: { label: ElectionTab; href: string }[] = [
		{ label: 'President', href: '/2028-presidential-election' },
		{ label: 'Senate', href: '/2026-senate-interactive-map' },
		{ label: 'House', href: '/2026-house-interactive-map' },
		{ label: 'Governor', href: '/2026-governor-interactive-map' }
	];
</script>

<div class="election-page-shell">
	<main class="page-grid">
		<div class="main-column">
			<div class="latest">
				<span>MARKET WATCH</span>
				<a href="/news">
					Explore the latest moves in election prediction markets
					<span aria-hidden="true">→</span>
				</a>
			</div>

			<header class="page-header">
				<p class="eyebrow">{eyebrow}</p>
				<h1>{title}</h1>
				<p class="tagline">{tagline}</p>
				<nav class="election-tabs" aria-label="Election maps">
					{#each tabs as tab}
						<a
							class:active={tab.label === active}
							aria-current={tab.label === active ? 'page' : undefined}
							href={tab.href}
						>
							{tab.label}
						</a>
					{/each}
				</nav>
				<p class="intro">{intro}</p>
				<p class="baseline">
					<span>Starting point: </span>
					{#if baselineHref && baselineLinkText}
						<a href={baselineHref}>{baselineLinkText}</a>
					{:else}
						{baseline}
					{/if}
					<span class="baseline-note">Your edits are scenarios, not forecasts.</span>
				</p>
			</header>

			{@render children()}
		</div>

		<aside class="sidebar" aria-label="Election context and related maps">
			{@render sidebar()}
			<nav class="side-section" aria-label="More election maps">
				<h2>More election maps</h2>
				<a href="/2028-presidential-election">
					<span>President<small>Find a path to 270</small></span><span aria-hidden="true">→</span>
				</a>
				<a href="/2026-senate-interactive-map">
					<span>U.S. Senate<small>Build the next majority</small></span><span aria-hidden="true"
						>→</span
					>
				</a>
				<a href="/2026-house-interactive-map">
					<span>U.S. House<small>Explore congressional districts</small></span><span
						aria-hidden="true">→</span
					>
				</a>
				<a href="/2026-governor-interactive-map">
					<span>Governors<small>Map state leadership races</small></span><span aria-hidden="true"
						>→</span
					>
				</a>
			</nav>
		</aside>
	</main>
	<SiteFooter />
</div>

<style>
	:global(html:has(.election-page-shell)),
	:global(body:has(.election-page-shell)) {
		touch-action: pan-y;
	}
	.election-page-shell {
		height: 100%;
		overflow-y: auto;
		background: white;
		color: #262626;
		font-family: Arial, Helvetica, sans-serif;
		scroll-behavior: smooth;
	}
	.page-grid {
		max-width: 1352px;
		margin: auto;
		padding: 58px 16px 68px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 288px;
		gap: 44px;
	}
	.main-column {
		min-width: 0;
	}
	.latest {
		display: flex;
		min-height: 35px;
		background: #f0f0f0;
		align-items: center;
		margin-bottom: 24px;
		font-size: 13px;
	}
	.latest > span {
		align-self: stretch;
		display: flex;
		align-items: center;
		padding: 8px 20px 8px 12px;
		color: white;
		background: #b82732;
		clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}
	.latest a {
		padding: 7px 12px;
		font-weight: 700;
		color: #353535;
	}
	.page-header h1 {
		font-size: 32px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.7px;
		margin: 0;
	}
	.eyebrow {
		margin: 0 0 7px;
		color: #a72932;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
	.tagline {
		font-size: 18px;
		font-style: italic;
		color: #737373;
		margin: 8px 0 17px;
	}
	.election-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-bottom: 18px;
	}
	.election-tabs a {
		font-size: 12px;
		padding: 6px 13px;
		background: #eff2f5;
		border-radius: 2px;
		font-weight: 700;
		color: #245493;
		text-decoration: none;
	}
	.election-tabs a:hover {
		background: #e5eaf0;
		text-decoration: none;
	}
	.election-tabs a.active {
		background: #285b97;
		color: white;
	}
	.intro {
		font-size: 16px;
		line-height: 1.6;
		margin: 0;
	}
	.baseline {
		margin: 10px 0 25px;
		font-size: 12px;
		color: #727272;
		line-height: 1.5;
	}
	.baseline a {
		text-decoration: underline;
		color: #245493;
	}
	.baseline-note {
		margin-left: 4px;
	}
	.sidebar {
		min-width: 0;
	}
	.side-section {
		border-top: 3px solid #294f83;
		margin-top: 32px;
	}
	.side-section h2 {
		font-size: 18px;
		padding: 15px 0 5px;
	}
	.side-section > a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 13px 0;
		border-bottom: 1px solid #e5e5e5;
		font-size: 14px;
		font-weight: 700;
		color: #245493;
		text-decoration: none;
	}
	.side-section > a:hover {
		text-decoration: underline;
	}
	.side-section small {
		display: block;
		color: #777;
		font-size: 11px;
		font-weight: 400;
		margin-top: 4px;
	}
	@media (max-width: 1100px) {
		.page-grid {
			gap: 28px;
			grid-template-columns: minmax(0, 1fr) 250px;
			padding-top: 42px;
		}
		.page-header h1 {
			font-size: 29px;
		}
	}
	@media (max-width: 900px) {
		.page-grid {
			grid-template-columns: 1fr;
			padding-top: 28px;
		}
		.sidebar {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 22px;
			align-items: start;
		}
	}
	@media (max-width: 600px) {
		.page-grid {
			padding: 20px 16px 40px;
			gap: 36px;
		}
		.page-header h1 {
			font-size: 27px;
			letter-spacing: -0.5px;
		}
		.tagline {
			font-size: 16px;
		}
		.latest {
			font-size: 11px;
			margin-bottom: 22px;
		}
		.latest > span {
			font-size: 9px;
			padding-left: 8px;
		}
		.intro {
			font-size: 14px;
		}
		.baseline {
			font-size: 11px;
			margin-bottom: 20px;
		}
		.sidebar {
			grid-template-columns: 1fr;
		}
	}
</style>
