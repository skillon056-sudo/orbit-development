# Orbit Development

Premium, database-driven software-development catalog + WhatsApp lead-gen platform.
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · React Three Fiber · Prisma · PostgreSQL.

## What it does

- Public site: cinematic 3D hero, **Website Development** + **App Development** catalogs, per-template detail pages, clients marquee, "Why Choose Us", contact page.
- Every template has an **ORDER NOW** button that opens WhatsApp with a pre-filled, template-specific message. The number comes from the admin panel — never hardcoded.
- Secure **admin panel** (`/admin`): dashboard stats, full template CRUD (create / edit / delete / publish / unpublish / change category / pricing / images / features / reorder), clients CRUD, contact settings, homepage content.
- Everything is DB-driven: Admin → Postgres → server → frontend. Publish a template and it appears in the right category automatically.

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Database** — put a PostgreSQL connection string in `.env` (`DATABASE_URL`).
   Free options: [Neon](https://neon.tech), [Supabase](https://supabase.com), Railway, or local Postgres.

3. **Create schema + seed** (admin user, default settings, sample templates/clients)
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin  (login: `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`)

## Environment (`.env`)

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `AUTH_SECRET` | Signs the admin session cookie — set a long random value |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login (hashed on seed) |
| `CLOUDINARY_URL` | Optional. If set, image uploads go to Cloudinary; otherwise they save to `/public/uploads` (dev). |

## Images — three ways

For every image (template cover, screenshots, client logo) the admin can either:

1. **Paste a direct image URL** (`https://…`) — recommended for serverless hosts. Nothing to configure; the URL is stored and rendered as-is. A pasted URL always wins over an upload.
2. **Upload a file with Cloudinary** — set `CLOUDINARY_URL` and uploads go to Cloudinary (persistent, optimized).
3. **Upload a file locally** — with no `CLOUDINARY_URL`, files save to `/public/uploads` (dev only; not persistent on serverless).

`next/image` runs with `unoptimized: true` so any pasted host works without an allowlist.

## Deploy to Netlify

1. Push this repo to GitHub, then in Netlify: **Add new site → Import from Git**. `netlify.toml` sets the build command and the Next.js runtime plugin automatically.
2. **Environment variables** (Site settings → Environment):
   - `DATABASE_URL` — use Neon's **pooled** connection string (host contains `-pooler`) for serverless; keep `&connection_limit=5&pool_timeout=20`.
   - `AUTH_SECRET` — a long random string.
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD` — **change from defaults** before going live.
   - `CLOUDINARY_URL` — optional; only if you want file uploads. Otherwise paste image URLs in the admin.
3. First deploy: the build runs `prisma generate && next build`. Prisma's `binaryTargets` in `schema.prisma` include the Linux/Lambda engines Netlify needs.
4. After it's live, seed the database once (from your machine, with the same `DATABASE_URL`): `npm run db:seed`.

> Note: `next/image` is `unoptimized`, so Netlify's image CDN isn't used — fine for URL-based images. Set `CLOUDINARY_URL` if you want optimized delivery.

## Architecture notes

- Auth: `jose` JWT in an httpOnly cookie; `src/middleware.ts` gates `/admin/**`; server actions re-check.
- Mutations run as **Server Actions** (`src/app/admin/actions.ts`) and call `revalidatePath("/", "layout")` so the frontend updates instantly.
- Public pages use `export const dynamic = "force-dynamic"` to always reflect the latest DB state.
- To switch DB provider, change `provider` in `prisma/schema.prisma` and `DATABASE_URL`.
