'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X, BookOpen, Code2, Layers, Box, Palette,
  Route, Sparkles, TestTube, Database, Zap, Server,
  LayoutGrid, Component, Paintbrush, ChevronDown,
} from 'lucide-react'

interface MobileLink {
  label: string
  href: string
  icon: typeof Box
  accent?: string
}

const GETTING_STARTED_LINKS: MobileLink[] = [
  { label: 'Installation', href: '/docs/getting-started/installation', icon: Zap },
  { label: 'Quick Start', href: '/docs/getting-started/quickstart', icon: Sparkles },
  { label: 'Configuration', href: '/docs/getting-started/configuration', icon: Layers },
]

const GUIDES_LINKS: MobileLink[] = [
  { label: 'First App', href: '/docs/guides/first-app', icon: BookOpen },
  { label: 'Theming', href: '/docs/guides/theming', icon: Palette },
  { label: 'Routing', href: '/docs/guides/routing', icon: Route },
]

const API_LINKS: MobileLink[] = [
  { label: 'Core', href: '/docs/core/overview', icon: Box, accent: '#00ff88' },
  { label: 'Widgets', href: '/docs/widgets/overview', icon: LayoutGrid, accent: '#00d4ff' },
  { label: 'UI', href: '/docs/ui/overview', icon: Component, accent: '#aa66ff' },
  { label: 'JSX', href: '/docs/jsx/overview', icon: Code2, accent: '#ffaa00' },
  { label: 'Store', href: '/docs/store/overview', icon: Database, accent: '#00d4ff' },
  { label: 'TSS', href: '/docs/tss/overview', icon: Paintbrush, accent: '#aa66ff' },
  { label: 'Router', href: '/docs/router/overview', icon: Route, accent: '#00ff88' },
  { label: 'Motion', href: '/docs/motion/overview', icon: Sparkles, accent: '#ffaa00' },
  { label: 'Testing', href: '/docs/testing/overview', icon: TestTube, accent: '#ff4466' },
  { label: 'Data', href: '/docs/data/overview', icon: Database, accent: '#00d4ff' },
  { label: 'Quick', href: '/docs/quick/overview', icon: Zap, accent: '#ffaa00' },
  { label: 'Dev Server', href: '/docs/dev-server/overview', icon: Server, accent: '#aa66ff' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const currentPath = usePathname()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  useEffect(() => { onClose() }, [currentPath, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mobile-nav-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`mobile-nav-sheet${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">
            <span className="mobile-nav-title-prompt">&gt;_</span> Navigation
          </span>
          <button
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sections */}
        <nav className="mobile-nav-nav">
          {/* Docs Section */}
          <div className="mobile-nav-section">
            <button
              className="mobile-nav-section-btn"
              onClick={() => toggleSection('docs')}
              type="button"
              aria-expanded={expandedSection === 'docs'}
            >
              <BookOpen size={16} className="mobile-nav-section-icon docs" />
              <span>Docs & Guides</span>
              <ChevronDown
                size={14}
                className={`mobile-nav-section-chevron${expandedSection === 'docs' ? ' open' : ''}`}
              />
            </button>
            {expandedSection === 'docs' && (
              <div className="mobile-nav-links">
                {/* Getting Started sub-group */}
                <span className="mobile-nav-sub-label">/ Getting Started</span>
                <ul className="mobile-nav-sub-list">
                  {GETTING_STARTED_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="mobile-nav-link" onClick={onClose}>
                        <link.icon size={14} />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Guides sub-group */}
                <span className="mobile-nav-sub-label">/ Guides</span>
                <ul className="mobile-nav-sub-list">
                  {GUIDES_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="mobile-nav-link" onClick={onClose}>
                        <link.icon size={14} />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* API Section */}
          <div className="mobile-nav-section">
            <button
              className="mobile-nav-section-btn"
              onClick={() => toggleSection('api')}
              type="button"
              aria-expanded={expandedSection === 'api'}
            >
              <Code2 size={16} className="mobile-nav-section-icon api" />
              <span>API Reference</span>
              <ChevronDown
                size={14}
                className={`mobile-nav-section-chevron${expandedSection === 'api' ? ' open' : ''}`}
              />
            </button>
            {expandedSection === 'api' && (
              <ul className="mobile-nav-api-grid">
                {API_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="mobile-nav-link" onClick={onClose}>
                      <link.icon size={14} style={link.accent ? { color: link.accent } : undefined} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="mobile-nav-footer">
          <a
            href="https://github.com/Karanjot786/TermUI"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-gh-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </>
  )
}
