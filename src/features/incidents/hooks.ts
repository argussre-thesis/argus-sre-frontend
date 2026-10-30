import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  getIncident,
  investigateIncident,
  listIncidents,
  listInvestigations,
  resolveIncident,
} from '@/features/incidents/api'
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

export function useInvestigations(incidentId: string) {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['incidents', 'investigations', orgId, incidentId],
    queryFn: () => listInvestigations(orgId, incidentId),
    // Poll while the newest run is going (runs take ~10-30s). Stop on an error so a down agent
    // service isn't hit every 15s against the backend's rate limit; Retry starts it again.
    refetchInterval: (query) =>
      !query.state.error && query.state.data?.[0]?.status === 'running' ? 15_000 : false,
  })
}

export function useInvestigateIncident(incidentId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => investigateIncident(orgId, incidentId),
    // Also on an error: INVESTIGATION_RUNNING means a run (maybe an automatic one) is already going.
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['incidents', 'investigations', orgId, incidentId],
      }),
  })
}
