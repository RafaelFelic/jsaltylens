import { series } from './series';
import type { Photo, PhotoId } from './types';

const standalone: Photo[] = [
	{ id: 'home/cliffs', alt: 'Aerial view of a green cliff meeting turquoise water', focus: '35% 50%' },
	{ id: 'home/fins', alt: 'Pale pink surfboard fins resting in beach sand', focus: '45% 50%' },
	{ id: 'about/header', alt: 'Black-and-white underwater photo of a diver swimming down with a camera' },
	{ id: 'about/josy', alt: 'Josy Menezes crouching against a white wall, holding a camera up to her eye', focus: '50% 30%' },
	{ id: 'prints/jungle', alt: 'Aerial view of a dense palm forest criss-crossed by fallen fronds' },
	{ id: 'prints/whale2', alt: 'Humpback whale tail rising out of the sea' },
	{ id: 'prints/branch', alt: 'Backlit green leaves glowing along a dark stem' },
	{ id: 'prints/sunset3', alt: 'Orange sun setting into the ocean beneath a band of cloud' },
	{ id: 'prints/sunset', alt: 'Silhouetted palm trees with the sun flaring through their trunks' },
	{ id: 'prints/pbsurf', alt: 'Black-and-white photo of two surfers holding boards above their heads at the water’s edge' },
	{ id: 'prints/blue', alt: 'Aerial view of a curving sandbar in deep turquoise water' },
	{ id: 'prints/boards', alt: 'Pale pink surfboard fins resting in textured beach sand' },
	{ id: 'prints/jump', alt: 'Children jumping off a timber jetty into sparkling blue water' },
	{ id: 'prints/national', alt: 'Surfers on a small wave seen past the side of a white van' },
	{ id: 'prints/pbsurf2', alt: 'Black-and-white photo of a surfer riding a small wave' },
	{ id: 'prints/shade', alt: 'Aerial view of turquoise waves washing onto a pale beach beneath a cliff' },
	{ id: 'prints/sunset2', alt: 'Silhouettes of people with surfboards on the shore as the sun sets' },
	{ id: 'prints/vila', alt: 'Coastal village and white beach seen past a boat’s rope under a blue sky' },
	{ id: 'prints/whales', alt: 'Two humpback whale fins raised above the water' },
	{ id: 'prints/bridge', alt: 'Natural rock arch over deep blue water with green-topped cliffs beyond' },
	{ id: 'prints/jungle2', alt: 'Tall palm trees covering a green hillside' }
];

const mockupAlt = (title: string) => `${title}, shown as a framed print`;

export const photos = new Map<PhotoId, Photo>(
	[...series.flatMap((entry) => entry.photos), ...standalone].map((photo) => [photo.id, photo])
);

export function describePhoto(id: PhotoId, printTitle?: string): Photo {
	if (id.startsWith('mockups/') && printTitle) return { id, alt: mockupAlt(printTitle) };
	const photo = photos.get(id);
	if (!photo) throw new Error(`No alt text registered for photo "${id}"`);
	return photo;
}
