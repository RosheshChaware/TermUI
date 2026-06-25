'use client'

import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export interface MegaItem {
  label: string
  href: string
  icon: LucideIcon
  description?: string
  accent?: string
}

export interface MegaSection {
  title: string
  items: MegaItem[]
}

interface MegaDropdownProps {
  sections: MegaSection[]
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaDropdown({ sections, onClose, onMouseEnter, onMouseLeave }: MegaDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const isWide = sections.length > 2

  return (
    <div
      ref={ref}
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`mega-drop${isWide ? ' wide' : ''}`}
    >
      <span className="mega-drop-glow" aria-hidden="true" />

      <div className="mega-drop-grid">
        {sections.map((section) => (
          <div key={section.title}>
            <span className="mega-drop-section-title">
              <span className="mega-drop-title-slash">/</span>
              {section.title}
            </span>
            <ul className="mega-drop-list">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="mega-drop-item"
                    role="menuitem"
                    onClick={onClose}
                  >
                    <span
                      className="mega-drop-item-icon"
                      style={item.accent ? { color: item.accent } : { color: 'var(--accent)' }}
                    >
                      <item.icon size={16} />
                    </span>
                    <span className="mega-drop-item-content">
                      <span className="mega-drop-item-label">{item.label}</span>
                      {item.description && (
                        <span className="mega-drop-item-desc">{item.description}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
