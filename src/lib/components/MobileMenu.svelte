<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { navigation, site } from '$lib/data/site';
	import ThemeToggle from './ThemeToggle.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	afterNavigate(() => {
		open = false;
	});
</script>

<button
	type="button"
	class="label flex items-center gap-3 py-2 lg:hidden"
	aria-haspopup="dialog"
	aria-expanded={open}
	onclick={() => (open = true)}
>
	Menu
	<span class="flex w-5 flex-col gap-[5px]" aria-hidden="true">
		<span class="h-px bg-current"></span>
		<span class="h-px w-3 self-end bg-current"></span>
	</span>
</button>

<dialog
	bind:this={dialog}
	class="menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-paper text-ink"
	aria-label="Site menu"
	onclose={() => (open = false)}
>
	<div class="frame flex h-full flex-col">
		<div class="flex h-(--spacing-header) items-center justify-end">
			<button type="button" class="label flex items-center gap-3 py-2" onclick={() => (open = false)}>
				Close
				<span class="relative block size-4" aria-hidden="true">
					<span class="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current"></span>
					<span class="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current"></span>
				</span>
			</button>
		</div>

		<nav aria-label="Mobile" class="flex flex-1 flex-col justify-center">
			<ol>
				<li class="item" style:--i={0}>
					<a href="/" class="group flex items-baseline gap-5 border-b border-line py-3" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
						<span class="label w-6 text-muted">00</span>
						<span class="font-serif text-[clamp(2.5rem,11vw,4rem)] leading-none group-aria-[current=page]:italic">Home</span>
					</a>
				</li>
				{#each navigation as item, index (item.href)}
					<li class="item" style:--i={index + 1}>
						<a
							href={item.href}
							class="group flex items-baseline gap-5 border-b border-line py-3"
							aria-current={page.url.pathname.startsWith(item.href) ? 'page' : undefined}
						>
							<span class="label w-6 text-muted">{String(index + 1).padStart(2, '0')}</span>
							<span class="font-serif text-[clamp(2.5rem,11vw,4rem)] leading-none group-aria-[current=page]:italic">{item.label}</span>
						</a>
					</li>
				{/each}
			</ol>
		</nav>

		<div class="flex flex-wrap items-end justify-between gap-6 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
			<div class="flex flex-col gap-2">
				<a class="link-rule" href="mailto:{site.email}">{site.email}</a>
				<a class="link-rule" href={site.social.instagram.url} rel="noopener noreferrer" target="_blank">
					{site.social.instagram.handle}
				</a>
			</div>
			<ThemeToggle showLabel class="py-2" />
		</div>
	</div>
</dialog>

<style>
	.menu {
		padding: 0;
		border: 0;
		overscroll-behavior: contain;
	}

	.menu::backdrop {
		background: transparent;
	}

	@media (prefers-reduced-motion: no-preference) {
		.menu[open] {
			animation: menu-in 500ms var(--ease-out-expo);
		}

		.menu[open] .item {
			animation: item-in 700ms var(--ease-out-expo) both;
			animation-delay: calc(80ms + var(--i) * 45ms);
		}
	}

	@keyframes menu-in {
		from {
			opacity: 0;
		}
	}

	@keyframes item-in {
		from {
			opacity: 0;
			translate: 0 1rem;
		}
	}
</style>
