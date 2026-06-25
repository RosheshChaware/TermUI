import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      className={`nav-theme-btn ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      type="button"
    >
      <div className="nav-theme-icon-wrap">
        <span className="nav-theme-sun"><Sun size={16} /></span>
        <span className="nav-theme-moon"><Moon size={16} /></span>
      </div>
    </button>
  )
}
