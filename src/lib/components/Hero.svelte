<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Image } from '$lib/data/types';
	import { cap } from '$lib/image-cap';
	import Picture from './Picture.svelte';

	interface Slide {
		image: Image;
		caption?: { label: string; href: string };
	}

	interface Props {
		slides: Slide[];
		headline: string;
		location: string;
	}

	let { slides, headline, location }: Props = $props();

	const interval = 6500;

	let index = $state(0);
	let previous = $state(-1);
	let playing = $state(false);
	let hidden = $state(false);
	let mounted = new SvelteSet<number>([0]);

	const next = $derived((index + 1) % slides.length);
	const running = $derived(playing && !hidden);
	const caption = $derived(slides[index].caption);
	const smallest = $derived(Math.min(...slides.map((slide) => slide.image.width)));
	const [lead, accent] = $derived(headline.split(' & '));
	const counter = (value: number) => String(value + 1).padStart(2, '0');

	function show(target: number) {
		if (target === index) return;
		previous = index;
		index = target;
	}

	const go = (step: number) => show((index + step + slides.length) % slides.length);

	$effect(() => {
		mounted.add(index);
		mounted.add(next);
	});

	$effect(() => {
		if (!running) return;
		const timer = setTimeout(() => show(next), interval);
		return () => clearTimeout(timer);
	});

	onMount(() => {
		playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
		const onVisibility = () => (hidden = document.hidden);
		document.addEventListener('visibilitychange', onVisibility);
		return () => document.removeEventListener('visibilitychange', onVisibility);
	});
</script>

<section
	class="frame grid grid-cols-1 gap-y-8 pt-[clamp(1.5rem,1rem+2vw,3rem)] lg:min-h-[calc(100svh-var(--spacing-header))] lg:grid-cols-12 lg:content-center lg:gap-x-(--spacing-gutter)"
	aria-roledescription="carousel"
	aria-label="Featured photographs"
>
	<div class="lg:col-span-7 lg:col-start-6 lg:row-start-1">
		<div class="stage cap relative aspect-[3/2] overflow-hidden bg-paper-raised" style={cap(smallest)} aria-live={running ? 'off' : 'polite'}>
			{#each slides as slide, i (slide.image.id)}
				{#if mounted.has(i)}
					<div
						class="slide absolute inset-0"
						class:active={i === index}
						role="group"
						aria-roledescription="slide"
						aria-label="{i + 1} of {slides.length}"
						aria-hidden={i !== index}
						inert={i !== index}
					>
						<div class="zoom absolute inset-0" class:moving={i === index || i === previous} class:paused={!running}>
							<Picture
								image={slide.image}
								sizes="(min-width: 1760px) 1000px, (min-width: 1024px) 57vw, calc(100vw - 2rem)"
								fill
								priority={i === 0}
							/>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="flex flex-col justify-end gap-10 lg:col-span-5 lg:row-start-1 lg:self-stretch lg:pb-2">
		<div>
			<p class="label rise text-muted" style:--delay="0ms">{location}</p>
			<h1 class="rise mt-5 font-serif text-[clamp(2.75rem,1.4rem+4.4vw,7rem)] leading-[0.94]" style:--delay="60ms">
				{lead}{#if accent}<br /><em class="italic">&amp; {accent}</em>{/if}
			</h1>
		</div>

		<div class="flex items-end justify-between gap-6 border-t border-line pt-5">
			<div class="min-w-0 flex-1">
				{#if caption}
					<a href={caption.href} class="label link-quiet inline-block max-w-full truncate py-1">{caption.label}</a>
				{:else}
					<span class="label block py-1">&nbsp;</span>
				{/if}
				<div class="mt-2 h-px w-full max-w-40 bg-line">
					{#key `${index}-${running}`}
						<div class="progress h-full bg-ink" class:running></div>
					{/key}
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-1">
				<button type="button" class="control" onclick={() => go(-1)} aria-label="Previous photograph">
					<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
				</button>
				<span class="label w-14 text-center tabular-nums" aria-hidden="true">{counter(index)} / {counter(slides.length - 1)}</span>
				<button type="button" class="control" onclick={() => go(1)} aria-label="Next photograph">
					<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
				</button>
				<button
					type="button"
					class="control sm:ml-2"
					onclick={() => (playing = !playing)}
					aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
				>
					{#if playing}
						<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" /></svg>
					{:else}
						<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5Z" class="fill-current" /></svg>
					{/if}
				</button>
			</div>
		</div>
	</div>
</section>

<style>
	.stage {
		margin-inline-end: 0;
	}

	.slide {
		opacity: 0;
		transition: opacity 1600ms var(--ease-in-out-soft);
	}

	.slide.active {
		opacity: 1;
		z-index: 1;
	}

	.control {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		transition: background-color 200ms ease;
	}

	.control:hover {
		background-color: color-mix(in oklab, var(--ink) 8%, transparent);
	}

	.control svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.progress {
		transform-origin: left;
		scale: 0 1;
	}

	@media (prefers-reduced-motion: no-preference) {
		.zoom.moving {
			animation: drift 9000ms linear both;
		}

		.zoom.paused {
			animation-play-state: paused;
		}

		.progress.running {
			animation: progress 6500ms linear both;
		}

		.rise {
			animation: rise 1200ms var(--ease-out-expo) both;
			animation-delay: var(--delay);
		}
	}

	@keyframes drift {
		from {
			scale: 1;
		}
		to {
			scale: 1.04;
		}
	}

	@keyframes progress {
		to {
			scale: 1 1;
		}
	}

	@keyframes rise {
		from {
			translate: 0 1.25rem;
		}
	}
</style>
