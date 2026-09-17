<script lang="ts">
	import { onMount } from 'svelte';

	let { class: className = '', showLabel = false }: { class?: string; showLabel?: boolean } = $props();

	let theme = $state<'light' | 'dark'>('light');
	const next = $derived(theme === 'dark' ? 'light' : 'dark');

	onMount(() => {
		const stored = document.documentElement.dataset.theme;
		const query = matchMedia('(prefers-color-scheme: dark)');
		const sync = () => {
			theme = (document.documentElement.dataset.theme as 'light' | 'dark') ?? (query.matches ? 'dark' : 'light');
		};
		theme = stored === 'dark' || stored === 'light' ? stored : query.matches ? 'dark' : 'light';
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});

	function toggle() {
		const apply = () => {
			theme = next;
			document.documentElement.dataset.theme = theme;
			try {
				localStorage.setItem('theme', theme);
			} catch {}
		};
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (document.startViewTransition && !reduce) document.startViewTransition(apply);
		else apply();
	}
</script>

<button
	type="button"
	class="group items-center gap-3 {className.includes('hidden') ? '' : 'inline-flex'} {className}"
	onclick={toggle}
	aria-label="Switch to {next} theme"
>
	<svg viewBox="0 0 20 20" class="size-4 transition-transform duration-500 ease-(--ease-out-expo) group-hover:rotate-180" aria-hidden="true">
		<circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5" />
		<path d="M10 1.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" />
	</svg>
	{#if showLabel}
		<span class="label">{next === 'dark' ? 'Dark' : 'Light'} theme</span>
	{/if}
</button>
