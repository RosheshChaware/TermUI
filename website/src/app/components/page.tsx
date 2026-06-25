'use client'

import { useState } from 'react'
import Link from 'next/link'
import rawRegistry from '@/data/registry.json'

interface RegistryEntry {
  name: string
  slug: string
  package: string
  category: 'display' | 'input' | 'feedback' | 'layout' | 'data' | 'hook' | 'template'
  description: string
  tags: string[]
}

const registry = rawRegistry as RegistryEntry[]

const CATEGORIES = ['all', 'display', 'input', 'feedback', 'layout', 'data', 'hook', 'template'] as const
type CategoryFilter = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Exclude<CategoryFilter, 'all'>, string> = {
  display:  'Display',
  input:    'Input',
  feedback: 'Feedback',
  layout:   'Layout',
  data:     'Data',
  hook:     'Hook',
  template: 'Template',
}

const PKG_BADGE: Record<string, string> = {
  '@termuijs/widgets': 'widgets',
  '@termuijs/ui':      'ui',
  '@termuijs/jsx':     'jsx',
  '@termuijs/tss':     'tss',
}

// Precompute counts once — not per-render
const COUNTS = Object.fromEntries(
  CATEGORIES.map((cat) => [
    cat,
    cat === 'all' ? registry.length : registry.filter((c) => c.category === cat).length,
  ])
) as Record<CategoryFilter, number>

export default function ComponentsPage() {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [query, setQuery] = useState('')

  const filtered = registry.filter((c) => {
    const matchCat = category === 'all' || c.category === category
    if (!matchCat) return false
    if (!query) return true
    const q = query.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.includes(q))
    )
  })

  return (
    <div className="cb-page">
      <header className="cb-header">
        <div className="cb-header-inner">
          <p className="cb-count" aria-hidden="true">
            {String(registry.length).padStart(3, '0')}
          </p>
          <div className="cb-header-text">
            <h1>Components</h1>
            <p>{registry.length} terminal UI components across 4 packages</p>
          </div>
        </div>

        <div className="cb-controls">
          <input
            className="cb-search"
            type="search"
            placeholder="Search by name, description, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search components"
          />

          <ul className="cb-tabs" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className="cb-tab"
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                  <span className="cb-tab-count">{COUNTS[cat]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="cb-empty" role="status">
          <span className="cb-empty-code">0x00</span>
          <p>No components match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="cb-grid">
          {filtered.map((comp, i) => (
            <ComponentCard key={comp.slug} comp={comp} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function ComponentCard({ comp, index }: { comp: RegistryEntry; index: number }) {
  const pkgShort = comp.package.replace('@termuijs/', '')
  const docsHref = `/components/${comp.slug}`
  const badgeKey = PKG_BADGE[comp.package] ?? 'default'
  const shortDesc = comp.description.split(/\.\s/)[0]

  return (
    <Link
      href={docsHref}
      className="cb-card"
      style={{ '--i': index } as React.CSSProperties}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      }}
    >
      <div className="cb-card-inner">
        <div className="cb-card-head">
          <code className="cb-card-name">{comp.name}</code>
          <span className={`cb-badge cb-badge--${badgeKey}`}>{pkgShort}</span>
        </div>
        <p className="cb-card-desc">{shortDesc}</p>
        <div className="cb-card-foot">
          <span className="cb-cat-chip">{CATEGORY_LABELS[comp.category as Exclude<CategoryFilter, 'all'>]}</span>
        </div>
      </div>
    </Link>
  )
}
