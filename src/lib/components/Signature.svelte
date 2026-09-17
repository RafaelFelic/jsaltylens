<script lang="ts">
	import signature from '$lib/assets/signature.png';

	let { class: className = '' }: { class?: string } = $props();
</script>

<span class="signature {className}" style:--signature="url({signature})" aria-hidden="true"></span>

<style>
	.signature {
		display: block;
		aspect-ratio: 640 / 267;
		background-color: currentColor;
		mask: var(--signature) center / contain no-repeat;
	}
</style>
