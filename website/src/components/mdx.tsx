import type { ComponentType } from 'react'
import { TerminalCodeBlock } from '@/components/docs/TerminalCodeBlock'
import { PackageTabs } from '@/components/docs/PackageTabs'
import { Callout } from '@/components/docs/Callout'
import { Steps } from '@/components/docs/Steps'
import { ApiTable } from '@/components/docs/ApiTable'
import { CodeTabs, TabsList, TabsTrigger, TabsContent } from '@/components/docs/CodeTabs'

export function getMDXComponents(overrides?: Record<string, unknown>): Record<string, ComponentType<any>> {
  return {
    pre: TerminalCodeBlock,
    PackageTabs,
    Callout,
    Steps,
    Step: Steps.Step,   // <Step title="..."> without importing
    ApiTable,
    CodeTabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    ...overrides,
  } as Record<string, ComponentType<any>>
}
