import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { PackageCards } from '@/components/landing/PackageCards'
import { InstallBanner } from '@/components/landing/InstallBanner'
import { CtaSection } from '@/components/landing/CtaSection'

const SITE_URL = 'https://termui.io'

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is TermUI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TermUI is a TypeScript framework for building terminal user interfaces. It provides a layout engine, JSX support, React-style hooks, context, global state management, theming, animations, routing, and a hot-reload dev server. It uses no C extensions and runs in pure TypeScript.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install TermUI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install TermUI with npm: run "npx create-termui-app my-app" to scaffold a new project, or install packages directly with "npm install @termuijs/core @termuijs/widgets @termuijs/jsx".',
      },
    },
    {
      '@type': 'Question',
      name: 'Does TermUI support JSX?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. TermUI includes @termuijs/jsx, a JSX runtime with useState, useEffect, useRef, useContext, useAsync, and memo(). It works like React in the browser but renders to the terminal.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many components does TermUI include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TermUI ships with 80+ components across two packages: @termuijs/widgets (Box, Text, Table, ProgressBar, Spinner, Gauge, VirtualList, DataGrid, Calendar, Markdown, and more) and @termuijs/ui (Select, Tabs, Modal, Toast, Tree, MultiSelect, CommandPalette, Drawer, Wizard, RadioGroup, and more).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is TermUI free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. TermUI is open-source and released under the MIT license. You can use it in personal and commercial projects without restrictions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between TermUI and Ink?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TermUI and Ink both target terminal UIs with JSX. TermUI adds a full layout engine, Terminal Style Sheets (TSS) for CSS-like theming, a built-in router, spring animations, a Zustand-like global store, and a hot-reload dev server. It ships as 13 independent packages so you only install what you need.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a TUI in Node.js?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A TUI (terminal user interface) is an interactive application that runs inside a terminal emulator. Unlike plain CLI output, a TUI renders a persistent, navigable UI using ANSI escape codes. In Node.js you build TUIs with frameworks like TermUI, which provides JSX components, a layout engine, keyboard input handling, and real-time rendering without a browser.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I build a CLI dashboard in TypeScript?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use TermUI. Run "npx create-termui-app my-dashboard", then add @termuijs/widgets for Box, Text, Table, ProgressBar, and Gauge components. Use @termuijs/data for live CPU, memory, disk, and network metrics. Use @termuijs/tss to theme the dashboard. The dev server reloads in under 200ms on every save.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best TypeScript terminal app framework?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TermUI is a TypeScript-first terminal UI framework with 15 packages covering components, JSX, theming (TSS), routing, spring animations, global state, hot reload, testing, adapters, and charts. Ink is the main alternative; it reuses React but has no built-in router, animations, or hot reload.',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <FeatureGrid />
      <PackageCards />
      <InstallBanner />
      <CtaSection />
    </>
  )
}
