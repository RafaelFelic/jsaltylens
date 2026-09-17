# [JSaltyLens](https://jsaltylens.vercel.app)

Portfolio and fine art print catalogue for **Josy Menezes**, photographer based in Noosa, QLD, Australia.

Built with SvelteKit (Svelte 5), Tailwind CSS 4, TypeScript and `@sveltejs/enhanced-img`, deployed on Vercel. Bun is the package manager and script runner.

## Setup

Requires [Bun](https://bun.sh) (developed with 1.4).

```bash
bun install
bun run dev
```

| Command | What it does |
| --- | --- |
| `bun run dev` | Generates photo metadata, then starts the dev server |
| `bun run build` | Generates photo metadata, then builds and prerenders the site |
| `bun run preview` | Serves the production build locally |
| `bun run check` | Type checks the project |
| `bun run photos` | Regenerates photo metadata only (dimensions, colour, blur placeholder, social image) |

The first build processes every photo into AVIF, WebP and JPEG at several widths and takes a few minutes. Results are cached in `node_modules/.cache/imagetools`, so later builds are much faster.

To test the contact form locally, copy `.env.example` to `.env` and fill it in (see [Environment variables](#environment-variables)).

### Building on Windows

`@sveltejs/adapter-vercel` creates symbolic links for server routes. Windows only allows that with **Developer Mode** on (Settings → System → For developers). Without it, `bun run build` prerenders everything and then fails at the final adapter step with `EPERM: operation not permitted, symlink`. Vercel builds on Linux and is not affected.

## Project structure

```
scripts/photos.ts              Photo metadata + social image generator (runs before dev/build)
src/lib/assets/photos/         Source photos, one folder per group
src/lib/data/                  All content: series, photos + alt text, prints, FAQ, about, site details
src/lib/server/images.ts       Resolves a photo id to responsive image data (server only)
src/lib/server/mail.ts         Sends contact form enquiries with Nodemailer
src/lib/components/            Header, Footer, Hero, Gallery, Lightbox, Picture, PrintCard, …
src/routes/                    Pages, sitemap.xml, robots.txt
src/hooks.server.ts            Redirects from the old .html URLs
```

Every page except `/contact` is prerendered to static HTML.

## Adding photos

Photos are referenced by an id that matches their path inside `src/lib/assets/photos`, without the extension. For example, `src/lib/assets/photos/waves/22.jpg` has the id `waves/22`.

Export JPEGs at about **2400–2560px on the long edge**. Larger files only slow the build down.

### Add a photo to an existing series

1. Save the file, for example `src/lib/assets/photos/waves/22.jpg`.
2. Add an entry to that series in `src/lib/data/series.ts`:

   ```ts
   { id: 'waves/22', alt: 'Describe what is in the photo for someone who cannot see it' },
   ```

   Optional fields:
   - `feature: true` shows a landscape photo full width between rows.
   - `focus: '40% 50%'` sets the crop focal point where the photo is cropped.

3. Run `bun run dev` and check the series page.

The order of entries is the order on the page. Photo URLs follow their position (`/work/waves/22`), so add new photos at the end to keep existing links stable.

### Add a new series

1. Create a folder, for example `src/lib/assets/photos/portraits/`, and add the photos.
2. Add a series to `src/lib/data/series.ts` with a `slug`, `number`, `title`, `description`, a `cover` photo id, a `spread` of two photo ids (one landscape, one portrait) for the home page, and the `photos` list.

The series then appears on the home page, `/work`, the footer, the sitemap and the 404 page automatically.

### Add a print

1. Save the photo in `src/lib/assets/photos/prints/`, or reuse a series photo by its id.
2. Save any framed mock-ups in `src/lib/assets/photos/mockups/`.
3. Add alt text for a new print photo in `src/lib/data/photos.ts` (mock-ups get theirs automatically).
4. Add the print to `src/lib/data/prints.ts`:

   ```ts
   { slug: 'new-print', title: 'New Print', photo: 'prints/new-print', mockups: ['mockups/new-printF'], priceFrom: 110 },
   ```

To feature it on the home page, add its slug to `featuredPrints` in `src/lib/data/home.ts`.

If a photo is missing its file, metadata or alt text, the build stops with an error naming the photo id.

## Deploying to Vercel

1. Import the repository in Vercel.
2. Use these project settings. Vercel detects them automatically from `bun.lock` and SvelteKit, but check them:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | SvelteKit |
   | Install Command | `bun install` |
   | Build Command | `bun run build` |
   | Output Directory | leave empty (set by the adapter) |
   | Node.js Version | 22.x or later |

3. Add the environment variables below for Production (and Preview if you want the form to work there), then deploy.

Caching:
- **Hashed files:** photos, fonts, JS and CSS are served from `/_app/immutable/` with `Cache-Control: public, immutable, max-age=31536000`, set by the adapter.
- **HTML pages:** always revalidated, so new content shows up straight after a deploy.

### Environment variables

| Name | Value |
| --- | --- |
| `GMAIL_USER` | Gmail address that sends the enquiry emails |
| `GMAIL_APP_PASSWORD` | A Google [app password](https://myaccount.google.com/apppasswords) for that account (requires 2-Step Verification) |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered, for example `joymnz.shoot@gmail.com` |

Enquiries arrive with **Reply-To** set to the visitor's email, so replying goes straight to them. If the variables are missing or sending fails, the form asks the visitor to email directly instead.

## Updating site details

- **Name, email, location and social links:** `src/lib/data/site.ts`. They're used in the header, footer, contact page, SEO tags and structured data.
- **Production domain:** also in `src/lib/data/site.ts` (`url`). It's used for canonical links, social images and the sitemap.
