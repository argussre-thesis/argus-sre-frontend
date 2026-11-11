import type { AlertStatus, IncidentStatus } from '@/types/incident'
import type { InvestigationStatus } from '@/types/investigation'

type StatusVariant = 'destructive' | 'warning' | 'info' | 'success' | 'secondary'

export type StatusInfo = {
  label: string
  variant: StatusVariant
}

export const statusDot: Record<StatusVariant, string> = {
  destructive: 'bg-destructive',
  warning: 'bg-warning',
  info: 'bg-info',
  success: 'bg-success',
  secondary: 'bg-muted-foreground',
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

export const investigationStatus: Record<InvestigationStatus, StatusInfo> = {
  running: { label: 'Running', variant: 'info' },
  done: { label: 'Done', variant: 'success' },
  failed: { label: 'Failed', variant: 'destructive' },
}

export const unknownCluster: StatusInfo = { label: 'Unknown cluster', variant: 'secondary' }

export const testIncident: StatusInfo = { label: 'Test', variant: 'secondary' }

export const runnerNeverConnected: StatusInfo = { label: 'Never connected', variant: 'warning' }

export const alertSourceNeverReceived: StatusInfo = { label: 'Never received', variant: 'warning' }

export const alertSourceNoClusters: StatusInfo = { label: 'No clusters', variant: 'warning' }

export const setupStepDone: StatusInfo = { label: 'Done', variant: 'success' }
