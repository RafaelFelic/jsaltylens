<script lang="ts">
	import { formatPrice } from '$lib/data/prints';
	import type { Image } from '$lib/data/types';
	import Picture from './Picture.svelte';

	interface Props {
		slug: string;
		title: string;
		priceFrom: number;
		image: Image;
		number?: string;
		sizes: string;
		priority?: boolean;
		headingLevel?: 'h2' | 'h3';
		class?: string;
	}

	let {
		slug,
		title,
		priceFrom,
		image,
		number,
		sizes,
		priority = false,
		headingLevel = 'h3',
		class: className = ''
	}: Props = $props();
</script>

<article class="group relative {className}">
	<div class="overflow-hidden bg-paper-raised p-[7%]">
		<div class="shadow-[0_1px_2px_rgb(0_0_0/0.08),0_12px_30px_-12px_rgb(0_0_0/0.25)] transition-transform duration-700 ease-(--ease-out-expo) group-hover:-translate-y-1.5">
			<Picture {image} {sizes} {priority} />
		</div>
	</div>
	<div class="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
		<svelte:element this={headingLevel} class="font-serif text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] leading-tight">
			<a href="/prints/{slug}" class="after:absolute after:inset-0">
				{#if number}<span class="label mr-2 align-middle text-muted">{number}</span>{/if}{title}
			</a>
		</svelte:element>
		<p class="label shrink-0 text-muted">From {formatPrice(priceFrom)}</p>
	</div>
</article>
