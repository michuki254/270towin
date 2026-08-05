	<script lang="ts">
		import { browser } from '$app/environment';
		import { onMount } from 'svelte';
		import { page } from '$app/stores';
		import SiteFooter from '$lib/components/sitefooter/SiteFooter.svelte';

	const defaultTarget = '2026-11-03T00:00:00-05:00';
	const defaultTitle = '2026 Midterm Elections';
	const defaultLabel = 'Election Day countdown';

	let now = $state(new Date());
	let copied = $state(false);

	onMount(() => {
		const timer = window.setInterval(() => {
			now = new Date();
		}, 1000);

		return () => window.clearInterval(timer);
	});

	const targetParam = $derived(
		browser ? $page.url.searchParams.get('date') || defaultTarget : defaultTarget
	);
	const title = $derived(browser ? $page.url.searchParams.get('title') || defaultTitle : defaultTitle);
	const label = $derived(browser ? $page.url.searchParams.get('label') || defaultLabel : defaultLabel);
	const compact = $derived(
		browser ? $page.url.searchParams.has('embed') || $page.url.searchParams.has('compact') : false
	);
	const targetDate = $derived(new Date(targetParam));
	const targetIsValid = $derived(!Number.isNaN(targetDate.getTime()));
	const millisecondsLeft = $derived(
		targetIsValid ? Math.max(0, targetDate.getTime() - now.getTime()) : 0
	);
	const isComplete = $derived(targetIsValid && targetDate.getTime() <= now.getTime());
	const days = $derived(Math.floor(millisecondsLeft / 86_400_000));
	const hours = $derived(Math.floor((millisecondsLeft % 86_400_000) / 3_600_000));
	const minutes = $derived(Math.floor((millisecondsLeft % 3_600_000) / 60_000));
	const seconds = $derived(Math.floor((millisecondsLeft % 60_000) / 1000));
	const formattedDate = $derived(
		targetIsValid
			? new Intl.DateTimeFormat('en-US', {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
					hour: 'numeric',
					minute: '2-digit',
					timeZoneName: 'short'
				}).format(targetDate)
			: 'Invalid date'
	);
	const origin = $derived($page.url.origin);
	const embedUrl = $derived(
		`${origin}/election-countdown-clock?embed=1&title=${encodeURIComponent(title)}&label=${encodeURIComponent(label)}&date=${encodeURIComponent(targetParam)}`
	);
	const embedCode = $derived(
		`<iframe src="${embedUrl}" title="${title} countdown clock" width="100%" height="260" style="border:0;border-radius:8px;overflow:hidden;" loading="lazy"></iframe>`
	);

	const units = $derived([
		{ label: 'Days', value: days },
		{ label: 'Hours', value: hours },
		{ label: 'Minutes', value: minutes },
		{ label: 'Seconds', value: seconds }
	]);

	async function copyEmbedCode() {
		try {
			await navigator.clipboard.writeText(embedCode);
			copied = true;
			window.setTimeout(() => {
				copied = false;
			}, 1800);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = embedCode;
			textarea.style.position = 'fixed';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			window.setTimeout(() => {
				copied = false;
			}, 1800);
		}
	}
</script>

<svelte:head>
	<title>Election Countdown Clock | Path to Win</title>
	<meta
		name="description"
		content="Embed a branded Path to Win election countdown clock for upcoming elections and campaign pages."
	/>
	<link rel="canonical" href="/election-countdown-clock" />
</svelte:head>

<div class={compact ? 'h-full bg-[#001666]' : 'h-full overflow-y-auto bg-[#eef1f5]'}>
	<section class={compact ? 'p-0' : 'mx-auto max-w-6xl px-4 py-8'}>
		{#if !compact}
			<div class="mb-6 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
				<div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
					<div class="p-6 md:p-8">
						<div class="inline-flex items-center gap-2 rounded-full bg-[#eaf0fb] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#2e5aac]">
							<span class="h-2 w-2 rounded-full bg-[#d83a45]"></span>
							Embeddable election tool
						</div>
						<h1 class="mt-4 text-3xl font-black leading-tight text-[#061a55] md:text-5xl">
							Election Countdown Clock
						</h1>
						<p class="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
							Add a branded Path to Win countdown to election pages, campaign dashboards, news
							posts, or live result hubs. The iframe version stays compact, responsive, and
							ready for embeds.
						</p>
						<div class="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
							<span class="rounded bg-[#2e5aac] px-3 py-1.5 text-white">Responsive</span>
							<span class="rounded bg-[#d83a45] px-3 py-1.5 text-white">American flag theme</span>
							<span class="rounded bg-[#f0ead8] px-3 py-1.5 text-[#655c3f]">Custom date</span>
						</div>
					</div>
					<div class="relative min-h-56 overflow-hidden bg-[#061a55] p-6 md:p-8">
						<div class="absolute inset-0 opacity-20">
							<div class="h-full w-full bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(0deg,#fff_1px,transparent_1px)] bg-[size:38px_38px]"></div>
						</div>
						<div class="relative rounded-md border border-[#2f5bbf] bg-[#001666] p-5 text-white shadow-xl">
							<div class="flex items-center gap-3">
								<img src="/favicon.svg" alt="" class="h-12 w-12 rounded-md bg-white" aria-hidden="true" />
								<div>
									<div class="text-xs font-black uppercase tracking-[0.2em] text-[#9db8e0]">
										Path to Win
									</div>
									<div class="text-xl font-black">Live countdown widget</div>
								</div>
							</div>
							<div class="mt-5 grid grid-cols-4 gap-2">
								{#each units as unit}
									<div class="rounded bg-white p-2 text-center text-[#061a55]">
										<div class="text-xl font-black tabular-nums">
											{unit.value.toString().padStart(2, '0')}
										</div>
										<div class="text-[10px] font-black uppercase text-neutral-500">{unit.label}</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div
			class={`overflow-hidden border border-[#2f5bbf] bg-[#001666] text-white shadow-xl ${
				compact ? 'min-h-full rounded-none' : 'rounded-md'
			}`}
		>
			<div class="grid gap-0 lg:grid-cols-[1.05fr_1.4fr]">
				<div class="relative overflow-hidden bg-[#061a55] p-5 md:p-7">
					<div class="absolute inset-0 opacity-10">
						<div class="h-full w-full bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(0deg,#fff_1px,transparent_1px)] bg-[size:34px_34px]"></div>
					</div>
					<div class="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-[#2e5aac] via-white to-[#d83a45]"></div>
					<div class="relative flex items-center gap-3">
						<img
							src="/favicon.svg"
							alt=""
							class="h-12 w-12 rounded-md bg-white object-contain"
							aria-hidden="true"
						/>
						<div>
							<div class="text-xs font-black uppercase tracking-[0.2em] text-[#9db8e0]">
								Path to Win
							</div>
							<h1 class="text-2xl font-black leading-tight md:text-3xl">{title}</h1>
						</div>
					</div>
					<p class="mt-5 text-sm font-semibold uppercase tracking-wide text-[#9db8e0]">{label}</p>
					<p class="mt-2 text-sm leading-relaxed text-[#d7e2f7]">
						{#if targetIsValid}
							Counting down to {formattedDate}.
						{:else}
							Use a valid ISO date in the URL, for example <span class="font-mono">?date=2026-11-03T00:00:00-05:00</span>.
						{/if}
					</p>
				</div>

				<div class="bg-white p-5 text-[#061a55] md:p-7">
					{#if isComplete}
						<div class="flex h-full min-h-36 items-center justify-center rounded-md border border-[#d83a45] bg-[#fff3f4] p-6 text-center">
							<div>
								<div class="text-4xl font-black text-[#d83a45]">Election Day</div>
								<p class="mt-2 text-sm font-semibold text-neutral-600">The countdown has reached the target date.</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
							{#each units as unit}
								<div class="rounded-md border border-neutral-200 bg-[#f7f8fb] p-4 text-center shadow-sm ring-1 ring-white">
									<div class="text-4xl font-black tabular-nums leading-none md:text-5xl">
										{unit.value.toString().padStart(2, '0')}
									</div>
									<div class="mt-2 text-xs font-black uppercase tracking-wide text-neutral-500">
										{unit.label}
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center text-xs font-black uppercase tracking-wide text-neutral-500">
							<div class="h-px bg-neutral-200"></div>
							<div>To Win</div>
							<div class="h-px bg-neutral-200"></div>
						</div>
						<div class="mt-4 rounded-md border border-neutral-200 bg-[#f7f8fb] p-3 text-center text-xs font-semibold text-neutral-600">
							Target date: <span class="font-black text-[#061a55]">{formattedDate}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if !compact}
			<div class="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
				<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-black text-[#061a55]">Embed This Countdown</h2>
					<p class="mt-2 text-sm leading-relaxed text-neutral-600">
						Add the iframe below to any page. Customize the countdown by changing the
						<span class="font-mono">title</span>, <span class="font-mono">label</span>, and
						<span class="font-mono">date</span> query parameters.
					</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							onclick={copyEmbedCode}
							class="rounded-md bg-[#061a55] px-4 py-2 text-sm font-black text-white hover:bg-[#102a78]"
						>
							{copied ? 'Copied' : 'Copy Embed Code'}
						</button>
						<a
							href={embedUrl}
							class="rounded-md border border-neutral-300 px-4 py-2 text-sm font-black text-[#061a55] hover:bg-[#f7f8fb]"
						>
							Preview Embed
						</a>
					</div>
					<textarea
						class="mt-4 h-32 w-full resize-none rounded-md border border-neutral-300 bg-[#f7f8fb] p-3 font-mono text-xs text-neutral-800"
						readonly
						value={embedCode}
						aria-label="Embed code"
					></textarea>
					{#if copied}
						<p class="mt-2 text-xs font-bold text-[#157347]">Embed code copied to clipboard.</p>
					{/if}
				</section>

				<section class="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-black text-[#061a55]">Customization</h2>
					<ul class="mt-3 space-y-2 text-sm text-neutral-700">
						<li><span class="font-mono text-[#061a55]">date</span>: ISO target date with timezone.</li>
						<li><span class="font-mono text-[#061a55]">title</span>: election or event name.</li>
						<li><span class="font-mono text-[#061a55]">label</span>: short line above the date.</li>
						<li><span class="font-mono text-[#061a55]">embed=1</span>: hides the site nav for iframe use.</li>
					</ul>
					<a
						href={embedUrl}
						class="mt-5 inline-flex rounded-md bg-[#d83a45] px-4 py-2 text-sm font-black text-white hover:bg-[#b92f39]"
					>
						Open Embed View
					</a>
				</section>
			</div>
		{/if}
	</section>
	{#if !compact}
		<SiteFooter />
	{/if}
</div>
