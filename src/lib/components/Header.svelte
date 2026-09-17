<script lang="ts">
	import { page } from '$app/state';
	import { navigation } from '$lib/data/site';
	import MobileMenu from './MobileMenu.svelte';
	import Signature from './Signature.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let scrollY = $state(0);

	const raised = $derived(scrollY > 8);

	const left = navigation.slice(0, 3);
	const right = navigation.slice(3);

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`) ? 'page' : undefined;
</script>

<svelte:window bind:scrollY />

<a
	href="#main"
	class="label fixed top-3 left-3 z-[60] -translate-y-24 bg-ink px-4 py-3 text-paper focus:translate-y-0"
>
	Skip to content
</a>

<header class="header fixed inset-x-0 top-0 z-50 h-(--spacing-header)" class:raised>
	<div class="frame grid h-full grid-cols-[1fr_auto_1fr] items-center">
		<nav aria-label="Primary" class="hidden lg:block">
			<ul class="flex gap-9">
				{#each left as item (item.href)}
					<li>
						<a class="label link-quiet py-2" href={item.href} aria-current={isCurrent(item.href)}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<a href="/" class="col-start-2 block py-2" aria-label="JSaltyLens, home">
			<Signature class="h-10 sm:h-11" />
		</a>

		<div class="col-start-3 flex items-center justify-end gap-9">
			<nav aria-label="Secondary" class="hidden lg:block">
				<ul class="flex gap-9">
					{#each right as item (item.href)}
						<li>
							<a class="label link-quiet py-2" href={item.href} aria-current={isCurrent(item.href)}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
			<ThemeToggle class="hidden p-2 lg:inline-flex" />
			<MobileMenu />
		</div>
	</div>
</header>

<style>
	.header {
		color: var(--ink);
		transition:
			background-color 400ms var(--ease-in-out-soft),
			box-shadow 400ms var(--ease-in-out-soft);
	}

	.header.raised {
		background-color: color-mix(in oklab, var(--paper) 88%, transparent);
		backdrop-filter: blur(14px) saturate(1.2);
		box-shadow: 0 1px 0 var(--line);
	}
</style>
