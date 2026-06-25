import type { ReactNode } from 'react'
import { DocsSidebar } from '@/components/docs-sidebar'
import { TableOfContents } from '@/components/docs/TableOfContents'

export default function DocsShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="doc-layout">
      <DocsSidebar />
      <div className="doc-content">
        {children}
      </div>
      <TableOfContents />
    </div>
  )
}
