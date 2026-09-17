<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		eyebrow: string;
		title: string;
		lead?: string;
		children?: Snippet;
	}

	let { eyebrow, title, lead, children }: Props = $props();
</script>

<header class="frame pt-[clamp(3rem,2rem+5vw,8rem)] pb-[clamp(2.5rem,1.5rem+4vw,6rem)]">
	<div class="grid grid-cols-12 items-end gap-x-(--spacing-gutter) gap-y-6">
		<div class="col-span-12 lg:col-span-8">
			<p class="label text-muted">{eyebrow}</p>
			<h1 class="enter mt-5 text-display">{title}</h1>
		</div>
		{#if lead || children}
			<div class="enter col-span-12 lg:col-span-4 lg:pb-3" style:--delay="120ms">
				{#if lead}<p class="max-w-[40ch] text-lead text-muted">{lead}</p>{/if}
				{@render children?.()}
			</div>
		{/if}
	</div>
</header>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.enter {
			animation: enter 900ms var(--ease-out-expo) both;
			animation-delay: var(--delay, 0ms);
		}
	}

	@keyframes enter {
		from {
			translate: 0 1rem;
		}
	}
</style>
