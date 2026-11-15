import { cn } from '@/lib/utils'

type Props = {
  scene: number
}

const ALERTS_FIRE = 1
const INVESTIGATING = 2
const REPORTED = 4

const podColumns = [34, 86, 138]
const clusterRows = [
  { y: 68, failing: 2 },
  { y: 212, failing: 0 },
]
const alertRows = ['HighErrorRate', 'PodCrashLooping', 'DeploymentReplicasMismatch']
const keptFields = ['status: CrashLoopBackOff', 'restarts: 14', 'lastState: OOMKilled']
const droppedFields = ['metadata.managedFields', 'spec.tolerations']

const appear = 'animate-in fade-in duration-700 motion-reduce:animate-none'

// The small things inside the boxes: pods, firing alerts, what the backend keeps, and what a tool
// call and its reply look like.
export function FlowDetails({ scene }: Props) {
  return (
    <>
      {clusterRows.map((row) =>
        podColumns.map((x, index) => {
          const failing = scene >= ALERTS_FIRE && index < row.failing
          return (
            <g key={`${row.y}-${x}`}>
              <rect
                x={x}
                y={row.y}
                width={44}
                height={30}
                rx={4}
                className={cn('transition-colors duration-700', failing ? 'fill-destructive' : 'fill-muted')}
              />
              <text
                x={x + 22}
                y={row.y + 19}
                textAnchor="middle"
                className={failing ? 'fill-background' : 'fill-muted-foreground'}
              >
                pod
              </text>
            </g>
          )
        }),
      )}

      {scene >= ALERTS_FIRE &&
        alertRows.map((alert, index) => (
          <g key={alert} className={appear}>
            <circle cx={40} cy={394 + index * 24} r={4} className="fill-destructive" />
            <text x={52} y={398 + index * 24} className="fill-foreground font-mono">
              {alert}
            </text>
          </g>
        ))}

      {scene >= ALERTS_FIRE && (
        <text x={318} y={464} className={cn('fill-foreground', appear)}>
          3 alerts, 1 incident
        </text>
      )}
      {scene >= INVESTIGATING && (
        <text className={cn('fill-muted-foreground', appear)}>
          <tspan x={318} y={484}>
            Kept: status, times, labels,
          </tspan>
          <tspan x={318} y={499}>
            annotations
          </tspan>
        </text>
      )}

      {scene === INVESTIGATING && (
        <g className={appear}>
          <rect x={306} y={200} width={200} height={180} rx={6} className="fill-background stroke-border stroke-1" />
          <text x={318} y={221} className="fill-foreground font-medium">
            Tool call
          </text>
          <text x={318} y={241} className="fill-primary font-mono">
            list_problem_pods
          </text>
          <text x={318} y={256} className="fill-muted-foreground font-mono">
            {'{"namespace":"payments"}'}
          </text>
          {/* The reply waits for the lines to reach the runner. */}
          <g className={cn(appear, 'delay-1500 fill-mode-both')}>
            <text x={318} y={284} className="fill-foreground font-medium">
              Runner reply
            </text>
            {keptFields.map((field, index) => (
              <text key={field} x={318} y={302 + index * 14} className="fill-foreground font-mono">
                {field}
              </text>
            ))}
            {droppedFields.map((field, index) => (
              <text
                key={field}
                x={318}
                y={346 + index * 14}
                className="animate-out fill-muted-foreground font-mono line-through delay-2500 duration-1000 fill-mode-forwards fade-out-20 motion-reduce:animate-none"
              >
                {field}
              </text>
            ))}
          </g>
        </g>
      )}

      {scene >= REPORTED && (
        <text x={568} y={464} className={cn('fill-foreground', appear)}>
          Cause: 128Mi memory limit
        </text>
      )}
    </>
  )
}
