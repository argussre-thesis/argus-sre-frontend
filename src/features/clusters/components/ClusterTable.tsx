import { Link } from 'react-router'
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
import { ClusterActions } from '@/features/clusters/components/ClusterActions'
import { runnerNeverConnected } from '@/lib/status'
import type { Cluster } from '@/types/cluster'
import type { IncidentListItem } from '@/types/incident'

type Props = {
  clusters: Cluster[]
  // Undefined while loading or after a failed load: the column then shows a dash, not a wrong 0.
  openIncidents?: IncidentListItem[]
}

export function ClusterTable({ clusters, openIncidents }: Props) {
  function openCount(cluster: Cluster) {
    if (!openIncidents) return '–'
    const count = openIncidents.filter((incident) => incident.cluster?.id === cluster.id).length
    if (count === 0) return '0'
    return (
      <Link to={`/app/incidents?status=OPEN&range=all&cluster=${cluster.id}`} className="underline">
        {count}
      </Link>
    )
  }

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cluster</TableHead>
            <TableHead className="text-right">Open incidents</TableHead>
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
              <TableCell className="text-right tabular-nums">{openCount(cluster)}</TableCell>
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
    </TableCard>
  )
}
