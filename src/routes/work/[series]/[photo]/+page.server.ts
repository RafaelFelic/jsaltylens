import { error } from '@sveltejs/kit';
import { getSeries, series } from '$lib/data/series';
import { image } from '$lib/server/images';

const pad = (index: number) => String(index + 1).padStart(2, '0');

export const entries = () =>
	series.flatMap((entry) => entry.photos.map((_, index) => ({ series: entry.slug, photo: pad(index) })));

export const load = ({ params }) => {
	const entry = getSeries(params.series);
	const index = Number(params.photo) - 1;
	if (!entry || !/^\d{2,}$/.test(params.photo) || !entry.photos[index]) error(404, 'Photo not found');

	return {
		series: { slug: entry.slug, title: entry.title },
		index,
		images: entry.photos.map((photo) => image(photo.id))
	};
};
