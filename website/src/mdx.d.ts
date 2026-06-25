declare module '*.mdx' {
  import type { ComponentType } from 'react'
  // MDX v3 compiled components accept a `components` prop for element overrides
  const Component: ComponentType<{ components?: Record<string, ComponentType<any>> }>
  export default Component
  export const frontmatter: Record<string, unknown>
}
