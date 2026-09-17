export type PhotoId = string;

export interface Photo {
	id: PhotoId;
	alt: string;
	focus?: string;
}

export interface SeriesPhoto extends Photo {
	feature?: boolean;
}

export interface Series {
	slug: string;
	number: string;
	title: string;
	description: string;
	cover: PhotoId;
	spread: [PhotoId, PhotoId];
	photos: SeriesPhoto[];
}

export interface Print {
	slug: string;
	title: string;
	photo: PhotoId;
	mockups: PhotoId[];
	priceFrom: number;
}

export interface FaqGroup {
	title: string;
	items: { question: string; answer: string }[];
}

export interface Picture {
	sources: Record<string, string>;
	img: { src: string; w: number; h: number };
}

export interface Image {
	id: PhotoId;
	alt: string;
	width: number;
	height: number;
	color: string;
	lqip: string;
	og: string;
	focus?: string;
	picture: Picture;
}
