'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MatrixRain } from './MatrixRain'
import { useCounter } from '../../hooks/useCounter'
import { useMagnetic } from '../../hooks/useMagnetic'

// Character scramble/decode effect — letters cycle through terminal chars before resolving
function useScramble(target: string, startDelay: number) {
    const [displayed, setDisplayed] = useState(target)

    useEffect(() => {
        const chars = '>_{}[]|/\\=+*~01ABCDabcd'
        let intervalId: ReturnType<typeof setInterval>

        const timeoutId = setTimeout(() => {
            let frame = 0
            const totalFrames = target.length * 4 + 8

            intervalId = setInterval(() => {
                frame++
                setDisplayed(
                    target.split('').map((char, i) => {
                        if (char === ' ' || char === '.' || char === '!') return char
                        if (frame >= i * 4 + 4) return char
                        return chars[Math.floor(Math.random() * chars.length)]
                    }).join('')
                )
                if (frame >= totalFrames) {
                    clearInterval(intervalId)
                    setDisplayed(target)
                }
            }, 40)
        }, startDelay)

        return () => {
            clearTimeout(timeoutId)
            clearInterval(intervalId)
        }
    }, [target, startDelay])

    return displayed
}

// Real src/index.tsx from a created TermUI app (CLI Wrapper template)
const terminalLines = [
    {
        content: (
            <>
                <span className="keyword">import</span>
                <span className="command"> {'{ app, text, logView }'} </span>
                <span className="keyword">from</span>
                <span className="string"> '@termuijs/quick'</span>
                <span className="command">;</span>
            </>
        ),
    },
    { content: <>&nbsp;</> },
    { content: <span className="comment">{'// CLI wrapper — displays log output'}</span> },
    {
        content: (
            <>
                <span className="keyword">const</span>
                <span className="command"> logs</span>
                <span className="flag">: string[]</span>
                <span className="command"> = [</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'  '}</span>
                <span className="string">'INFO  Application started'</span>
                <span className="command">,</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'  '}</span>
                <span className="string">'INFO  Waiting for input...'</span>
                <span className="command">,</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'  '}</span>
                <span className="string">'DEBUG Press q to quit'</span>
                <span className="command">,</span>
            </>
        ),
    },
    { content: <span className="command">{']'}</span> },
    { content: <>&nbsp;</> },
    {
        content: (
            <>
                <span className="flag">app</span>
                <span className="command">{'('}</span>
                <span className="string">{'\'📟 my-app\''}</span>
                <span className="command">{')'}</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'    .'}</span>
                <span className="flag">rows</span>
                <span className="command">{'('}</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'        '}</span>
                <span className="flag">text</span>
                <span className="command">{'('}</span>
                <span className="string">'Command output:'</span>
                <span className="command">{'),'}</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'        '}</span>
                <span className="flag">logView</span>
                <span className="command">{'(() => logs),'}</span>
            </>
        ),
    },
    { content: <span className="command">{'    )'}</span> },
    {
        content: (
            <>
                <span className="command">{'    .'}</span>
                <span className="flag">keys</span>
                <span className="command">{'({ q: '}</span>
                <span className="string">'quit'</span>
                <span className="command">{' })'}</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'    .'}</span>
                <span className="flag">refresh</span>
                <span className="command">{'('}</span>
                <span className="string">'1s'</span>
                <span className="command">{')'}</span>
            </>
        ),
    },
    {
        content: (
            <>
                <span className="command">{'    .'}</span>
                <span className="flag">run</span>
                <span className="command">{'();'}</span>
                <span className="hero-terminal-cursor" />
            </>
        ),
    },
]

export function Hero() {
    const primaryBtn = useMagnetic(0.25)
    const secondaryBtn = useMagnetic(0.25)
    const heroRef = useRef<HTMLElement>(null)
    const tiltRef = useRef<HTMLDivElement>(null)
    const [terminalPhase, setTerminalPhase] = useState<'coding' | 'running'>('coding')

    // Scramble decode for "magic" — starts after its charReveal animation completes
    const magicText = useScramble('magic', 1200)

    const packages = useCounter(15, 1800)
    const tests = useCounter(356, 2200)

    // Global mouse tracking → 3D tilt on terminal (direct DOM, no React re-render)
    useEffect(() => {
        const hero = heroRef.current
        const tiltEl = tiltRef.current
        if (!hero || !tiltEl) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect()
            const nx = (e.clientX - rect.left) / rect.width   // 0–1
            const ny = (e.clientY - rect.top) / rect.height   // 0–1
            const rotX = (ny - 0.5) * -10  // rotateX: ±5deg
            const rotY = (nx - 0.5) * 14   // rotateY: ±7deg
            tiltEl.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg)`
            tiltEl.style.transition = 'transform 0.08s ease-out'
        }

        const handleMouseLeave = () => {
            tiltEl.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)'
            tiltEl.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
        }

        hero.addEventListener('mousemove', handleMouseMove)
        hero.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            hero.removeEventListener('mousemove', handleMouseMove)
            hero.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    // Trigger terminal "running" output after code lines finish revealing
    useEffect(() => {
        // 17 lines × 0.08s stagger + 0.8s start + 0.4s duration + 0.3s buffer
        const timer = setTimeout(() => setTerminalPhase('running'), 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="hero" ref={heroRef}>
            <MatrixRain />

            <div className="hero-watermark" aria-hidden="true">TERMUI</div>

            {/* Decorative floating prompts */}
            <span className="hero-float-prompt hero-float-1" aria-hidden="true">&gt;_</span>
            <span className="hero-float-prompt hero-float-2" aria-hidden="true">&gt;_</span>
            <span className="hero-float-prompt hero-float-3" aria-hidden="true">$</span>

            <div className="hero-content">
                <div className="hero-text">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" />
                        <span>v0.1.6 · TypeScript</span>
                    </div>

                    {/* Editorial stacked headline — each line deliberately sized */}
                    <h1 className="hero-headline">
                        <span
                            className="hero-line hero-line-1"
                            style={{ '--i': 0 } as React.CSSProperties}
                        >
                            Build
                        </span>
                        <span
                            className="hero-line hero-line-2"
                            style={{ '--i': 1 } as React.CSSProperties}
                        >
                            interfaces
                        </span>
                        <span
                            className="hero-line hero-line-3"
                            style={{ '--i': 2 } as React.CSSProperties}
                        >
                            that feel like
                        </span>
                        <span
                            className="hero-line hero-line-4 hero-magic"
                            style={{ '--i': 3 } as React.CSSProperties}
                        >
                            {magicText}
                        </span>
                        <span
                            className="hero-line hero-line-5"
                            style={{ '--i': 4 } as React.CSSProperties}
                        >
                            in the terminal<span className="hero-dot">.</span>
                        </span>
                    </h1>

                    <p className="hero-tagline">
                        A TypeScript framework with 230 components, theming,
                        routing, and spring animations. Built for terminal apps
                        you ship to production.
                    </p>

                    <div className="hero-cta">
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
                            View on GitHub
                        </a>
                    </div>
                </div>

                <div className="hero-terminal-wrap">
                    {/* Both panels tilt together as one 3D unit */}
                    <div className="hero-terminal-group" ref={tiltRef}>

                        {/* Panel 1 — Code Editor (image #6 style) */}
                        <div className="hero-code-editor">
                            <div className="hero-terminal-scanline" aria-hidden="true" />
                            <div className="hero-terminal-header">
                                <span className="hero-terminal-dot red" />
                                <span className="hero-terminal-dot yellow" />
                                <span className="hero-terminal-dot green" />
                                <span className="hero-terminal-title">~/my-app/src/index.tsx</span>
                                <span className="hero-terminal-lang">TSX</span>
                            </div>
                            <div className="hero-terminal-body">
                                {terminalLines.map((line, i) => (
                                    <div
                                        key={i}
                                        className={`hero-terminal-line${i === terminalLines.length - 1 ? ' hero-terminal-line-active' : ''}`}
                                        style={{ '--line': i } as React.CSSProperties}
                                    >
                                        <span className="hero-terminal-linum">{i + 1}</span>
                                        <span className="hero-terminal-line-content">{line.content}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Panel 2 — Runtime Terminal (image #7 style) */}
                        <div className="hero-runtime-card">
                            <div className="hero-runtime-body">
                                <div className="hero-terminal-output-line out-cmd">
                                    <span className="prompt">$&nbsp;</span>
                                    <span className="command">npm run dev</span>
                                </div>
                                <div className="hero-terminal-output-line out-compiling">
                                    <span className="hero-compiling-text" />
                                </div>

                                {terminalPhase === 'running' && (
                                    <div className="hero-terminal-output-ui">
                                        <div className="out-app-titlebar">
                                            <span className="out-app-icon">🖥</span>
                                            <span className="out-app-name">my-app</span>
                                        </div>
                                        <div className="out-app-label">Command output:</div>
                                        {/* CSS-bordered logbox with scrollbar — matches image #7 */}
                                        <div className="out-app-logbox">
                                            <div className="out-logbox-lines">
                                                <div className="out-log-line">
                                                    <span className="out-log-info">INFO</span>
                                                    <span className="out-log-msg-green">&nbsp;&nbsp;Application started</span>
                                                </div>
                                                <div className="out-log-line">
                                                    <span className="out-log-info">INFO</span>
                                                    <span className="out-log-msg-cyan">&nbsp;&nbsp;Waiting for input&nbsp;...</span>
                                                </div>
                                                <div className="out-log-line">
                                                    <span className="out-log-debug">DEBUG</span>
                                                    <span className="out-log-msg-muted">&nbsp;Press q to quit</span>
                                                </div>
                                            </div>
                                            <div className="out-logbox-scrollbar">
                                                <div className="out-logbox-thumb" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* VS Code-style status bar at the very bottom */}
                            <div className="hero-editor-statusbar">
                                <div className="editor-status-left">
                                    <span className="editor-status-item editor-status-branch">⎇&nbsp;main</span>
                                    <span className="editor-status-item editor-status-ts">TS&nbsp;5.3</span>
                                    <span className="editor-status-item editor-status-hot">
                                        <span className="editor-status-dot" />
                                        Hot Reload
                                    </span>
                                </div>
                                <div className="editor-status-right">
                                    <span className="editor-status-item">Ln&nbsp;17</span>
                                    <span className="editor-status-item">UTF-8</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="hero-status-bar">
                <div className="hero-status-item" ref={packages.ref}>
                    <span className="hero-status-indicator" />
                    <span className="hero-status-value">{packages.value}</span>
                    <span className="hero-status-label">Packages</span>
                </div>
                <span className="hero-status-sep" aria-hidden="true">│</span>
                <div className="hero-status-item">
                    <span className="hero-status-indicator" />
                    <span className="hero-status-value">230</span>
                    <span className="hero-status-label">Components</span>
                </div>
                <span className="hero-status-sep" aria-hidden="true">│</span>
                <div className="hero-status-item" ref={tests.ref}>
                    <span className="hero-status-indicator" />
                    <span className="hero-status-value">{tests.value}</span>
                    <span className="hero-status-label">Tests Passing</span>
                </div>
                <span className="hero-status-sep" aria-hidden="true">│</span>
                <div className="hero-status-item">
                    <span className="hero-status-indicator" />
                    <span className="hero-status-value">100%</span>
                    <span className="hero-status-label">TypeScript</span>
                </div>
            </div>
        </section>
    )
}
