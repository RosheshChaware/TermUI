'use client'
import { useEffect, useRef, useState } from 'react'

interface ScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: ScrollRevealOptions = {}
) {
    const { threshold = 0.1, rootMargin = '0px 0px -60px 0px', once = true } = options
    const ref = useRef<T>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsRevealed(true)
            el.setAttribute('data-revealed', 'true')
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true)
                    el.setAttribute('data-revealed', 'true')
                    if (once) observer.unobserve(el)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold, rootMargin, once])

    return { ref, isRevealed }
}
