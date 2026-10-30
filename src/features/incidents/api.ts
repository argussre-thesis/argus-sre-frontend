import { apiRequest } from '@/lib/api-client'
import type { IncidentDetail, IncidentFilters, IncidentPage } from '@/types/incident'
import type { Investigation } from '@/types/investigation'

export function listIncidents(orgId: string, filters: IncidentFilters, cursor?: string) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.clusterId) params.set('clusterId', filters.clusterId)
  if (cursor) params.set('cursor', cursor)
  const query = params.toString()

  return apiRequest<IncidentPage>(
    `/organizations/${encodeURIComponent(orgId)}/incidents${query ? `?${query}` : ''}`,
  )
}

export function getIncident(orgId: string, incidentId: string) {
  return apiRequest<IncidentDetail>(
    `/organizations/${encodeURIComponent(orgId)}/incidents/${encodeURIComponent(incidentId)}`,
  )
}

export function resolveIncident(orgId: string, incidentId: string) {
  return apiRequest<IncidentDetail>(
    `/organizations/${encodeURIComponent(orgId)}/incidents/${encodeURIComponent(incidentId)}/resolve`,
    { method: 'POST' },
  )
}

export function investigateIncident(orgId: string, incidentId: string) {
  return apiRequest<{ id: string }>(
    `/organizations/${encodeURIComponent(orgId)}/incidents/${encodeURIComponent(incidentId)}/investigate`,
    { method: 'POST' },
  )
}

// Newest first.
export async function listInvestigations(orgId: string, incidentId: string) {
  const { investigations } = await apiRequest<{ investigations: Investigation[] }>(
    `/organizations/${encodeURIComponent(orgId)}/incidents/${encodeURIComponent(incidentId)}/investigations`,
  )
  return investigations
}
