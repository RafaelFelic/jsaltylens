<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PrintCard from '$lib/components/PrintCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatPrice, printSizes } from '$lib/data/prints';
	import { site } from '$lib/data/site';

	let { data } = $props();

	const lowest = $derived(Math.min(...data.prints.map((print) => print.priceFrom)));
</script>

<Seo
	title="Prints"
	description="Fine art prints of surf, ocean and coastal photography by {site.photographer}. Museum-grade archival cotton rag paper, framed or unframed, from {formatPrice(lowest)} AUD."
	image={data.prints[0].image.og}
	imageAlt={data.prints[0].image.alt}
/>

<PageHeader eyebrow="Shop — {data.prints.length} prints" title="Prints" lead={site.lead}>
	<dl class="label mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-muted">
		<dt>Paper</dt>
		<dd class="text-ink">Fine Art 310GSM cotton rag</dd>
		<dt>Sizes</dt>
		<dd class="text-ink">{printSizes.map((size) => size.mm.replace(' mm', '')).join(' · ')} mm</dd>
		<dt>From</dt>
		<dd class="text-ink">{formatPrice(lowest)} AUD</dd>
	</dl>
</PageHeader>

<section class="frame" aria-label="All prints">
	<ul class="prints grid grid-cols-2 gap-x-(--spacing-gutter) gap-y-14 sm:gap-y-20 lg:grid-cols-3">
		{#each data.prints as print, index (print.slug)}
			<li class={index > 2 ? 'reveal' : undefined}>
				<PrintCard {...print} headingLevel="h2" priority={index < 2} sizes="(min-width: 1024px) 28vw, 44vw" />
			</li>
		{/each}
	</ul>

	<aside class="mt-(--spacing-section) grid grid-cols-12 gap-x-(--spacing-gutter) gap-y-6 border-t border-line pt-10">
		<h2 class="col-span-12 text-title md:col-span-5">Framing & shipping</h2>
		<div class="col-span-12 space-y-4 text-muted md:col-span-6 md:col-start-7">
			<p>Framed prints are housed in a handcrafted shadow box frame made from FSC certified Victorian Ash, available in a natural, black, or white finish.</p>
			<p>For Australia, both unframed and framed prints are shipped for free.</p>
			<a href="/faq" class="label inline-flex items-center gap-3 border-b border-current pb-1 text-ink transition-[gap] duration-300 hover:gap-5">
				Read the FAQ <span aria-hidden="true">→</span>
			</a>
		</div>
	</aside>
</section>

<style>
	@media (min-width: 1024px) {
		.prints > :global(li:nth-child(3n + 2)) {
			margin-top: clamp(4rem, 8vw, 9rem);
		}
	}

	@media (max-width: 1023px) {
		.prints > :global(li:nth-child(2n)) {
			margin-top: clamp(2.5rem, 10vw, 6rem);
		}
	}
</style>
