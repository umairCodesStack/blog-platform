import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { createSupabaseStorageAdapter, getSupabasePublicObjectURL } from './lib/supabaseStorage'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const supabaseURL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseStorageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'Media'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const isSupabaseStorageConfigured = Boolean(
  supabaseURL || process.env.SUPABASE_STORAGE_BUCKET || supabaseServiceRoleKey,
)

if (isSupabaseStorageConfigured) {
  const missingVariables = [
    ['SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL', supabaseURL],
    ['SUPABASE_SERVICE_ROLE_KEY', supabaseServiceRoleKey],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missingVariables.length > 0) {
    throw new Error(
      `Supabase Storage is configured but missing required settings: ${missingVariables.join(', ')}. ` +
        'Use the server-side service_role key from Supabase Dashboard > Project Settings > API.',
    )
  }
}

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
    ...(isSupabaseStorageConfigured
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                generateFileURL: ({ filename, prefix }) =>
                  getSupabasePublicObjectURL({
                    bucket: supabaseStorageBucket,
                    filename,
                    prefix,
                    supabaseURL: supabaseURL!,
                  }),
                adapter: createSupabaseStorageAdapter({
                  bucket: supabaseStorageBucket,
                  serviceRoleKey: supabaseServiceRoleKey!,
                  supabaseURL: supabaseURL!,
                }),
              },
            },
          }),
        ]
      : []),
  ],
})
