import { ExternalLink } from 'lucide-react'
import { RelativeTime } from '@/components/common/RelativeTime'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { alertStatus } from '@/lib/status'
import type { IncidentAlert } from '@/types/incident'

type Props = {
  alerts: IncidentAlert[]
}

// generatorUrl comes from the alert sender, so only link to web pages.
function webUrl(url: string | null): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null
}

export function AlertTable({ alerts }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {alerts.map((alert) => {
            const href = webUrl(alert.generatorUrl)
            return (
              <TableRow key={alert.id}>
                <TableCell className="whitespace-normal">
                  <div className="font-medium">{alert.labels.alertname ?? 'Unnamed alert'}</div>
                  {alert.annotations.summary && (
                    <div className="text-muted-foreground">{alert.annotations.summary}</div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {alert.alertSource?.name ?? 'Deleted source'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={alertStatus[alert.status]} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <RelativeTime iso={alert.startsAt} />
                </TableCell>
                <TableCell className="text-muted-foreground">
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
