<script lang="ts">
	import type { Image } from '$lib/data/types';
	import Picture from './Picture.svelte';

	type GalleryImage = Image & { feature?: boolean };

	interface Props {
		images: GalleryImage[];
		href: (index: number) => string;
		label: (index: number) => string;
		onopen?: (index: number, event: MouseEvent) => void;
		transitionIndex?: number;
	}

	let { images, href, label, onopen, transitionIndex }: Props = $props();

	type Item = { image: GalleryImage; index: number; ratio: number };
	type Row = { items: Item[]; sum: number };
	type Block = { kind: 'rows'; rows: Row[] } | { kind: 'feature'; image: GalleryImage; index: number };

	const target = 3.2;

	function partition(items: Item[]): Row[] {
		const rows: Row[] = [];
		let current: Row = { items: [], sum: 0 };
		for (const item of items) {
			current.items.push(item);
			current.sum += item.ratio;
			if (current.sum >= target) {
				rows.push(current);
				current = { items: [], sum: 0 };
			}
		}
		if (current.items.length) {
			const last = rows.at(-1);
			if (last && current.sum < target * 0.5) {
				last.items.push(...current.items);
				last.sum += current.sum;
			} else {
				rows.push(current);
			}
		}
		return rows;
	}

	const blocks = $derived.by(() => {
		const result: Block[] = [];
		let pending: Item[] = [];
		const flush = () => {
			if (pending.length) result.push({ kind: 'rows', rows: partition(pending) });
			pending = [];
		};
		images.forEach((image, index) => {
			if (image.feature && image.width > image.height) {
				flush();
				result.push({ kind: 'feature', image, index });
			} else {
				pending.push({ image, index, ratio: image.width / image.height });
			}
		});
		flush();
		return result;
	});

	const name = (index: number) => (transitionIndex === index ? 'lightbox-photo' : undefined);

	const sizes = (ratio: number, sum: number) =>
		`(min-width: 640px) ${Math.round((ratio / sum) * 100)}vw, ${ratio > 1 ? '100vw' : '60vw'}`;
</script>

<div class="gallery grid gap-(--gap)">
	{#each blocks as block, blockIndex (blockIndex)}
		{#if block.kind === 'feature'}
			<a
				href={href(block.index)}
				id="photo-{block.index + 1}"
				class="tile block"
				aria-label={label(block.index)}
				onclick={(event) => onopen?.(block.index, event)}
			>
				<Picture
					image={block.image}
					sizes="(min-width: 1760px) 1700px, 100vw"
					priority={blockIndex === 0}
					transitionName={name(block.index)}
					alt=""
				/>
			</a>
		{:else}
			<div class="rows">
				{#each block.rows as row, rowIndex (rowIndex)}
					<ul class="row" style:--sum={row.sum}>
						{#each row.items as { image, index, ratio } (image.id)}
							<li class="item" style:--ar={ratio}>
								<a
									href={href(index)}
									id="photo-{index + 1}"
									class="tile block h-full"
									aria-label={label(index)}
									onclick={(event) => onopen?.(index, event)}
								>
									<Picture
										{image}
										sizes={sizes(ratio, row.sum)}
										class="h-full"
										priority={blockIndex === 0 && rowIndex === 0 && index < 2}
										transitionName={name(index)}
										alt=""
									/>
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style>
	.gallery {
		--gap: clamp(0.5rem, 0.3rem + 0.8vw, 1rem);
	}

	.rows {
		display: grid;
		gap: var(--gap);
	}

	.row {
		display: flex;
		gap: var(--gap);
		max-width: calc(var(--sum) * 34rem);
	}

	.item {
		flex: var(--ar) 1 0;
		min-width: 0;
		aspect-ratio: var(--ar);
	}

	@media (max-width: 639px) {
		.rows {
			display: flex;
			flex-wrap: wrap;
		}

		.rows::after {
			content: '';
			flex-grow: 999999;
		}

		.row {
			display: contents;
		}

		.item {
			flex: calc(var(--ar) * 100) 1 calc(var(--ar) * 11rem);
		}
	}

	.tile {
		position: relative;
		overflow: hidden;
		cursor: zoom-in;
	}

	.tile::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgb(10 10 9 / 0);
		transition: background-color 500ms var(--ease-out-expo);
		pointer-events: none;
	}

	.tile :global(.photo) {
		transition:
			opacity 700ms var(--ease-in-out-soft),
			scale 1200ms var(--ease-out-expo);
	}

	.tile:hover :global(.photo) {
		scale: 1.03;
	}

	.tile:hover::after {
		background: rgb(10 10 9 / 0.08);
	}

	@media (prefers-reduced-motion: no-preference) {
		@supports (animation-timeline: view()) {
			.tile {
				animation: tile-in both var(--ease-out-expo);
				animation-timeline: view();
				animation-range: entry 0% entry 60%;
			}
		}
	}

	@keyframes tile-in {
		from {
			translate: 0 2.5rem;
		}
	}
</style>
