<script lang="ts">
	import { about } from '$lib/data/about';
	import { site } from '$lib/data/site';
	import Hero from '$lib/components/Hero.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import PrintCard from '$lib/components/PrintCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SeriesSpread from '$lib/components/SeriesSpread.svelte';
	import Signature from '$lib/components/Signature.svelte';

	let { data } = $props();
</script>

<Seo
	description="Photography and fine art prints by {site.photographer}: lifestyle, surf and beach culture from Noosa, QLD, Australia."
	image={data.slides[0].image.og}
	imageAlt={data.slides[0].image.alt}
/>

<Hero slides={data.slides} headline={site.headline} location={site.location.label} />

<section class="frame pt-(--spacing-section)" aria-labelledby="intro-title">
	<div class="grid grid-cols-12 gap-x-(--spacing-gutter)">
		<p class="label reveal col-span-12 text-muted md:col-span-3">(Est. {site.established})</p>
		<div class="col-span-12 mt-6 md:col-span-8 md:col-start-5 md:mt-0">
			<h2 id="intro-title" class="reveal font-serif text-[clamp(2rem,1.3rem+3vw,4.5rem)] leading-[1.02]">
				{site.lead}
				<span class="text-muted italic">Based in {site.location.label}.</span>
			</h2>
			<div class="reveal mt-10 flex flex-wrap gap-x-10 gap-y-4">
				<a href="/work" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					Explore the work <span aria-hidden="true">→</span>
				</a>
				<a href="/prints" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					Shop prints <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="frame pt-(--spacing-section)" aria-labelledby="work-title">
	<div class="flex items-baseline justify-between border-b border-line pb-5">
		<h2 id="work-title" class="label">Selected work</h2>
		<a href="/work" class="label link-quiet text-muted">All series</a>
	</div>
	<div class="mt-14 space-y-(--spacing-section) sm:mt-20">
		{#each data.spreads as spread, index (spread.slug)}
			<SeriesSpread {...spread} flip={index % 2 === 1} />
		{/each}
	</div>
</section>

<section class="pt-(--spacing-section)" aria-labelledby="prints-title">
	<div class="frame">
		<div class="grid grid-cols-12 items-end gap-x-(--spacing-gutter) gap-y-6 border-b border-line pb-8">
			<div class="col-span-12 md:col-span-7">
				<p class="label text-muted">Fine art prints</p>
				<h2 id="prints-title" class="reveal mt-4 text-title">Museum-grade, archival cotton rag</h2>
			</div>
			<div class="col-span-12 flex items-end justify-between gap-6 md:col-span-5 md:flex-col md:items-end">
				<p class="max-w-[36ch] text-muted md:text-right">Three sizes, framed or unframed. Free shipping within Australia.</p>
				<a href="/prints" class="label inline-flex shrink-0 items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					All prints <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>

	<ul class="strip mt-10 flex snap-x snap-mandatory gap-(--spacing-gutter) overflow-x-auto pb-6" aria-label="Featured prints">
		{#each data.prints as print (print.slug)}
			<li class="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[26vw] 2xl:w-[22rem]">
				<PrintCard {...print} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 68vw" />
			</li>
		{/each}
	</ul>
</section>

<section class="frame pt-(--spacing-section)" aria-labelledby="about-title">
	<div class="grid grid-cols-12 items-center gap-x-(--spacing-gutter) gap-y-10">
		<div class="col-span-10 col-start-2 sm:col-span-6 sm:col-start-auto md:col-span-5">
			<div class="reveal-image">
				<Picture image={data.portrait} sizes="(min-width: 768px) 40vw, (min-width: 640px) 50vw, 80vw" />
			</div>
		</div>
		<div class="col-span-12 sm:col-span-6 md:col-span-6 md:col-start-7">
			<p class="label text-muted" id="about-title">{about.title}</p>
			<blockquote class="reveal mt-6 font-serif text-[clamp(2rem,1.4rem+2.6vw,4rem)] leading-[1.04]">
				<p>“{about.quote}”</p>
			</blockquote>
			<p class="reveal mt-8 max-w-[44ch] text-muted">{about.greeting} {about.intro}</p>
			<div class="reveal mt-10 flex items-center justify-between gap-8">
				<a href="/about" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					Read more <span aria-hidden="true">→</span>
				</a>
				<Signature class="h-12 w-auto text-ink/80" />
			</div>
		</div>
	</div>
</section>

<style>
	.strip {
		padding-inline: var(--spacing-gutter);
		scroll-padding-inline: var(--spacing-gutter);
		scrollbar-width: thin;
		scrollbar-color: var(--line) transparent;
	}
</style>
