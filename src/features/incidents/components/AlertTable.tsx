import { TableCard } from '@/components/common/TableCard'
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
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            {/* w-0 shrinks the icon columns to their button, so the spare width goes to the text. */}
            <TableHead className="w-0">
              <span className="sr-only">Details</span>
            </TableHead>
            <TableHead>Alert</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Started</TableHead>
            <TableHead className="hidden md:table-cell">Last received</TableHead>
            <TableHead className="w-0">
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
    </TableCard>
  )
}
