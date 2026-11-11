import { StatusBadge } from '@/components/common/StatusBadge'
import { alertStatus, incidentStatus, investigationStatus } from '@/lib/status'

const alerts = ['HighErrorRate', 'PodCrashLooping', 'DeploymentReplicasMismatch']

const evidence = [
  {
    call: 'list_problem_pods {"namespace":"payments"}',
    found: '3 of 3 checkout pods in CrashLoopBackOff, last state OOMKilled.',
  },
  {
    call: 'list_replicasets {"namespace":"payments"}',
    found: 'A new ReplicaSet was created at 14:02, four minutes before the first alert.',
  },
  {
    call: 'list_events {"namespace":"payments"}',
    found: 'Containers killed for exceeding the 128Mi memory limit.',
  },
]

export function IncidentPreview() {
  return (
    <figure className="flex flex-col gap-2">
      <div className="flex flex-col rounded-lg border bg-card text-sm">
        <div className="flex flex-col gap-3 border-b p-4">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium">HighErrorRate on checkout</p>
            <StatusBadge status={incidentStatus.OPEN} />
          </div>
          <p className="text-muted-foreground">prod-eu-1, payments namespace, 3 alerts</p>
          <ul className="flex flex-col gap-1">
            {alerts.map((alert) => (
              <li key={alert} className="flex items-center justify-between gap-4">
                <code className="font-mono text-xs">{alert}</code>
                <StatusBadge status={alertStatus.FIRING} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 p-4 leading-relaxed">
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium">Investigation</p>
            <StatusBadge status={investigationStatus.done} />
          </div>
          <p className="font-semibold">Root cause</p>
          <p>
            The 14:02 rollout of <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">checkout</code>{' '}
            lowered its memory limit to 128Mi. Every new pod is killed on startup, so the service has no ready
            replicas.
          </p>
          <p className="font-semibold">Evidence</p>
          <ul className="flex flex-col gap-2">
            {evidence.map((item) => (
              <li key={item.call} className="flex flex-col gap-1">
                <code className="overflow-x-auto rounded-sm bg-muted px-2 py-1 font-mono text-xs whitespace-nowrap">
                  {item.call}
                </code>
                <span className="text-muted-foreground">{item.found}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="text-xs text-muted-foreground">
        An example incident and report. Each finding names the check it came from.
      </figcaption>
    </figure>
  )
}
