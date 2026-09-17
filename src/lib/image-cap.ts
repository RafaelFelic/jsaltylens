export const highDensityFactor = 1.5;

export const cap = (width: number) =>
	`--cap-1x: ${width}px; --cap-hd: ${Math.round(width / highDensityFactor)}px`;
