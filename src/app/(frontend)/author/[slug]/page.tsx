import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAuthor, getPosts } from '@/lib/data'
import { PostList } from '@/components/PostList'
import { JsonLd } from '@/components/JsonLd'
import { abs, imageUrl } from '@/lib/site'

export const revalidate = 3600
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAuthor((await params).slug)
  if (!a) return {}
  return { title: a.name, description: a.bio?.slice(0, 160), alternates: { canonical: abs(`/author/${a.slug}`) } }
}

export default async function AuthorPage({ params }: Props) {
  const a = await getAuthor((await params).slug)
  if (!a) notFound()
  const posts = await getPosts({ author: { equals: a.id } })
  const avatar = imageUrl(a.avatar, 'card')
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: a.name,
          url: abs(`/author/${a.slug}`),
          description: a.bio,
          image: avatar ? abs(avatar) : undefined,
          sameAs: (a.socials || []).map((s: any) => s.url),
        }}
      />
      <section className="intro author">
        {avatar && <Image src={avatar} alt={a.name} width={96} height={96} className="avatar" />}
        <div>
          <h1>{a.name}</h1>
          {a.bio && <p className="lede">{a.bio}</p>}
          <p className="byline">
            {(a.socials || []).map((s: any) => (
              <a key={s.url} href={s.url} rel="me noopener">{s.label}</a>
            ))}
          </p>
        </div>
      </section>
      <PostList posts={posts} />
    </>
  )
}
