import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertRow } from '@/features/incidents/components/AlertRow'
import type { IncidentAlert } from '@/types/incident'

type Props = {
  alerts: IncidentAlert[]
}

export function AlertTable({ alerts }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="sr-only">Details</span>
            </TableHead>
            <TableHead>Alert</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Last received</TableHead>
            <TableHead>
              <span className="sr-only">Link</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
