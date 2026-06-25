'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMagnetic } from '@/hooks/useMagnetic'
import { MegaDropdown, type MegaSection } from './MegaDropdown'
import {
  BookOpen, Code2, Layers, Box, Palette,
  Route, Sparkles, TestTube, Database, Zap, Server,
  LayoutGrid, Component, Paintbrush
} from 'lucide-react'

const DOCS_SECTIONS: MegaSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Installation', href: '/docs/getting-started/installation', icon: Zap, description: 'Set up TermUI in your project' },
      { label: 'Quick Start', href: '/docs/getting-started/quickstart', icon: Sparkles, description: 'Build your first terminal app' },
      { label: 'Configuration', href: '/docs/getting-started/configuration', icon: Layers, description: 'Configure your workspace' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'First App', href: '/docs/guides/first-app', icon: BookOpen, description: 'Step-by-step tutorial' },
      { label: 'Theming', href: '/docs/guides/theming', icon: Palette, description: 'Custom themes with TSS' },
      { label: 'Routing', href: '/docs/guides/routing', icon: Route, description: 'Multi-screen navigation' },
    ],
  },
]

const API_SECTIONS: MegaSection[] = [
  {
    title: 'Core',
    items: [
      { label: 'Core', href: '/docs/core/overview', icon: Box, accent: '#00ff88' },
      { label: 'Widgets', href: '/docs/widgets/overview', icon: LayoutGrid, accent: '#00d4ff' },
      { label: 'UI', href: '/docs/ui/overview', icon: Component, accent: '#aa66ff' },
      { label: 'JSX', href: '/docs/jsx/overview', icon: Code2, accent: '#ffaa00' },
    ],
  },
  {
    title: 'State & Style',
    items: [
      { label: 'Store', href: '/docs/store/overview', icon: Database, accent: '#00d4ff' },
      { label: 'TSS', href: '/docs/tss/overview', icon: Paintbrush, accent: '#aa66ff' },
      { label: 'Router', href: '/docs/router/overview', icon: Route, accent: '#00ff88' },
      { label: 'Motion', href: '/docs/motion/overview', icon: Sparkles, accent: '#ffaa00' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Testing', href: '/docs/testing/overview', icon: TestTube, accent: '#ff4466' },
      { label: 'Data', href: '/docs/data/overview', icon: Database, accent: '#00d4ff' },
      { label: 'Quick', href: '/docs/quick/overview', icon: Zap, accent: '#ffaa00' },
      { label: 'Dev Server', href: '/docs/dev-server/overview', icon: Server, accent: '#aa66ff' },
    ],
  },
]

const API_PATH_PREFIXES = [
  '/docs/core', '/docs/widgets', '/docs/ui', '/docs/jsx',
  '/docs/store', '/docs/tss', '/docs/router', '/docs/motion',
  '/docs/testing', '/docs/data', '/docs/quick', '/docs/dev-server',
]

interface NavLinkDef {
  label: string
  isActive: boolean
  megaSections?: MegaSection[]
  href?: string
}

export function NavLinks() {
  const currentPath = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeIndicator, setActiveIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })
  const linksContainerRef = useRef<HTMLUListElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const magnetic = useMagnetic(0.15)

  const links: NavLinkDef[] = [
    {
      label: 'Docs',
      isActive: currentPath.startsWith('/docs/getting-started') || currentPath.startsWith('/docs/guides'),
      megaSections: DOCS_SECTIONS,
    },
    {
      label: 'API',
      isActive: API_PATH_PREFIXES.some((p) => currentPath.startsWith(p)),
      megaSections: API_SECTIONS,
    },
    {
      label: 'Components',
      isActive: currentPath === '/components',
      href: '/components',
    },
  ]

  // Measure active link for sliding indicator
  useEffect(() => {
    if (!linksContainerRef.current) return
    const activeEl = linksContainerRef.current.querySelector('[data-active="true"]') as HTMLElement
    if (activeEl) {
      const containerRect = linksContainerRef.current.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      setActiveIndicator({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      })
    } else {
      setActiveIndicator({ left: 0, width: 0 })
    }
  }, [currentPath])

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setOpenDropdown(label)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 150)
  }, [])

  const handleDropdownEnter = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
  }, [])

  return (
    <ul className="nav-links" ref={linksContainerRef}>
      {/* Sliding active pill */}
      <span
        className="nav-link-indicator"
        style={{
          left: activeIndicator.left,
          width: activeIndicator.width,
          opacity: activeIndicator.width > 0 ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {links.map((link) => (
        <li
          key={link.label}
          className="nav-link-item"
          onMouseEnter={() => link.megaSections && handleMouseEnter(link.label)}
          onMouseLeave={link.megaSections ? handleMouseLeave : undefined}
        >
          {link.href ? (
            <Link
              href={link.href}
              data-active={link.isActive}
              className={`nav-link${link.isActive ? ' active' : ''}`}
              {...magnetic}
            >
              {link.label}
            </Link>
          ) : (
            <button
              data-active={link.isActive}
              className={`nav-link${link.isActive ? ' active' : ''}`}
              type="button"
              aria-expanded={openDropdown === link.label}
              aria-haspopup="true"
              {...magnetic}
            >
              {link.label}
              <svg
                className={`nav-link-chevron${openDropdown === link.label ? ' open' : ''}`}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                aria-hidden="true"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {link.megaSections && openDropdown === link.label && (
            <MegaDropdown
              sections={link.megaSections}
              onClose={() => setOpenDropdown(null)}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
