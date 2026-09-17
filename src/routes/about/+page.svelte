<script lang="ts">
	import Picture from '$lib/components/Picture.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Signature from '$lib/components/Signature.svelte';
	import { about } from '$lib/data/about';
	import { site } from '$lib/data/site';
	import { personId } from '$lib/structured-data';

	let { data } = $props();

	const [first, second, ...rest] = about.paragraphs;
</script>

<Seo
	title="About"
	description="{site.photographer} is a photographer originally from {site.origin}, based in {site.location.label}, capturing the ocean, surf, beaches and coastal lifestyle."
	image={data.portrait.og}
	imageAlt={data.portrait.alt}
	type="profile"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		mainEntity: { '@id': personId },
		url: `${site.url}/about`
	}}
/>

<article>
	<header class="frame pt-[clamp(3rem,2rem+5vw,8rem)]">
		<p class="label text-muted">About — {site.photographer}</p>
		<h1 class="mt-5 text-display">{about.title}</h1>
	</header>

	<div class="frame mt-[clamp(3rem,2rem+5vw,7rem)] grid grid-cols-12 gap-x-(--spacing-gutter) gap-y-14">
		<div class="col-span-12 sm:col-span-8 lg:col-span-5">
			<div class="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
				<Picture image={data.portrait} sizes="(min-width: 1024px) 38vw, (min-width: 640px) 64vw, 100vw" priority />
				<p class="label mt-4 text-muted">{site.photographer}, {site.location.label}</p>
			</div>
		</div>

		<div class="col-span-12 lg:col-span-6 lg:col-start-7">
			<p class="reveal font-serif text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1.12]">
				{about.greeting} <span class="text-muted">{about.intro}</span>
			</p>

			<div class="measure mt-12 space-y-6">
				<p class="reveal">{first}</p>
			</div>

			<figure class="reveal my-16 border-y border-line py-10 sm:my-20">
				<blockquote class="font-serif text-[clamp(2rem,1.3rem+3vw,4.25rem)] leading-[1.02] italic">
					<p>{about.quote}</p>
				</blockquote>
			</figure>

			<div class="measure space-y-6">
				<p class="reveal">{second}</p>
				{#each rest as paragraph, index (index)}
					<p class="reveal">{paragraph}</p>
				{/each}
			</div>

			<div class="reveal mt-14">
				<p class="font-serif text-2xl">{about.signOff}</p>
				<Signature class="mt-2 h-24 w-auto" />
			</div>

			<div class="reveal mt-14 flex flex-wrap gap-x-10 gap-y-4">
				<a href="/work" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					See the work <span aria-hidden="true">→</span>
				</a>
				<a href="/contact" class="label inline-flex items-center gap-3 border-b border-current pb-1 transition-[gap] duration-300 hover:gap-5">
					Book a session <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>

	<div class="frame mt-(--spacing-section)">
		<div class="reveal-image">
			<Picture image={data.closing} sizes="min(100vw, {data.closing.width}px)" capped />
		</div>
	</div>
</article>
