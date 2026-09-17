import { about } from '$lib/data/about';
import { featuredPrints, hero } from '$lib/data/home';
import { getPrint } from '$lib/data/prints';
import { getSeries, series } from '$lib/data/series';
import { image } from '$lib/server/images';

export const load = () => ({
	slides: hero.map(({ photo, series: slug }) => {
		const entry = slug ? getSeries(slug) : undefined;
		const index = entry?.photos.findIndex((item) => item.id === photo) ?? -1;
		return {
			image: image(photo),
			caption: entry
				? {
						label: `${entry.title} — ${String(index + 1).padStart(2, '0')}`,
						href: `/work/${entry.slug}/${photo.split('/')[1]}`
					}
				: undefined
		};
	}),
	spreads: series.map((entry) => ({
		slug: entry.slug,
		number: entry.number,
		title: entry.title,
		description: entry.description,
		count: entry.photos.length,
		images: entry.spread.map((id) => image(id))
	})),
	prints: featuredPrints.map((slug) => {
		const print = getPrint(slug)!;
		return { slug: print.slug, title: print.title, priceFrom: print.priceFrom, image: image(print.photo) };
	}),
	portrait: image(about.portrait)
});
