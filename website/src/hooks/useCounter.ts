import { useEffect, useRef, useState } from 'react'

function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useCounter(target: number, duration = 2000) {
    const ref = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState(0)
    const started = useRef(false)

    useEffect(() => {
        // Reset animation state when target changes so it can replay
        started.current = false
        setValue(0)
    }, [target])

    useEffect(() => {
        const el = ref.current
        if (!el) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(target)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true
                    const startTime = performance.now()

                    function tick(now: number) {
                        const elapsed = now - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const eased = easeOutExpo(progress)
                        setValue(Math.round(eased * target))

                        if (progress < 1) {
                            requestAnimationFrame(tick)
                        }
                    }

                    requestAnimationFrame(tick)
                    observer.unobserve(el)
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [target, duration])

    return { ref, value }
}
