# Blog platform: Next.js + Payload CMS + Postgres

One project: public blog (`src/app/(frontend)`), admin + API (`src/app/(payload)` → `/admin`, `/api`).
Roles: **admin** and **author**. Authors submit for review; admins (or authors with "Can publish without review") publish.

## Run
1. `cp .env.example .env` and fill `DATABASE_URI` + `PAYLOAD_SECRET`
2. `npm install`
3. `npm run generate:importmap`
4. `npm run dev` → open http://localhost:3000/admin, create the first user (becomes admin)
5. Create a Category, then add Authors (Users) with a `slug` and bio, then write posts.

Set `NEXT_PUBLIC_CONTACT_EMAIL` to update the contact email shown on the homepage and in the footer.

## Deploy
Vercel + Neon/Supabase Postgres. Configure the existing Supabase Storage bucket for media; no S3 setup is required. Set `SUPABASE_URL` (or use `NEXT_PUBLIC_SUPABASE_URL`), the bucket name (`Media` by default), and the server-side `SUPABASE_SERVICE_ROLE_KEY` from Supabase Project Settings → API. Keep this key private and never expose it in a `NEXT_PUBLIC_` variable. Make the bucket public if media should be publicly viewable. If a Supabase project URL is configured without the service role key, Payload reports the missing setting instead of silently saving uploads to local disk. With no Supabase storage settings, local disk remains available for development. New uploads receive unique UUID-based filenames.

## SEO included
Per-page metadata + canonical + Open Graph, Article/BreadcrumbList/Person/WebSite JSON-LD, sitemap.xml with lastmod,
robots.txt (blocks /admin, /api), RSS, ISR with on-demand revalidation when a post is published/unpublished,
`rel="sponsored"` on links flagged in the editor, visible sponsored-post disclosure.

## Not included yet
Related posts, table of contents, search, contact/advertise page, email notifications, 301 redirect list (`next.config.mjs`).
