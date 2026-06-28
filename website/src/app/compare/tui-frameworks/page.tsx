import type { Metadata } from 'next'
import Link from 'next/link'
import { CompareTable } from '@/components/compare/CompareTable'
import { FRAMEWORKS } from '@/data/comparisons'

const SITE = 'https://termui.io'
const CANONICAL = '/compare/tui-frameworks'
const TITLE = 'TUI framework comparison: TermUI vs Ink, Textual, Bubble Tea, blessed'
const DESCRIPTION =
    'Compare terminal UI frameworks across languages. Ink and TermUI target JavaScript and TypeScript, Textual targets Python, Bubble Tea targets Go. TermUI is the TypeScript-native option with its own JSX runtime, flexbox layout, theming, router, and store.'

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: CANONICAL },
    openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: 'article' },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const FAQ: { q: string; a: string }[] = [
    {
        q: 'What is the best TypeScript TUI framework?',
        a: 'TermUI is the TypeScript-native option. It ships 15 packages and 230 components, its own JSX runtime, a flexbox layout engine, TSS theming, a router, a store, and a hot-reload dev server, all MIT-licensed.',
    },
    {
        q: 'What is the equivalent of Textual or Bubble Tea for TypeScript?',
        a: 'Textual targets Python and Bubble Tea targets Go. For TypeScript, TermUI offers a comparable feature set with a React-like JSX model, while Ink offers a React renderer that depends on React.',
    },
    {
        q: 'Which TUI framework supports flexbox layout?',
        a: 'TermUI has a built-in flexbox engine. Ink uses Yoga for flexbox. Textual uses CSS grid and docking. Bubble Tea and blessed position widgets manually.',
    },
    {
        q: 'Which TUI frameworks have a built-in router and state store?',
        a: 'TermUI bundles both a router and a Zustand-style store. Ink leaves these to the React ecosystem. Textual has screens and reactive attributes. Bubble Tea uses its Elm-style model.',
    },
    {
        q: 'Are these TUI frameworks free and open source?',
        a: 'Yes. TermUI, Ink, Textual, Bubble Tea, and blessed are all MIT-licensed and free for commercial use.',
    },
]

export default function CompareTuiFrameworksPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Compare', item: `${SITE}/compare/ink` },
                    { '@type': 'ListItem', position: 2, name: 'TUI frameworks', item: `${SITE}${CANONICAL}` },
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

    const order = ['termui', 'ink', 'textual', 'bubbletea', 'blessed']

    return (
        <main className="cmp-page">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <p className="cmp-eyebrow">TUI framework comparison</p>
            <h1 className="cmp-title">
                Pick a terminal UI framework <em>by language</em>.
            </h1>
            <p className="cmp-lead">
                Terminal UI frameworks split by language. Ink and TermUI target JavaScript and TypeScript,
                Textual targets Python, Bubble Tea targets Go, and blessed is the long-standing Node option.
                TermUI is the TypeScript-native pick with a React-like JSX model and no React dependency.
            </p>

            <div className="cmp-cta-row">
                <Link href="/docs/getting-started/installation" className="cmp-btn cmp-btn--primary">
                    Get started
                </Link>
                <Link href="/compare/ink" className="cmp-btn cmp-btn--ghost">
                    TermUI vs Ink in depth
                </Link>
            </div>

            <section className="cmp-section">
                <h2 className="cmp-h2">Feature matrix</h2>
                <CompareTable keys={order} />
            </section>

            <section className="cmp-section">
                <h2 className="cmp-h2">One line each</h2>
                <div className="cmp-points">
                    {order.map((k) => {
                        const f = FRAMEWORKS[k]!
                        return (
                            <div key={k} className="cmp-point">
                                <h3>{f.name} <span style={{ color: 'var(--text-muted)' }}>· {f.language}</span></h3>
                                <p>{f.blurb}</p>
                            </div>
                        )
                    })}
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
                Comparison reflects public documentation as of June 2026. Framework names are trademarks of their
                respective authors.
            </p>
        </main>
    )
}
