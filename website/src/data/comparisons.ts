// Framework comparison data. Facts verified against each project's docs and
// package metadata (2026-06). Used by the /compare pages.

export interface Framework {
    key: string
    name: string
    language: string
    runtimeDep: string
    blurb: string
    repo?: string
}

export const FRAMEWORKS: Record<string, Framework> = {
    termui: {
        key: 'termui',
        name: 'TermUI',
        language: 'TypeScript',
        runtimeDep: 'None (own JSX runtime)',
        blurb: 'TypeScript framework with its own JSX runtime, flexbox layout, TSS theming, router, store, and a hot-reload dev server.',
        repo: 'https://github.com/Karanjot786/TermUI',
    },
    ink: {
        key: 'ink',
        name: 'Ink',
        language: 'JavaScript / TypeScript',
        runtimeDep: 'React + Yoga',
        blurb: 'React renderer for the terminal. You write React components; Ink renders them to the CLI using Yoga for flexbox.',
        repo: 'https://github.com/vadimdemedes/ink',
    },
    textual: {
        key: 'textual',
        name: 'Textual',
        language: 'Python',
        runtimeDep: 'Rich',
        blurb: 'Python TUI framework with CSS-like styling and an async, widget-based model.',
        repo: 'https://github.com/Textualize/textual',
    },
    bubbletea: {
        key: 'bubbletea',
        name: 'Bubble Tea',
        language: 'Go',
        runtimeDep: 'None',
        blurb: 'Go framework based on the Elm architecture, paired with Lip Gloss for styling.',
        repo: 'https://github.com/charmbracelet/bubbletea',
    },
    blessed: {
        key: 'blessed',
        name: 'blessed',
        language: 'JavaScript',
        runtimeDep: 'None',
        blurb: 'Long-standing curses-like library for Node. No JSX or component model.',
        repo: 'https://github.com/chjj/blessed',
    },
}

// A feature row: label + a value per framework key. Use short cells so the
// table reads as a real comparison, not prose.
export interface FeatureRow {
    feature: string
    values: Record<string, string>
}

export const FEATURES: FeatureRow[] = [
    { feature: 'Language', values: { termui: 'TypeScript', ink: 'JS / TS', textual: 'Python', bubbletea: 'Go', blessed: 'JavaScript' } },
    { feature: 'Runtime dependency', values: { termui: 'None', ink: 'React + Yoga', textual: 'Rich', bubbletea: 'None', blessed: 'None' } },
    { feature: 'JSX / components', values: { termui: 'Own JSX runtime', ink: 'Via React', textual: 'Python widgets', bubbletea: 'Elm model', blessed: 'No' } },
    { feature: 'Flexbox layout', values: { termui: 'Yes (built-in)', ink: 'Yes (Yoga)', textual: 'CSS grid/dock', bubbletea: 'Manual', blessed: 'Manual' } },
    { feature: 'CSS-like theming', values: { termui: 'TSS, 12 themes', ink: 'Limited', textual: 'Yes', bubbletea: 'Lip Gloss', blessed: 'No' } },
    { feature: 'Spring animations', values: { termui: 'Yes', ink: 'No', textual: 'Yes', bubbletea: 'Manual', blessed: 'No' } },
    { feature: 'Router', values: { termui: 'Built-in', ink: 'No', textual: 'Screens', bubbletea: 'No', blessed: 'No' } },
    { feature: 'Global state', values: { termui: 'Built-in store', ink: 'Use React', textual: 'Reactive', bubbletea: 'Model', blessed: 'No' } },
    { feature: 'Test renderer', values: { termui: 'Yes', ink: 'ink-testing-library', textual: 'Pilot', bubbletea: 'teatest', blessed: 'No' } },
    { feature: 'Hot reload dev server', values: { termui: 'Yes', ink: 'No', textual: 'Yes (textual run --dev)', bubbletea: 'No', blessed: 'No' } },
    { feature: 'Components', values: { termui: '230', ink: 'Small core', textual: '30+', bubbletea: 'Bubbles set', blessed: '~20' } },
    { feature: 'License', values: { termui: 'MIT', ink: 'MIT', textual: 'MIT', bubbletea: 'MIT', blessed: 'MIT' } },
]
