import { Inbox } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { useClusters } from '@/features/clusters/hooks'
import { IncidentFilterBar } from '@/features/incidents/components/IncidentFilterBar'
import { IncidentPager } from '@/features/incidents/components/IncidentPager'
import { IncidentTable } from '@/features/incidents/components/IncidentTable'
import { useIncidents } from '@/features/incidents/hooks'
import {
  DEFAULT_RANGE,
  filterIncidents,
  parseRange,
  rangeStart,
  type IncidentPageFilters,
} from '@/features/incidents/incidentFilters'

// Filters live in the URL so going back from an incident, or sharing a link, keeps them.
function filtersFromUrl(params: URLSearchParams): IncidentPageFilters {
  const status = params.get('status')
  return {
    status: status === 'OPEN' || status === 'RESOLVED' ? status : undefined,
    clusterId: params.get('cluster') ?? undefined,
    search: params.get('q') ?? undefined,
    range: parseRange(params.get('range')) ?? DEFAULT_RANGE,
  }
}

function filtersToUrl(filters: IncidentPageFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.clusterId) params.set('cluster', filters.clusterId)
  if (filters.search) params.set('q', filters.search)
  if (filters.range !== DEFAULT_RANGE) params.set('range', filters.range)
  return params
}

export function IncidentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromUrl(searchParams)
  const allTime = filters.range === 'all'
  const incidents = useIncidents(
    { status: filters.status, clusterId: filters.clusterId },
    rangeStart(filters.range),
  )
  const clusters = useClusters()
  // The page shown when the range is all time, 0-based; one API page each.
  const [page, setPage] = useState(0)

  function goToNextPage(current: number) {
    if (current + 1 < (incidents.data?.pages.length ?? 0)) {
      setPage(current + 1)
      return
    }
    void incidents.fetchNextPage().then((result) => {
      if (!result.isError) setPage(current + 1)
    })
  }

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

    const pages = incidents.data.pages
    const shownPage = Math.min(page, pages.length - 1)
    const loaded = allTime
      ? pages[shownPage].incidents
      : pages.flatMap((apiPage) => apiPage.incidents)
    const items = filterIncidents(loaded, filters)
    const searching = Boolean(filters.search?.trim())
    const hasFilters = searching || !allTime || filters.status || filters.clusterId

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
        {!allTime && incidents.isFetchingNextPage && (
          <p className="text-center text-sm text-muted-foreground">Loading older incidents…</p>
        )}
        {allTime && searching && (
          <p className="text-center text-sm text-muted-foreground">Search only covers this page.</p>
        )}
        {allTime && (shownPage > 0 || incidents.hasNextPage) && (
          <IncidentPager
            page={shownPage + 1}
            hasPrevious={shownPage > 0}
            hasNext={shownPage + 1 < pages.length || incidents.hasNextPage}
            loading={incidents.isFetchingNextPage}
            onPrevious={() => setPage(shownPage - 1)}
            onNext={() => goToNextPage(shownPage)}
          />
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
        onChange={(next) => {
          setPage(0)
          setSearchParams(filtersToUrl(next), { replace: true })
        }}
      />
      {renderList()}
    </>
  )
}
