<script lang="ts">
	import { page } from '$app/state';
	import { series } from '$lib/data/series';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} — JSaltyLens</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="frame grid min-h-[70svh] content-center py-(--spacing-section)">
	<p class="label text-muted">Error {page.status}</p>
	<h1 class="mt-5 max-w-[14ch] text-display">
		{notFound ? 'This page drifted out to sea' : 'Something went wrong'}
	</h1>
	<p class="mt-8 max-w-[44ch] text-lead text-muted">
		{notFound ? 'The page you’re looking for doesn’t exist or has moved.' : 'Please try again in a moment.'}
	</p>
	<ul class="mt-12 flex flex-wrap gap-x-10 gap-y-4">
		<li><a href="/" class="label inline-flex items-center gap-3 border-b border-current pb-1">Home <span aria-hidden="true">→</span></a></li>
		{#each series as entry (entry.slug)}
			<li><a href="/work/{entry.slug}" class="label link-quiet">{entry.title}</a></li>
		{/each}
		<li><a href="/prints" class="label link-quiet">Prints</a></li>
	</ul>
</section>
