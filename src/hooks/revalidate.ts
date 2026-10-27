import { revalidatePath } from 'next/cache'

// Called from Payload hooks. Wrapped in try/catch so scripts running outside Next don't crash.
export const revalidateAll = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {}
}

export const revalidatePost = ({ doc, previousDoc }: any) => {
  try {
    if (doc._status === 'published') revalidatePath(`/blog/${doc.slug}`)
    // Unpublished or slug changed: purge the old URL
    if (previousDoc?._status === 'published' && (doc._status !== 'published' || previousDoc.slug !== doc.slug)) {
      revalidatePath(`/blog/${previousDoc.slug}`)
    }
    revalidatePath('/')
    revalidatePath('/sitemap.xml')
    revalidatePath('/rss.xml')
  } catch {}
  return doc
}

export const revalidatePostDelete = ({ doc }: any) => {
  try {
    revalidatePath(`/blog/${doc.slug}`)
    revalidatePath('/')
    revalidatePath('/sitemap.xml')
  } catch {}
  return doc
}
