import { useCallback, useEffect, useRef, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'termui-theme'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const html = document.documentElement
  html.classList.remove('theme-light', 'theme-dark')
  html.classList.add(`theme-${resolved}`)
  html.setAttribute('data-theme', resolved)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const mediaRef = useRef<MediaQueryList | null>(null)

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
    applyTheme(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next)
      return next
    })
  }, [])

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    applyTheme(theme)

    mediaRef.current = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') applyTheme('system')
    }
    mediaRef.current.addEventListener('change', handler)
    return () => mediaRef.current?.removeEventListener('change', handler)
  }, [theme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
