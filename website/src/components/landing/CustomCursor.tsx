'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const mousePos = useRef({ x: 0, y: 0 })
    const cursorPos = useRef({ x: 0, y: 0 })
    const hoveringRef = useRef(false)

    useEffect(() => {
        // Only show custom cursor on desktop with fine pointer
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (!hasFinePointer || prefersReducedMotion) return

        setIsVisible(true)
        document.documentElement.classList.add('has-custom-cursor')

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
        }

        document.addEventListener('mousemove', handleMouseMove)

        // Event delegation — one listener on document.body, direct classList toggle (no React re-render)
        const interactiveSelector = 'a, button, [role="button"], input, select, textarea'
        const handleOver = (e: MouseEvent) => {
            if ((e.target as Element).closest(interactiveSelector)) {
                if (!hoveringRef.current) {
                    hoveringRef.current = true
                    cursorRef.current?.classList.add('cursor-hover')
                }
            }
        }
        const handleOut = (e: MouseEvent) => {
            if ((e.target as Element).closest(interactiveSelector)) {
                if (hoveringRef.current) {
                    hoveringRef.current = false
                    cursorRef.current?.classList.remove('cursor-hover')
                }
            }
        }
        document.body.addEventListener('mouseover', handleOver)
        document.body.addEventListener('mouseout', handleOut)

        // Lerp animation loop
        let animId: number
        function animate() {
            const lerp = 0.12
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerp
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerp

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
            }

            animId = requestAnimationFrame(animate)
        }
        animId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animId)
            document.removeEventListener('mousemove', handleMouseMove)
            document.body.removeEventListener('mouseover', handleOver)
            document.body.removeEventListener('mouseout', handleOut)
            document.documentElement.classList.remove('has-custom-cursor')
        }
    }, [])

    if (!isVisible) return null

    return (
        <div
            ref={cursorRef}
            className="custom-cursor"
            aria-hidden="true"
        >
            <span className="custom-cursor-text">&gt;_</span>
        </div>
    )
}
