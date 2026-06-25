'use client'

import { useEffect, useState } from 'react'
import { NavLogo } from '@/components/navbar/NavLogo'
import { NavLinks } from '@/components/navbar/NavLinks'
// import { SearchTrigger } from '@/components/navbar/SearchTrigger'
import { GithubStarsBadge } from '@/components/navbar/GithubStarsBadge'
// import { ThemeToggle } from '@/components/navbar/ThemeToggle'
// import { ChangelogBadge } from '@/components/navbar/ChangelogBadge'
import { MobileNav } from '@/components/navbar/MobileNav'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => {
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        className={`nav-outer${mounted ? ' mounted' : ''}`}
        aria-label="Site navigation"
      >
        <div className={`nav-capsule-wrap${scrolled ? ' scrolled' : ''}`}>
          {/* Aurora rotating border - reveals on hover */}
          <span className="nav-aurora" aria-hidden="true" />

          {/* Glass surface */}
          <div className={`nav-surface${scrolled ? ' docked' : ' floating'}`}>
            <span className="nav-noise" aria-hidden="true" />
            <span className="nav-scan" aria-hidden="true" />

            {/* Terminal corner marks - floating only */}
            {!scrolled && (
              <>
                <span className="nav-corner nav-corner-tl" aria-hidden="true" />
                <span className="nav-corner nav-corner-tr" aria-hidden="true" />
                <span className="nav-corner nav-corner-bl" aria-hidden="true" />
                <span className="nav-corner nav-corner-br" aria-hidden="true" />
              </>
            )}

            {/* Content row */}
            <div className="nav-inner">
              {/* Logo */}
              <div className="nav-boot-logo">
                <NavLogo scrolled={scrolled} />
              </div>

              {/* Desktop nav links */}
              <div className="nav-boot-links nav-links-wrap">
                <NavLinks />
              </div>

              {/* Actions */}
              <div className="nav-boot-actions nav-actions">
                {/* <SearchTrigger onOpen={handleSearchOpen} /> */}

                <div className="nav-sep" aria-hidden="true" />

                <div className="nav-actions-group">
                  <GithubStarsBadge />
                  {/* <ThemeToggle /> */}
                  {/* <ChangelogBadge /> */}
                </div>

                <span className={`nav-version${scrolled ? ' scrolled' : ''}`}>
                  v0.1.6
                </span>

                {/* Hamburger - mobile only */}
                <button
                  className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                  type="button"
                >
                  <span className="hamburger-line hamburger-line-top" />
                  <span className="hamburger-line hamburger-line-mid" />
                  <span className="hamburger-line hamburger-line-bot" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        onClose={closeMobile}
      />
    </>
  )
}
