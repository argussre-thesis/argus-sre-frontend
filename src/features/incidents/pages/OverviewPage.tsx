import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IncidentTable } from '@/features/incidents/components/IncidentTable'
import { StatCard } from '@/features/incidents/components/StatCard'
import { useOpenIncidentsSummary, useRecentIncidentsSummary } from '@/features/incidents/hooks'
import { incidentStats } from '@/features/incidents/incidentFilters'
import { formatDuration } from '@/lib/utils'

const ATTENTION_ROWS = 10

// shortcut: the API has no totals, so these come from one page of 100 incidents each, and the cards
// say so when there are more. Replace them with a summary endpoint when the backend has one.
export function OverviewPage() {
  const open = useOpenIncidentsSummary()
  const recent = useRecentIncidentsSummary()

  function renderContent() {
    if (open.isError) {
      return (
        <ErrorState title="Couldn't load the overview" error={open.error} onRetry={() => open.refetch()} />
      )
    }
    if (recent.isError) {
      return (
        <ErrorState title="Couldn't load the overview" error={recent.error} onRetry={() => recent.refetch()} />
      )
    }
    if (open.isPending || recent.isPending) {
      return (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-48" />
        </>
      )
    }

    const openIncidents = open.data.incidents
    const openMore = open.data.nextCursor !== null
    const recentMore = recent.data.nextCursor !== null
    const stats = incidentStats(recent.data.incidents)
    const firing = openIncidents.reduce((sum, incident) => sum + incident.firingAlertCount, 0)
    const sampleHint = recentMore ? 'From the latest 100 incidents' : 'Across all incidents'

    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Open incidents"
            value={openMore ? '100+' : String(openIncidents.length)}
            hint="Test incidents not counted"
          />
          <StatCard
            label="Firing alerts"
            value={openMore ? `${firing}+` : String(firing)}
            hint="On open incidents"
          />
          <StatCard label="Opened in the last 24h" value={String(stats.last24h)} hint={sampleHint} />
          <StatCard
            label="Mean time to resolve"
            value={stats.mttrMs === null ? 'No data' : formatDuration(stats.mttrMs)}
            hint={stats.resolvedCount > 0 ? `${stats.resolvedCount} resolved incidents` : 'Nothing resolved yet'}
          />
        </div>
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium">Needs attention</h2>
            {openIncidents.length > ATTENTION_ROWS && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/incidents?status=OPEN">View all open</Link>
              </Button>
            )}
          </div>
          {openIncidents.length > 0 ? (
            <IncidentTable incidents={openIncidents.slice(0, ATTENTION_ROWS)} />
          ) : (
            <EmptyState
              icon={CircleCheck}
              title="Nothing needs attention"
              description="No incidents are open right now."
            />
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Overview" description="What's happening across your clusters." />
      {renderContent()}
    </>
  )
}
