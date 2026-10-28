import { apiRequest } from '@/lib/api-client'
import type { Cluster } from '@/types/cluster'

export function listClusters(orgId: string) {
  return apiRequest<Cluster[]>(`/organizations/${encodeURIComponent(orgId)}/clusters`)
}
