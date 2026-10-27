import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/data'
import { abs, fmtDate, imageUrl, SITE_NAME } from '@/lib/site'
import { Body } from '@/components/Body'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 3600 // plus on-demand revalidation from the Payload hook
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || undefined
  const img = imageUrl(post.featuredImage)
  return {
    title,
    description,
    alternates: { canonical: abs(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      title,
      description,
      url: abs(`/blog/${post.slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: img ? [abs(img)] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const img = imageUrl(post.featuredImage)
  const url = abs(`/blog/${post.slug}`)

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: img ? [abs(img)] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    author: post.author?.slug
      ? { '@type': 'Person', name: post.author.name, url: abs(`/author/${post.author.slug}`) }
      : undefined,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: abs('/') },
  }
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
      ...(post.category ? [{ '@type': 'ListItem', position: 2, name: post.category.name, item: abs(`/category/${post.category.slug}`) }] : []),
      { '@type': 'ListItem', position: post.category ? 3 : 2, name: post.title, item: url },
    ],
  }

  return (
    <article className="article">
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/">Home</Link> / {post.category && <><Link href={`/category/${post.category.slug}`}>{post.category.name}</Link> / </>}
        <span>{post.title}</span>
      </nav>
      <h1>{post.title}</h1>
      {post.excerpt && <p className="lede">{post.excerpt}</p>}
      <p className="byline">
        {post.author?.slug ? <Link href={`/author/${post.author.slug}`}>{post.author.name}</Link> : post.author?.name}
        {' · '}Published {fmtDate(post.publishedAt)}
        {post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt?.slice(0, 10) && <> · Updated {fmtDate(post.updatedAt)}</>}
      </p>
      {post.isSponsored && <p className="disclosure">{post.sponsorDisclosure || 'This is a sponsored post.'}</p>}
      {img && <Image className="hero" src={img} alt={post.featuredImage?.alt || ''} width={1200} height={630} priority />}
      <Body data={post.content} />
    </article>
  )
}
