<script lang="ts">
	import type { Snippet } from 'svelte';
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	let {
		wide = false,
		children
	}: {
		wide?: boolean;
		children: Snippet;
	} = $props();
</script>

<div class="site-page-shell">
	<main class="page-grid" class:wide>
		<div class="main-column">
			<div class="latest">
				<span>MARKET WATCH</span>
				<a href="/news">
					Explore the latest moves in election prediction markets
					<span aria-hidden="true">→</span>
				</a>
			</div>
			<div class="public-page-content">
				{@render children()}
			</div>
		</div>

		{#if !wide}
			<aside class="sidebar" aria-label="Election maps and resources">
				<nav class="side-section" aria-label="Election maps">
					<h2>Election maps</h2>
					<a href="/2028-presidential-election">
						<span>President<small>Build a path to 270</small></span><span aria-hidden="true">→</span
						>
					</a>
					<a href="/2026-senate-interactive-map">
						<span>U.S. Senate<small>Explore the 2026 races</small></span><span aria-hidden="true"
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

				<nav class="side-section" aria-label="Results and data">
					<h2>Results &amp; data</h2>
					<a href="/election-results">
						<span>Election results<small>Browse results by year</small></span><span
							aria-hidden="true">→</span
						>
					</a>
					<a href="/historical-presidential-elections">
						<span>Election history<small>Compare past cycles</small></span><span aria-hidden="true"
							>→</span
						>
					</a>
					<a href="/forecasts">
						<span>Forecasts &amp; scenarios<small>See current baselines</small></span><span
							aria-hidden="true">→</span
						>
					</a>
					<a href="/election-data-methodology">
						<span>Data &amp; methodology<small>Sources and limitations</small></span><span
							aria-hidden="true">→</span
						>
					</a>
				</nav>

				<section class="side-note">
					<p class="eyebrow">ABOUT THE NUMBERS</p>
					<p>
						Results, market prices, ratings, and editable maps have different sources and meanings.
						Check the source notes on each page.
					</p>
				</section>
			</aside>
		{/if}
	</main>
	<SiteFooter />
</div>

<style>
	.site-page-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		background: #fff;
		color: #262626;
		font-family: Arial, Helvetica, sans-serif;
		scroll-behavior: smooth;
	}
	.page-grid {
		flex: 0 0 auto;
		max-width: 1352px;
		margin: auto;
		padding: 44px 16px 32px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 288px;
		align-items: start;
		gap: 44px;
	}
	.page-grid.wide {
		grid-template-columns: minmax(0, 1fr);
	}
	.main-column,
	.public-page-content {
		min-width: 0;
	}
	.latest {
		display: flex;
		min-height: 35px;
		background: #f0f0f0;
		align-items: center;
		margin-bottom: 20px;
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
		text-decoration: none;
	}
	.sidebar {
		min-width: 0;
	}
	.side-section {
		border-top: 3px solid #294f83;
	}
	.side-section + .side-section,
	.side-note {
		margin-top: 30px;
	}
	.side-section h2 {
		font-size: 18px;
		font-weight: 700;
		padding: 14px 0 5px;
	}
	.side-section > a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 12px 0;
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
		margin-top: 4px;
		color: #777;
		font-size: 11px;
		font-weight: 400;
	}
	.side-note {
		padding: 16px;
		border: 1px solid #e1e4e8;
		background: #f5f6f8;
	}
	.eyebrow {
		margin: 0 0 8px;
		color: #a72932;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
	.side-note p:last-child {
		margin: 0;
		color: #62666c;
		font-size: 12px;
		line-height: 1.6;
	}
	:global(.public-page-content > :first-child) {
		height: auto !important;
		min-height: 0 !important;
		overflow: visible !important;
		background-color: #fff !important;
		font-family: Arial, Helvetica, sans-serif;
	}
	:global(.public-page-content .site-footer) {
		display: none;
	}
	:global(.site-page-shell > .site-footer) {
		flex-shrink: 0;
	}
	:global(.public-page-content a:focus-visible) {
		outline: 3px solid #245493;
		outline-offset: 3px;
	}
	@media (max-width: 1100px) {
		.page-grid {
			gap: 28px;
			grid-template-columns: minmax(0, 1fr) 250px;
			padding-top: 38px;
		}
		.page-grid.wide {
			grid-template-columns: minmax(0, 1fr);
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
			align-items: start;
			gap: 24px;
		}
		.side-section + .side-section,
		.side-note {
			margin-top: 0;
		}
	}
	@media (max-width: 600px) {
		.page-grid {
			padding: 20px 16px 28px;
			gap: 34px;
		}
		.latest {
			font-size: 11px;
		}
		.latest > span {
			padding-left: 8px;
			font-size: 9px;
		}
		.sidebar {
			grid-template-columns: 1fr;
		}
	}
</style>
