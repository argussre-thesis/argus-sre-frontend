import { Link } from 'react-router'
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
import { incidentStatus, testIncident, unknownCluster } from '@/lib/status'
import type { IncidentListItem } from '@/types/incident'

type Props = {
  incidents: IncidentListItem[]
}

export function IncidentTable({ incidents }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Firing alerts</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell className="font-medium whitespace-normal">
                <div className="flex items-center gap-2">
                  <Link to={`/incidents/${incident.id}`} className="hover:underline">
                    {incident.title}
                  </Link>
                  {incident.isTest && <StatusBadge status={testIncident} />}
                </div>
              </TableCell>
              <TableCell>
                {incident.cluster ? incident.cluster.name : <StatusBadge status={unknownCluster} />}
              </TableCell>
              <TableCell>
                <StatusBadge status={incidentStatus[incident.status]} />
              </TableCell>
              <TableCell className="text-right tabular-nums">{incident.firingAlertCount}</TableCell>
              <TableCell className="text-muted-foreground">
                <RelativeTime iso={incident.createdAt} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
