import Link from 'next/link'
import Image from 'next/image'
import { fmtDate, imageUrl } from '@/lib/site'

export function PostList({ posts }: { posts: any[] }) {
  if (!posts.length) return <p className="muted">No articles yet. Publish one from the admin panel.</p>
  return (
    <ul className="list">
      {posts.map((p, i) => {
        const img = imageUrl(p.featuredImage, 'card')
        return (
          <li key={p.id} className="row">
            <div>
              <p className="meta">
                {p.category?.name && <Link href={`/category/${p.category.slug}`}>{p.category.name}</Link>}
                {p.isSponsored && <span className="badge">Sponsored</span>}
                <span>{fmtDate(p.publishedAt)}</span>
              </p>
              <h2>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              {p.excerpt && <p className="muted">{p.excerpt}</p>}
              {p.author?.name && <p className="byline">By {p.author.name}</p>}
            </div>
            {img && <Image src={img} alt={p.featuredImage?.alt || ''} width={320} height={180} priority={i === 0} />}
          </li>
        )
      })}
    </ul>
  )
}
