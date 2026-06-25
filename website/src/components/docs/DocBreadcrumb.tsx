'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DocBreadcrumb() {
  const pathname = usePathname()
  // /docs/jsx/hooks-overview → ['jsx', 'hooks-overview']
  const parts = pathname.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  if (parts.length < 2) return null

  const section = parts[0]
  const slug = parts[parts.length - 1]
  const pageTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const editHref = `https://github.com/Karanjot786/TermUI/edit/main/website/content/docs/${parts.join('/')}.mdx`

  return (
    <div className="doc-meta-bar">
      <nav className="doc-breadcrumb" aria-label="Breadcrumb">
        <Link href="/docs" className="breadcrumb-root">docs</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href={`/docs/${section}`} className="breadcrumb-section">{section}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{pageTitle}</span>
      </nav>
      <div className="doc-meta-actions">
        <a href={editHref} target="_blank" rel="noopener noreferrer" className="doc-edit-link">
          Edit this page ↗
        </a>
      </div>
    </div>
  )
}
