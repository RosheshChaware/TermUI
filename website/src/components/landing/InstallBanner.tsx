'use client'
import { useState, useCallback } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const installCommands = {
    bunx: 'bunx create-termui-app my-app',
    bun: 'bun create termui-app my-app',
    npx: 'npx create-termui-app my-app',
} as const

type PackageManager = keyof typeof installCommands

export function InstallBanner() {
    const [pm, setPm] = useState<PackageManager>('bunx')
    const [sessionKey, setSessionKey] = useState(0)
    const [copied, setCopied] = useState(false)
    const { ref } = useScrollReveal<HTMLElement>({ threshold: 0.15 })

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(installCommands[pm])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [pm])

    const handlePmChange = useCallback((key: PackageManager) => {
        if (key === pm) return
        setPm(key)
        setSessionKey((k) => k + 1)
        setCopied(false)
    }, [pm])

    return (
        <section className="install-banner section" ref={ref}>

            {/* ── Section header ── */}
            <div className="install-section-header container">
                <div className="install-eyebrow">
                    <span className="install-eyebrow-dash" />
                    <span className="install-eyebrow-label">QUICK START</span>
                    <span className="install-eyebrow-dash" />
                </div>
                <h2 className="install-main-title">
                    One command to{' '}
                    <span style={{ color: 'var(--accent)' }}>start building</span>
                </h2>
                <p className="install-main-desc">
                    Scaffold a TermUI project with one command, then run it.
                </p>
            </div>

            {/* ── Two-panel session (key resets animations on PM switch) ── */}
            <div className="install-layout container" key={sessionKey}>

                {/* Left: Terminal session window */}
                <div className="install-window">

                    {/* Chrome: dots + PM tabs + copy btn */}
                    <div className="install-chrome">
                        <div className="install-chrome-dots">
                            <span className="idot idot--red" />
                            <span className="idot idot--yellow" />
                            <span className="idot idot--green" />
                        </div>
                        <div className="install-chrome-tabs" role="tablist">
                            {(Object.keys(installCommands) as PackageManager[]).map((key) => (
                                <button
                                    key={key}
                                    role="tab"
                                    aria-selected={pm === key}
                                    onClick={() => handlePmChange(key)}
                                    className={`install-chrome-tab${pm === key ? ' active' : ''}`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                        <button
                            className={`install-copy-btn${copied ? ' copied' : ''}`}
                            onClick={handleCopy}
                            aria-label="Copy install command"
                        >
                            {copied ? '✓ copied' : '⎘ copy'}
                        </button>
                    </div>

                    {/* Session body */}
                    <div className="install-session">

                        {/* Shell prompt */}
                        <div className="install-prompt-line">
                            <span className="ipr-user">user</span>
                            <span className="ipr-at">@</span>
                            <span className="ipr-host">machine</span>
                            <span>&nbsp;</span>
                            <span className="ipr-dir">~/projects</span>
                            <span className="ipr-dollar">&nbsp;$&nbsp;</span>
                        </div>

                        {/* Typewriter command + blinking cursor */}
                        <div className="install-cmd-line">
                            <span className="install-cmd-text">{installCommands[pm]}</span>
                            <span className="install-cmd-cursor" aria-hidden="true" />
                        </div>

                        <div className="install-gap" />

                        {/* Staggered output lines */}
                        <div className="iout iout-1">
                            <span className="iout-check">✓</span>
                            <span className="iout-label"> Scaffolding project</span>
                            <span className="iout-dim"> my-app/</span>
                        </div>
                        <div className="iout iout-2">
                            <span className="iout-check">✓</span>
                            <span className="iout-label"> TypeScript template applied</span>
                        </div>
                        <div className="iout iout-3">
                            <span className="iout-check">✓</span>
                            <span className="iout-label"> 15 packages installed</span>
                        </div>

                        <div className="install-gap" />

                        <div className="iout iout-4">
                            <span className="iout-arrow">▸</span>
                            <span className="iout-run-hint"> Next:&nbsp;</span>
                            <span className="iout-run-cmd">cd my-app</span>
                            <span className="iout-run-sep">&nbsp;&amp;&amp;&nbsp;</span>
                            <span className="iout-run-cmd">bun run dev</span>
                        </div>

                    </div>
                </div>

                {/* Right: Live preview card */}
                <div className="install-preview">
                    <div className="install-preview-chrome">
                        <div className="install-chrome-dots">
                            <span className="idot idot--red" />
                            <span className="idot idot--yellow" />
                            <span className="idot idot--green" />
                        </div>
                        <span className="install-preview-title">🖥&nbsp;&nbsp;my-app</span>
                        <span className="install-preview-live">
                            <span className="install-preview-live-dot" />
                            live
                        </span>
                    </div>
                    <div className="install-preview-body">
                        <div className="install-preview-app-label">Command output:</div>
                        <div className="install-preview-logbox">
                            <div className="install-log-line">
                                <span className="out-log-info">INFO</span>
                                <span className="out-log-msg-green">&nbsp;&nbsp;Application started</span>
                            </div>
                            <div className="install-log-line">
                                <span className="out-log-info">INFO</span>
                                <span className="out-log-msg-cyan">&nbsp;&nbsp;Waiting for input&nbsp;...</span>
                            </div>
                            <div className="install-log-line">
                                <span className="out-log-debug">DEBUG</span>
                                <span className="out-log-msg-muted">&nbsp;Press q to quit</span>
                            </div>
                        </div>
                    </div>
                    <div className="install-preview-statusbar">
                        <span className="install-preview-status-left">
                            <span className="install-preview-status-dot" />
                            Running
                        </span>
                        <span className="install-preview-status-right">refresh: 1s</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
