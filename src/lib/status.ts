import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'
import type { AlertStatus, IncidentStatus } from '@/types/incident'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

export type StatusInfo = {
  label: string
  variant: BadgeVariant
}

// "Traffic light": red needs attention, green is fixed, amber is a setup problem, grey is noise.
export const incidentStatus: Record<IncidentStatus, StatusInfo> = {
  OPEN: { label: 'Open', variant: 'destructive' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
}

export const alertStatus: Record<AlertStatus, StatusInfo> = {
  FIRING: { label: 'Firing', variant: 'destructive' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
}

export const unknownCluster: StatusInfo = { label: 'Unknown cluster', variant: 'warning' }

export const testIncident: StatusInfo = { label: 'Test', variant: 'secondary' }

export const runnerNeverConnected: StatusInfo = { label: 'Never connected', variant: 'warning' }
