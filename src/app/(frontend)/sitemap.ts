import type { MetadataRoute } from 'next'
import { getPosts, getCategories, getAuthors } from '@/lib/data'
import { abs } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([getPosts({}, 1000), getCategories(), getAuthors()])
  return [
    { url: abs('/'), lastModified: posts[0]?.updatedAt },
    ...posts.map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: p.updatedAt })),
    ...categories.map((c) => ({ url: abs(`/category/${c.slug}`), lastModified: c.updatedAt })),
    ...authors.map((a) => ({ url: abs(`/author/${a.slug}`), lastModified: a.updatedAt })),
  ]
}
