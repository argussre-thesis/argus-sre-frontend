import { useEffect, useState } from 'react'

// The active id is the last element whose top has scrolled past `line` (px from the top of the
// viewport, or its middle), or the last one once the page is at the bottom. Worked out from
// positions on every scroll, so a big jump (End key, dragging the scrollbar) can't skip one.
// `ids` must be a stable array (a module constant), or the listener is added on every render.
export function useScrollSpy(ids: string[], line: number | 'middle') {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    function update() {
      const page = document.documentElement
      const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= page.scrollHeight - 2
      if (atBottom) {
        setActive(ids[ids.length - 1])
        return
      }
      const y = line === 'middle' ? window.innerHeight / 2 : line
      let current = ids[0]
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= y) current = id
      }
      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids, line])

  return active
}
