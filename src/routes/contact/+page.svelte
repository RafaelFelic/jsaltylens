<script lang="ts">
	import { enhance } from '$app/forms';
	import Picture from '$lib/components/Picture.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	let { data, form } = $props();

	let submitting = $state(false);
	let formElement: HTMLFormElement | undefined = $state();

	const values = $derived(form && 'values' in form ? form.values : undefined);
	const errors = $derived<Record<string, string | undefined>>(form && 'errors' in form ? (form.errors ?? {}) : {});
	const unavailable = $derived(Boolean(form && 'unavailable' in form && form.unavailable));
	const sent = $derived(Boolean(form && 'success' in form && form.success));

	const describedBy = (name: string) => (errors[name] ? `${name}-error` : undefined);
</script>

<Seo
	title="Contact"
	description="Get in touch with {site.photographer} about fine art prints, private photography sessions or brand shoots in {site.location.label}."
	image={data.image.og}
	imageAlt={data.image.alt}
/>

<div class="frame pt-[clamp(3rem,2rem+5vw,8rem)]">
	<div class="grid grid-cols-12 gap-x-(--spacing-gutter) gap-y-14">
		<div class="col-span-12 lg:col-span-5">
			<p class="label text-muted">Prints, sessions & brand shoots</p>
			<h1 class="mt-5 text-display">Contact</h1>

			<dl class="mt-12 space-y-6">
				<div>
					<dt class="label text-muted">Email</dt>
					<dd class="mt-2 font-serif text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-tight">
						<a class="link-quiet break-all" href="mailto:{site.email}">{site.email}</a>
					</dd>
				</div>
				<div>
					<dt class="label text-muted">Follow</dt>
					<dd class="mt-2 flex flex-wrap gap-x-6 gap-y-1">
						{#each Object.values(site.social) as link (link.url)}
							<a class="link-rule" href={link.url} target="_blank" rel="noopener noreferrer">
								{link.label} <span class="text-muted">{link.handle}</span><span class="sr-only"> (opens in a new tab)</span>
							</a>
						{/each}
					</dd>
				</div>
				<div>
					<dt class="label text-muted">Based in</dt>
					<dd class="mt-2">{site.location.label}</dd>
				</div>
			</dl>

			<div class="mt-14 hidden lg:block">
				<Picture image={data.image} sizes="(min-width: 1024px) 38vw, 0px" />
			</div>
		</div>

		<div class="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-4">
			{#if sent}
				<div class="border-t border-ink pt-10" role="status">
					<p class="label text-muted">Message sent</p>
					<p class="mt-4 font-serif text-title">Thank you — your message is on its way.</p>
					<p class="mt-6 max-w-[44ch] text-muted">I’ll reply to the email address you provided as soon as I can.</p>
					<a href="/work" class="label mt-10 inline-flex items-center gap-3 border-b border-current pb-1">
						Back to the work <span aria-hidden="true">→</span>
					</a>
				</div>
			{:else}
				<form
					bind:this={formElement}
					method="POST"
					class="relative grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink pt-10"
					novalidate
					use:enhance={() => {
						submitting = true;
						return async ({ update, result }) => {
							await update({ reset: result.type === 'success' });
							submitting = false;
							if (result.type === 'failure') {
								formElement?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
							}
						};
					}}
				>
					{#if unavailable}
						<p class="col-span-2 border-l-2 border-sea bg-paper-raised px-5 py-4" role="alert">
							Sorry, the message couldn’t be sent right now. Please email
							<a class="link-rule" href="mailto:{site.email}">{site.email}</a> directly.
						</p>
					{/if}

					<div class="field col-span-2 sm:col-span-1">
						<label for="firstName">First name <span class="text-muted">(required)</span></label>
						<input id="firstName" name="firstName" autocomplete="given-name" required maxlength="80" value={values?.firstName ?? ''} aria-invalid={errors.firstName ? 'true' : undefined} aria-describedby={describedBy('firstName')} />
						{#if errors.firstName}<p id="firstName-error" class="error">{errors.firstName}</p>{/if}
					</div>

					<div class="field col-span-2 sm:col-span-1">
						<label for="lastName">Last name</label>
						<input id="lastName" name="lastName" autocomplete="family-name" maxlength="80" value={values?.lastName ?? ''} aria-invalid={errors.lastName ? 'true' : undefined} aria-describedby={describedBy('lastName')} />
						{#if errors.lastName}<p id="lastName-error" class="error">{errors.lastName}</p>{/if}
					</div>

					<div class="field col-span-2">
						<label for="email">Email address <span class="text-muted">(required)</span></label>
						<input id="email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="254" value={values?.email ?? ''} aria-invalid={errors.email ? 'true' : undefined} aria-describedby={describedBy('email')} />
						{#if errors.email}<p id="email-error" class="error">{errors.email}</p>{/if}
					</div>

					<div class="field col-span-2">
						<label for="print">Print <span class="text-muted">(optional)</span></label>
						<div class="relative">
							<select id="print" name="print" value={values?.print ?? data.selectedPrint}>
								<option value="">Not about a specific print</option>
								{#each data.prints as print (print.slug)}
									<option value={print.slug}>{print.title}</option>
								{/each}
							</select>
							<svg class="pointer-events-none absolute top-1/2 right-0 size-3 -translate-y-1/2" viewBox="0 0 12 12" aria-hidden="true"><path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.25" /></svg>
						</div>
					</div>

					<div class="field col-span-2">
						<label for="subject">Subject <span class="text-muted">(required)</span></label>
						<input id="subject" name="subject" required maxlength="150" value={values?.subject ?? data.defaultSubject} aria-invalid={errors.subject ? 'true' : undefined} aria-describedby={describedBy('subject')} />
						{#if errors.subject}<p id="subject-error" class="error">{errors.subject}</p>{/if}
					</div>

					<div class="field col-span-2">
						<label for="message">Message <span class="text-muted">(required)</span></label>
						<textarea id="message" name="message" rows="6" required maxlength="5000" aria-invalid={errors.message ? 'true' : undefined} aria-describedby={describedBy('message')}>{values?.message ?? ''}</textarea>
						{#if errors.message}<p id="message-error" class="error">{errors.message}</p>{/if}
					</div>

					<div class="absolute -left-[9999px]" aria-hidden="true">
						<label for="company">Company</label>
						<input id="company" name="company" tabindex="-1" autocomplete="off" />
					</div>

					<div class="col-span-2 flex flex-wrap items-center justify-between gap-6">
						<p class="text-sm text-muted">Your details are only used to reply to you.</p>
						<button
							type="submit"
							class="label flex min-w-48 items-center justify-between gap-6 bg-ink px-6 py-5 text-paper transition-colors duration-300 hover:bg-sea disabled:opacity-60"
							disabled={submitting}
						>
							{submitting ? 'Sending…' : 'Send message'} <span aria-hidden="true">→</span>
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field label {
		font-size: var(--text-label);
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.field input,
	.field select,
	.field textarea {
		width: 100%;
		appearance: none;
		border: 0;
		border-bottom: 1px solid var(--field);
		border-radius: 0;
		background: transparent;
		color: var(--ink);
		padding: 0.625rem 0;
		font-size: 1.125rem;
		transition: border-color 200ms ease;
	}

	.field textarea {
		resize: vertical;
		min-height: 9rem;
	}

	.field select {
		padding-right: 1.5rem;
	}

	.field input:hover,
	.field select:hover,
	.field textarea:hover {
		border-bottom-color: var(--ink);
	}

	.field input:focus-visible,
	.field select:focus-visible,
	.field textarea:focus-visible {
		outline: none;
		border-bottom: 2px solid var(--sea);
		margin-bottom: -1px;
	}

	.field [aria-invalid='true'] {
		border-bottom-color: #b3261e;
	}

	.error {
		color: #b3261e;
		font-size: 0.875rem;
	}

	:global([data-theme='dark']) .error {
		color: #ffb4ab;
	}

	:global([data-theme='dark']) .field [aria-invalid='true'] {
		border-bottom-color: #ffb4ab;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) .error {
			color: #ffb4ab;
		}

		:global(:root:not([data-theme='light'])) .field [aria-invalid='true'] {
			border-bottom-color: #ffb4ab;
		}
	}
</style>
