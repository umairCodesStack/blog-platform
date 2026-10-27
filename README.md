# Blog platform: Next.js + Payload CMS + Postgres

One project: public blog (`src/app/(frontend)`), admin + API (`src/app/(payload)` → `/admin`, `/api`).
Roles: **admin** and **author**. Authors submit for review; admins (or authors with "Can publish without review") publish.

## Run
1. `cp .env.example .env` and fill `DATABASE_URI` + `PAYLOAD_SECRET`
2. `npm install`
3. `npm run generate:importmap`
4. `npm run dev` → open http://localhost:3000/admin, create the first user (becomes admin)
5. Create a Category, then add Authors (Users) with a `slug` and bio, then write posts.

## Deploy
Vercel + Neon/Supabase Postgres. Set the env vars. Use Cloudflare R2/S3 for media (Vercel's disk is not persistent).

## SEO included
Per-page metadata + canonical + Open Graph, Article/BreadcrumbList/Person/WebSite JSON-LD, sitemap.xml with lastmod,
robots.txt (blocks /admin, /api), RSS, ISR with on-demand revalidation when a post is published/unpublished,
`rel="sponsored"` on links flagged in the editor, visible sponsored-post disclosure.

## Not included yet
Related posts, table of contents, search, contact/advertise page, email notifications, 301 redirect list (`next.config.mjs`).
