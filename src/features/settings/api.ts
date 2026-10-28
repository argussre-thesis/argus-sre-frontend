import { apiRequest } from '@/lib/api-client'
import type { Organization } from '@/types/organization'

export function getOrganization(orgId: string) {
  return apiRequest<Organization>(`/organizations/${encodeURIComponent(orgId)}`)
}
