<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { faq } from '$lib/data/faq';
	import { site } from '$lib/data/site';

	const slug = (title: string) => title.toLowerCase().replace(/[^a-z]+/g, '-');
</script>

<Seo
	title="FAQ"
	description="Answers about {site.name} fine art prints: paper quality, sizes, borders, framing, packaging, shipping and private photography sessions."
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.flatMap((group) =>
			group.items.map((item) => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: { '@type': 'Answer', text: item.answer }
			}))
		)
	}}
/>

<PageHeader eyebrow="Frequently asked" title="FAQ">
	<nav aria-label="FAQ topics">
		<ul class="flex flex-wrap gap-x-6 gap-y-2">
			{#each faq as group (group.title)}
				<li><a href="#{slug(group.title)}" class="label link-quiet">{group.title}</a></li>
			{/each}
		</ul>
	</nav>
</PageHeader>

<div class="frame space-y-(--spacing-section)">
	{#each faq as group, groupIndex (group.title)}
		<section id={slug(group.title)} class="grid scroll-mt-28 grid-cols-12 gap-x-(--spacing-gutter) gap-y-6" aria-labelledby="{slug(group.title)}-title">
			<div class="col-span-12 md:col-span-4">
				<div class="md:sticky md:top-[calc(var(--spacing-header)+2rem)]">
					<p class="label text-muted">{String(groupIndex + 1).padStart(2, '0')}</p>
					<h2 id="{slug(group.title)}-title" class="mt-3 text-title">{group.title}</h2>
				</div>
			</div>
			<div class="col-span-12 border-t border-line md:col-span-8 md:col-start-5">
				{#each group.items as item, index (item.question)}
					<details class="faq group border-b border-line" open={groupIndex === 0 && index === 0}>
						<summary class="flex cursor-pointer list-none items-start justify-between gap-8 py-6">
							<span class="font-serif text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-snug transition-colors group-hover:text-sea">{item.question}</span>
							<span class="relative mt-3 size-3.5 shrink-0" aria-hidden="true">
								<span class="absolute top-1/2 left-0 h-px w-full bg-current"></span>
								<span class="absolute top-0 left-1/2 h-full w-px bg-current transition-transform duration-300 group-open:scale-y-0"></span>
							</span>
						</summary>
						<p class="measure pb-8 text-muted">{item.answer}</p>
					</details>
				{/each}
			</div>
		</section>
	{/each}

	<section class="grid grid-cols-12 gap-x-(--spacing-gutter) border-t border-line pt-10">
		<p class="col-span-12 font-serif text-title md:col-span-7">Still have a question?</p>
		<div class="col-span-12 mt-6 md:col-span-4 md:col-start-9 md:mt-0">
			<a href="/contact" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
				Send me a message <span aria-hidden="true">→</span>
			</a>
		</div>
	</section>
</div>

<style>
	.faq {
		interpolate-size: allow-keywords;
	}

	.faq::details-content {
		block-size: 0;
		overflow: hidden;
		transition:
			block-size 450ms var(--ease-out-expo),
			content-visibility 450ms allow-discrete;
	}

	.faq[open]::details-content {
		block-size: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.faq::details-content {
			transition: none;
		}
	}
</style>
