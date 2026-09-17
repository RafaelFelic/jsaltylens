<script lang="ts">
	import { onMount } from 'svelte';
	import type { Image } from '$lib/data/types';
	import Picture from './Picture.svelte';

	interface Props {
		images: Image[];
		index: number;
		title: string;
		titleHref: string;
		closeHref: string;
		href: (index: number) => string;
		onnavigate: (index: number) => void;
		onclose?: () => void;
		transitionIndex?: number;
		ssrOpen?: boolean;
	}

	let {
		images,
		index,
		title,
		titleHref,
		closeHref,
		href,
		onnavigate,
		onclose,
		transitionIndex,
		ssrOpen = false
	}: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	let dragX = $state(0);
	let dragging = $state(false);
	let start: { x: number; y: number; id: number } | null = null;

	const count = $derived(images.length);
	const prev = $derived((index - 1 + count) % count);
	const next = $derived((index + 1) % count);
	const visible = $derived(new Set([prev, index, next]));
	const pad = (value: number) => String(value + 1).padStart(2, '0');

	let requested = false;

	onMount(() => {
		if (!dialog) return;
		dialog.showModal();
		return () => {
			requested = true;
			if (dialog?.open) dialog.close();
		};
	});

	function close(event?: Event) {
		if (!onclose) return;
		event?.preventDefault();
		if (requested) return;
		requested = true;
		onclose();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
		if (event.key === 'Escape') {
			close(event);
			return;
		}
		const targets: Record<string, number> = { ArrowLeft: prev, ArrowRight: next, Home: 0, End: count - 1 };
		if (event.key in targets) {
			event.preventDefault();
			onnavigate(targets[event.key]);
		}
	}

	function onpointerdown(event: PointerEvent) {
		if (event.pointerType === 'mouse' || !event.isPrimary) return;
		start = { x: event.clientX, y: event.clientY, id: event.pointerId };
	}

	function onpointermove(event: PointerEvent) {
		if (!start || event.pointerId !== start.id) return;
		const dx = event.clientX - start.x;
		const dy = event.clientY - start.y;
		if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) dragging = true;
		if (dragging) dragX = dx;
	}

	function onpointerup(event: PointerEvent) {
		if (!start || event.pointerId !== start.id) return;
		const threshold = Math.min(90, window.innerWidth * 0.18);
		if (dragging && Math.abs(dragX) > threshold) onnavigate(dragX < 0 ? next : prev);
		start = null;
		dragging = false;
		dragX = 0;
	}
</script>

<svelte:window {onkeydown} />

<dialog
	bind:this={dialog}
	data-page={ssrOpen ? '' : undefined}
	class="lightbox fixed inset-0 z-[80] m-0 h-dvh max-h-none w-full max-w-none bg-[#0b0b0a] p-0 text-[#ece7df]"
	aria-label="{title}, photo {index + 1} of {count}"
	oncancel={close}
	onclose={() => dialog?.open || close()}
>
	<div class="grid h-full grid-rows-[auto_1fr_auto]">
		<div class="flex items-center justify-between gap-4 px-(--spacing-gutter) py-4">
			<p class="label flex min-w-0 items-center gap-3">
				<a href={titleHref} class="link-quiet truncate">{title}</a>
				<span class="text-[#a8a29a] tabular-nums">{pad(index)} / {pad(count - 1)}</span>
			</p>
			<a href={closeHref} class="label flex items-center gap-3 py-2" onclick={close}>
				Close
				<span class="relative block size-4" aria-hidden="true">
					<span class="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current"></span>
					<span class="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current"></span>
				</span>
			</a>
		</div>

		<div
			class="stage relative min-h-0 touch-pan-y select-none"
			role="presentation"
			{onpointerdown}
			{onpointermove}
			{onpointerup}
			onpointercancel={onpointerup}
		>
			{#each images as image, i (image.id)}
				{#if visible.has(i)}
					<figure
						class="slide absolute inset-0 m-0 grid place-items-center px-(--spacing-gutter) sm:px-24"
						class:current={i === index}
						class:dragging
						style:translate={i === index && dragX ? `${dragX}px 0` : undefined}
						aria-hidden={i !== index}
					>
						<div class="fit h-full w-full" style:--ar={image.width / image.height}>
							<Picture
								{image}
								sizes="100vw"
								class="box"
								capped
								fit="contain"
								priority={i === index}
								transitionName={i === index && transitionIndex === index ? 'lightbox-photo' : undefined}
							/>
						</div>
					</figure>
				{/if}
			{/each}

			<a href={href(prev)} class="nav left-0" aria-label="Previous photo" onclick={(e) => (e.preventDefault(), onnavigate(prev))}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
			</a>
			<a href={href(next)} class="nav right-0" aria-label="Next photo" onclick={(e) => (e.preventDefault(), onnavigate(next))}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
			</a>
		</div>

		<p class="label px-(--spacing-gutter) py-4 text-center text-[#a8a29a]">
			<span class="hidden sm:inline">Use ← → to browse · Esc to close</span>
			<span class="sm:hidden">Swipe to browse</span>
		</p>
	</div>

	<p class="sr-only" aria-live="polite">Photo {index + 1} of {count}: {images[index].alt}</p>
</dialog>

<style>
	.lightbox {
		border: 0;
		overscroll-behavior: contain;
		color-scheme: dark;
	}

	.lightbox:not([open]) {
		display: none;
	}

	:global(html:not(.js)) .lightbox[data-page] {
		display: block;
	}

	.lightbox::backdrop {
		background: #0b0b0a;
	}

	:global(html:has(.lightbox[open])) {
		overflow: hidden;
	}

	.slide {
		opacity: 0;
		transition:
			opacity 450ms var(--ease-in-out-soft),
			translate 450ms var(--ease-out-expo);
	}

	.slide.current {
		opacity: 1;
		z-index: 1;
	}

	.slide.dragging {
		transition: none;
	}

	.fit {
		container-type: size;
		display: grid;
		place-items: center;
	}

	.fit :global(.box) {
		width: min(100cqw, 100cqh * var(--ar));
		height: auto;
		background-color: transparent !important;
	}

	.nav {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(3rem, 12vw, 6rem);
		color: #ece7df;
		opacity: 0.55;
		transition: opacity 250ms ease;
	}

	.nav:hover,
	.nav:focus-visible {
		opacity: 1;
	}

	.nav svg {
		width: 1.75rem;
		height: 1.75rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.25;
	}

	@media (max-width: 639px) {
		.nav {
			top: auto;
			height: 4rem;
			bottom: -4rem;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.lightbox[open] {
			animation: fade-in 350ms var(--ease-in-out-soft);
		}
	}
</style>
