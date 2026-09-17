import { series } from '$lib/data/series';
import { image } from '$lib/server/images';

export const load = () => ({
	series: series.map((entry) => ({
		slug: entry.slug,
		number: entry.number,
		title: entry.title,
		description: entry.description,
		count: entry.photos.length,
		cover: image(entry.cover),
		previews: entry.photos
			.filter((photo) => photo.id !== entry.cover)
			.slice(0, 3)
			.map((photo) => image(photo.id))
	}))
});
