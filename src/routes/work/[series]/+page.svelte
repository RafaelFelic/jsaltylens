<script lang="ts">
	import { flushSync } from 'svelte';
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Gallery from '$lib/components/Gallery.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { canTransition, isModifiedClick, transition } from '$lib/view-transition';

	let { data } = $props();

	let morph = $state<{ index: number; on: 'grid' | 'lightbox' } | null>(null);

	const pad = (index: number) => String(index + 1).padStart(2, '0');
	const base = $derived(`/work/${data.series.slug}`);
	const href = (index: number) => `${base}/${pad(index)}`;
	const label = (index: number) => `${data.series.title} ${pad(index)}: ${data.images[index].alt}`;
	const active = $derived(page.state.photo);

	const popped = () => new Promise<void>((resolve) => addEventListener('popstate', () => resolve(), { once: true }));

	async function open(index: number, event: MouseEvent) {
		if (isModifiedClick(event)) return;
		event.preventDefault();

		if (!canTransition()) {
			pushState(href(index), { photo: index });
			return;
		}

		morph = { index, on: 'grid' };
		flushSync();
		await transition(() => {
			morph = { index, on: 'lightbox' };
			pushState(href(index), { photo: index });
		});
		morph = null;
	}

	function navigate(index: number) {
		replaceState(href(index), { photo: index });
	}

	async function close() {
		const index = active ?? 0;
		const tile = document.getElementById(`photo-${index + 1}`);
		const back = async () => {
			const done = popped();
			history.back();
			await done;
		};

		tile?.scrollIntoView({ block: 'center', behavior: 'instant' });

		if (canTransition()) {
			morph = { index, on: 'lightbox' };
			flushSync();
			await transition(async () => {
				morph = { index, on: 'grid' };
				await back();
			});
			morph = null;
		} else {
			await back();
		}

		tile?.focus({ preventScroll: true });
	}
</script>

<Seo
	title={data.series.title}
	description="{data.series.description} {data.images.length} photographs by {site.photographer}, {site.location.label}."
	image={data.images[0].og}
	imageAlt={data.images[0].alt}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ImageGallery',
		name: data.series.title,
		description: data.series.description,
		url: `${site.url}${base}`,
		author: { '@type': 'Person', name: site.photographer },
		image: data.images.map((image, index) => ({
			'@type': 'ImageObject',
			contentUrl: new URL(image.picture.img.src, site.url).href,
			url: `${site.url}${href(index)}`,
			description: image.alt,
			creator: { '@type': 'Person', name: site.photographer }
		}))
	}}
/>

<PageHeader eyebrow="Work — {data.series.number}" title={data.series.title}>
	<p class="max-w-[40ch] text-lead text-muted">{data.series.description}</p>
	<p class="label mt-6">{data.images.length} photographs</p>
</PageHeader>

<section class="frame" aria-label="{data.series.title} photographs">
	<Gallery
		images={data.images}
		{href}
		{label}
		onopen={open}
		transitionIndex={morph?.on === 'grid' ? morph.index : undefined}
	/>
</section>

<nav class="frame pt-(--spacing-section)" aria-label="Next series">
	<a href="/work/{data.next.slug}" class="group grid grid-cols-12 items-end gap-x-(--spacing-gutter) gap-y-6 border-t border-line pt-10">
		<div class="col-span-12 md:col-span-7">
			<p class="label text-muted">Next series — {data.next.number}</p>
			<p class="mt-4 font-serif text-display transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-3">
				{data.next.title}<span class="ml-4 inline-block text-muted transition-transform duration-500 group-hover:translate-x-2" aria-hidden="true">→</span>
			</p>
		</div>
		<div class="col-span-8 overflow-hidden md:col-span-4 md:col-start-9">
			<Picture
				image={data.next.cover}
				sizes="(min-width: 768px) 30vw, 66vw"
				class="aspect-[4/3]! transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
				alt=""
			/>
		</div>
	</a>
</nav>

{#if active !== undefined && data.images[active]}
	<Lightbox
		images={data.images}
		index={active}
		title={data.series.title}
		titleHref={base}
		closeHref={base}
		{href}
		onnavigate={navigate}
		onclose={close}
		transitionIndex={morph?.on === 'lightbox' ? morph.index : undefined}
	/>
{/if}
