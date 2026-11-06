import { apiRequest } from '@/lib/api-client'
import type { Organization, OrganizationSettings } from '@/types/organization'
import type { SlackStatus } from '@/types/slack'

export function getOrganization(orgId: string) {
  return apiRequest<Organization>(`/organizations/${encodeURIComponent(orgId)}`)
}

export function updateOrganizationSettings(orgId: string, settings: OrganizationSettings) {
  return apiRequest<OrganizationSettings>(
    `/organizations/${encodeURIComponent(orgId)}/settings`,
    { method: 'PATCH', body: settings },
  )
}

function slackPath(orgId: string) {
  return `/organizations/${encodeURIComponent(orgId)}/slack`
}

export function getSlackStatus(orgId: string) {
  return apiRequest<SlackStatus>(slackPath(orgId))
}

export function createSlackInstallUrl(orgId: string) {
  return apiRequest<{ url: string }>(`${slackPath(orgId)}/install`, { method: 'POST' })
}

export function disconnectSlack(orgId: string) {
  return apiRequest<{ connected: false }>(slackPath(orgId), { method: 'DELETE' })
}
