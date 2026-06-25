import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/landing/CustomCursor'
import './globals.css'

const SITE_URL = 'https://termui.io'
const SITE_NAME = 'TermUI'
const SITE_TITLE = 'TermUI | Terminal UI Framework for TypeScript'
const SITE_DESCRIPTION =
  'TermUI is a TypeScript framework for building terminal user interfaces. It includes 16+ components, JSX support, React-style hooks, theming, routing, and spring animations. Pure TypeScript, no C extensions.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s | TermUI' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Karanjot786' }],
  keywords: ['terminal UI', 'TypeScript', 'TUI', 'terminal framework', 'CLI UI', 'Node.js terminal'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@termuijs',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [],
  },
}

// Main site graph — Organization, Software, WebSite, SourceCode
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.svg`,
      },
      sameAs: ['https://github.com/Karanjot786/TermUI', 'https://www.npmjs.com/package/@termuijs/core'],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'TermUI',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Linux, macOS, Windows',
      programmingLanguage: 'TypeScript',
      url: SITE_URL,
      downloadUrl: 'https://www.npmjs.com/package/@termuijs/core',
      softwareVersion: '1.0',
      license: 'https://opensource.org/licenses/MIT',
      description:
        'TermUI is a TypeScript framework for building terminal user interfaces with 16+ components, JSX support, hooks, theming, routing, and animations.',
      author: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/docs/getting-started/installation#search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${SITE_URL}/#sourcecode`,
      name: 'TermUI Source Code',
      codeRepository: 'https://github.com/Karanjot786/TermUI',
      programmingLanguage: 'TypeScript',
      license: 'https://opensource.org/licenses/MIT',
      runtimePlatform: 'Node.js',
    },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="theme-color" content="#0a0a0f" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
          <CustomCursor />
          <Navbar />
          <main id="main-content" style={{ paddingTop: 'var(--navbar-height)' }}>
            {children}
          </main>
          <Footer />
          <Analytics />
      </body>
    </html>
  )
}
