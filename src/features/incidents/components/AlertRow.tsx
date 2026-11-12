import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { AlertDetails } from '@/features/incidents/components/AlertDetails'
import { alertStatus } from '@/lib/status'
import { webUrl } from '@/lib/utils'
import type { IncidentAlert } from '@/types/incident'

type Props = {
  alert: IncidentAlert
}

export function AlertRow({ alert }: Props) {
  const [open, setOpen] = useState(false)
  const href = webUrl(alert.generatorUrl)

  return (
    <>
      <TableRow className={open ? 'border-b-0' : undefined}>
        <TableCell>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Alert details"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </TableCell>
        <TableCell className="whitespace-normal">
          <div className="font-medium">{alert.labels.alertname ?? 'Unnamed alert'}</div>
          {alert.annotations.summary && (
            <div className="text-muted-foreground">{alert.annotations.summary}</div>
          )}
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {alert.alertSource?.name ?? 'Deleted source'}
        </TableCell>
        <TableCell>
          <StatusBadge status={alertStatus[alert.status]} />
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          <RelativeTime iso={alert.startsAt} />
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          <RelativeTime iso={alert.lastReceivedAt} />
        </TableCell>
        <TableCell className="text-right">
          {href && (
            <Button variant="ghost" size="icon-sm" asChild>
              <a href={href} target="_blank" rel="noreferrer" aria-label="Open in alert source">
                <ExternalLink />
              </a>
            </Button>
          )}
        </TableCell>
      </TableRow>
      {open && (
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell />
          <TableCell colSpan={6}>
            <AlertDetails alert={alert} />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
