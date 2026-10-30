import { apiRequest, apiUrl } from '@/lib/api-client'
import type {
  AlertSource,
  CreateAlertSourceInput,
  CreatedAlertSource,
} from '@/types/alert-source'

// Where senders post alerts: outside /api/v1 and authorized by the webhook token, not Clerk.
export const webhookUrl = `${apiUrl}/webhooks/v1/alerts`

// The backend's default cluster label.
export const defaultClusterLabel = 'cluster'

function alertSourcesPath(orgId: string) {
  return `/organizations/${encodeURIComponent(orgId)}/alert-sources`
}

export function listAlertSources(orgId: string) {
  return apiRequest<AlertSource[]>(alertSourcesPath(orgId))
}

export function createAlertSource(orgId: string, input: CreateAlertSourceInput) {
  return apiRequest<CreatedAlertSource>(alertSourcesPath(orgId), { method: 'POST', body: input })
}

export function updateAlertSource(
  orgId: string,
  alertSourceId: string,
  input: CreateAlertSourceInput,
) {
  return apiRequest<AlertSource>(
    `${alertSourcesPath(orgId)}/${encodeURIComponent(alertSourceId)}`,
    { method: 'PATCH', body: input },
  )
}

export function rotateAlertSourceToken(orgId: string, alertSourceId: string) {
  return apiRequest<{ token: string }>(
    `${alertSourcesPath(orgId)}/${encodeURIComponent(alertSourceId)}/token`,
    { method: 'POST' },
  )
}

export function deleteAlertSource(orgId: string, alertSourceId: string) {
  return apiRequest<null>(`${alertSourcesPath(orgId)}/${encodeURIComponent(alertSourceId)}`, {
    method: 'DELETE',
  })
}
