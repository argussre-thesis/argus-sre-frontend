import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { getIncident, listIncidents, resolveIncident } from '@/features/incidents/api'
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

export function useResolveIncident(incidentId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => resolveIncident(orgId, incidentId),
    onSuccess: (incident) => {
      // The response is the updated incident, so the page needs no refetch; the lists do.
      queryClient.setQueryData(['incidents', 'detail', orgId, incidentId], incident)
      return queryClient.invalidateQueries({ queryKey: ['incidents', 'list'] })
    },
  })
}
