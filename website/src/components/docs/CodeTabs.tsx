'use client'

import { createContext, useContext, useState, Children, isValidElement } from 'react'
import type { ReactNode } from 'react'

interface TabsCtx {
  active: string
  set: (v: string) => void
}

const Ctx = createContext<TabsCtx>({ active: '', set: () => {} })

export function CodeTabs({ children, defaultValue }: { children: ReactNode; defaultValue?: string }) {
  // ponytail: scan children for first TabsTrigger value when no defaultValue given
  let first = defaultValue ?? ''
  if (!first) {
    Children.forEach(children, (child) => {
      if (first || !isValidElement(child)) return
      Children.forEach((child.props as { children?: ReactNode }).children, (trigger) => {
        if (first || !isValidElement(trigger)) return
        const v = (trigger.props as { value?: string }).value
        if (v) first = v
      })
    })
  }
  const [active, set] = useState(first)
  return (
    <Ctx.Provider value={{ active, set }}>
      <div className="code-tabs">{children}</div>
    </Ctx.Provider>
  )
}

export function TabsList({ children }: { children: ReactNode }) {
  return <div className="tabs-list" role="tablist">{children}</div>
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { active, set } = useContext(Ctx)
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active === value}
      className={`tabs-trigger${active === value ? ' active' : ''}`}
      onClick={() => set(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useContext(Ctx)
  if (active !== value) return null
  return <div role="tabpanel" className="tabs-content">{children}</div>
}
