import type { ReactNode } from 'react'

interface StepProps {
    title: string
    children: ReactNode
}

function Step({ title, children }: StepProps) {
    // Rendered by Steps component — this is just a data container
    return <>{title}{children}</>
}

interface StepsProps {
    children: ReactNode
}

function Steps({ children }: StepsProps) {
    const items = Array.isArray(children) ? children : [children]

    return (
        <div className="steps">
            {items.map((child, i) => {
                if (!child || typeof child !== 'object' || !('props' in child)) return null
                const { title, children: content } = (child as React.ReactElement<StepProps>).props
                return (
                    <div key={i} className="steps-item">
                        <div className="steps-number">{i + 1}</div>
                        <div className="steps-content">
                            {title && <h3>{title}</h3>}
                            {content}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

Steps.Step = Step

export { Steps }
