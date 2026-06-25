'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

const FULL_TEXT = '>_TermUI'
const GLITCH_CHARS = '!@#$%^&*<>/\\|{}[]~`'

interface NavLogoProps {
  scrolled?: boolean
}

export function NavLogo({ scrolled }: NavLogoProps) {
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'idle' | 'glitch'>('typing' as const)
  const glitchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hasTyped = useRef(false)

  useEffect(() => {
    if (hasTyped.current) return
    hasTyped.current = true
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayText(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) {
        clearInterval(interval)
        setPhase('idle')
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const triggerGlitch = useCallback(() => {
    if (phase === 'typing') return
    setPhase('glitch')
    let iterations = 0
    const interval = setInterval(() => {
      iterations++
      setDisplayText(
        FULL_TEXT.split('').map((_, idx) => {
          if (idx < iterations) return FULL_TEXT[idx]
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }).join('')
      )
      if (iterations >= 6 + FULL_TEXT.length) {
        clearInterval(interval)
        setDisplayText(FULL_TEXT)
        setPhase('idle')
      }
    }, 35)
    glitchTimeout.current = interval
  }, [phase])

  const stopGlitch = useCallback(() => {
    if (glitchTimeout.current) clearInterval(glitchTimeout.current)
    setDisplayText(FULL_TEXT)
    setPhase('idle')
  }, [])

  const gtPart = displayText.slice(0, 2)
  const namePart = displayText.slice(2)

  return (
    <Link
      href="/"
      className={`nav-logo${scrolled ? ' nav-logo--scrolled' : ''}`}
      onMouseEnter={triggerGlitch}
      onMouseLeave={stopGlitch}
      aria-label="TermUI Home"
    >
      <span className="logo-prompt" aria-hidden="true">{gtPart}</span>
      <span className="logo-name">{namePart}</span>
      <span className={`logo-cursor${phase === 'idle' ? ' blink' : ''}`} aria-hidden="true" />
      {phase === 'idle' && (
        <span className="logo-status-dot" title="Online" aria-hidden="true" />
      )}
    </Link>
  )
}
