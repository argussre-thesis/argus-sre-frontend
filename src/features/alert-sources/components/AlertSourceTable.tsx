import { CopyButton } from '@/components/common/CopyButton'
import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableCard } from '@/components/common/TableCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { webhookUrl } from '@/features/alert-sources/api'
import { AlertSourceActions } from '@/features/alert-sources/components/AlertSourceActions'
import { alertSourceNeverReceived, alertSourceNoClusters } from '@/lib/status'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSources: AlertSource[]
}

export function AlertSourceTable({ alertSources }: Props) {
  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert source</TableHead>
            <TableHead>Clusters</TableHead>
            <TableHead>Last alert</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alertSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {/* Deleting a cluster removes it from its sources, so a source can end up with none. */}
                {source.clusters.length > 0 ? (
                  source.clusters.map((cluster) => cluster.name).join(', ')
                ) : (
                  <StatusBadge status={alertSourceNoClusters} />
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {source.lastReceivedAt ? (
                  <RelativeTime iso={source.lastReceivedAt} />
                ) : (
                  <StatusBadge status={alertSourceNeverReceived} />
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <RelativeTime iso={source.createdAt} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <CopyButton label="webhook URL" value={webhookUrl} variant="ghost" size="icon-sm" />
                  <AlertSourceActions alertSource={source} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  )
}
