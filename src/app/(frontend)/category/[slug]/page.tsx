import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategory, getPosts } from '@/lib/data'
import { PostList } from '@/components/PostList'
import { abs } from '@/lib/site'

export const revalidate = 3600
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug)
  if (!c) return {}
  return { title: c.name, description: c.description || undefined, alternates: { canonical: abs(`/category/${c.slug}`) } }
}

export default async function CategoryPage({ params }: Props) {
  const c = await getCategory((await params).slug)
  if (!c) notFound()
  const posts = await getPosts({ category: { equals: c.id } })
  return (
    <>
      <section className="intro">
        <h1>{c.name}</h1>
        {c.description && <p className="lede">{c.description}</p>}
      </section>
      <PostList posts={posts} />
    </>
  )
}
