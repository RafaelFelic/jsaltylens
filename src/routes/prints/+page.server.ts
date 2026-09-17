import { prints } from '$lib/data/prints';
import { image } from '$lib/server/images';

export const load = () => ({
	prints: prints.map((print, index) => ({
		slug: print.slug,
		title: print.title,
		priceFrom: print.priceFrom,
		number: String(index + 1).padStart(2, '0'),
		image: image(print.photo)
	}))
});
