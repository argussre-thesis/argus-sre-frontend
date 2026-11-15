import { FlowDetails } from '@/features/landing/components/FlowDetails'
import { links, nodes, scenes, type FlowNode } from '@/features/landing/flowData'
import { cn } from '@/lib/utils'

type Props = {
  scene: number
}

const nodeFill: Record<FlowNode['kind'], string> = {
  zone: 'fill-none',
  box: 'fill-card',
  chip: 'fill-background',
}

const drawDelay = ['delay-0', 'delay-500', 'delay-1000']

export function FlowDiagram({ scene }: Props) {
  const { focus, links: activeLinks } = scenes[scene]

  return (
    <svg
      viewBox="0 0 760 540"
      role="img"
      aria-label="Diagram of how an alert travels from your cluster through Argus to a root cause report. The steps next to it describe it."
      className="w-full text-xs"
    >
      <defs>
        <pattern id="flow-dots" width={20} height={20} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={1} className="fill-border" />
        </pattern>
      </defs>
      <rect width={760} height={540} fill="url(#flow-dots)" />

      {links.map((link) => {
        const order = activeLinks.indexOf(link.id)
        const active = order !== -1
        return (
          <g key={link.id} className="fill-none">
            <path d={link.d} className="stroke-border stroke-1" />
            {/* With pathLength 1, a dash offset of 1 hides the line and 0 shows it, so the transition draws it. */}
            <path
              d={link.d}
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: active ? 0 : 1 }}
              className={cn(
                'stroke-2 transition-all duration-1000 ease-out motion-reduce:transition-none',
                link.tone === 'alert' ? 'stroke-destructive' : 'stroke-primary',
                active && drawDelay[order],
              )}
            />
          </g>
        )
      })}

      {nodes.map((node) => {
        const Icon = node.icon
        const focused = focus.includes(node.id)
        return (
          <g key={node.id} className={cn('transition-opacity duration-700', scene < node.from && 'opacity-40')}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx={6}
              strokeDasharray={node.kind === 'zone' ? '6 6' : undefined}
              className={cn(
                'transition-colors duration-500',
                nodeFill[node.kind],
                focused ? 'stroke-primary stroke-2' : 'stroke-border stroke-1',
              )}
            />
            {Icon && (
              <Icon
                x={node.x + 12}
                y={node.y + 10}
                size={14}
                aria-hidden
                className={cn('transition-colors duration-500', focused ? 'text-primary' : 'text-muted-foreground')}
              />
            )}
            <text x={node.x + (Icon ? 32 : 12)} y={node.y + 21} className="fill-foreground font-medium">
              {node.label}
            </text>
            {node.sub && (
              <text x={node.x + 12} y={node.y + 37} className="fill-muted-foreground">
                {node.sub}
              </text>
            )}
          </g>
        )
      })}

      <FlowDetails scene={scene} />
    </svg>
  )
}
