import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { getIncident, listIncidents } from '@/features/incidents/api'
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

export function useIncident(incidentId: string) {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['incidents', 'detail', orgId, incidentId],
    queryFn: () => getIncident(orgId, incidentId),
  })
}
