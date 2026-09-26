<script lang="ts">
	import { CandidatesStore, TossupCandidateStore } from '$lib/stores/Candidates';
	import { ChartPositionStore } from '$lib/stores/Chart';
	import { CandidateCounts, CandidateCountsMargins } from '$lib/stores/regions/Regions';
	import { calculateLumaHEX } from '$lib/utils/luma';
	import { MapIdentifier } from '$lib/stores/MapIdentifier';
	import CandidateHeadshotDropdown from './CandidateHeadshotDropdown.svelte';
	import BattleChartLabel from './BattleChartLabel.svelte';

	const { transitions = true }: { transitions?: boolean } = $props();
	const democratCandidateOptions = [
		{ name: 'Democrats' },
		{
			name: 'Kamala Harris',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Kamala_Harris_Vice_Presidential_Portrait.jpg/330px-Kamala_Harris_Vice_Presidential_Portrait.jpg'
		},
		{
			name: 'Gavin Newsom',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Governor_of_California_Gavin_Newsom_%28cropped_3x4%29.jpg/330px-Governor_of_California_Gavin_Newsom_%28cropped_3x4%29.jpg'
		},
		{
			name: 'Gretchen Whitmer',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/2025_Gretchen_Whitmer_%28cropped%29.jpg/330px-2025_Gretchen_Whitmer_%28cropped%29.jpg'
		},
		{
			name: 'Pete Buttigieg',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pete_Buttigieg%2C_Secretary_of_Transportation.jpg/330px-Pete_Buttigieg%2C_Secretary_of_Transportation.jpg'
		},
		{
			name: 'Josh Shapiro',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Josh_Shapiro_December_2025.jpg/330px-Josh_Shapiro_December_2025.jpg'
		},
		{
			name: 'JB Pritzker',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Governor_JB_Pritzker_official_portrait_2019_%28crop%29.jpg/330px-Governor_JB_Pritzker_official_portrait_2019_%28crop%29.jpg'
		},
		{
			name: 'Wes Moore',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wes_Moore_Official_Governor_Portrait.jpg/330px-Wes_Moore_Official_Governor_Portrait.jpg'
		},
		{
			name: 'Andy Beshear',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Andy_Beshear_in_April_2026_%28cropped%29.jpg/330px-Andy_Beshear_in_April_2026_%28cropped%29.jpg'
		},
		{
			name: 'Ruben Gallego',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Senator_Ruben_Gallego_Official_Portrait.jpg/330px-Senator_Ruben_Gallego_Official_Portrait.jpg'
		},
		{
			name: 'Alexandria Ocasio-Cortez',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg/330px-Alexandria_Ocasio-Cortez_Official_Portrait.jpg'
		}
	];
	const republicanCandidateOptions = [
		{ name: 'Republicans' },
		{
			name: 'JD Vance',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/March_2026_Official_Vice_Presidential_Portrait_of_JD_Vance_%28head-and-shoulders_cropped%29.jpg/330px-March_2026_Official_Vice_Presidential_Portrait_of_JD_Vance_%28head-and-shoulders_cropped%29.jpg'
		},
		{
			name: 'Marco Rubio',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Official_portrait_of_Secretary_Marco_Rubio_%28cropped%29%282%29.jpg/330px-Official_portrait_of_Secretary_Marco_Rubio_%28cropped%29%282%29.jpg'
		},
		{
			name: 'Ron DeSantis',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gov-Ron-DeSantis-Official-2-X2.jpg/330px-Gov-Ron-DeSantis-Official-2-X2.jpg'
		},
		{
			name: 'Nikki Haley',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nikki_Haley_official_photo.jpg/330px-Nikki_Haley_official_photo.jpg'
		},
		{
			name: 'Vivek Ramaswamy',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/AmericaFest_2025_-_Vivek_Ramaswamy_03_%28cropped%29.jpg/330px-AmericaFest_2025_-_Vivek_Ramaswamy_03_%28cropped%29.jpg'
		},
		{
			name: 'Glenn Youngkin',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Youngkin_Governor_Portrait.jpg/330px-Youngkin_Governor_Portrait.jpg'
		},
		{
			name: 'Ted Cruz',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Ted_Cruz_official_116th_portrait_%283x4_cropped%29.jpg/330px-Ted_Cruz_official_116th_portrait_%283x4_cropped%29.jpg'
		},
		{
			name: 'Kristi Noem',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Official_Portrait_of_Secretary_Kristi_Noem.jpg/330px-Official_Portrait_of_Secretary_Kristi_Noem.jpg'
		}
	];

	let selectedDemocratLabel = $state(democratCandidateOptions[0].name);
	let selectedRepublicanLabel = $state(republicanCandidateOptions[0].name);

	const tossupCounts = $derived({
		count: $CandidateCounts.get($TossupCandidateStore.id) ?? 0,
		color: $TossupCandidateStore.margins.at(0)?.color ?? '#000000'
	});

	const countsWithLeans = $derived(
		$CandidatesStore.map((candidate) => {
			return candidate.margins.map((margin, index) => ({
				candidateName: candidate.name,
				count: $CandidateCountsMargins.get(candidate.id)?.at(index) ?? 0,
				color: margin.color
			}));
		})
	);

	const choosenChartData = $derived(countsWithLeans);
	const twoPartyChartData = $derived.by(() => {
		if (choosenChartData.length !== 2) {
			return undefined;
		}

		const democratIndex = $CandidatesStore.findIndex((candidate) =>
			candidate.name.toLowerCase().includes('democrat')
		);
		const republicanIndex = $CandidatesStore.findIndex((candidate) =>
			candidate.name.toLowerCase().includes('republican')
		);

		if (democratIndex !== -1 && republicanIndex !== -1) {
			return [choosenChartData[democratIndex], choosenChartData[republicanIndex]];
		}

		return choosenChartData;
	});

	const finalChartData = $derived(
		twoPartyChartData !== undefined
			? [
					...(twoPartyChartData.at(0) ?? []),
					tossupCounts,
					...(twoPartyChartData.at(1) ?? []).reverse()
				]
			: [tossupCounts, ...choosenChartData.flat()]
	);

	/**
	 * Sum the total number of votes
	 */
	const total = $derived(finalChartData.reduce((total, count) => total + count.count, 0));
	const winThreshold = $derived(
		$MapIdentifier?.type === 'presidential' ? 270 : Math.floor(total / 2) + 1
	);

	/**
	 * Calculate the percentage of votes for each candidate
	 */
	const percentages = $derived(finalChartData.map((count) => (total === 0 ? 0 : count.count / total)));
	const winThresholdPosition = $derived(total === 0 ? 0.5 : Math.min(1, winThreshold / total));
	const labels = $derived.by(() => {
		let offset = 0;
		return finalChartData.map((count, index) => {
			const percentage = percentages[index] ?? 0;
			const center = offset + percentage / 2;
			offset += percentage;

			return {
				count: count.count,
				color: calculateLumaHEX(count.color) > 0.5 ? '#000000' : '#ffffff',
				center,
				top: percentage < 0.035 ? (index % 2 === 0 ? 35 : 65) : 50,
				size:
					percentage < 0.025
						? 'text-[9px] sm:text-[10px]'
						: percentage < 0.08
							? 'text-[10px] sm:text-xs'
							: 'text-base sm:text-lg'
			};
		});
	});
	const partySummaries = $derived.by(() => {
		const democrat =
			$CandidatesStore.find((candidate) => candidate.name.toLowerCase().includes('democrat')) ??
			$CandidatesStore.at(0);
		const republican =
			$CandidatesStore.find((candidate) => candidate.name.toLowerCase().includes('republican')) ??
			$CandidatesStore.at(1);

		return {
			left:
				democrat !== undefined
					? {
							name: democrat.name,
							count: $CandidateCounts.get(democrat.id) ?? 0,
							color: democrat.margins.at(0)?.color ?? '#000000'
						}
					: undefined,
			right:
				republican !== undefined
					? {
							name: republican.name,
							count: $CandidateCounts.get(republican.id) ?? 0,
							color: republican.margins.at(0)?.color ?? '#000000'
						}
					: undefined
		};
	});
	const showCandidateDropdowns = $derived(
		$MapIdentifier?.type === 'presidential' &&
			$MapIdentifier?.date === '2028' &&
			$MapIdentifier?.variant === '2024map' &&
			partySummaries.left?.name.toLowerCase() === 'democrats' &&
			partySummaries.right?.name.toLowerCase() === 'republicans'
	);

	/**
	 * Calculate the color of the candidate with over half the votes
	 */
	const winningColor = $derived(
		$CandidatesStore.reduce(
			(current, candidate) => {
				const nextWinner = $CandidateCounts.get(candidate.id) ?? 0;
				if (nextWinner > total / 2) {
					return candidate.margins.at(0)?.color ?? '#000000';
				} else {
					return current;
				}
			},
			$TossupCandidateStore.margins.at(0)?.color ?? '#000000'
		)
	);
</script>

<div
	class="flex w-full h-full justify-center min-w-0 min-h-0"
	class:flex-col={$ChartPositionStore === 'bottom'}
	class:flex-row-reverse={$ChartPositionStore === 'left'}
>
	<div
		class="flex"
		class:flex-col={$ChartPositionStore === 'bottom'}
		class:justify-center={$ChartPositionStore === 'bottom'}
		class:gap-1={$ChartPositionStore === 'bottom'}
		class:w-full={$ChartPositionStore === 'bottom'}
		class:h-full={$ChartPositionStore === 'left'}
	>
		{#if $ChartPositionStore === 'bottom'}
			<div class="flex w-full items-end justify-between px-1 text-base font-bold leading-none sm:text-lg">
				{#if partySummaries.left !== undefined}
					<div class="flex items-center gap-2 min-w-0" style:color={partySummaries.left.color}>
						{#if showCandidateDropdowns}
							<CandidateHeadshotDropdown
								options={democratCandidateOptions}
								bind:value={selectedDemocratLabel}
								color={partySummaries.left.color}
								ariaLabel="Select Democratic candidate"
							/>
						{:else}
							<span class="truncate">{partySummaries.left.name}</span>
						{/if}
						<span class="shrink-0">{partySummaries.left.count}</span>
					</div>
				{/if}
				{#if partySummaries.right !== undefined}
					<div
						class="flex items-center justify-end gap-2 min-w-0"
						style:color={partySummaries.right.color}
					>
						<span class="shrink-0">{partySummaries.right.count}</span>
						{#if showCandidateDropdowns}
							<CandidateHeadshotDropdown
								options={republicanCandidateOptions}
								bind:value={selectedRepublicanLabel}
								color={partySummaries.right.color}
								ariaLabel="Select Republican candidate"
								align="right"
							/>
						{:else}
							<span class="truncate">{partySummaries.right.name}</span>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
		<div
			class="relative"
			class:w-16={$ChartPositionStore === 'left'}
			class:h-10={$ChartPositionStore === 'bottom'}
			class:w-full={$ChartPositionStore === 'bottom'}
			class:h-full={$ChartPositionStore === 'left'}
		>
			{#if $CandidatesStore.length === 2}
				<div
					class="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white/95 shadow-sm"
					style:left={`${winThresholdPosition * 100}%`}
				></div>
				<div
					class="absolute z-20 flex items-center gap-1 rounded-sm bg-white/90 px-1 py-0.5 text-[10px] font-bold leading-none shadow-sm {$ChartPositionStore ===
					'bottom'
						? '-translate-x-1/2 -top-5'
						: 'top-1/2 -translate-y-1/2 -right-1'}"
					style:left={$ChartPositionStore === 'bottom'
						? `${winThresholdPosition * 100}%`
						: undefined}
					style:color={winningColor}
				>
					{winThreshold}
					<span
						style="width: 0; height: 0; border-left: 0.35rem solid transparent; border-right: 0.35rem solid transparent; border-top: 0.45rem solid currentColor;"
					></span>
				</div>
				<div
					class="absolute z-10 {$ChartPositionStore === 'bottom'
						? '-translate-x-1/2 -bottom-1'
						: 'top-1/2 -translate-y-1/2 -left-1'}"
					style:left={$ChartPositionStore === 'bottom'
						? `${winThresholdPosition * 100}%`
						: undefined}
					style="width: 0; height: 0; border-left: 0.6rem solid transparent; border-right: 0.6rem solid transparent; border-bottom: 0.75rem solid {winningColor};"
				></div>
			{/if}
			<div
				class="flex w-full h-full overflow-hidden"
				class:flex-col={$ChartPositionStore === 'left'}
				class:flex-row={$ChartPositionStore === 'bottom'}
			>
				{#each finalChartData as count, index}
					<BattleChartLabel
						count={count.count}
						color={count.color}
						percentage={percentages[index]}
						{transitions}
					/>
				{/each}
			</div>
			<div class="pointer-events-none absolute inset-0 z-10">
				{#each labels as label}
					{#if label.count > 0}
						<span
							class="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-semibold leading-none drop-shadow-sm {label.size}"
							style:left={`${label.center * 100}%`}
							style:top={`${label.top}%`}
							style:color={label.color}
						>
							{label.count}
						</span>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
