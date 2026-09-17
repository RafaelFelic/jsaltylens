import { tick } from 'svelte';

export const canTransition = () =>
	typeof document !== 'undefined' &&
	'startViewTransition' in document &&
	!matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function transition(update: () => void | Promise<void>) {
	if (!canTransition()) {
		await update();
		return;
	}
	const viewTransition = document.startViewTransition(async () => {
		await update();
		await tick();
	});
	await viewTransition.finished.catch(() => {});
}

export const isModifiedClick = (event: MouseEvent) =>
	event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
