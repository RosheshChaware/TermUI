import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Getting Started - TermUI Docs',
    description: 'Install TermUI, scaffold a project with the CLI, and understand the architecture. Three pages, about 15 minutes.',
}

const NEXT_STEPS = [
    {
        title: 'Installation',
        slug: 'installation',
        desc: 'Scaffold a new project with the create-termui-app CLI, or add packages manually to an existing project.',
    },
    {
        title: 'Quick Start',
        slug: 'quick-start',
        desc: 'Build a working terminal app with Box, Text, and keyboard handling. See output in your terminal in minutes.',
    },
    {
        title: 'Architecture',
        slug: 'architecture',
        desc: 'How TermUI is structured as separate packages. The five-layer dependency model and render pipeline.',
    },
]

export default function GettingStartedHub() {
    return (
        <div className="gs-hub">

            <h1>Getting Started</h1>

            <p className="gs-hub-sub">
                This section walks you through installing TermUI, creating your
                first project, and understanding the package structure. You will
                go from an empty directory to a running terminal app.
            </p>

            {/* ── Pre-requisite knowledge ─────────────── */}
            <section className="gs-prereqs" aria-labelledby="prereqs-heading">
                <h2 id="prereqs-heading" className="gs-section-title">
                    Pre-requisite knowledge
                </h2>
                <p className="gs-prereq-intro">
                    The docs assume some familiarity with TypeScript and Node.js.
                    Before starting, make sure you are comfortable with:
                </p>
                <ul className="gs-prereqs-list">
                    <li className="gs-prereq-item required">
                        <span className="gs-prereq-icon" aria-hidden="true">✓</span>
                        <span className="gs-prereq-text">Bun 1.3 or later</span>
                    </li>
                    <li className="gs-prereq-item required">
                        <span className="gs-prereq-icon" aria-hidden="true">✓</span>
                        <span className="gs-prereq-text">Node.js 18+ if installing from npm</span>
                    </li>
                    <li className="gs-prereq-item required">
                        <span className="gs-prereq-icon" aria-hidden="true">✓</span>
                        <span className="gs-prereq-text">TypeScript basics (types, async/await)</span>
                    </li>
                    <li className="gs-prereq-item required">
                        <span className="gs-prereq-icon" aria-hidden="true">✓</span>
                        <span className="gs-prereq-text">A terminal emulator with 256-color support</span>
                    </li>
                </ul>
                <p className="gs-prereq-note">
                    If you know React, the <code>@termuijs/jsx</code> package will feel
                    familiar. If you do not, the widget-tree API works without JSX.
                </p>
            </section>

            {/* ── Next Steps ──────────────────────────── */}
            <section className="gs-next-steps" aria-labelledby="next-steps-heading">
                <h2 id="next-steps-heading" className="gs-section-title">
                    Next Steps
                </h2>
                <div className="gs-step-cards">
                    {NEXT_STEPS.map((step) => (
                        <Link
                            key={step.slug}
                            href={`/docs/getting-started/${step.slug}`}
                            className="gs-step-card"
                        >
                            <div className="gsc-body">
                                <span className="gsc-title">{step.title}</span>
                                <p className="gsc-desc">{step.desc}</p>
                            </div>
                            <span className="gsc-arrow" aria-hidden="true">→</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
