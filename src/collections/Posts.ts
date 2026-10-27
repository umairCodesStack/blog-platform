import type { CollectionConfig } from 'payload'
import { revalidatePost, revalidatePostDelete } from '../hooks/revalidate'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'author', '_status', 'submitForReview', 'updatedAt'] },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 20 },
  access: {
    // Visitors (REST) only ever see published posts. Logged-in users see drafts they can edit.
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) =>
      user?.role === 'admin' ? true : user ? { author: { equals: user.id } } : false,
    delete: ({ req: { user } }) =>
      user?.role === 'admin' ? true : user ? { author: { equals: user.id } } : false,
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data
        if (data.title && !data.slug) data.slug = slugify(data.title)
        // Authors can only create posts as themselves
        if (operation === 'create' && req.user?.role !== 'admin') data.author = req.user?.id
        return data
      },
    ],
    beforeChange: [
      ({ data, req }) => {
        const u: any = req.user
        const canPublish = u?.role === 'admin' || u?.canPublishDirectly
        if (data._status === 'published') {
          if (!canPublish) {
            // Workflow: Draft -> In review -> Published (by an admin / trusted author)
            data._status = 'draft'
            data.submitForReview = true
          } else {
            data.submitForReview = false
            data.publishedAt = data.publishedAt || new Date().toISOString()
          }
        }
        return data
      },
    ],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', maxLength: 300, admin: { description: 'Short summary used on cards and as the fallback meta description.' } },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-generated from the title. Do not change after publishing.' },
    },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true, admin: { position: 'sidebar' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true, admin: { position: 'sidebar' } },
    { name: 'tags', type: 'array', admin: { position: 'sidebar' }, fields: [{ name: 'tag', type: 'text' }] },
    {
      name: 'submitForReview',
      type: 'checkbox',
      defaultValue: false,
      label: 'In review',
      admin: { position: 'sidebar', description: 'Set automatically when an author presses Publish.' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sponsored / guest post',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sponsorDisclosure',
      type: 'text',
      defaultValue: 'This is a sponsored post.',
      admin: { position: 'sidebar', condition: (d) => Boolean(d?.isSponsored) },
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        { name: 'seoTitle', type: 'text', maxLength: 70, admin: { description: 'Defaults to the post title.' } },
        { name: 'seoDescription', type: 'textarea', maxLength: 170, admin: { description: 'Defaults to the excerpt.' } },
      ],
    },
  ],
}
