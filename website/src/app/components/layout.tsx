import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import rawRegistry from '@/data/registry.json'

export const metadata: Metadata = {
  title: 'Component Browser',
  description: `${rawRegistry.length} terminal UI components — browse by category across widgets, ui, jsx, and tss packages.`,
}

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
