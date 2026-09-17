<script lang="ts">
	import type { Image } from '$lib/data/types';
	import Picture from './Picture.svelte';

	interface Props {
		slug: string;
		number: string;
		title: string;
		description: string;
		count: number;
		images: Image[];
		flip?: boolean;
	}

	let { slug, number, title, description, count, images, flip = false }: Props = $props();

	const [wide, tall] = $derived(images);
	const href = $derived(`/work/${slug}`);
</script>

<article class="grid grid-cols-12 gap-x-(--spacing-gutter) gap-y-8" aria-labelledby="spread-{slug}">
	<a
		{href}
		tabindex="-1"
		aria-hidden="true"
		class="group col-span-12 block overflow-hidden md:col-span-7 {flip ? 'md:col-start-6 md:row-start-1' : ''}"
	>
		<div class="reveal-image">
			<Picture
				image={wide}
				sizes="(min-width: 768px) 58vw, 100vw"
				class="transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.025]"
			/>
		</div>
	</a>

	<div
		class="col-span-12 flex flex-col justify-between gap-10 md:col-span-4 md:row-start-1 {flip
			? 'md:col-start-1'
			: 'md:col-start-9'}"
	>
		<header class="reveal">
			<p class="label text-muted">{number} <span class="mx-2">—</span> {count} photographs</p>
			<h3 id="spread-{slug}" class="mt-4 text-title">
				<a {href} class="link-quiet">{title}</a>
			</h3>
			<p class="mt-5 max-w-[34ch] text-muted">{description}</p>
			<a {href} class="label mt-8 inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
				View series <span aria-hidden="true">→</span>
			</a>
		</header>

		<a {href} tabindex="-1" aria-hidden="true" class="group hidden w-3/4 overflow-hidden md:block {flip ? '' : 'self-end'}">
			<div class="reveal-image">
				<Picture
					image={tall}
					sizes="(min-width: 768px) 25vw, 0px"
					class="transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.03]"
				/>
			</div>
		</a>
	</div>
</article>
