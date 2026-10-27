import type { Metadata } from 'next'
import Link from 'next/link'
import { Newsreader, Instrument_Sans } from 'next/font/google'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site'
import { getCategories } from '@/lib/data'
import './globals.css'

const serif = Newsreader({ subsets: ['latin'], variable: '--serif', display: 'swap' })
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: { siteName: SITE_NAME, type: 'website' },
}

export const revalidate = 3600

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch(() => [])
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <header className="wrap head">
          <Link href="/" className="logo">{SITE_NAME}</Link>
          <nav aria-label="Categories">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`}>{c.name}</Link>
            ))}
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="wrap foot">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Sponsored posts are labelled and paid links use rel="sponsored".</p>
          <p><Link href="/rss.xml">RSS</Link></p>
        </footer>
      </body>
    </html>
  )
}
