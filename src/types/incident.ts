export type IncidentStatus = 'OPEN' | 'RESOLVED'

export type Incident = {
  id: string
  title: string
  status: IncidentStatus
  isTest: boolean
  createdAt: string
  resolvedAt: string | null
  // null = unknown cluster: no alert label matched a registered cluster, or the cluster was deleted.
  cluster: { id: string; name: string } | null
}

export type IncidentListItem = Incident & { firingAlertCount: number }

export type AlertStatus = 'FIRING' | 'RESOLVED'

export type IncidentAlert = {
  id: string
  status: AlertStatus
  fingerprint: string
  startsAt: string
  endsAt: string | null
  // When the sender last repeated the alert.
  lastReceivedAt: string
  // Whatever the sender put on the alert, so any key can be missing.
  labels: Record<string, string | undefined>
  annotations: Record<string, string | undefined>
  generatorUrl: string | null
  // null = the alert source was deleted.
  alertSource: { id: string; name: string } | null
}

export type IncidentDetail = Incident & { alerts: IncidentAlert[] }

export type IncidentPage = {
  incidents: IncidentListItem[]
  nextCursor: string | null
}

export type IncidentFilters = {
  status?: IncidentStatus
  // A cluster id, or "unknown" for unknown-cluster incidents.
  clusterId?: string
}
