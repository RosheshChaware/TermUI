'use client'

import { useEffect, useState } from 'react'

type PM = 'bunx' | 'bun' | 'npx' | 'npm' | 'pnpm' | 'yarn'

const STORAGE_KEY = 'termui-preferred-pm'
const TAB_ORDER: PM[] = ['bunx', 'bun', 'npx', 'npm', 'pnpm', 'yarn']

interface PackageTabsProps {
    bunx?: string
    bun?: string
    npx?: string
    npm?: string
    pnpm?: string
    yarn?: string
}

const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
        <rect x="0" y="0" width="6" height="6" rx="1" />
        <rect x="8" y="0" width="6" height="6" rx="1" />
        <rect x="0" y="8" width="6" height="6" rx="1" />
        <rect x="8" y="8" width="6" height="6" rx="1" />
    </svg>
)

const ClipboardIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

function CommandLines({ cmd }: { cmd: string }) {
    const lines = cmd.split('\n')
    return (
        <>
            {lines.map((line, i) => {
                if (!line && i === lines.length - 1) return null
                const trimmed = line.trimStart()
                if (trimmed.startsWith('#')) {
                    return (
                        <span key={i} className="pkg-line pkg-comment">
                            <span>{line}</span>{'\n'}
                        </span>
                    )
                }
                const command = trimmed.startsWith('$ ') ? trimmed.slice(2) : line
                return (
                    <span key={i} className="pkg-line pkg-prompt">
                        <span className="pkg-dollar">$</span>
                        {' '}
                        <span className="pkg-cmd">{command}</span>
                        {'\n'}
                    </span>
                )
            })}
        </>
    )
}

export function PackageTabs({ bunx, bun, npx, npm, pnpm, yarn }: PackageTabsProps) {
    const props = { bunx, bun, npx, npm, pnpm, yarn }
    const tabs = TAB_ORDER
        .filter((pm) => Boolean(props[pm]))
        .map((pm) => ({ pm, cmd: props[pm]! }))

    const [selected, setSelected] = useState<PM>(tabs[0]?.pm ?? 'bun')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as PM | null
        if (saved && tabs.some((t) => t.pm === saved)) setSelected(saved)
    }, [])

    const handleSelect = (pm: PM) => {
        setSelected(pm)
        localStorage.setItem(STORAGE_KEY, pm)
    }

    const active = tabs.find((t) => t.pm === selected) ?? tabs[0]
    if (!active) return null

    const handleCopy = async () => {
        const text = active.cmd
            .split('\n')
            .filter((l) => l.trim() && !l.trimStart().startsWith('#'))
            .map((l) => (l.trimStart().startsWith('$ ') ? l.trimStart().slice(2) : l))
            .join('\n')
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* clipboard unavailable */ }
    }

    return (
        <div className="pkg-tabs">
            <div className="pkg-tabs-header">
                <span className="pkg-grid-icon" aria-hidden="true"><GridIcon /></span>
                <div className="pkg-tabs-list" role="tablist">
                    {tabs.map(({ pm }) => (
                        <button
                            key={pm}
                            role="tab"
                            type="button"
                            aria-selected={active.pm === pm}
                            className={`pkg-tab${active.pm === pm ? ' active' : ''}`}
                            onClick={() => handleSelect(pm)}
                        >
                            {pm}
                        </button>
                    ))}
                </div>
                <button
                    className={`pkg-copy-icon${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied' : 'Copy'}
                    type="button"
                >
                    {copied ? <CheckIcon /> : <ClipboardIcon />}
                </button>
            </div>
            <pre className="pkg-tabs-body" role="tabpanel">
                <code className="pkg-code">
                    <CommandLines cmd={active.cmd} />
                </code>
            </pre>
        </div>
    )
}
