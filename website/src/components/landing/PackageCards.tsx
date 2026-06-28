'use client'

import Link from 'next/link'
import { packages, categoryLabels } from '../../data/packages'
import type { PackageInfo } from '../../data/packages'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCounter } from '../../hooks/useCounter'

function splitPackageName(name: string): { scope: string; slug: string } {
    if (name.startsWith('@')) {
        const slash = name.indexOf('/')
        return { scope: name.slice(0, slash + 1), slug: name.slice(slash + 1) }
    }
    return { scope: '', slug: name }
}

const categoryBadgeClass: Record<PackageInfo['category'], string> = {
    core: 'badge-accent',
    components: 'badge-cyan',
    features: 'badge-purple',
    dx: 'badge-amber',
}

function PackageCard({ pkg, index }: { pkg: PackageInfo; index: number }) {
    const { ref } = useScrollReveal<HTMLAnchorElement>({ threshold: 0.1 })
    const { scope, slug } = splitPackageName(pkg.name)

    return (
        <Link
            ref={ref}
            href={`/docs/${pkg.section}/overview`}
            className="pkg-card"
            style={{ '--i': index } as React.CSSProperties}
        >
            <div className="pkg-icon-box">{pkg.icon}</div>
            <div className="pkg-card-body">
                <div className="pkg-name">
                    {scope && <span className="pkg-name-scope">{scope}</span>}
                    <span className="pkg-name-slug">{slug}</span>
                </div>
                <p className="pkg-desc">{pkg.description}</p>
            </div>
            <span className="pkg-install-chip">npm i {pkg.name}</span>
        </Link>
    )
}

export function PackageCards() {
    const categories = ['core', 'components', 'features', 'dx'] as const
    const counter = useCounter(15, 1800)

    return (
        <section className="packages section">
            <div className="packages-shell-header container">
                <div className="shell-header-cmd">
                    <span className="shell-prompt">$</span>
                    <span className="shell-cmd">
                        ls <span className="shell-path">./packages</span>
                    </span>
                </div>
                <div className="shell-header-meta" ref={counter.ref}>
                    <span className="shell-count">{counter.value}</span>
                    <span className="shell-count-label"> packages</span>
                </div>
            </div>

            <div className="packages-list container">
                {categories.map((category) => {
                    const categoryPackages = packages.filter((p) => p.category === category)
                    if (categoryPackages.length === 0) return null

                    return (
                        <div key={category} className="package-category-group">
                            <div className="pkg-category-header">
                                <span className="pkg-cat-prompt">$&nbsp;ls</span>
                                <span className="pkg-cat-path">./packages/{category}/</span>
                                <span className={`badge ${categoryBadgeClass[category]} pkg-cat-badge`}>
                                    {categoryLabels[category]}
                                </span>
                            </div>
                            <div className="pkg-cards-grid">
                                {categoryPackages.map((pkg, i) => (
                                    <PackageCard key={pkg.slug} pkg={pkg} index={i} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
