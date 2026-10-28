import { useQuery } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { listClusters } from '@/features/clusters/api'

export function useClusters() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['clusters', 'list', orgId],
    queryFn: () => listClusters(orgId),
  })
}
