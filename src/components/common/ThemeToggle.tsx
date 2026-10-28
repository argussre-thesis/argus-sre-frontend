import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Also read by the inline script in index.html.
const STORAGE_KEY = 'argus-theme'

// shortcut: the theme lives on <html> and in localStorage only, so other components can't react
// to a change; move it into a provider once one needs to (e.g. a toast library's theme prop).
export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}
