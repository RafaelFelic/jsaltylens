<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Image } from '$lib/data/types';
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
	let playing = $state(false);
	let hidden = $state(false);
	let mounted = new SvelteSet<number>([0]);

	const next = $derived((index + 1) % slides.length);
	const running = $derived(playing && !hidden);
	const caption = $derived(slides[index].caption);
	const counter = (value: number) => String(value + 1).padStart(2, '0');

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

	let previous = $state(-1);

	function show(target: number) {
		if (target === index) return;
		previous = index;
		index = target;
	}

	const go = (step: number) => show((index + step + slides.length) % slides.length);

	const [lead, accent] = $derived(headline.split(' & '));
</script>

<section
	class="hero relative isolate h-svh min-h-[36rem] overflow-hidden bg-[#10100f] text-on-photo"
	aria-roledescription="carousel"
	aria-label="Featured photographs"
>
	<div class="absolute inset-0" aria-live={running ? 'off' : 'polite'}>
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
						<Picture image={slide.image} sizes="100vw" fill priority={i === 0} />
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<div class="scrim pointer-events-none absolute inset-0" aria-hidden="true"></div>

	<div class="frame relative flex h-full flex-col justify-end pb-[max(2rem,env(safe-area-inset-bottom))] sm:pb-12">
		<div class="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<p class="label rise" style:--delay="0ms">{location}</p>
				<h1 class="rise mt-5 font-serif text-display" style:--delay="60ms">
					{lead}{#if accent}<br /><em class="italic">&amp; {accent}</em>{/if}
				</h1>
			</div>

			<div class="intro flex items-end justify-between gap-6 lg:col-span-4 lg:justify-end" style:--delay="420ms">
				<div class="min-w-0 flex-1 lg:flex-none lg:text-right">
					{#if caption}
						<a href={caption.href} class="label link-quiet inline-block max-w-full truncate py-1">{caption.label}</a>
					{:else}
						<span class="label block py-1">&nbsp;</span>
					{/if}
					<div class="mt-2 h-px w-full max-w-40 bg-on-photo/25 lg:ml-auto lg:w-40">
						{#key `${index}-${running}`}
							<div class="progress h-full bg-on-photo" class:running></div>
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
	</div>
</section>

<style>
	.slide {
		opacity: 0;
		transition: opacity 1600ms var(--ease-in-out-soft);
	}

	.slide.active {
		opacity: 1;
		z-index: 1;
	}

	.scrim {
		z-index: 2;
		background:
			linear-gradient(to top, rgb(8 8 7 / 0.72) 0%, rgb(8 8 7 / 0.28) 32%, transparent 58%),
			linear-gradient(to bottom, rgb(8 8 7 / 0.25), transparent 22%);
	}

	.frame {
		z-index: 3;
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
		background-color: rgb(255 255 255 / 0.12);
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

		.intro {
			animation: intro-rise 1100ms var(--ease-out-expo) both;
			animation-delay: var(--delay);
		}
	}

	@keyframes drift {
		from {
			scale: 1;
		}
		to {
			scale: 1.06;
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

	@keyframes intro-rise {
		from {
			opacity: 0;
			translate: 0 1.5rem;
		}
	}
</style>
