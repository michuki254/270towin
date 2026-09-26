<script lang="ts">
	/* Footer.
	 *
	 * This was 44 links in five columns — effectively a second sitemap, and it
	 * read as noise. Two structural faults made it worse: the grid declared five
	 * tracks for six children, so "Company" wrapped under the brand and left a
	 * dead half-row; and the categories overlapped, with "2024 Senate" filed
	 * under Results Archive while "Senate Elections" sat under Historical Data,
	 * so a reader had no way to guess which column held what.
	 *
	 * Now: three link columns grouped by what someone is actually looking for,
	 * capped so each is scannable, with "All pages" carrying the long tail to
	 * the sitemap. Company and legal move to the bottom bar, where they stay
	 * findable without competing with the product.
	 *
	 * Every href below was checked against src/routes — nothing here is dead.
	 */
	const columns: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
		{
			heading: 'Interactive maps',
			links: [
				{ href: '/2028-presidential-election-interactive-map', label: '2028 President' },
				{ href: '/2026-senate-interactive-map', label: '2026 Senate' },
				{ href: '/2026-house-interactive-map', label: '2026 House' },
				{ href: '/2026-governor-interactive-map', label: '2026 Governors' },
				{ href: '/simulator', label: 'Election simulator' },
				{ href: '/elected-officials', label: 'Elected officials' }
			]
		},
		{
			heading: 'Results',
			links: [
				{ href: '/election-results', label: 'All results' },
				{ href: '/2024-election-results', label: '2024' },
				{ href: '/2022-senate-election-results', label: '2022' },
				{ href: '/2020-presidential-election-results', label: '2020' },
				{ href: '/states', label: 'By state' }
			]
		},
		{
			heading: 'Forecasts & data',
			links: [
				{ href: '/forecasts', label: 'Forecasts' },
				{ href: '/election-data-methodology', label: 'Data & methodology' },
				{ href: '/polls', label: 'Polls' },
				{ href: '/prediction-markets', label: 'Prediction markets' },
				{ href: '/presidential-election-margins', label: 'Election margins' },
				{ href: '/state-voting-history', label: 'State voting history' },
				{ href: '/historical-timeline', label: 'Timeline' }
			]
		}
	];

	const meta = [
		{ href: '/news', label: 'News' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/advertising', label: 'Advertising' },
		{ href: '/privacy', label: 'Privacy' },
		{ href: '/site-map', label: 'All pages' }
	];
</script>

<footer class="site-footer mt-auto bg-[#001666] text-[#b9c9e8]">
	<!-- Four children, four tracks. The old five-track grid had six children,
	     which is what pushed a whole column onto its own row. -->
	<div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
		<div>
			<img
				src="/path-to-win-logo.svg"
				alt="Path to Win"
				class="h-14 w-52 rounded bg-white object-contain px-2 py-1"
			/>
			<p class="mt-4 max-w-sm text-sm leading-relaxed">
				Interactive election maps, chamber control scenarios, and historical results for
				presidential, Senate, House, and governor races.
			</p>
			<p class="mt-3 max-w-sm text-xs leading-relaxed text-[#8fa7d5]">
				Forecasts and market probabilities are informational indicators, not official election
				results.
			</p>
		</div>

		{#each columns as column}
			<nav aria-label={column.heading}>
				<h3 class="text-sm font-black uppercase tracking-wide text-white">{column.heading}</h3>
				<ul class="mt-3 space-y-2 text-sm">
					{#each column.links as link}
						<li>
							<a class="hover:text-white hover:underline" href={link.href}>{link.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>

	<div class="border-t border-[#244999]">
		<div class="mx-auto max-w-6xl px-4 py-4">
			<nav aria-label="Site information" class="flex flex-wrap gap-x-4 gap-y-2 text-xs">
				{#each meta as link}
					<a class="hover:text-white hover:underline" href={link.href}>{link.label}</a>
				{/each}
			</nav>
			<div
				class="mt-3 flex flex-col gap-2 text-xs text-[#8fa7d5] md:flex-row md:items-center md:justify-between"
			>
				<p>It will take 270 electoral votes to win the 2028 presidential election.</p>
				<p>
					&copy; 2026 Path to Win &middot; Built on
					<a
						class="underline hover:text-white"
						href="https://github.com/michuki254/270towin"
						rel="noopener"
						target="_blank">YAPMS (AGPL-3.0) — source</a
					>
				</p>
			</div>
		</div>
	</div>
</footer>
