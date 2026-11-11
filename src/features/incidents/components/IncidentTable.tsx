import { Link } from 'react-router'
import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableCard } from '@/components/common/TableCard'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { incidentDurationMs, repeatCounter } from '@/features/incidents/incidentFilters'
import { incidentStatus, testIncident, unknownCluster } from '@/lib/status'
import { formatDuration } from '@/lib/utils'
import type { IncidentListItem } from '@/types/incident'

type Props = {
  incidents: IncidentListItem[]
}

export function IncidentTable({ incidents }: Props) {
  const repeats = repeatCounter(incidents)

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Firing alerts</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id} className="relative">
              <TableCell className="font-medium whitespace-normal">
                <div className="flex items-center gap-2">
                  {/* The stretched ::after makes the whole row clickable and it stays a real link. */}
                  <Link to={`/app/incidents/${incident.id}`} className="after:absolute after:inset-0">
                    {incident.title}
                  </Link>
                  {repeats(incident) > 1 && (
                    <Badge
                      variant="secondary"
                      title={`${repeats(incident)} incidents in this list share this title and cluster`}
                    >
                      {repeats(incident)}×
                    </Badge>
                  )}
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
                {/* Positioned so it sits above the row's link and its tooltip can open. */}
                <span className="relative">
                  <RelativeTime iso={incident.createdAt} />
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {formatDuration(incidentDurationMs(incident))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  )
}
