import { Link, useLocation } from 'react-router'
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
  const { search } = useLocation()

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident</TableHead>
            <TableHead className="hidden md:table-cell">Cluster</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden pr-8 text-right md:table-cell">Firing alerts</TableHead>
            <TableHead className="hidden md:table-cell">Started</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id} className="relative">
              <TableCell className="font-medium whitespace-normal">
                <div className="flex items-center gap-2">
                  {/* The stretched ::after makes the whole row clickable and it stays a real link. */}
                  <Link
                    to={`/app/incidents/${incident.id}`}
                    state={{ listSearch: search }}
                    className="after:absolute after:inset-0"
                  >
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
                {/* On a phone the cluster moves under the title, so Status still fits on screen. */}
                <div className="font-normal text-muted-foreground md:hidden">
                  {incident.cluster ? incident.cluster.name : <StatusBadge status={unknownCluster} />}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {incident.cluster ? incident.cluster.name : <StatusBadge status={unknownCluster} />}
              </TableCell>
              <TableCell>
                <StatusBadge status={incidentStatus[incident.status]} />
              </TableCell>
              <TableCell className="hidden pr-8 text-right tabular-nums md:table-cell">
                {incident.firingAlertCount}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {/* Positioned so it sits above the row's link and its tooltip can open. */}
                <span className="relative">
                  <RelativeTime iso={incident.createdAt} />
                </span>
              </TableCell>
              <TableCell className="hidden text-muted-foreground tabular-nums md:table-cell">
                {formatDuration(incidentDurationMs(incident))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  )
}
