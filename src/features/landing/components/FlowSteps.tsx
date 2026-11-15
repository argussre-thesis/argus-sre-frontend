import { scenes, stepIds } from '@/features/landing/flowData'
import { cn } from '@/lib/utils'

type Props = {
  scene: number
}

export function FlowSteps({ scene }: Props) {
  return (
    <ol className="flex flex-col">
      {scenes.map((step, index) => {
        const active = index === scene
        return (
          <li
            key={step.title}
            id={stepIds[index]}
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
