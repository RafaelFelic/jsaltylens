export const site = {
	name: 'JSaltyLens',
	url: 'https://jsaltylens.vercel.app',
	photographer: 'Josy Menezes',
	role: 'Photographer',
	headline: 'Stylish photography & art prints',
	lead: 'Fine art prints showcasing lifestyle, surf, and beach culture.',
	location: { locality: 'Noosa', region: 'QLD', country: 'AU', label: 'Noosa, QLD, Australia' },
	email: 'joymnz.shoot@gmail.com',
	origin: 'Brazil',
	social: {
		instagram: { label: 'Instagram', handle: '@josy_saltylens', url: 'https://www.instagram.com/josy_saltylens/' },
		facebook: { label: 'Facebook', handle: 'josyMnz', url: 'https://www.facebook.com/josyMnz/' }
	},
	established: 2023
} as const;

export const navigation = [
	{ href: '/work', label: 'Work' },
	{ href: '/prints', label: 'Prints' },
	{ href: '/faq', label: 'FAQ' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' }
] as const;
