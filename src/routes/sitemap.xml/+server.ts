import { prints } from '$lib/data/prints';
import { series } from '$lib/data/series';
import { site } from '$lib/data/site';
import { image } from '$lib/server/images';

export const prerender = true;

const escape = (value: string) =>
	value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!);

const absolute = (path: string) => new URL(path, site.url).href;

export const GET = () => {
	const pad = (index: number) => String(index + 1).padStart(2, '0');

	const pages: { path: string; images?: { src: string; caption: string }[]; priority: string }[] = [
		{ path: '/', priority: '1.0' },
		{ path: '/work', priority: '0.9' },
		...series.map((entry) => ({
			path: `/work/${entry.slug}`,
			priority: '0.9',
			images: entry.photos.map((photo) => ({ src: image(photo.id).picture.img.src, caption: photo.alt }))
		})),
		...series.flatMap((entry) => entry.photos.map((_, index) => ({ path: `/work/${entry.slug}/${pad(index)}`, priority: '0.5' }))),
		{ path: '/prints', priority: '0.9' },
		...prints.map((print) => ({
			path: `/prints/${print.slug}`,
			priority: '0.8',
			images: [{ src: image(print.photo).picture.img.src, caption: print.title }]
		})),
		{ path: '/about', priority: '0.7' },
		{ path: '/faq', priority: '0.6' },
		{ path: '/contact', priority: '0.7' }
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
	.map(
		(page) => `	<url>
		<loc>${escape(absolute(page.path))}</loc>
		<priority>${page.priority}</priority>${(page.images ?? [])
			.map(
				(item) => `
		<image:image><image:loc>${escape(absolute(item.src))}</image:loc></image:image>`
			)
			.join('')}
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
