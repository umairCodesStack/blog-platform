import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: { user: Users.slug, meta: { titleSuffix: ' – Admin' } },
  collections: [Users, Posts, Categories, Media],
  editor: lexicalEditor({
    // Replace the default link feature so editors can flag paid links as rel="sponsored"
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => f.key !== 'link'),
      LinkFeature({
        enabledCollections: [],
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'sponsored', type: 'checkbox', label: 'Sponsored / paid link (rel="sponsored")' },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION || 'auto',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
            },
          }),
        ]
      : []),
  ],
})
