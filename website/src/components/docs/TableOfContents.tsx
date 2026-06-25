'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Heading {
  id: string
  text: string
  depth: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.doc-content h2, .doc-content h3')
      const items: Heading[] = Array.from(elements).map((el) => ({
        id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
        text: el.textContent || '',
        depth: el.tagName === 'H2' ? 2 : 3,
      }))
      setHeadings(items)
      elements.forEach((el) => {
        if (!el.id) el.id = el.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      })
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => { setActiveId('') }, [pathname])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    headings.forEach((h) => { const el = document.getElementById(h.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = document.querySelector('.doc-content') as HTMLElement | null
          if (!el) return
          const total = el.scrollHeight - window.innerHeight + 64
          const scrolled = window.scrollY - el.offsetTop + 64
          setScrollProgress(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="toc">
      <div className="toc-progress-track">
        <div className="toc-progress-fill" style={{ height: `${scrollProgress}%` }} />
      </div>
      <div className="toc-header">
        <span className="toc-title">On this page</span>
        <span className="toc-count">{headings.length} sections</span>
      </div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className="toc-item">
            <a
              href={`#${h.id}`}
              className={`toc-link${h.depth === 3 ? ' depth-3' : ''}${activeId === h.id ? ' active' : ''}`}
            >
              {activeId === h.id && <span className="toc-cursor" aria-hidden="true">▶</span>}
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
