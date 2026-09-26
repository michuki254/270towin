<script lang="ts">
	import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	let { data } = $props();
	const predictionMarkets = $derived(data?.presidential?.odds ?? []);
	const marketsAsOf = $derived(
		data?.presidential?.ok
			? new Date(data.presidential.fetchedAt).toLocaleString('en-US', {
					dateStyle: 'medium',
					timeStyle: 'short',
					timeZone: 'UTC'
				}) + ' UTC'
			: null
	);
	const coverage = [
		{
			tag: '2026 MIDTERMS',
			title: 'Explore the race for control of Congress',
			description:
				'Build your own Senate and House scenarios, compare the starting balance, and follow the contests that could decide the majority.',
			href: '/2026-senate-election',
			image: '/path-to-win-logo.svg'
		},
		{
			tag: 'ELECTION MARKETS',
			title: 'Follow the latest election market movements',
			description:
				'See how tracked election markets have changed over the past day, week, and month, with a timestamp and source for each update.',
			href: '/news',
			image: ''
		},
		{
			tag: 'RESULTS & HISTORY',
			title: 'Every election has a different path to victory',
			description:
				'Explore historical presidential results and compare how the Electoral College map has changed across election cycles.',
			href: '/historical-presidential-elections',
			image: ''
		}
	];
</script>

<svelte:head>
	<title>2028 Presidential Election Interactive Map | Path to Win</title>
	<meta
		name="description"
		content="Create your 2028 Electoral College map. Start with the certified 2024 result, change state ratings, and find a path to 270 electoral votes. Explore election results and markets."
	/>
	<meta property="og:title" content="2028 Presidential Election Interactive Map | Path to Win" />
	<meta
		property="og:description"
		content="Build a path to 270 electoral votes, follow election markets, and explore U.S. election results."
	/>
</svelte:head>

<div class="home-page">
	<main class="page-grid">
		<div class="main-column">
			<div class="latest">
				<span>MARKET WATCH</span><a href="/news"
					>Explore the latest moves in election prediction markets <span aria-hidden="true">→</span
					></a
				>
			</div>
			<section aria-labelledby="home-title">
				<h1 id="home-title">2028 Presidential Election Interactive Map</h1>
				<p class="tagline">Every state counts. Find your path to 270.</p>
				<nav class="election-tabs" aria-label="Election maps">
					<a class="active" href="#presidential-map" aria-current="page">President</a>
					<a href="/2026-senate-interactive-map">Senate</a>
					<a href="/2026-house-interactive-map">House</a>
					<a href="/2026-governor-interactive-map">Governor</a>
				</nav>
				<p class="intro">
					It takes <strong>270 electoral votes</strong> to win the presidency. Choose a color and select
					states on the map to build your 2028 scenario. Explore different combinations, then share your
					path to the White House.
				</p>
				<p class="baseline">
					Starting map: <a href="/2024-presidential-election-results">certified 2024 results</a>.
					Your edits are a scenario, not a forecast.
				</p>
				<div id="presidential-map" class="map-wrap">
					<iframe
						src="/app/usa/presidential/2028/2024map?embed=home"
						title="Interactive Electoral College map with color palette and vote totals"
					></iframe>
				</div>
				<p class="map-note">
					Maine and Nebraska allocate some electoral votes by congressional district. <a
						href="/election-data-methodology">About our data and sources</a
					>
				</p>
			</section>

			<section class="coverage" aria-labelledby="coverage-title">
				<div class="section-heading">
					<h2 id="coverage-title">Election coverage &amp; resources</h2>
					<a href="/news">Market updates →</a>
				</div>
				{#each coverage as story}
					<article class="story">
						<div>
							<span class="eyebrow">{story.tag}</span>
							<h3><a href={story.href}>{story.title}</a></h3>
							<p>{story.description}</p>
							<a class="read-more" href={story.href}>Explore <span aria-hidden="true">→</span></a>
						</div>
						{#if story.image}<a
								href={story.href}
								class="story-image"
								tabindex="-1"
								aria-hidden="true"><img src={story.image} alt="" loading="lazy" /></a
							>{/if}
					</article>
				{/each}
			</section>
		</div>

		<aside class="sidebar" aria-label="Election markets and resources">
			<section class="market-panel">
				<h2>Prediction Markets</h2>
				<p class="market-question">
					Which party will win the<br /><strong>2028 Presidential Election?</strong>
				</p>
				{#if predictionMarkets.length}
					<div class="market-tiles">
						{#each predictionMarkets as market}
							<div class="market-tile" style:--party-color={market.color}>
								<span>{market.party}</span><strong>{market.pct}<small>%</small></strong>
							</div>
						{/each}
					</div>
				{:else}<p class="unavailable">Market prices are temporarily unavailable.</p>{/if}
				<div class="market-source">Market prices from <strong>Polymarket</strong></div>
				{#if marketsAsOf}<p class="market-caption">
						Read {marketsAsOf}. Latest “yes” trades from separate party markets; percentages may not
						total 100%.
					</p>{/if}
				<a class="sidebar-link" href="/2028-presidential-election">View election overview →</a>
			</section>

			<section class="side-section" id="state-maps">
				<h2>2026 Election Maps</h2>
				<a href="/2026-senate-interactive-map"
					><span>U.S. Senate<small>Build the next Senate majority</small></span><span
						aria-hidden="true">→</span
					></a
				>
				<a href="/2026-house-interactive-map"
					><span>U.S. House<small>Explore congressional districts</small></span><span
						aria-hidden="true">→</span
					></a
				>
				<a href="/2026-governor-interactive-map"
					><span>Governors<small>Map the races for state leadership</small></span><span
						aria-hidden="true">→</span
					></a
				>
			</section>

			<section class="road-panel">
				<span class="eyebrow">THE ELECTORAL COLLEGE</span>
				<h2>The road to <strong>270</strong></h2>
				<p>
					A majority of the 538 electoral votes decides the presidency. Use the map to see how
					individual states change the outcome.
				</p>
				<dl>
					<div>
						<dt>Electoral votes</dt>
						<dd>538</dd>
					</div>
					<div>
						<dt>Needed to win</dt>
						<dd>270</dd>
					</div>
					<div>
						<dt>An even split</dt>
						<dd>269–269</dd>
					</div>
				</dl>
				<a href="/2028-presidential-election">Explore the 2028 election →</a>
			</section>

			<section class="side-section archive">
				<h2>Past Election Results</h2>
				<a href="/2024-presidential-election-results"
					>2024 Presidential Results <span aria-hidden="true">→</span></a
				><a href="/historical-presidential-elections"
					>Presidential Election Archive <span aria-hidden="true">→</span></a
				><a href="/historical-governor-elections"
					>Governor Election Archive <span aria-hidden="true">→</span></a
				>
			</section>
		</aside>
	</main>
	<SiteFooter />
</div>

<style>
	:global(html:has(.home-page)),
	:global(body:has(.home-page)) {
		touch-action: pan-y;
	}
	.home-page {
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
		padding: 72px 16px 68px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 288px;
		gap: 44px;
	}
	.main-column {
		min-width: 0;
	}
	a {
		color: #245493;
	}
	a:hover {
		text-decoration: underline;
	}
	a:focus-visible {
		outline: 3px solid #245493;
		outline-offset: 4px;
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
	h1 {
		font-size: 32px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.7px;
		margin: 0;
	}
	.tagline {
		font-size: 18px;
		font-style: italic;
		color: #737373;
		margin: 8px 0 17px;
	}
	.election-tabs {
		display: flex;
		gap: 5px;
		margin-bottom: 18px;
	}
	.election-tabs a {
		font-size: 12px;
		padding: 5px 12px;
		background: #eff2f5;
		border-radius: 2px;
		font-weight: 700;
	}
	.election-tabs .active {
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
	.baseline a,
	.map-note a {
		text-decoration: underline;
	}
	.map-wrap {
		scroll-margin-top: 16px;
	}
	iframe {
		display: block;
		width: 100%;
		height: 570px;
		border: 0;
		background: white;
	}
	.map-note {
		font-size: 11px;
		color: #777;
		margin: 14px 0 0;
		line-height: 1.6;
	}
	.sidebar h2 {
		font-size: 21px;
		font-weight: 700;
		line-height: 1.3;
	}
	.market-panel {
		text-align: center;
	}
	.market-question {
		font-size: 14px;
		line-height: 1.5;
		margin: 20px 0 18px;
	}
	.market-question strong {
		font-weight: 400;
	}
	.market-tiles {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.market-tile {
		display: flex;
		flex-direction: column;
		border: 6px solid #ededed;
		padding: 10px 3px 13px;
		background: var(--party-color);
		color: white;
	}
	.market-tile > span {
		font-size: 13px;
	}
	.market-tile > strong {
		font-size: 42px;
		line-height: 1.25;
		font-weight: 700;
	}
	.market-tile small {
		font-size: 24px;
	}
	.market-source {
		font-size: 11px;
		margin-top: 13px;
		color: #777;
	}
	.market-source strong {
		display: block;
		font-size: 21px;
		letter-spacing: -0.7px;
		color: #2154ba;
		margin-top: 3px;
	}
	.market-caption {
		font-size: 10px;
		line-height: 1.5;
		color: #888;
		margin: 12px 3px;
	}
	.sidebar-link {
		display: inline-block;
		font-size: 12px;
		margin-top: 7px;
	}
	.unavailable {
		background: #f3f4f5;
		padding: 20px;
		font-size: 13px;
		color: #666;
	}
	.side-section {
		border-top: 3px solid #294f83;
		margin-top: 36px;
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
	}
	.side-section small {
		display: block;
		color: #777;
		font-size: 11px;
		font-weight: 400;
		margin-top: 4px;
	}
	.road-panel {
		margin-top: 32px;
		padding: 20px;
		background: #f5f6f8;
		border: 1px solid #e1e4e8;
	}
	.eyebrow {
		font-size: 10px;
		letter-spacing: 1px;
		font-weight: 700;
		color: #a72932;
	}
	.road-panel h2 {
		margin: 8px 0 12px;
		font-weight: 400;
		font-size: 23px;
	}
	.road-panel h2 strong {
		color: #264c83;
	}
	.road-panel p {
		font-size: 13px;
		color: #62666c;
		line-height: 1.6;
	}
	.road-panel dl {
		margin: 14px 0;
		font-size: 13px;
	}
	.road-panel dl div {
		display: flex;
		justify-content: space-between;
		padding: 9px 0;
		border-bottom: 1px solid #ddd;
	}
	.road-panel dd {
		font-weight: 700;
	}
	.road-panel > a {
		font-size: 12px;
	}
	.archive > a {
		font-size: 12px;
	}
	.coverage {
		margin-top: 38px;
	}
	.section-heading {
		border-bottom: 2px solid #34547e;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding-bottom: 12px;
	}
	.section-heading h2 {
		font-size: 23px;
		font-weight: 700;
	}
	.section-heading > a {
		font-size: 12px;
		white-space: nowrap;
	}
	.story {
		display: flex;
		gap: 24px;
		justify-content: space-between;
		border-bottom: 1px solid #ddd;
		padding: 25px 0;
	}
	.story h3 {
		font-size: 22px;
		line-height: 1.3;
		font-weight: 700;
		margin: 8px 0;
	}
	.story p {
		font-size: 14px;
		color: #626262;
		line-height: 1.65;
		max-width: 680px;
	}
	.read-more {
		display: inline-block;
		margin-top: 12px;
		font-size: 12px;
		font-weight: 700;
	}
	.story-image {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 170px;
		flex-shrink: 0;
		padding: 14px;
		background: #f5f6f8;
	}
	.story-image img {
		width: 100%;
	}
	@media (max-width: 1100px) {
		.page-grid {
			gap: 28px;
			grid-template-columns: minmax(0, 1fr) 250px;
			padding-top: 42px;
		}
		h1 {
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
			grid-template-columns: 1fr 1fr;
			gap: 28px;
			align-items: start;
		}
		.side-section,
		.road-panel {
			margin-top: 0;
		}
		iframe {
			height: 580px;
		}
	}
	@media (max-width: 600px) {
		.page-grid {
			padding: 20px 16px 40px;
			gap: 36px;
		}
		h1 {
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
		iframe {
			height: 650px;
		}
		.sidebar {
			grid-template-columns: 1fr;
		}
		.market-panel {
			max-width: 340px;
			width: 100%;
			margin: auto;
		}
		.section-heading {
			flex-wrap: wrap;
		}
		.section-heading h2 {
			font-size: 21px;
		}
		.story h3 {
			font-size: 20px;
		}
		.story-image {
			display: none;
		}
		.coverage {
			margin-top: 30px;
		}
	}
</style>
