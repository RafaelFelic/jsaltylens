<script lang="ts">
	import { goto } from '$app/navigation';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();

	const pad = (index: number) => String(index + 1).padStart(2, '0');
	const base = $derived(`/work/${data.series.slug}`);
	const href = (index: number) => `${base}/${pad(index)}`;
	const current = $derived(data.images[data.index]);
</script>

<Seo
	title="{data.series.title} {pad(data.index)}"
	description="{current.alt}. From the {data.series.title} series by {site.photographer}."
	image={current.og}
	imageAlt={current.alt}
	type="article"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ImageObject',
		contentUrl: new URL(current.picture.img.src, site.url).href,
		url: `${site.url}${href(data.index)}`,
		description: current.alt,
		width: current.width,
		height: current.height,
		creator: { '@type': 'Person', name: site.photographer },
		copyrightHolder: { '@type': 'Person', name: site.photographer },
		isPartOf: { '@type': 'ImageGallery', name: data.series.title, url: `${site.url}${base}` }
	}}
/>

<h1 class="sr-only">{data.series.title} {pad(data.index)}</h1>

{#key data.series.slug}
	<Lightbox
		images={data.images}
		index={data.index}
		title={data.series.title}
		titleHref={base}
		closeHref="{base}#photo-{data.index + 1}"
		{href}
		ssrOpen
		onnavigate={(index) => goto(href(index), { replaceState: true, noScroll: true, keepFocus: true })}
		onclose={() => goto(`${base}#photo-${data.index + 1}`)}
	/>
{/key}
