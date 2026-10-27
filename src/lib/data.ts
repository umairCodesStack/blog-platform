import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

const published = { _status: { equals: 'published' } }
const client = () => getPayload({ config })

export const getPosts = cache(async (extra: any = {}, limit = 50) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [published, extra] },
    sort: '-publishedAt',
    depth: 1,
    limit,
    draft: false,
  })
  return docs as any[]
})

export const getPost = cache(async (slug: string) => {
  const docs = await getPosts({ slug: { equals: slug } }, 1)
  return docs[0] || null
})

export const getCategory = cache(async (slug: string) => {
  const payload = await client()
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  return (docs[0] as any) || null
})

export const getCategories = cache(async () => {
  const payload = await client()
  const { docs } = await payload.find({ collection: 'categories', sort: 'name', limit: 100 })
  return docs as any[]
})

export const getAuthor = cache(async (slug: string) => {
  const payload = await client()
  const { docs } = await payload.find({ collection: 'users', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return (docs[0] as any) || null
})

export const getAuthors = cache(async () => {
  const payload = await client()
  const { docs } = await payload.find({ collection: 'users', where: { slug: { exists: true } }, limit: 500 })
  return docs as any[]
})
