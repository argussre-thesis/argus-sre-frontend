import { apiRequest } from '@/lib/api-client'
import type { Cluster, CreatedCluster } from '@/types/cluster'

export function listClusters(orgId: string) {
  return apiRequest<Cluster[]>(`/organizations/${encodeURIComponent(orgId)}/clusters`)
}

export function createCluster(orgId: string, name: string) {
  return apiRequest<CreatedCluster>(`/organizations/${encodeURIComponent(orgId)}/clusters`, {
    method: 'POST',
    body: { name },
  })
}
