import type { ReactNode } from 'react'

type CalloutVariant = 'tip' | 'warning' | 'note' | 'danger'

const TAG_MAP: Record<CalloutVariant, string> = {
    tip: '[TIP]',
    warning: '[WARN]',
    note: '[INFO]',
    danger: '[ERR]',
}

interface CalloutProps {
    variant?: CalloutVariant
    children: ReactNode
}

export function Callout({ variant = 'note', children }: CalloutProps) {
    return (
        <div className={`callout callout-${variant}`}>
            <span className="callout-icon">{TAG_MAP[variant]}</span>
            <div className="callout-body">{children}</div>
        </div>
    )
}
