import { error } from '@sveltejs/kit';
import { getPrint, prints } from '$lib/data/prints';
import { image } from '$lib/server/images';

export const entries = () => prints.map((print) => ({ slug: print.slug }));

export const load = ({ params }) => {
	const print = getPrint(params.slug);
	if (!print) error(404, 'Print not found');

	const position = prints.indexOf(print);
	const neighbour = (offset: number) => {
		const entry = prints[(position + offset + prints.length) % prints.length];
		return { slug: entry.slug, title: entry.title };
	};

	return {
		print: {
			slug: print.slug,
			title: print.title,
			priceFrom: print.priceFrom,
			number: String(position + 1).padStart(2, '0'),
			total: prints.length
		},
		views: [image(print.photo), ...print.mockups.map((id) => image(id, { printTitle: print.title }))],
		previous: neighbour(-1),
		next: neighbour(1)
	};
};
