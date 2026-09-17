<script lang="ts">
	import type { Image } from '$lib/data/types';
	import { cap } from '$lib/image-cap';

	interface Props {
		image: Image;
		sizes: string;
		priority?: boolean;
		fill?: boolean;
		fit?: 'cover' | 'contain';
		class?: string;
		imgClass?: string;
		transitionName?: string;
		alt?: string;
		capped?: boolean;
	}

	let {
		image,
		sizes,
		priority = false,
		fill = false,
		fit = 'cover',
		class: className = '',
		imgClass = '',
		transitionName,
		alt,
		capped = false
	}: Props = $props();

	let element: HTMLImageElement | undefined = $state();
	let loaded = $state(false);

	const formats = ['avif', 'webp'] as const;

	$effect(() => {
		if (element?.complete && element.naturalWidth > 0) loaded = true;
	});
</script>

<picture
	class="picture {fill ? 'absolute inset-0' : 'relative block'} {capped ? 'cap' : ''} {className}"
	style={capped ? cap(image.width) : undefined}
	style:aspect-ratio={fill ? undefined : `${image.width} / ${image.height}`}
	style:background-color={image.color}
	style:view-transition-name={transitionName}
	data-loaded={loaded || priority ? '' : undefined}
>
	{#if !priority}
		<img class="placeholder" class:contain={fit === 'contain'} src={image.lqip} alt="" aria-hidden="true" />
	{/if}
	{#each formats as format (format)}
		{#if image.picture.sources[format]}
			<source srcset={image.picture.sources[format]} {sizes} type="image/{format}" />
		{/if}
	{/each}
	<img
		bind:this={element}
		class="photo {imgClass}"
		class:object-contain={fit === 'contain'}
		class:object-cover={fit === 'cover'}
		src={image.picture.img.src}
		srcset={image.picture.sources.jpeg}
		{sizes}
		alt={alt ?? image.alt}
		width={image.picture.img.w}
		height={image.picture.img.h}
		loading={priority ? 'eager' : 'lazy'}
		decoding={priority ? 'sync' : 'async'}
		fetchpriority={priority ? 'high' : 'auto'}
		style:object-position={image.focus}
		onload={() => (loaded = true)}
	/>
</picture>

<style>
	.picture {
		overflow: hidden;
		isolation: isolate;
	}

	.placeholder,
	.photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.placeholder {
		object-fit: cover;
		filter: blur(22px) saturate(1.1);
		scale: 1.15;
		transition: opacity 700ms var(--ease-in-out-soft);
	}

	.photo {
		transition: opacity 700ms var(--ease-in-out-soft);
	}

	.placeholder.contain {
		object-fit: contain;
		scale: 1;
	}

	.picture[data-loaded] .placeholder {
		opacity: 0;
	}

	:global(html.js) .picture:not([data-loaded]) .photo {
		opacity: 0;
	}
</style>
