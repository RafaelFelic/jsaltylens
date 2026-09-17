import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const root = join(import.meta.dir, '..');
const sourceDir = join(root, 'src/lib/assets/photos');
const outDir = join(root, 'src/lib/generated');
const ogDir = join(outDir, 'og');
const manifestPath = join(outDir, 'photos.json');

export interface PhotoMeta {
	width: number;
	height: number;
	color: string;
	lqip: string;
	mtime: number;
}

async function listPhotos(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) return listPhotos(path);
			return /\.(jpe?g|png|webp|avif)$/i.test(entry.name) ? [path] : [];
		})
	);
	return nested.flat();
}

const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');

async function describe(path: string, mtime: number): Promise<PhotoMeta> {
	const image = sharp(path);
	const { width = 0, height = 0 } = await image.metadata();
	const { dominant } = await image.stats();
	const lqip = await sharp(path)
		.resize(20, 20, { fit: 'inside' })
		.modulate({ saturation: 1.2 })
		.webp({ quality: 40 })
		.toBuffer();

	return {
		width,
		height,
		color: `#${toHex(dominant.r)}${toHex(dominant.g)}${toHex(dominant.b)}`,
		lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
		mtime
	};
}

async function writeOgImage(path: string, id: string) {
	await sharp(path)
		.resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
		.jpeg({ quality: 78, mozjpeg: true })
		.toFile(join(ogDir, `${id.replaceAll('/', '--')}.jpg`));
}

const started = performance.now();
await mkdir(ogDir, { recursive: true });

const previous: Record<string, PhotoMeta> = existsSync(manifestPath)
	? JSON.parse(await readFile(manifestPath, 'utf8'))
	: {};

const files = await listPhotos(sourceDir);
const manifest: Record<string, PhotoMeta> = {};
let processed = 0;

await Promise.all(
	files.map(async (path) => {
		const id = relative(sourceDir, path).replaceAll('\\', '/').replace(/\.[^.]+$/, '');
		const { mtimeMs } = await stat(path);
		const cached = previous[id];
		const ogExists = existsSync(join(ogDir, `${id.replaceAll('/', '--')}.jpg`));

		if (cached && cached.mtime === mtimeMs && ogExists) {
			manifest[id] = cached;
			return;
		}

		manifest[id] = await describe(path, mtimeMs);
		await writeOgImage(path, id);
		processed++;
	})
);

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, JSON.stringify(sorted, null, '\t'));

const seconds = ((performance.now() - started) / 1000).toFixed(1);
console.log(`photos: ${files.length} found, ${processed} processed in ${seconds}s`);
