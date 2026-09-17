import type { PhotoId } from './types';

export const hero: { photo: PhotoId; series?: string }[] = [
	{ photo: 'scapes/01', series: 'scapes' },
	{ photo: 'waves/01', series: 'waves' },
	{ photo: 'waves/02', series: 'waves' },
	{ photo: 'home/cliffs' },
	{ photo: 'scapes/03', series: 'scapes' },
	{ photo: 'women/06', series: 'women' },
	{ photo: 'home/fins' },
	{ photo: 'waves/04', series: 'waves' },
	{ photo: 'waves/05', series: 'waves' },
	{ photo: 'women/19', series: 'women' }
];

export const featuredPrints = [
	'palm-paradise',
	'island-in-the-blue',
	'endless-summer',
	'sculpted-by-time',
	'embers-of-the-day',
	'mermaids-dream',
	'stingray-mirage'
];

export const contactImage: PhotoId = 'waves/17';
