<script lang="ts">
	import Picture from '$lib/components/Picture.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatPrice, printDetails, printSizes } from '$lib/data/prints';
	import { site } from '$lib/data/site';

	let { data } = $props();

	let selected = $derived.by(() => {
		void data.print.slug;
		return 0;
	});

	const view = $derived(data.views[selected] ?? data.views[0]);

	const details = [
		{ title: 'Paper', body: printDetails.paper },
		{ title: 'Borders', body: printDetails.border },
		{ title: 'Framing', body: printDetails.framing },
		{ title: 'Shipping', body: printDetails.shipping }
	];
</script>

<Seo
	title="{data.print.title} — Fine art print"
	description="{data.print.title}, a fine art print by {site.photographer} on museum-grade archival cotton rag paper. Framed or unframed, from {formatPrice(data.print.priceFrom)} AUD."
	image={data.views[0].og}
	imageAlt={data.views[0].alt}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: data.print.title,
		description: `Fine art print by ${site.photographer}. ${printDetails.paper}`,
		image: new URL(data.views[0].picture.img.src, site.url).href,
		brand: { '@type': 'Brand', name: site.name },
		offers: {
			'@type': 'AggregateOffer',
			priceCurrency: 'AUD',
			lowPrice: data.print.priceFrom,
			availability: 'https://schema.org/InStock',
			url: `${site.url}/prints/${data.print.slug}`
		}
	}}
/>

<article class="frame pt-[clamp(2rem,1rem+3vw,5rem)]">
	<nav aria-label="Breadcrumb" class="label text-muted">
		<ol class="flex gap-3">
			<li><a href="/prints" class="link-quiet">Prints</a></li>
			<li aria-hidden="true">/</li>
			<li aria-current="page" class="text-ink">{data.print.number}</li>
		</ol>
	</nav>

	<div class="mt-8 grid grid-cols-12 gap-x-(--spacing-gutter) gap-y-12">
		<div class="col-span-12 lg:col-span-7">
			<div class="stage grid place-items-center bg-paper-raised p-[clamp(1.5rem,5vw,5rem)]">
				{#key view.id}
					<div class="view w-full" style:--ar={view.width / view.height}>
						<Picture
							image={view}
							sizes="(min-width: 1024px) 50vw, 90vw"
							priority={selected === 0}
							capped
							class="mx-auto {selected === 0 ? 'shadow-[0_2px_4px_rgb(0_0_0/0.08),0_24px_50px_-20px_rgb(0_0_0/0.35)]' : ''}"
						/>
					</div>
				{/key}
			</div>

			{#if data.views.length > 1}
				<div class="mt-4 flex gap-3" role="group" aria-label="Choose a view">
					{#each data.views as option, index (option.id)}
						<button
							type="button"
							class="thumb relative size-20 overflow-hidden bg-paper-raised sm:size-24"
							aria-pressed={selected === index}
							aria-label={index === 0 ? 'View the photograph' : `View framed example ${index}`}
							onclick={() => (selected = index)}
						>
							<Picture image={option} sizes="96px" fill alt="" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="col-span-12 lg:col-span-4 lg:col-start-9">
			<div class="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
				<p class="label text-muted">Print {data.print.number} / {data.print.total}</p>
				<h1 class="mt-4 text-title">{data.print.title}</h1>
				<p class="mt-5 text-lead">From {formatPrice(data.print.priceFrom)} <span class="label align-middle text-muted">AUD</span></p>

				<h2 class="label mt-10 text-muted">Sizes</h2>
				<ul class="mt-3 border-t border-line">
					{#each printSizes as size (size.mm)}
						<li class="flex justify-between border-b border-line py-3">
							<span>{size.label}</span>
							<span class="text-muted tabular-nums">{size.mm}</span>
						</li>
					{/each}
				</ul>

				<a
					href="/contact?print={data.print.slug}"
					class="label mt-8 flex items-center justify-between bg-ink px-6 py-5 text-paper transition-[background-color,padding] duration-300 hover:bg-sea hover:px-7"
				>
					Enquire about this print <span aria-hidden="true">→</span>
				</a>
				<p class="mt-3 text-sm text-muted">Framed and unframed options, sizes and shipping are confirmed by email.</p>

				<div class="mt-10 border-t border-line">
					{#each details as detail (detail.title)}
						<details class="group border-b border-line">
							<summary class="flex cursor-pointer list-none items-center justify-between py-4">
								<span class="label">{detail.title}</span>
								<span class="relative size-3" aria-hidden="true">
									<span class="absolute top-1/2 left-0 h-px w-full bg-current"></span>
									<span class="absolute top-0 left-1/2 h-full w-px bg-current transition-transform duration-300 group-open:scale-y-0"></span>
								</span>
							</summary>
							<p class="pb-5 text-muted">{detail.body}</p>
						</details>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<nav class="mt-(--spacing-section) grid grid-cols-2 border-t border-line" aria-label="More prints">
		<a href="/prints/{data.previous.slug}" class="group py-8 pr-4">
			<span class="label text-muted">← Previous</span>
			<span class="mt-2 block font-serif text-[clamp(1.5rem,1rem+2vw,2.75rem)] leading-tight transition-transform duration-500 group-hover:-translate-x-1">{data.previous.title}</span>
		</a>
		<a href="/prints/{data.next.slug}" class="group border-l border-line py-8 pl-4 text-right sm:pl-8">
			<span class="label text-muted">Next →</span>
			<span class="mt-2 block font-serif text-[clamp(1.5rem,1rem+2vw,2.75rem)] leading-tight transition-transform duration-500 group-hover:translate-x-1">{data.next.title}</span>
		</a>
	</nav>
</article>

<style>
	.stage {
		container-type: inline-size;
	}

	.view :global(.picture) {
		width: min(100%, calc(70svh * var(--ar)));
	}

	@media (min-width: 1024px) {
		.stage {
			min-height: min(80svh, 56rem);
		}

		.view :global(.picture) {
			width: min(100%, calc((min(80svh, 56rem) - 10cqw) * var(--ar)));
		}
	}

	.thumb::after {
		content: '';
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 0 1px var(--line);
		transition: box-shadow 200ms ease;
	}

	.thumb[aria-pressed='true']::after {
		box-shadow: inset 0 0 0 2px var(--ink);
	}

	details p {
		text-wrap: pretty;
	}

	@media (prefers-reduced-motion: no-preference) {
		.view {
			animation: fade-in 500ms var(--ease-in-out-soft);
		}
	}
</style>
