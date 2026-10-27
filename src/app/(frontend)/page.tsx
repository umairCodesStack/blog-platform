import { getPosts } from '@/lib/data'
import { PostList } from '@/components/PostList'
import { SITE_NAME, SITE_DESCRIPTION, abs } from '@/lib/site'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 3600

export default async function Home() {
  const posts = await getPosts({}, 30)
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: abs('/'), description: SITE_DESCRIPTION }} />
      <section className="intro">
        <h1>{SITE_DESCRIPTION}</h1>
      </section>
      <PostList posts={posts} />
    </>
  )
}
