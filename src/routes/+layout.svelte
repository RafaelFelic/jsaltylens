<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import archivo from '@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2?url';
	import instrumentSerif from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url';
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import favicon from '$lib/assets/favicon.png';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { siteGraph } from '$lib/structured-data';

	let { children } = $props();

	const graph = `<script type="application/ld+json">${JSON.stringify(siteGraph).replaceAll('<', '\\u003c')}</` + 'script>';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preload" href={archivo} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={instrumentSerif} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="icon" href={favicon} type="image/png" />
	<link rel="apple-touch-icon" href={appleTouchIcon} />
	{@html graph}
</svelte:head>

<Header />

<main id="main" tabindex="-1" class="pt-(--spacing-header) outline-none">
	{@render children()}
</main>

<Footer />
