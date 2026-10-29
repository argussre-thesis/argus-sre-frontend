import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { incidentStatus, testIncident, unknownCluster } from '@/lib/status'
import type { Incident } from '@/types/incident'

type Props = {
  incident: Incident
}

export function IncidentSummary({ incident }: Props) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Status</dt>
        <dd className="flex items-center gap-2">
          <StatusBadge status={incidentStatus[incident.status]} />
          {incident.isTest && <StatusBadge status={testIncident} />}
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Cluster</dt>
        <dd>{incident.cluster ? incident.cluster.name : <StatusBadge status={unknownCluster} />}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Opened</dt>
        <dd>
          <RelativeTime iso={incident.createdAt} />
        </dd>
      </div>
      {incident.resolvedAt && (
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Resolved</dt>
          <dd>
            <RelativeTime iso={incident.resolvedAt} />
          </dd>
        </div>
      )}
    </dl>
  )
}
