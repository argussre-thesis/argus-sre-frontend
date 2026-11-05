import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClusterActions } from '@/features/clusters/components/ClusterActions'
import { runnerNeverConnected } from '@/lib/status'
import type { Cluster } from '@/types/cluster'

type Props = {
  clusters: Cluster[]
}

export function ClusterTable({ clusters }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cluster</TableHead>
            <TableHead>Runner last connected</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => (
            <TableRow key={cluster.id}>
              <TableCell className="font-medium">{cluster.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {cluster.lastConnectedAt ? (
                  <RelativeTime iso={cluster.lastConnectedAt} />
                ) : (
                  <StatusBadge status={runnerNeverConnected} />
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <RelativeTime iso={cluster.createdAt} />
              </TableCell>
              <TableCell className="text-right">
                <ClusterActions cluster={cluster} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
