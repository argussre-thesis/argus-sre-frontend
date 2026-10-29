import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { createCluster, listClusters } from '@/features/clusters/api'

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
