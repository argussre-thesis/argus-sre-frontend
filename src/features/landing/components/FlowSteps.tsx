import { useEffect, useRef } from 'react'
import { scenes } from '@/features/landing/flowData'
import { cn } from '@/lib/utils'

type Props = {
  scene: number
  onSceneChange: (scene: number) => void
}

export function FlowSteps({ scene, onSceneChange }: Props) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    // The margins shrink the viewport to its middle line, so the step crossing it is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onSceneChange(Number((entry.target as HTMLElement).dataset.scene))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const item of list.children) observer.observe(item)
    return () => observer.disconnect()
  }, [onSceneChange])

  return (
    <ol ref={listRef} className="flex flex-col">
      {scenes.map((step, index) => {
        const active = index === scene
        return (
          <li
            key={step.title}
            data-scene={index}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'border-l-2 py-6 pl-6 transition-colors duration-500 lg:min-h-120',
              active ? 'lg:border-primary' : 'border-border',
            )}
          >
            <div className={cn('flex flex-col gap-2 transition-opacity duration-500', !active && 'lg:opacity-60')}>
              <span className="font-mono text-sm text-muted-foreground">0{index + 1}</span>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
