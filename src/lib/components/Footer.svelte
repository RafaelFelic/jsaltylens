<script lang="ts">
	import { series } from '$lib/data/series';
	import { site } from '$lib/data/site';
	import Signature from './Signature.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="mt-(--spacing-section) border-t border-line">
	<div class="frame pt-16 pb-10 sm:pt-24">
		<p class="label text-muted">Get in touch</p>
		<a
			href="mailto:{site.email}"
			class="link-quiet mt-4 inline font-serif text-[clamp(1.75rem,1rem+4.4vw,6rem)] leading-[1.05] break-words"
		>
			{site.email}
		</a>

		<div class="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-24 md:grid-cols-12">
			<div class="col-span-2 md:col-span-4">
				<Signature class="h-14 w-auto" />
				<p class="mt-5 max-w-[28ch] text-muted">{site.lead} Based in {site.location.label}.</p>
			</div>

			<nav aria-label="Work" class="md:col-span-2 md:col-start-7">
				<h2 class="label text-muted">Work</h2>
				<ul class="mt-4 space-y-2">
					{#each series as entry (entry.slug)}
						<li><a class="link-quiet" href="/work/{entry.slug}">{entry.title}</a></li>
					{/each}
				</ul>
			</nav>

			<nav aria-label="Studio" class="md:col-span-2">
				<h2 class="label text-muted">Studio</h2>
				<ul class="mt-4 space-y-2">
					<li><a class="link-quiet" href="/prints">Prints</a></li>
					<li><a class="link-quiet" href="/about">About</a></li>
					<li><a class="link-quiet" href="/faq">FAQ</a></li>
					<li><a class="link-quiet" href="/contact">Contact</a></li>
				</ul>
			</nav>

			<div class="md:col-span-2">
				<h2 class="label text-muted">Follow</h2>
				<ul class="mt-4 space-y-2">
					{#each Object.values(site.social) as link (link.url)}
						<li>
							<a class="link-quiet" href={link.url} target="_blank" rel="noopener noreferrer">
								{link.label}<span class="sr-only"> (opens in a new tab)</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="label mt-20 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-muted">
			<p>© {year} {site.name}</p>
			<p>Photography by {site.photographer}</p>
			<p>Designed &amp; built by STRATIG DIGITAL</p>
		</div>
	</div>
</footer>
