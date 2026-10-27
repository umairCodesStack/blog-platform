import { getPosts } from '@/lib/data'
import { abs, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export const revalidate = 3600
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET() {
  const posts = await getPosts({}, 30)
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${abs(`/blog/${p.slug}`)}</link><guid>${abs(`/blog/${p.slug}`)}</guid><pubDate>${new Date(p.publishedAt || p.createdAt).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE_NAME)}</title><link>${abs('/')}</link><description>${esc(SITE_DESCRIPTION)}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
