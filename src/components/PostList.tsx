import Link from 'next/link'
import Image from 'next/image'
import { fmtDate, imageUrl } from '@/lib/site'

export function PostList({ posts }: { posts: any[] }) {
  if (!posts.length) return <p className="muted">No articles yet. Publish one from the admin panel.</p>
  return (
    <ul className="list">
      {posts.map((p) => {
        const img = imageUrl(p.featuredImage, 'card')
        return (
          <li key={p.id} className="story-row">
            {img && (
              <Link href={`/blog/${p.slug}`} className="story-image" aria-label={`Read ${p.title}`}>
                <Image src={img} alt={p.featuredImage?.alt || ''} fill sizes="(max-width: 620px) 100vw, 220px" />
              </Link>
            )}
            <div className="story-copy">
              <p className="meta">
                {p.category?.name && <Link href={`/category/${p.category.slug}`}>{p.category.name}</Link>}
                {p.isSponsored && <span className="badge">Sponsored</span>}
                <span>{fmtDate(p.publishedAt)}</span>
              </p>
              <h2>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              {p.excerpt && <p className="muted">{p.excerpt}</p>}
              <p className="story-byline">{p.author?.name && <span>By {p.author.name}</span>}<Link href={`/blog/${p.slug}`}>Read story <span aria-hidden="true">→</span></Link></p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
