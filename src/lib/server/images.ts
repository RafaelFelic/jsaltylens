import meta from '$lib/generated/photos.json';
import { describePhoto } from '$lib/data/photos';
import type { Image, Picture, PhotoId } from '$lib/data/types';

const photoModules = import.meta.glob<Picture>(
	['/src/lib/assets/photos/**/*.jpg', '!/src/lib/assets/photos/mockups/**'],
	{ eager: true, import: 'default', query: { enhanced: true, w: '360;540;768;1080;1600;2400' } }
);

const mockupModules = import.meta.glob<Picture>('/src/lib/assets/photos/mockups/*.jpg', {
	eager: true,
	import: 'default',
	query: { enhanced: true, w: '360;768;1200' }
});

const ogModules = import.meta.glob<string>('/src/lib/generated/og/*.jpg', {
	eager: true,
	import: 'default',
	query: '?url'
});

const metadata = meta as Record<string, { width: number; height: number; color: string; lqip: string }>;

const pictures = new Map<PhotoId, Picture>(
	Object.entries({ ...photoModules, ...mockupModules }).map(([path, picture]) => [
		path.replace('/src/lib/assets/photos/', '').replace(/\.jpg$/, ''),
		picture
	])
);

export function image(id: PhotoId, context?: { printTitle?: string }): Image {
	const picture = pictures.get(id);
	const details = metadata[id];
	if (!picture) throw new Error(`Photo file not found for "${id}" in src/lib/assets/photos`);
	if (!details) throw new Error(`Photo metadata missing for "${id}". Run: bun run photos`);

	const { alt, focus } = describePhoto(id, context?.printTitle);
	const og = ogModules[`/src/lib/generated/og/${id.replaceAll('/', '--')}.jpg`];

	return {
		id,
		alt,
		focus,
		width: details.width,
		height: details.height,
		color: details.color,
		lqip: details.lqip,
		og,
		picture
	};
}

export const images = (ids: PhotoId[]) => ids.map((id) => image(id));
