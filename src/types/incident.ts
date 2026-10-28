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

export type IncidentPage = {
  incidents: IncidentListItem[]
  nextCursor: string | null
}

export type IncidentFilters = {
  status?: IncidentStatus
  // A cluster id, or "unknown" for unknown-cluster incidents.
  clusterId?: string
}
