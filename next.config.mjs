import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  // Add 301 redirects here if you ever change a slug
  async redirects() {
    return []
  },
}

export default withPayload(nextConfig)
