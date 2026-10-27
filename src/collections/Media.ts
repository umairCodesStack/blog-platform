import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true, create: ({ req: { user } }) => Boolean(user) },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640, height: 360, position: 'centre' },
      { name: 'hero', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image (accessibility + SEO).' } }],
}
