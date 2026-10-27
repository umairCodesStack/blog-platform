import Image from 'next/image'
import Link from 'next/link'
import { getPosts } from '@/lib/data'
import { PostList } from '@/components/PostList'
import { CONTACT_EMAIL, fmtDate, imageUrl, SITE_NAME, SITE_DESCRIPTION, abs } from '@/lib/site'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 3600

export default async function Home() {
  const posts = await getPosts({}, 30)
  const [featuredPost, ...recentPosts] = posts
  const featuredImage = imageUrl(featuredPost?.featuredImage)

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: abs('/'), description: SITE_DESCRIPTION }} />
      <section className="home-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> A little something worth reading</p>
        <h1>{SITE_DESCRIPTION}</h1>
        <p className="home-intro-note">Fresh perspectives, useful ideas, and stories to take with you.</p>
      </section>
      {featuredPost && (
        <section className="featured-section" aria-labelledby="featured-heading">
          <p className="section-kicker" id="featured-heading">Editor&apos;s pick <span /></p>
          <article className={`featured-story${featuredImage ? ' has-image' : ''}`}>
            {featuredImage && (
              <Link href={`/blog/${featuredPost.slug}`} className="featured-image" aria-label={`Read ${featuredPost.title}`}>
                <Image
                  src={featuredImage}
                  alt={featuredPost.featuredImage?.alt || ''}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 55vw"
                />
              </Link>
            )}
            <div className="featured-copy">
              <p className="meta">
                {featuredPost.category?.name && (
                  <Link href={`/category/${featuredPost.category.slug}`}>{featuredPost.category.name}</Link>
                )}
                {featuredPost.isSponsored && <span className="badge">Sponsored</span>}
                <span>{fmtDate(featuredPost.publishedAt)}</span>
              </p>
              <h2><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              {featuredPost.excerpt && <p className="featured-excerpt">{featuredPost.excerpt}</p>}
              <div className="featured-byline">
                {featuredPost.author?.name && <span>By {featuredPost.author.name}</span>}
                <Link href={`/blog/${featuredPost.slug}`} className="read-link">Read the story <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </article>
        </section>
      )}
      {recentPosts.length > 0 && (
        <section className="latest-section" aria-labelledby="latest-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">The reading list</p>
              <h2 id="latest-heading">Latest stories</h2>
            </div>
            <span className="section-count">{recentPosts.length} {recentPosts.length === 1 ? 'story' : 'stories'}</span>
          </div>
          <PostList posts={recentPosts} />
        </section>
      )}
      {!featuredPost && <p className="empty-state">No stories just yet. Check back soon for something new.</p>}
      <section className="contact-section" id="contact" aria-labelledby="contact-heading">
        <div className="contact-mark" aria-hidden="true">@</div>
        <div>
          <p className="section-kicker">The conversation continues</p>
          <h2 id="contact-heading">Have a thought to share?</h2>
          <p>Questions, ideas, or just want to say hello? We’d love to hear from you.</p>
        </div>
        <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </section>
    </>
  )
}
