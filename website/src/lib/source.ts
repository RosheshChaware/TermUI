import type { ComponentType } from 'react'

// ponytail: static map replaces fumadocs-core/source — add entry when new MDX file added
type MDXModule = { default: ComponentType<{ components?: Record<string, ComponentType> }>; frontmatter?: Record<string, unknown> }

const DOCS: Record<string, () => Promise<MDXModule>> = {
  'adapters/ai':                    () => import('../../content/docs/adapters/ai.mdx'),
  'adapters/cli-tools':             () => import('../../content/docs/adapters/cli-tools.mdx'),
  'adapters/integrations':          () => import('../../content/docs/adapters/integrations.mdx'),
  'adapters/overview':              () => import('../../content/docs/adapters/overview.mdx'),
  'adapters/storage':               () => import('../../content/docs/adapters/storage.mdx'),
  'core/app':                       () => import('../../content/docs/core/app.mdx'),
  'core/event-emitter':             () => import('../../content/docs/core/event-emitter.mdx'),
  'core/input-parser':              () => import('../../content/docs/core/input-parser.mdx'),
  'core/layout':                    () => import('../../content/docs/core/layout.mdx'),
  'core/overview':                  () => import('../../content/docs/core/overview.mdx'),
  'core/screen':                    () => import('../../content/docs/core/screen.mdx'),
  'core/style':                     () => import('../../content/docs/core/style.mdx'),
  'core/unicode':                   () => import('../../content/docs/core/unicode.mdx'),
  'create-termui-app/overview':     () => import('../../content/docs/create-termui-app/overview.mdx'),
  'getting-started/architecture':   () => import('../../content/docs/getting-started/architecture.mdx'),
  'getting-started/installation':   () => import('../../content/docs/getting-started/installation.mdx'),
  'getting-started/quick-start':    () => import('../../content/docs/getting-started/quick-start.mdx'),
  'guides/accessibility':           () => import('../../content/docs/guides/accessibility.mdx'),
  'guides/dev-server':              () => import('../../content/docs/guides/dev-server.mdx'),
  'guides/first-app':               () => import('../../content/docs/guides/first-app.mdx'),
  'guides/quick':                   () => import('../../content/docs/guides/quick.mdx'),
  'guides/termui-vs-ink':           () => import('../../content/docs/guides/termui-vs-ink.mdx'),
  'guides/testing':                 () => import('../../content/docs/guides/testing.mdx'),
  'guides/what-is-a-tui':           () => import('../../content/docs/guides/what-is-a-tui.mdx'),
  'jsx/context':                    () => import('../../content/docs/jsx/context.mdx'),
  'jsx/error-boundary':             () => import('../../content/docs/jsx/error-boundary.mdx'),
  'jsx/focus':                      () => import('../../content/docs/jsx/focus.mdx'),
  'jsx/hooks-overview':             () => import('../../content/docs/jsx/hooks-overview.mdx'),
  'jsx/memo':                       () => import('../../content/docs/jsx/memo.mdx'),
  'jsx/use-async':                  () => import('../../content/docs/jsx/use-async.mdx'),
  'jsx/use-input':                  () => import('../../content/docs/jsx/use-input.mdx'),
  'jsx/use-keymap':                 () => import('../../content/docs/jsx/use-keymap.mdx'),
  'jsx/use-motion':                 () => import('../../content/docs/jsx/use-motion.mdx'),
  'motion/springs':                 () => import('../../content/docs/motion/springs.mdx'),
  'motion/transitions':             () => import('../../content/docs/motion/transitions.mdx'),
  'router/guards':                  () => import('../../content/docs/router/guards.mdx'),
  'router/hooks':                   () => import('../../content/docs/router/hooks.mdx'),
  'router/overview':                () => import('../../content/docs/router/overview.mdx'),
  'router/query-strings':           () => import('../../content/docs/router/query-strings.mdx'),
  'store/api':                      () => import('../../content/docs/store/api.mdx'),
  'store/middleware':               () => import('../../content/docs/store/middleware.mdx'),
  'store/overview':                 () => import('../../content/docs/store/overview.mdx'),
  'store/selectors':                () => import('../../content/docs/store/selectors.mdx'),
  'testing/overview':               () => import('../../content/docs/testing/overview.mdx'),
  'tss/overview':                   () => import('../../content/docs/tss/overview.mdx'),
  'tss/themes':                     () => import('../../content/docs/tss/themes.mdx'),
  'tss/tokens':                     () => import('../../content/docs/tss/tokens.mdx'),
  'ui/inputs':                      () => import('../../content/docs/ui/inputs.mdx'),
  'ui/notifications':               () => import('../../content/docs/ui/notifications.mdx'),
  'ui/overview':                    () => import('../../content/docs/ui/overview.mdx'),
  'ui/prompts':                     () => import('../../content/docs/ui/prompts.mdx'),
  'widgets/charts':                 () => import('../../content/docs/widgets/charts.mdx'),
  'widgets/charts-package':         () => import('../../content/docs/widgets/charts-package.mdx'),
  'widgets/display':                () => import('../../content/docs/widgets/display.mdx'),
  'widgets/feedback':               () => import('../../content/docs/widgets/feedback.mdx'),
  'widgets/inputs':                 () => import('../../content/docs/widgets/inputs.mdx'),
  'widgets/layout':                 () => import('../../content/docs/widgets/layout.mdx'),
  'widgets/overview':               () => import('../../content/docs/widgets/overview.mdx'),
  'widgets/virtual-list':           () => import('../../content/docs/widgets/virtual-list.mdx'),
  'data/database':                  () => import('../../content/docs/data/database.mdx'),
  'data/docker':                    () => import('../../content/docs/data/docker.mdx'),
  'data/hooks':                     () => import('../../content/docs/data/hooks.mdx'),
  'data/overview':                  () => import('../../content/docs/data/overview.mdx'),
  'data/system-monitoring':         () => import('../../content/docs/data/system-monitoring.mdx'),
}

export function getAllSlugs() {
  return Object.keys(DOCS).map((key) => ({ slug: key.split('/') }))
}

export async function getDocPage(slug: string[]) {
  const loader = DOCS[slug.join('/')]
  return loader ? loader() : null
}
