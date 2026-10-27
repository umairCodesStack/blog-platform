export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog'
export const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION || 'Articles on a topic you know well.'
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'skyrocketseosolution@gmail.com'

export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`)
export const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

export const imageUrl = (m: any, size: 'card' | 'hero' = 'hero') =>
  m && typeof m === 'object' ? m.sizes?.[size]?.url || m.url || null : null

export const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 220))
