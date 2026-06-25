'use client'

import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF>_{}[]|/\\=+*~'
const FONT_SIZE = 14
const COLUMN_GAP = 20
const FADE_ALPHA = 0.04

export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        let columns: number[] = []
        let speeds: number[] = []

        function resize() {
            if (!canvas) return
            const rect = canvas.parentElement?.getBoundingClientRect()
            if (!rect) return
            canvas.width = rect.width
            canvas.height = rect.height
            const colCount = Math.floor(canvas.width / COLUMN_GAP)
            columns = Array.from({ length: colCount }, () => Math.random() * canvas.height / FONT_SIZE)
            speeds = Array.from({ length: colCount }, () => 0.3 + Math.random() * 0.7)
        }

        resize()
        window.addEventListener('resize', resize)

        // Set font once — avoid re-parsing every frame
        ctx.font = `${FONT_SIZE}px 'Fira Code', monospace`

        function draw() {
            if (!ctx || !canvas) return

            ctx.fillStyle = 'rgba(10, 10, 15, 0.12)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < columns.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)]
                const x = i * COLUMN_GAP
                const y = columns[i] * FONT_SIZE

                const brightness = FADE_ALPHA + Math.random() * 0.04
                ctx.fillStyle = `rgba(0, 255, 136, ${brightness})`
                ctx.fillText(char, x, y)

                if (y > canvas.height && Math.random() > 0.975) {
                    columns[i] = 0
                } else {
                    columns[i] += speeds[i]
                }
            }

            animId = requestAnimationFrame(draw)
        }

        animId = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="matrix-rain"
            aria-hidden="true"
        />
    )
}
