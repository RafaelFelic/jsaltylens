<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	interface Props {
		title?: string;
		description: string;
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article' | 'profile';
		jsonLd?: Record<string, unknown>;
	}

	let { title, description, image, imageAlt, type = 'website', jsonLd }: Props = $props();

	const fullTitle = $derived(title ? `${title} — ${site.name}` : `${site.name} — Photography & art prints by ${site.photographer}`);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	const imageUrl = $derived(image ? new URL(image, site.url).href : undefined);
	const structuredData = $derived(
		jsonLd
			? `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</` + 'script>'
			: ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content="en_AU" />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		{#if imageAlt}<meta property="og:image:alt" content={imageAlt} />{/if}
	{/if}

	<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
		{#if imageAlt}<meta name="twitter:image:alt" content={imageAlt} />{/if}
	{/if}

	{@html structuredData}
</svelte:head>
