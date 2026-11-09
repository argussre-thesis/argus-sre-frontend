import { Inbox } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useClusters } from '@/features/clusters/hooks'
import { IncidentFilterBar } from '@/features/incidents/components/IncidentFilterBar'
import { IncidentTable } from '@/features/incidents/components/IncidentTable'
import { useIncidents } from '@/features/incidents/hooks'
import {
  filterIncidents,
  parseRange,
  type IncidentPageFilters,
} from '@/features/incidents/incidentFilters'

// Filters live in the URL so going back from an incident, or sharing a link, keeps them.
function filtersFromUrl(params: URLSearchParams): IncidentPageFilters {
  const status = params.get('status')
  return {
    status: status === 'OPEN' || status === 'RESOLVED' ? status : undefined,
    clusterId: params.get('cluster') ?? undefined,
    search: params.get('q') ?? undefined,
    range: parseRange(params.get('range')),
  }
}

function filtersToUrl(filters: IncidentPageFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.clusterId) params.set('cluster', filters.clusterId)
  if (filters.search) params.set('q', filters.search)
  if (filters.range) params.set('range', filters.range)
  return params
}

export function IncidentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromUrl(searchParams)
  const incidents = useIncidents({ status: filters.status, clusterId: filters.clusterId })
  const clusters = useClusters()

  function renderList() {
    if (incidents.isPending) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )
    }
    if (incidents.isError) {
      return (
        <ErrorState
          title="Couldn't load incidents"
          error={incidents.error}
          onRetry={() => incidents.refetch()}
        />
      )
    }

    const loaded = incidents.data.pages.flatMap((page) => page.incidents)
    const items = filterIncidents(loaded, filters)
    const filteredHere = Boolean(filters.search?.trim() || filters.range)
    const hasFilters = filteredHere || filters.status || filters.clusterId

    return (
      <>
        {items.length > 0 ? (
          <IncidentTable incidents={items} />
        ) : hasFilters ? (
          <EmptyState icon={Inbox} title="No matching incidents" description="No incidents match these filters." />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No incidents yet"
            description="Incidents open here when your alert sources send firing alerts."
          />
        )}
        {filteredHere && incidents.hasNextPage && (
          <p className="text-center text-sm text-muted-foreground">
            Search and time range only cover the {loaded.length} incidents loaded so far.
          </p>
        )}
        {incidents.hasNextPage && (
          <Button
            variant="outline"
            className="self-center"
            disabled={incidents.isFetchingNextPage}
            onClick={() => incidents.fetchNextPage()}
          >
            {incidents.isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        )}
      </>
    )
  }

  return (
    <>
      <PageHeader title="Incidents" description="Related alerts grouped per cluster, newest first." />
      <IncidentFilterBar
        filters={filters}
        clusters={clusters.data ?? []}
        onChange={(next) => setSearchParams(filtersToUrl(next), { replace: true })}
      />
      {renderList()}
    </>
  )
}
