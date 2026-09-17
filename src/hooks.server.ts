import { redirect, type Handle } from '@sveltejs/kit';

const legacyRoutes: Record<string, string> = {
	'/index.html': '/',
	'/gallery.html': '/work',
	'/portfolio.html': '/work',
	'/waves.html': '/work/waves',
	'/surfing.html': '/work/waves',
	'/skate.html': '/work',
	'/landscapes.html': '/work/scapes',
	'/human.html': '/work/women',
	'/shop.html': '/prints',
	'/cart.html': '/prints',
	'/checkout.html': '/prints',
	'/faq.html': '/faq',
	'/about.html': '/about',
	'/contact.html': '/contact'
};

export const handle: Handle = async ({ event, resolve }) => {
	const target = legacyRoutes[event.url.pathname.toLowerCase()];
	if (target) redirect(308, target);

	return resolve(event);
};
