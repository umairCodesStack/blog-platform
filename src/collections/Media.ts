import type { CollectionConfig } from 'payload'
import { randomUUID } from 'node:crypto'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true, create: ({ req: { user } }) => Boolean(user) },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const extension = req.file.name.match(/\.[^.]+$/)?.[0].toLowerCase() ?? ''
          req.file.name = `${randomUUID()}${extension}`
        }
      },
    ],
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640, height: 360, position: 'centre' },
      { name: 'hero', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image (accessibility + SEO).' } }],
}
