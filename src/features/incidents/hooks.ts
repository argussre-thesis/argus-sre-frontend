import { useEffect } from 'react'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  getIncident,
  investigateIncident,
  listIncidents,
  listInvestigations,
  resolveIncident,
} from '@/features/incidents/api'
import type { IncidentFilters, IncidentPage } from '@/types/incident'

// The API's largest page. One request per summary, because of its rate limit.
const SUMMARY_LIMIT = 100
export const ALL_TIME_PAGE_SIZE = 20

function withoutTests(page: IncidentPage): IncidentPage {
  return { ...page, incidents: page.incidents.filter((incident) => !incident.isTest) }
}

// All time (no `since`): pages of 20, shown one at a time. A time range: pages of 100, fetched
// until one reaches past `since`, because the API can't filter by date.
export function useIncidents(filters: IncidentFilters, since?: number) {
  const orgId = useOrgId()
  const limit = since === undefined ? ALL_TIME_PAGE_SIZE : SUMMARY_LIMIT
  const query = useInfiniteQuery({
    queryKey: ['incidents', 'list', orgId, filters, limit],
    queryFn: ({ pageParam }) => listIncidents(orgId, filters, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const oldest = query.data?.pages.at(-1)?.incidents.at(-1)
  const needsMore =
    since !== undefined &&
    query.hasNextPage &&
    !query.isFetching &&
    !query.isError &&
    oldest !== undefined &&
    Date.parse(oldest.createdAt) >= since
  const { fetchNextPage } = query
  useEffect(() => {
    if (needsMore) void fetchNextPage()
  }, [needsMore, fetchNextPage])

  return query
}

export function useOpenIncidentsSummary() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['incidents', 'list', orgId, 'open-summary'],
    queryFn: () => listIncidents(orgId, { status: 'OPEN' }, undefined, SUMMARY_LIMIT),
    select: withoutTests,
  })
}

export function useRecentIncidentsSummary() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['incidents', 'list', orgId, 'recent-summary'],
    queryFn: () => listIncidents(orgId, {}, undefined, SUMMARY_LIMIT),
    select: withoutTests,
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
