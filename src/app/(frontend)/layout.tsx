import type { Metadata } from 'next'
import Link from 'next/link'
import { Newsreader, Instrument_Sans } from 'next/font/google'
import { CONTACT_EMAIL, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site'
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
      <body id="top">
        <header className="site-header">
          <div className="wrap head">
            <Link href="/" className="logo" aria-label={`${SITE_NAME} home`}>
              <span className="brand-mark" aria-hidden="true">{SITE_NAME.charAt(0).toUpperCase()}</span>
              <span>{SITE_NAME}</span>
            </Link>
            <nav className="head-nav" aria-label="Categories">
              {categories.slice(0, 6).map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`}>{c.name}</Link>
              ))}
            </nav>
            {/* <Link href="/rss.xml" className="header-rss" type="application/rss+xml">
              <span>Get the RSS feed</span><span aria-hidden="true">↗</span>
            </Link> */}
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div className="footer-main">
              <div className="footer-about">
                <Link href="/" className="logo">
                  <span className="brand-mark" aria-hidden="true">{SITE_NAME.charAt(0).toUpperCase()}</span>
                  <span>{SITE_NAME}</span>
                </Link>
                <p>{SITE_DESCRIPTION}</p>
              </div>
              <div className="footer-links">
                <h2>Explore</h2>
                {categories.slice(0, 4).map((c) => (
                  <Link key={c.id} href={`/category/${c.slug}`}>{c.name}</Link>
                ))}
              </div>
              <div className="footer-links">
                <h2>Get in touch</h2>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <Link href="/rss.xml">RSS feed <span aria-hidden="true">↗</span></Link>
                <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} {SITE_NAME}</span>
              <span>Thoughtful reads, made for curious minds.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
