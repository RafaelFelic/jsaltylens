import { error } from '@sveltejs/kit';
import { getSeries, series } from '$lib/data/series';
import { image } from '$lib/server/images';

export const entries = () => series.map((entry) => ({ series: entry.slug }));

export const load = ({ params }) => {
	const entry = getSeries(params.series);
	if (!entry) error(404, 'Series not found');

	const position = series.indexOf(entry);
	const next = series[(position + 1) % series.length];

	return {
		series: {
			slug: entry.slug,
			number: entry.number,
			title: entry.title,
			description: entry.description
		},
		images: entry.photos.map((photo) => ({ ...image(photo.id), feature: photo.feature })),
		next: { slug: next.slug, number: next.number, title: next.title, cover: image(next.cover) }
	};
};
