import { CircleAlert } from 'lucide-react'
import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { investigationStatus } from '@/lib/status'
import type { Investigation } from '@/types/investigation'
import type { AgentLevel } from '@/types/organization'

type Props = {
  investigation: Investigation
  effort?: AgentLevel
}

export function InvestigationSummary({ investigation, effort }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <StatusBadge status={investigationStatus[investigation.status]} />
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Started</dt>
          <dd>
            <RelativeTime iso={investigation.startedAt} />
          </dd>
        </div>
        {investigation.finishedAt && (
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Finished</dt>
            <dd>
              <RelativeTime iso={investigation.finishedAt} />
            </dd>
          </div>
        )}
        {effort && (
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Effort</dt>
            <dd className="capitalize">{effort}</dd>
          </div>
        )}
      </dl>
      {investigation.status === 'running' && (
        <p className="text-sm text-muted-foreground">
          The agent is looking into the cluster. This page checks for the result every 15 seconds.
        </p>
      )}
      {investigation.status === 'failed' && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>The investigation failed</AlertTitle>
          <AlertDescription>{investigation.error ?? 'No reason was recorded.'}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
