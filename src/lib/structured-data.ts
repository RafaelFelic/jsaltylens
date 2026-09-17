import { site } from '$lib/data/site';

export const personId = `${site.url}/#person`;
export const businessId = `${site.url}/#business`;

export const siteGraph = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Person',
			'@id': personId,
			name: site.photographer,
			jobTitle: site.role,
			url: `${site.url}/about`,
			email: `mailto:${site.email}`,
			homeLocation: {
				'@type': 'Place',
				address: {
					'@type': 'PostalAddress',
					addressLocality: site.location.locality,
					addressRegion: site.location.region,
					addressCountry: site.location.country
				}
			},
			sameAs: [site.social.instagram.url, site.social.facebook.url]
		},
		{
			'@type': ['LocalBusiness', 'ProfessionalService'],
			'@id': businessId,
			name: site.name,
			description: `${site.lead} Based in ${site.location.label}.`,
			url: site.url,
			email: site.email,
			founder: { '@id': personId },
			address: {
				'@type': 'PostalAddress',
				addressLocality: site.location.locality,
				addressRegion: site.location.region,
				addressCountry: site.location.country
			},
			areaServed: 'Australia',
			sameAs: [site.social.instagram.url, site.social.facebook.url]
		},
		{
			'@type': 'WebSite',
			'@id': `${site.url}/#website`,
			url: site.url,
			name: site.name,
			publisher: { '@id': businessId },
			inLanguage: 'en-AU'
		}
	]
};
