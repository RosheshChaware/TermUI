'use client'

import Link from 'next/link'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useMagnetic } from '../../hooks/useMagnetic'

export function CtaSection() {
    const primaryBtn = useMagnetic(0.2)
    const secondaryBtn = useMagnetic(0.2)
    const { ref } = useScrollReveal<HTMLElement>({ threshold: 0.2 })

    return (
        <section className="cta-section" ref={ref}>

            {/* Ambient glow orbs */}
            <div className="cta-orb cta-orb--center" aria-hidden="true" />
            <div className="cta-orb cta-orb--left" aria-hidden="true" />
            <div className="cta-orb cta-orb--right" aria-hidden="true" />

            <div className="cta-inner container">

                {/* Boot status eyebrow */}
                <div className="cta-boot-status">
                    <span className="cta-boot-dot" aria-hidden="true" />
                    <span className="cta-boot-label">SYSTEM INITIALIZED</span>
                    <span className="cta-boot-sep" aria-hidden="true">|</span>
                    <span className="cta-boot-version">termui v0.1.6</span>
                </div>

                {/* Boot progress bar */}
                <div className="cta-boot-bar" aria-hidden="true">
                    <div className="cta-boot-bar-track">
                        <div className="cta-boot-bar-fill" />
                    </div>
                    <span className="cta-boot-bar-label">100%</span>
                </div>

                {/* Stacked editorial headline */}
                <h2 className="cta-headline">
                    <span className="cta-hl-line cta-hl-1">Ready to</span>
                    <span className="cta-hl-line cta-hl-2">BUILD</span>
                    <span className="cta-hl-line cta-hl-3">
                        something<span className="cta-hl-dot">.</span>
                    </span>
                </h2>

                <p className="cta-tagline">
                    Ship your next terminal app with TermUI.
                    Open source. MIT licensed.
                </p>

                {/* Action buttons */}
                <div className="cta-actions">
                    <Link
                        href="/docs/getting-started/installation"
                        className="btn btn-primary btn-lg hero-btn-magnetic"
                        onMouseMove={primaryBtn.onMouseMove}
                        onMouseLeave={primaryBtn.onMouseLeave}
                    >
                        Get Started →
                    </Link>
                    <a
                        href="https://github.com/Karanjot786/TermUI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-lg hero-btn-magnetic"
                        onMouseMove={secondaryBtn.onMouseMove}
                        onMouseLeave={secondaryBtn.onMouseLeave}
                    >
                        Star on GitHub ⭐
                    </a>
                </div>

                {/* Stats row */}
                <div className="cta-stats">
                    <div className="cta-stat">
                        <span className="cta-stat-value">13</span>
                        <span className="cta-stat-label">packages</span>
                    </div>
                    <span className="cta-stat-sep" aria-hidden="true">·</span>
                    <div className="cta-stat">
                        <span className="cta-stat-value">80+</span>
                        <span className="cta-stat-label">components</span>
                    </div>
                    <span className="cta-stat-sep" aria-hidden="true">·</span>
                    <div className="cta-stat">
                        <span className="cta-stat-value">100%</span>
                        <span className="cta-stat-label">TypeScript</span>
                    </div>
                    <span className="cta-stat-sep" aria-hidden="true">·</span>
                    <div className="cta-stat">
                        <span className="cta-stat-value">MIT</span>
                        <span className="cta-stat-label">licensed</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
