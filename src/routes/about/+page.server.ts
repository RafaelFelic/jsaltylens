import { about } from '$lib/data/about';
import { image } from '$lib/server/images';

export const load = () => ({
	portrait: image(about.portrait),
	closing: image(about.header)
});
