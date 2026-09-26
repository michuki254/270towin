<script lang="ts">
	let { home = false, active = 'President' } = $props<{ home?: boolean; active?: string }>();
	type NavLink = {
		label: string;
		href: string;
		description: string;
		image: string;
	};

	type NavItem = {
		label: string;
		href?: string;
		kicker?: string;
		description?: string;
		image?: string;
		items: NavLink[];
	};

	const navItems = [
		{ label: 'News', href: '/news', items: [] },
		{
			label: 'President',
			href: '/2028-presidential-election-interactive-map',
			kicker: 'Electoral College',
			description:
				'Build presidential paths to 270, review certified results, and compare every historical election cycle.',
			image: '/path-to-win-logo.svg',
			items: [
				{
					label: '2028 Electoral College Map',
					href: '/2028-presidential-election-interactive-map',
					description:
						'Interactive forecast map with candidate options and a 270 electoral vote path.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Presidential Results',
					href: '/2024-presidential-election-results',
					description: 'Certified state results with electoral vote totals and historical context.',
					image: '/portraits/donald-trump.jpg'
				},
				{
					label: 'Historical Elections',
					href: '/historical-presidential-elections',
					description: 'Explore presidential maps from early elections through the modern era.',
					image: '/portraits/abraham-lincoln.jpg'
				},
				{
					label: '2028 Presidential Hub',
					href: '/2028-presidential-election',
					description: 'Overview page: ratings, key states, and cycle context.',
					image: '/path-to-win-logo.svg'
				}
			]
		},
		{
			label: 'Senate',
			href: '/2026-senate-interactive-map',
			kicker: 'Chamber Control',
			description:
				'Track the balance of power across Senate classes, current forecasts, and historical cycles.',
			image: '/party-logos/democrats.png',
			items: [
				{
					label: '2026 Senate Interactive Map',
					href: '/2026-senate-interactive-map',
					description: 'Forecast contested seats, holdovers, and the route to Senate control.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Senate Results',
					href: '/2024-senate-election-results',
					description: 'Final Senate balance after the 2024 election cycle.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Historical Senate Elections',
					href: '/historical-senate-elections',
					description: 'Cycle-by-cycle Senate maps and chamber balance summaries.',
					image: '/party-logos/democrats.png'
				},
				{
					label: '2026 Senate Hub',
					href: '/2026-senate-election',
					description: 'Overview page: chamber balance, classes, and cycle context.',
					image: '/path-to-win-logo.svg'
				}
			]
		},
		{
			label: 'House',
			href: '/2026-house-interactive-map',
			kicker: 'District Battles',
			description: 'Use district-level maps and race tables to model the path to a House majority.',
			image: '/party-logos/republicans.png',
			items: [
				{
					label: '2026 House Interactive Map',
					href: '/2026-house-interactive-map',
					description: 'District map, competitive race table, ratings, and control projection.',
					image: '/favicon.svg'
				},
				{
					label: 'Historical House Elections',
					href: '/historical-house-elections',
					description: 'Historical House control summaries and interactive map pages.',
					image: '/party-logos/democrats.png'
				},
				{
					label: 'State & Provincial Maps',
					href: '/#state-maps',
					description: 'Browse state legislative and regional map tools.',
					image: '/path-to-win-logo.svg'
				},
				{
					label: '2026 House Hub',
					href: '/2026-house-election',
					description: 'Overview page: majority maths and district-level context.',
					image: '/path-to-win-logo.svg'
				}
			]
		},
		{
			label: 'Governor',
			href: '/2026-governor-interactive-map',
			kicker: 'State Executives',
			description:
				'Forecast gubernatorial races with candidate tables, ratings, and future election tabs.',
			image: '/favicon.svg',
			items: [
				{
					label: '2026 Governor Interactive Map',
					href: '/2026-governor-interactive-map',
					description: 'Forecast dashboard for upcoming governor races and ratings.',
					image: '/favicon.svg'
				},
				{
					label: '2024 Governor Results',
					href: '/2024-governor-election-results',
					description: 'Results map and control summary for the 2024 governor cycle.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Historical Governor Elections',
					href: '/historical-governor-elections',
					description: 'Governor results by year with state-by-state historical context.',
					image: '/party-logos/democrats.png'
				},
				{
					label: '2026 Governor Hub',
					href: '/2026-governor-election',
					description: 'Overview page: seats up, open races, and cycle context.',
					image: '/path-to-win-logo.svg'
				}
			]
		},
		{
			label: 'States',
			href: '/elected-officials',
			kicker: 'Elected Officials',
			description:
				'State-by-state dashboards for federal officials, governors, legislatures, and partisan composition.',
			image: '/favicon.svg',
			items: [
				{
					label: 'Elected Officials Map',
					href: '/elected-officials',
					description:
						'Click a 2024 presidential result map to open each state officials dashboard.',
					image: '/favicon.svg'
				},
				{
					label: 'All State Dashboards',
					href: '/states',
					description: 'Browse all state elected officials dashboards.',
					image: '/favicon.svg'
				},
				{
					label: 'State Voting History',
					href: '/state-voting-history',
					description: 'Recent partisan trends, battleground status, and state voting behavior.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'State Trifectas',
					href: '/state-trifectas',
					description: 'Governor and legislative chamber control by party.',
					image: '/path-to-win-logo.svg'
				},
				{
					label: 'State Election Results',
					href: '/state-election-results',
					description: 'State result archive links for major offices.',
					image: '/party-logos/democrats.png'
				}
			]
		},
		{
			label: 'More',
			href: '/site-map',
			// Kicker and description used to advertise the Map Library, which is no
			// longer linked from the navigation, so both describe what is actually
			// in this menu now.
			kicker: 'Tools & Reference',
			description: 'Simulators, countdown clocks, reference tables, and the full site index.',
			image: '/path-to-win-logo.svg',
			items: [
				{
					label: 'Election Simulator',
					href: '/simulator',
					description: 'Choose a presidential, Senate, House, or governor simulator.',
					image: '/path-to-win-logo.svg'
				},
				{
					label: 'Election Countdown Clock',
					href: '/election-countdown-clock',
					description:
						'A branded embeddable countdown clock for election pages and campaign sites.',
					image: '/favicon.svg'
				},
				{
					label: 'Forecasts, Polls & Markets',
					href: '/forecasts',
					description: 'Forecast dashboards with links to polling and prediction-market pages.',
					image: '/party-logos/democrats.png'
				},
				{
					label: 'Election Reference Tools',
					href: '/poll-closing-times',
					description:
						'Poll closing times, primary dates, tie scenarios, and electoral vote rules.',
					image: '/party-logos/republicans.png'
				},
				{
					label: 'Fantasy Election Maps',
					href: '/fantasy-election-maps',
					description: 'Alternate geography and custom scenario map tools.',
					image: '/favicon.svg'
				},
				{
					label: 'Site Map',
					href: '/site-map',
					description: 'Browse every major Path to Win page and election data section.',
					image: '/portraits/george-washington.jpg'
				},
				{
					label: 'About Path to Win',
					href: '/about',
					description: 'Learn about the election map, forecast, and historical data platform.',
					image: '/path-to-win-logo.svg'
				}
			]
		}
	] satisfies NavItem[];

	let openMenu: string | undefined = $state(undefined);
	let closeMenuTimeout: ReturnType<typeof setTimeout> | undefined;

	function openMegaMenu(label: string) {
		if (closeMenuTimeout !== undefined) {
			clearTimeout(closeMenuTimeout);
			closeMenuTimeout = undefined;
		}
		openMenu = label;
	}

	function closeMegaMenu() {
		closeMenuTimeout = setTimeout(() => {
			openMenu = undefined;
			closeMenuTimeout = undefined;
		}, 180);
	}

	function toggleMegaMenu(label: string) {
		if (openMenu === label) {
			openMenu = undefined;
			return;
		}
		openMegaMenu(label);
	}
</script>

<header class="relative z-40 bg-[#001666] text-white shadow-md shrink-0" class:home-nav={home}>
	<div class="mx-auto flex max-w-6xl items-center gap-8 px-4 py-2">
		<a href="/" class="flex shrink-0 items-center gap-2" aria-label="Path to Win home">
			<img
				src="/favicon.svg"
				alt=""
				class="h-9 w-9 rounded-md bg-white object-contain"
				aria-hidden="true"
			/>
			<span class="flex flex-col leading-none">
				<span class="text-xl font-extrabold tracking-tight text-white">Path</span>
				<span class="text-base font-bold text-[#9db8e0]">to Win</span>
			</span>
		</a>
		<nav class="min-w-0 flex-1" aria-label="Primary navigation">
			<ul class="flex flex-wrap items-stretch text-sm font-semibold">
				{#each navItems as item}
					{#if item.items.length === 0}
						<li class:home-active={home && item.label === active}>
							<a
								class="block rounded px-4 py-2.5 transition-colors hover:bg-[#b60b03]"
								href={item.href}
							>
								{item.label}
							</a>
						</li>
					{:else}
						<li
							class="relative"
							class:home-active={home && item.label === active}
							onmouseenter={() => openMegaMenu(item.label)}
							onmouseleave={closeMegaMenu}
						>
							<!-- Split control: the label is a real link straight to the
						     interactive map, and the chevron opens the menu.
						     A single <button> meant clicking "Senate" only toggled a
						     dropdown and never went anywhere; a plain <a> would have
						     fixed that but stranded touch users, since there is no
						     hamburger here and tapping is the only way they reach the
						     submenu. Desktop still opens on hover and on focus. -->
							<span class="flex items-stretch rounded transition-colors hover:bg-[#b60b03]">
								<a
									class="select-none py-2.5 pl-4 pr-1"
									href={item.href}
									onfocus={() => openMegaMenu(item.label)}
									onclick={() => (openMenu = undefined)}
								>
									{item.label}
								</a>
								<button
									type="button"
									aria-haspopup="true"
									aria-expanded={openMenu === item.label}
									aria-label={`${item.label} menu`}
									class="cursor-pointer select-none py-2.5 pl-1 pr-3"
									onclick={() => toggleMegaMenu(item.label)}
									onfocus={() => openMegaMenu(item.label)}
								>
									<svg
										class={`h-3 w-3 transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`}
										viewBox="0 0 12 12"
										fill="none"
										aria-hidden="true"
									>
										<path
											d="M2.5 4.5 6 8l3.5-3.5"
											stroke="currentColor"
											stroke-width="1.6"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</span>
							{#if openMenu === item.label}
								<div
									class={`absolute top-full z-50 pt-2 ${item.label === 'More' ? 'right-0' : 'left-0'}`}
								>
									<div
										class="w-[min(92vw,760px)] rounded-md border border-neutral-200 bg-white p-3 text-neutral-900 shadow-2xl"
									>
										<div class="grid gap-3 md:grid-cols-[230px_1fr]">
											<a
												href={item.href ?? item.items[0]?.href}
												class="overflow-hidden rounded-md border border-neutral-200 bg-[#f5f7fb] hover:border-[#2e5aac]"
												onclick={() => (openMenu = undefined)}
											>
												<div class="flex h-28 items-center justify-center bg-[#eef1f7] p-4">
													<img
														src={item.image}
														alt=""
														class="max-h-24 max-w-full object-contain"
														loading="lazy"
														aria-hidden="true"
													/>
												</div>
												<div class="p-3">
													<div
														class="text-[11px] font-black uppercase tracking-wide text-[#d83a45]"
													>
														{item.kicker}
													</div>
													<div class="mt-1 text-base font-black text-[#061a55]">{item.label}</div>
													<p class="mt-1 text-xs leading-relaxed text-neutral-600">
														{item.description}
													</p>
												</div>
											</a>

											<div class="grid gap-2">
												{#each item.items as sub}
													<a
														href={sub.href}
														class="grid grid-cols-[54px_1fr] gap-3 rounded-md border border-transparent p-2 transition hover:border-neutral-200 hover:bg-[#f7f8fb]"
														onclick={() => (openMenu = undefined)}
													>
														<div
															class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[#eef1f7]"
														>
															<img
																src={sub.image}
																alt=""
																class="h-full w-full object-cover"
																loading="lazy"
																aria-hidden="true"
															/>
														</div>
														<div>
															<div class="text-sm font-black text-[#061a55]">{sub.label}</div>
															<p class="mt-0.5 text-xs leading-snug text-neutral-600">
																{sub.description}
															</p>
														</div>
													</a>
												{/each}
											</div>
										</div>
									</div>
								</div>
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	.home-nav {
		background: #f8f9fa;
		color: #343434;
		border-top: 4px solid #173c77;
		border-bottom: 2px solid #b52632;
		box-shadow: none;
		font-family: Arial, sans-serif;
	}
	.home-nav > div {
		max-width: 1352px;
		min-height: 66px;
		gap: 38px;
	}
	.home-nav > div > a span span:first-child {
		color: #183e75;
	}
	.home-nav > div > a span span:last-child {
		color: #bd2935;
	}
	.home-nav nav > ul {
		font-size: 16px;
		font-weight: 400;
	}
	.home-nav nav > ul > li > a:hover,
	.home-nav nav > ul > li > span:hover {
		background: #e9edf2;
	}
	.home-nav nav > ul > li.home-active > a,
	.home-nav nav > ul > li.home-active > span > a {
		font-weight: 700;
		color: #171717;
	}
	@media (max-width: 900px) {
		.home-nav > div {
			flex-wrap: wrap;
			gap: 4px;
			padding-top: 8px;
			padding-bottom: 5px;
		}
		.home-nav nav {
			flex-basis: 100%;
		}
		.home-nav nav > ul {
			font-size: 13px;
		}
		.home-nav nav > ul > li > a {
			padding: 9px 8px;
		}
		.home-nav nav > ul > li > span > a {
			padding: 9px 0 9px 8px;
		}
		.home-nav nav > ul > li > span > button {
			padding: 9px 5px;
		}
		.home-nav nav > ul > li {
			position: static;
		}
		.home-nav nav > ul > li > div {
			left: 8px;
			right: 8px;
			padding-top: 0;
		}
		.home-nav nav > ul > li > div > div {
			width: 100%;
			max-height: 65vh;
			overflow: auto;
		}
	}
</style>
