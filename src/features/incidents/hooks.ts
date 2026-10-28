import { useInfiniteQuery } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { listIncidents } from '@/features/incidents/api'
import type { IncidentFilters } from '@/types/incident'

export function useIncidents(filters: IncidentFilters) {
  const orgId = useOrgId()
  return useInfiniteQuery({
    queryKey: ['incidents', 'list', orgId, filters],
    queryFn: ({ pageParam }) => listIncidents(orgId, filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
