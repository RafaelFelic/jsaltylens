<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();

	const total = $derived(data.series.reduce((sum, entry) => sum + entry.count, 0));
</script>

<Seo
	title="Portfolio"
	description="Three photographic series by {site.photographer}: waves and surfing, coastal scapes, and portraits of women by the water."
	image={data.series[0].cover.og}
	imageAlt={data.series[0].cover.alt}
/>

<PageHeader eyebrow="Portfolio — {total} photographs" title="Work" />

<section class="frame" aria-label="Series">
	<ol class="border-t border-line">
		{#each data.series as entry (entry.slug)}
			<li class="border-b border-line">
				<a
					href="/work/{entry.slug}"
					class="group grid grid-cols-12 items-center gap-x-(--spacing-gutter) gap-y-6 py-8 sm:py-10 lg:py-12"
				>
					<span class="label col-span-2 self-start pt-3 text-muted sm:col-span-1 lg:self-center lg:pt-0">{entry.number}</span>

					<div class="col-span-10 sm:col-span-11 lg:col-span-6">
						<h2 class="text-title transition-[font-style,translate] duration-500 ease-(--ease-out-expo) group-hover:translate-x-2 group-hover:italic">
							{entry.title}
						</h2>
						<p class="mt-3 max-w-[40ch] text-muted">{entry.description}</p>
						<p class="label mt-5">{entry.count} photographs <span aria-hidden="true" class="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span></p>
					</div>

					<div class="col-span-12 grid grid-cols-6 items-end gap-2 sm:col-span-11 sm:col-start-2 lg:col-span-5 lg:col-start-8">
						<div class="col-span-4 overflow-hidden">
							<Picture
								image={entry.cover}
								sizes="(min-width: 1024px) 28vw, 66vw"
								class="aspect-[4/3]! transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
								alt=""
							/>
						</div>
						<div class="col-span-2 grid gap-2">
							{#each entry.previews.slice(0, 2) as preview (preview.id)}
								<div class="overflow-hidden">
									<Picture
										image={preview}
										sizes="(min-width: 1024px) 14vw, 33vw"
										class="aspect-square! transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.06]"
										alt=""
									/>
								</div>
							{/each}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ol>
</section>
