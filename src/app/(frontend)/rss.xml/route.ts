import { getPosts } from '@/lib/data'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export const revalidate = 3600
const esc = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET(request: Request) {
  const absoluteURL = (path: string) => new URL(path, request.url).toString()
  const posts = await getPosts({}, 30)
  const items = posts
    .map(
      (post) => {
        const url = absoluteURL(`/blog/${post.slug}`)
        const pubDate = new Date(post.publishedAt || post.createdAt)

        return `    <item>
      <title>${esc(post.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <description>${esc(post.excerpt)}</description>
    </item>`
      },
    )
    .join('')
  const feedURL = absoluteURL('/rss.xml')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${esc(absoluteURL('/'))}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${esc(feedURL)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
