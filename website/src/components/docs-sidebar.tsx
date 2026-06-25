'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { navigation } from '@/data/navigation'
import type { NavItem } from '@/data/navigation'

const SECTION_ICONS: Record<string, string> = {
    'Getting Started': '◈',
    'Core': '⬡',
    'JSX': '◇',
    'Widgets': '▦',
    'UI Components': '◉',
    'Store': '⊕',
    'TSS (Theming)': '◈',
    'Router': '⟋',
    'Motion': '∿',
    'Data': '◎',
    'Adapters': '⊞',
    'Testing': '✦',
    'Guides': '◎',
    'create-termui-app': '◈',
}

function SidebarSection({ section, currentPath }: { section: NavItem; currentPath: string }) {
    const isAnyChildActive = section.children?.some((c) => currentPath === c.href) ?? false
    const [isOpen, setIsOpen] = useState(isAnyChildActive)

    useEffect(() => {
        if (isAnyChildActive) setIsOpen(true)
    }, [isAnyChildActive])

    const icon = SECTION_ICONS[section.label] ?? '◦'
    const slug = section.label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')

    return (
        <div className="sidebar-section">
            <button
                className={`sidebar-section-label${isOpen ? ' open' : ''}${isAnyChildActive ? ' has-active' : ''}`}
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
                type="button"
            >
                <span className="section-icon">{icon}</span>
                <span className="section-path">
                    <span className="section-path-prefix">~/</span>
                    <span className="section-path-name">{slug}</span>
                    <span className="section-path-slash">/</span>
                </span>
                <span className="chevron">{isOpen ? '▾' : '▸'}</span>
            </button>
            <ul className={`sidebar-items${isOpen ? ' expanded' : ' collapsed'}`} aria-hidden={!isOpen}>
                {section.children?.map((item) => (
                    <li key={item.href} className="sidebar-item">
                        <Link
                            href={item.href}
                            className={`sidebar-link${currentPath === item.href ? ' active' : ''}`}
                            aria-current={currentPath === item.href ? 'page' : undefined}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function DocsSidebar() {
    const pathname = usePathname()
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-header-prompt">$ docs</span>
                <span className="sidebar-header-cursor">▌</span>
            </div>
            {navigation.map((section) => (
                <SidebarSection key={section.label} section={section} currentPath={pathname} />
            ))}
        </aside>
    )
}
