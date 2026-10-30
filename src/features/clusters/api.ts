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

export function rotateClusterToken(orgId: string, clusterId: string) {
  return apiRequest<{ token: string }>(
    `/organizations/${encodeURIComponent(orgId)}/clusters/${encodeURIComponent(clusterId)}/token`,
    { method: 'POST' },
  )
}

export function deleteCluster(orgId: string, clusterId: string) {
  return apiRequest<null>(
    `/organizations/${encodeURIComponent(orgId)}/clusters/${encodeURIComponent(clusterId)}`,
    { method: 'DELETE' },
  )
}
