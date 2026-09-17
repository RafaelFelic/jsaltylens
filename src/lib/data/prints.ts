import type { Print } from './types';

export const printSizes = [
	{ label: 'Small', mm: '400 × 600 mm' },
	{ label: 'Medium', mm: '600 × 900 mm' },
	{ label: 'Large', mm: '800 × 1200 mm' }
] as const;

export const printDetails = {
	paper:
		'Produced on museum-grade, Fine Art 310GSM, archival cotton rag paper. With a matte finish and a delightful texture, these 310GSM prints are thick and the quality is instantly apparent.',
	border: 'Unframed prints generally have a 15mm white border.',
	framing:
		'Prints are dry mounted to an acid-free 5mm foam board using an archival adhesive film. Each print is housed in a handcrafted shadow box frame made from FSC certified Victorian Ash and fronted with durable 3mm museum-grade plexiglass. The frame is available in a natural, black, or white finish.',
	shipping:
		'For Australia, both unframed and framed prints are shipped for free. International customers purchasing unframed prints are charged a standard flat fee of $50. For international shipping of framed prints, please reach out for a custom quote specific to your location.',
	currency: 'AUD'
} as const;

export const prints: Print[] = [
	{ slug: 'palm-paradise', title: 'Palm Paradise', photo: 'prints/jungle', mockups: ['mockups/jungleF', 'mockups/jungleFB'], priceFrom: 110 },
	{ slug: 'oceans-embrace', title: 'Ocean’s Embrace', photo: 'prints/whale2', mockups: ['mockups/whale2FB'], priceFrom: 110 },
	{ slug: 'natures-vein', title: 'Nature’s Vein', photo: 'prints/branch', mockups: ['mockups/branchF', 'mockups/branchFB'], priceFrom: 110 },
	{ slug: 'fiery-horizon', title: 'Fiery Horizon', photo: 'prints/sunset3', mockups: ['mockups/sunset3FB'], priceFrom: 110 },
	{ slug: 'embers-of-the-day', title: 'Embers of the Day', photo: 'prints/sunset', mockups: ['mockups/sunsetF', 'mockups/sunsetFB'], priceFrom: 110 },
	{ slug: 'stingray-mirage', title: 'Stingray Mirage', photo: 'scapes/02', mockups: ['mockups/stingrayF', 'mockups/stingrayFB'], priceFrom: 110 },
	{ slug: 'eternal-surf', title: 'Eternal Surf', photo: 'prints/pbsurf', mockups: ['mockups/pbsurfFB'], priceFrom: 110 },
	{ slug: 'island-in-the-blue', title: 'Island in the Blue', photo: 'prints/blue', mockups: ['mockups/blueFB'], priceFrom: 110 },
	{ slug: 'endless-summer', title: 'Endless Summer', photo: 'prints/boards', mockups: ['mockups/boardsFB'], priceFrom: 110 },
	{ slug: 'seas-clap', title: 'Sea’s Clap', photo: 'scapes/13', mockups: ['mockups/boomF'], priceFrom: 110 },
	{ slug: 'momentum', title: 'Momentum', photo: 'prints/jump', mockups: ['mockups/jumpF'], priceFrom: 110 },
	{ slug: 'mermaids-dream', title: 'Mermaid’s Dream', photo: 'women/04', mockups: ['mockups/mermaidFB'], priceFrom: 110 },
	{ slug: 'calm-seas-cruiser', title: 'Calm Seas Cruiser', photo: 'prints/national', mockups: ['mockups/nationalF', 'mockups/nationalFB'], priceFrom: 110 },
	{ slug: 'dance-on-waves', title: 'Dance On Waves', photo: 'prints/pbsurf2', mockups: ['mockups/pbsurf2FB'], priceFrom: 110 },
	{ slug: 'seas-secret', title: 'Sea’s Secret', photo: 'prints/shade', mockups: ['mockups/shadeFB'], priceFrom: 110 },
	{ slug: 'days-final-flame', title: 'Day’s Final Flame', photo: 'prints/sunset2', mockups: ['mockups/sunset2FB'], priceFrom: 110 },
	{ slug: 'sea-of-silence', title: 'Sea of Silence', photo: 'prints/vila', mockups: ['mockups/vilaF', 'mockups/vilaFB'], priceFrom: 110 },
	{ slug: 'deep-sea-ballet', title: 'Deep Sea Ballet', photo: 'prints/whales', mockups: ['mockups/whalesFB'], priceFrom: 110 },
	{ slug: 'sculpted-by-time', title: 'Sculpted by Time', photo: 'prints/bridge', mockups: ['mockups/bridgeF'], priceFrom: 110 },
	{ slug: 'green-haven', title: 'Green Haven', photo: 'prints/jungle2', mockups: ['mockups/jungle2F'], priceFrom: 110 }
];

export const getPrint = (slug: string) => prints.find((print) => print.slug === slug);

export const formatPrice = (amount: number) =>
	new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', currencyDisplay: 'narrowSymbol' }).format(amount);
