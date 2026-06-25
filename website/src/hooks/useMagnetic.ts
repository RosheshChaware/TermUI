import { useCallback, type MouseEvent as ReactMouseEvent } from 'react'

export function useMagnetic(strength = 0.3) {
    const onMouseMove = useCallback(
        (e: ReactMouseEvent<HTMLElement>) => {
            const el = e.currentTarget
            const rect = el.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) * strength
            const y = (e.clientY - rect.top - rect.height / 2) * strength
            el.style.transform = `translate(${x}px, ${y}px)`
            el.style.transition = 'transform 0.15s ease-out'
        },
        [strength]
    )

    const onMouseLeave = useCallback((e: ReactMouseEvent<HTMLElement>) => {
        const el = e.currentTarget
        el.style.transform = 'translate(0px, 0px)'
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }, [])

    return { onMouseMove, onMouseLeave }
}
