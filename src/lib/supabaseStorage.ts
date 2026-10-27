import { readFile } from 'node:fs/promises'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { buildStoragePathData } from '@payloadcms/plugin-cloud-storage/utilities'

const encodePath = (storagePath: string) =>
  storagePath.split('/').map((segment) => encodeURIComponent(segment)).join('/')

export const getSupabasePublicObjectURL = ({
  bucket,
  collectionPrefix,
  filename,
  prefix,
  supabaseURL,
}: {
  bucket: string
  collectionPrefix?: string
  filename: string
  prefix?: string
  supabaseURL: string
}) => {
  const { storageFilePath } = buildStoragePathData({
    collectionPrefix,
    docPrefix: prefix,
    filename,
  })

  return `${supabaseURL.replace(/\/+$/, '')}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodePath(storageFilePath)}`
}

export const createSupabaseStorageAdapter = ({
  bucket,
  serviceRoleKey,
  supabaseURL,
}: {
  bucket: string
  serviceRoleKey: string
  supabaseURL: string
}): Adapter => {
  const storageURL = `${supabaseURL.replace(/\/+$/, '')}/storage/v1`
  const encodedBucket = encodeURIComponent(bucket)

  const getObjectURL = (storagePath: string) =>
    `${storageURL}/object/public/${encodedBucket}/${encodePath(storagePath)}`

  const requestHeaders = (contentType?: string) => ({
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  })

  const assertSuccessfulResponse = async (response: Response, action: string) => {
    if (!response.ok) {
      const details = await response.text()
      throw new Error(
        `Supabase Storage ${action} failed (${response.status} ${response.statusText}): ${details}`,
      )
    }
  }

  return ({ prefix: collectionPrefix }) => ({
    name: 'supabase',
    generateURL: ({ filename, prefix }) => {
      return getSupabasePublicObjectURL({
        bucket,
        collectionPrefix,
        filename,
        prefix,
        supabaseURL,
      })
    },
    handleUpload: async ({ file, storageFilePath }) => {
      const fileBuffer = file.tempFilePath ? await readFile(file.tempFilePath) : file.buffer
      const response = await fetch(
        `${storageURL}/object/${encodedBucket}/${encodePath(storageFilePath)}`,
        {
          method: 'POST',
          headers: {
            ...requestHeaders(file.mimeType),
            'x-upsert': 'true',
          },
          body: new Uint8Array(fileBuffer),
        },
      )

      await assertSuccessfulResponse(response, 'upload')
    },
    handleDelete: async ({ storageFilePath }) => {
      const response = await fetch(`${storageURL}/object/${encodedBucket}`, {
        method: 'DELETE',
        headers: {
          ...requestHeaders('application/json'),
        },
        body: JSON.stringify({ prefixes: [storageFilePath] }),
      })

      await assertSuccessfulResponse(response, 'delete')
    },
    staticHandler: (_req, { params: { filename, prefix } }) => {
      const { storageFilePath } = buildStoragePathData({
        collectionPrefix,
        docPrefix: prefix,
        filename,
      })

      return Response.redirect(getObjectURL(storageFilePath))
    },
  })
}
