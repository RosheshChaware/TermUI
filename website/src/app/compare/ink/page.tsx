import type { Metadata } from 'next'
import Link from 'next/link'
import { CompareTable } from '@/components/compare/CompareTable'

const SITE = 'https://termui.io'
const CANONICAL = '/compare/ink'
const TITLE = 'TermUI vs Ink: a terminal UI framework with no React dependency'
const DESCRIPTION =
    'TermUI and Ink both bring JSX and hooks to the terminal. Ink depends on React and Yoga. TermUI ships its own JSX runtime with flexbox layout, TSS theming, a router, a store, and a hot-reload dev server. Compare features, install size, and APIs.'

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: CANONICAL },
    openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'article' },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const FAQ: { q: string; a: string }[] = [
    {
        q: 'What is the difference between TermUI and Ink?',
        a: 'Ink depends on React and Yoga; you write React components and Ink renders them to the terminal. TermUI ships its own JSX runtime, so you write JSX and hooks with no React dependency, plus a built-in flexbox layout engine, TSS theming, a router, a store, and a hot-reload dev server.',
    },
    {
        q: 'Is TermUI a drop-in replacement for Ink?',
        a: 'No, the imports and some APIs differ. The mental model is the same: JSX, hooks like useState and useEffect, and flexbox layout. Most Ink components port over by swapping React imports for @termuijs/jsx and Ink primitives for TermUI widgets.',
    },
    {
        q: 'Why choose TermUI over Ink?',
        a: 'TermUI has no React or Yoga dependency, so the install is smaller and there is no React version to manage. It also bundles features Ink leaves to the ecosystem: a router, a global store, CSS-like theming, spring animations, and a test renderer.',
    },
    {
        q: 'Does TermUI run on Node.js like Ink?',
        a: 'Yes. Published TermUI packages run on Node 18+ with no native C extensions. Bun 1.3+ is only needed for the development server.',
    },
    {
        q: 'How do I migrate a CLI from Ink to TermUI?',
        a: 'Install @termuijs/core, @termuijs/jsx, and @termuijs/widgets, replace React imports with @termuijs/jsx, swap Ink Box and Text for TermUI widgets, and mount with the App class. Hooks and flexbox props map closely.',
    },
]

export default function CompareInkPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Compare', item: `${SITE}/compare/ink` },
                    { '@type': 'ListItem', position: 2, name: 'TermUI vs Ink', item: `${SITE}${CANONICAL}` },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: FAQ.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
        ],
    }

    return (
        <main className="cmp-page">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <p className="cmp-eyebrow">TermUI vs Ink</p>
            <h1 className="cmp-title">
                Write JSX in the terminal, <em>without React</em>.
            </h1>
            <p className="cmp-lead">
                Ink renders React components to the terminal using React and Yoga. TermUI ships its own JSX
                runtime, so you get JSX, hooks, and flexbox layout with no React dependency, plus a router, a
                store, TSS theming, and a hot-reload dev server in one framework.
            </p>

            <div className="cmp-cta-row">
                <Link href="/docs/getting-started/installation" className="cmp-btn cmp-btn--primary">
                    Get started
                </Link>
                <Link href="/compare/tui-frameworks" className="cmp-btn cmp-btn--ghost">
                    Compare all frameworks
                </Link>
            </div>

            <section className="cmp-section">
                <h2 className="cmp-h2">TermUI vs Ink at a glance</h2>
                <CompareTable keys={['termui', 'ink']} />
            </section>

            <section className="cmp-section">
                <h2 className="cmp-h2">Key differences</h2>
                <div className="cmp-points">
                    <div className="cmp-point">
                        <h3>No React dependency</h3>
                        <p>Ink pulls in React and Yoga. TermUI ships its own JSX runtime and flexbox engine, so there is no React version to track and the install is smaller.</p>
                    </div>
                    <div className="cmp-point">
                        <h3>Batteries included</h3>
                        <p>Ink leaves routing, state, and theming to the ecosystem. TermUI bundles a router, a Zustand-style store, TSS theming with 12 themes, and spring animations.</p>
                    </div>
                    <div className="cmp-point">
                        <h3>Same mental model</h3>
                        <p>You still write JSX with useState, useEffect, and flexbox props. Porting an Ink component means swapping imports, not relearning the model.</p>
                    </div>
                    <div className="cmp-point">
                        <h3>230 components</h3>
                        <p>TermUI ships 230 components across widgets and UI, from Table and Spinner to DataGrid, charts, and a command palette. Browse them in the catalog.</p>
                    </div>
                </div>
            </section>

            <section className="cmp-section">
                <h2 className="cmp-h2">Frequently asked questions</h2>
                <dl className="cmp-faq">
                    {FAQ.map((f) => (
                        <div key={f.q} className="cmp-faq-item">
                            <dt>{f.q}</dt>
                            <dd>{f.a}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <p className="cmp-note">
                Ink is a trademark of its authors. This comparison reflects public documentation as of June 2026
                and is maintained by the TermUI project.
            </p>
        </main>
    )
}
