import { StatusBadge } from '@/components/common/StatusBadge'
import { RcaReport } from '@/features/incidents/components/RcaReport'
import { alertStatus, incidentStatus, investigationStatus } from '@/lib/status'

const alerts = ['HighErrorRate', 'PodCrashLooping', 'DeploymentReplicasMismatch']

const report = `## Root cause

The 14:02 rollout of \`checkout\` lowered its memory limit to 128Mi. Every new pod is killed on startup, so the service has no ready replicas.

## Evidence

- \`list_problem_pods {"namespace":"payments"}\`: 3 of 3 checkout pods in CrashLoopBackOff, last state OOMKilled.
- \`list_replicasets {"namespace":"payments"}\`: a new ReplicaSet was created at 14:02, four minutes before the first alert.
- \`list_events {"namespace":"payments"}\`: containers killed for exceeding the 128Mi memory limit.`

export function IncidentPreview() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Alerts go in, a root cause comes out</h2>
        <p className="max-w-prose text-muted-foreground">
          An example incident and the report Argus wrote for it. Each finding names the check it came from.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <h3 className="font-medium">1. Your alerts fire</h3>
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm">
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
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium">2. Argus investigates and writes the report</h3>
            <StatusBadge status={investigationStatus.done} />
          </div>
          <RcaReport report={report} />
        </div>
      </div>
    </section>
  )
}
