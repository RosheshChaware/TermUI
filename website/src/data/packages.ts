export interface PackageInfo {
    name: string
    slug: string
    section: string
    description: string
    icon: string
    category: 'core' | 'components' | 'features' | 'dx'
}

export const packages: PackageInfo[] = [
    {
        name: '@termuijs/core',
        slug: 'core',
        section: 'core',
        description: 'Render engine, screen buffer, input parsing, event system, and layout.',
        icon: '⚡',
        category: 'core',
    },
    {
        name: '@termuijs/widgets',
        slug: 'widgets',
        section: 'widgets',
        description: 'Box, Text, Table, ProgressBar, Spinner, Gauge, DataGrid, Calendar, Markdown, and 60+ more.',
        icon: '🧩',
        category: 'components',
    },
    {
        name: '@termuijs/ui',
        slug: 'ui',
        section: 'ui',
        description: 'Select, Tabs, Modal, Tree, Toast, Form, Drawer, Wizard, RadioGroup, MenuBar, and 25+ more.',
        icon: '🎨',
        category: 'components',
    },
    {
        name: '@termuijs/tss',
        slug: 'tss',
        section: 'tss',
        description: 'Terminal Style Sheets. CSS-like theming for terminal apps.',
        icon: '🎭',
        category: 'features',
    },
    {
        name: '@termuijs/router',
        slug: 'router',
        section: 'router',
        description: 'File-based routing with params, guards, and transitions.',
        icon: '🧭',
        category: 'features',
    },
    {
        name: '@termuijs/motion',
        slug: 'motion',
        section: 'motion',
        description: 'Spring physics and easing-based animations for the terminal.',
        icon: '✨',
        category: 'features',
    },
    {
        name: '@termuijs/jsx',
        slug: 'jsx',
        section: 'jsx',
        description: 'JSX runtime for declarative terminal UI composition.',
        icon: '📐',
        category: 'core',
    },
    {
        name: '@termuijs/store',
        slug: 'store',
        section: 'store',
        description: 'Zustand-style global state with selector subscriptions.',
        icon: '🗃️',
        category: 'core',
    },
    {
        name: '@termuijs/data',
        slug: 'data',
        section: 'data',
        description: 'System monitoring: CPU, memory, disk, network, processes.',
        icon: '📊',
        category: 'features',
    },
    {
        name: '@termuijs/adapters',
        slug: 'adapters',
        section: 'adapters',
        description: 'Bridges to AI providers, git, execa, and other CLI tools.',
        icon: '🔌',
        category: 'features',
    },
    {
        name: '@termuijs/testing',
        slug: 'testing',
        section: 'testing',
        description: 'In-memory test renderer with query and interaction API.',
        icon: '🧪',
        category: 'dx',
    },
    {
        name: '@termuijs/quick',
        slug: 'quick',
        section: 'quick',
        description: 'Rapid prototyping with reactive values and a fluent app builder.',
        icon: '🚀',
        category: 'dx',
    },
    {
        name: '@termuijs/dev-server',
        slug: 'dev-server',
        section: 'dev-server',
        description: 'Hot-reload dev server. Restart on file save.',
        icon: '🔥',
        category: 'dx',
    },
    {
        name: 'create-termui-app',
        slug: 'create-termui-app',
        section: 'create-termui-app',
        description: 'CLI scaffolding tool. One command to start building.',
        icon: '📦',
        category: 'dx',
    },
    {
        name: '@termuijs/cli',
        slug: 'cli',
        section: 'cli',
        description: 'Add components to your project with npx termuijs add.',
        icon: '⌘',
        category: 'dx',
    },
]

export const categoryLabels: Record<PackageInfo['category'], string> = {
    core: 'Core Infrastructure',
    components: 'Component Libraries',
    features: 'Features',
    dx: 'Developer Experience',
}
