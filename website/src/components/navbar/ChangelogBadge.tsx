import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'

const DISMISS_KEY = 'termui-changelog-dismissed'

interface ChangelogEntry {
  version: string
  date: string
  title: string
  type: 'feature' | 'fix' | 'breaking'
}

const RECENT_CHANGES: ChangelogEntry[] = [
  { version: '0.1.6', date: '2026-06-15', title: '60+ new widgets, hooks, adapters, TSS themes, router guards, store middleware', type: 'feature' },
  { version: '0.1.5', date: '2026-05-26', title: 'Full Bun migration: Bun.spawn dev-server, drop Node and pnpm', type: 'breaking' },
  { version: '0.1.4', date: '2026-05-11', title: 'Focus system, 24 new widgets, data hooks', type: 'feature' },
  { version: '0.1.3', date: '2026-04-15', title: 'Motion package: spring physics', type: 'feature' },
]

export function ChangelogBadge() {
  const [open, setOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY)
    const latestVersion = RECENT_CHANGES[0]?.version
    if (dismissed !== latestVersion) setHasNew(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleOpen = () => {
    setOpen((o) => !o)
    if (hasNew) {
      setHasNew(false)
      localStorage.setItem(DISMISS_KEY, RECENT_CHANGES[0]?.version ?? '')
    }
  }

  return (
    <div className="nav-changelog-wrap" ref={ref}>
      <button
        className="nav-changelog-btn"
        onClick={handleOpen}
        aria-label="View changelog"
        aria-expanded={open}
        type="button"
      >
        <Bell size={15} />
        {hasNew && (
          <span className="nav-changelog-dot" aria-label="New updates" />
        )}
      </button>

      {open && (
        <div className="nav-changelog-panel" role="menu">
          <span className="nav-changelog-glow" aria-hidden="true" />

          <div className="nav-changelog-header">
            <span className="nav-changelog-header-icon">&gt;</span>
            <span>Changelog</span>
          </div>

          <ul className="nav-changelog-list">
            {RECENT_CHANGES.map((entry) => (
              <li key={entry.version} className="nav-changelog-entry" role="menuitem">
                <span className={`nav-changelog-tag ${entry.type}`}>{entry.type}</span>
                <span className="nav-changelog-entry-title">{entry.title}</span>
                <span className="nav-changelog-entry-date">v{entry.version} · {entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
