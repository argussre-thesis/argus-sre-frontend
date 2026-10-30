import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  createCluster,
  deleteCluster,
  listClusters,
  rotateClusterToken,
} from '@/features/clusters/api'

export function useClusters() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['clusters', 'list', orgId],
    queryFn: () => listClusters(orgId),
  })
}

export function useCreateCluster() {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCluster(orgId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clusters', 'list', orgId] }),
  })
}

export function useRotateClusterToken(clusterId: string) {
  const orgId = useOrgId()
  return useMutation({
    mutationFn: () => rotateClusterToken(orgId, clusterId),
  })
}

export function useDeleteCluster(clusterId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteCluster(orgId, clusterId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['clusters', 'list', orgId] }),
        // Its incidents now have no cluster ("unknown cluster"), and it left every alert source.
        queryClient.invalidateQueries({ queryKey: ['incidents'] }),
        queryClient.invalidateQueries({ queryKey: ['alert-sources'] }),
      ]),
  })
}
