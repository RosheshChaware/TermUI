'use client'
import { useCallback, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Shared mouse-tracking glow helper — rAF-throttled to avoid per-pixel DOM writes
function useGlowCard() {
    const ticking = useRef(false)
    return useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
        if (ticking.current) return
        ticking.current = true
        const el = e.currentTarget
        const clientX = e.clientX
        const clientY = e.clientY
        requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect()
            el.style.setProperty('--mx', `${((clientX - rect.left) / rect.width) * 100}%`)
            el.style.setProperty('--my', `${((clientY - rect.top) / rect.height) * 100}%`)
            ticking.current = false
        })
    }, [])
}

// Card 1 — TypeScript-First (col-span 2)
function TypeScriptCard() {
    const { ref } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 })
    const onMouseMove = useGlowCard()
    return (
        <div ref={ref} className="bento-card bento-card--ts glow-card" onMouseMove={onMouseMove}>
            <div className="bento-card-label">TypeScript-First</div>
            <h3 className="bento-card-title">Full type inference,<br />end to end.</h3>
            <div className="bento-ts-demo">
                <div className="bento-ts-tooltip">
                    <span className="bento-ts-tooltip-kind">const</span>
                    <span className="bento-ts-tooltip-type"> Widget&lt;&#123; label: string &#125;&gt;</span>
                </div>
                <pre className="bento-ts-code"><span className="keyword">const</span> widget <span className="flag">= text</span><span className="command">&lt;&#123;</span> <span className="string">label</span><span className="command">: string &#125;&gt;(</span>opts<span className="command">)</span></pre>
            </div>
            <p className="bento-card-desc">Your APIs stay typed across all 15 packages. Autocomplete, generics, and compile-time checks work end to end.</p>
        </div>
    )
}

// Card 2 — Spring Animations (row-span 2, right column)
function SpringCard() {
    const { ref } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
    const onMouseMove = useGlowCard()
    return (
        <div ref={ref} className="bento-card bento-card--spring glow-card" onMouseMove={onMouseMove}>
            <div className="bento-card-label">Spring Animations</div>
            <div className="bento-spring-demo">
                <svg className="bento-spring-svg" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                        id="spring-path"
                        d="M 20,80 C 60,10 140,10 180,80"
                        stroke="rgba(0,255,136,0.2)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                    <circle className="spring-dot" r="6" fill="var(--accent)" />
                </svg>
                <div className="bento-spring-label">
                    <span className="keyword">motion</span>
                    <span className="command">.spring(&#123;</span>
                    <span className="string"> stiffness</span>
                    <span className="command">: 260,</span>
                    <span className="string"> damping</span>
                    <span className="command">: 20 &#125;)</span>
                </div>
            </div>
            <h3 className="bento-card-title">Physics-based<br />motion.</h3>
            <p className="bento-card-desc">Spring physics and easing transitions add smooth, natural motion to your terminal UI.</p>
        </div>
    )
}

// Card 3 — Terminal Style Sheets (bottom-left)
function TSSCard() {
    const { ref } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 })
    const onMouseMove = useGlowCard()
    const swatches = [
        { name: 'accent', color: 'var(--accent)' },
        { name: 'cyan', color: 'var(--cyan)' },
        { name: 'amber', color: 'var(--amber)' },
        { name: 'purple', color: 'var(--purple)' },
        { name: 'red', color: '#ff5f57' },
        { name: 'white', color: '#e8e8f0' },
    ]
    return (
        <div ref={ref} className="bento-card bento-card--tss glow-card" onMouseMove={onMouseMove}>
            <div className="bento-card-label">Terminal Style Sheets</div>
            <div className="bento-swatches">
                {swatches.map((s, i) => (
                    <div
                        key={s.name}
                        className="bento-swatch"
                        style={{ '--swatch-color': s.color, '--i': i } as React.CSSProperties}
                        title={`$${s.name}`}
                    />
                ))}
            </div>
            <pre className="bento-tss-code"><span className="flag">.panel</span> <span className="command">&#123;</span>
  <span className="keyword">background</span><span className="command">: </span><span className="string">$bg-surface</span><span className="command">;</span>
  <span className="keyword">border</span><span className="command">: 1px solid </span><span className="string">$accent</span><span className="command">;</span>
<span className="command">&#125;</span></pre>
        </div>
    )
}

// Card 4 — 16+ Components (bottom-center)
const componentNames = [
    'Box', 'Text', 'Table', 'Spinner', 'Select',
    'Tabs', 'Modal', 'Tree', 'Toast', 'Form',
    'CommandPalette', 'ProgressBar', 'Gauge', 'TextInput', 'logView', 'Divider',
]

function ComponentsCard() {
    const { ref } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 })
    const onMouseMove = useGlowCard()
    // Split into two columns: first 8 scroll up, last 8 scroll down
    const col1 = [...componentNames.slice(0, 8), ...componentNames.slice(0, 8)]
    const col2 = [...componentNames.slice(8), ...componentNames.slice(8)]

    return (
        <div ref={ref} className="bento-card bento-card--components glow-card" onMouseMove={onMouseMove}>
            <div className="bento-card-label">16+ Components</div>
            <div className="bento-marquee-wrap">
                <div className="bento-marquee-col bento-marquee-col--up">
                    <div className="bento-marquee-inner">
                        {col1.map((name, i) => (
                            <div key={i} className="bento-marquee-item">{name}</div>
                        ))}
                    </div>
                </div>
                <div className="bento-marquee-col bento-marquee-col--down">
                    <div className="bento-marquee-inner">
                        {col2.map((name, i) => (
                            <div key={i} className="bento-marquee-item">{name}</div>
                        ))}
                    </div>
                </div>
            </div>
            <p className="bento-card-desc">Box, Text, Table, Spinner, Select, Tabs, Modal, Tree, Toast, Form, and more. Ready to use.</p>
        </div>
    )
}

export function FeatureGrid() {
    return (
        <section className="features section">
            <div className="features-editorial-header container">
                <span className="features-section-num">04</span>
                <div>
                    <h2 className="fade-in-up" style={{ marginTop: 0 }}>
                        Core <span style={{ color: 'var(--accent)' }}>Features</span>
                    </h2>
                    <p className="fade-in-up stagger-1">
                        Tools for building terminal applications, with a
                        developer experience modeled after web frameworks.
                    </p>
                </div>
            </div>

            <div className="bento-grid container">
                <TypeScriptCard />
                <SpringCard />
                <TSSCard />
                <ComponentsCard />
            </div>
        </section>
    )
}
