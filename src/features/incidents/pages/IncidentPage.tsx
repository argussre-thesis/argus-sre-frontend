import { ArrowLeft, BellOff, CircleCheck, SearchX } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTable } from '@/features/incidents/components/AlertTable'
import { IncidentInvestigation } from '@/features/incidents/components/IncidentInvestigation'
import { IncidentSummary } from '@/features/incidents/components/IncidentSummary'
import { useIncident, useResolveIncident } from '@/features/incidents/hooks'
import { ApiError } from '@/lib/api-client'

export function IncidentPage() {
  // The route is /incidents/:incidentId, so the param is always set.
  const { incidentId = '' } = useParams()
  const { state } = useLocation()
  const incident = useIncident(incidentId)
  const resolve = useResolveIncident(incidentId)

  if (incident.isPending) {
    return (
      <>
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </>
    )
  }
  if (incident.isError) {
    if (incident.error instanceof ApiError && incident.error.code === 'INCIDENT_NOT_FOUND') {
      return (
        <EmptyState
          icon={SearchX}
          title="Incident not found"
          description="There is no incident with this id in the current organization."
        />
      )
    }
    return (
      <ErrorState
        title="Couldn't load the incident"
        error={incident.error}
        onRetry={() => incident.refetch()}
      />
    )
  }

  const { alerts } = incident.data
  return (
    <>
      <div className="flex flex-col gap-2">
        {/* The list passes its filters along, so going back keeps them. */}
        <Link
          to={`/app/incidents${typeof state?.listSearch === 'string' ? state.listSearch : ''}`}
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Incidents
        </Link>
        <PageHeader
          title={incident.data.title}
          actions={
            incident.data.status === 'OPEN' && (
              <Button
                variant="outline"
                disabled={resolve.isPending}
                onClick={() => resolve.mutate()}
              >
                <CircleCheck />
                {resolve.isPending ? 'Resolving…' : 'Resolve'}
              </Button>
            )
          }
        />
      </div>
      {resolve.isError && (
        <ErrorState
          title="Couldn't resolve the incident"
          error={resolve.error}
          onRetry={() => resolve.mutate()}
        />
      )}
      <IncidentSummary incident={incident.data} />
      <IncidentInvestigation incident={incident.data} />
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Alerts</h2>
        {alerts.length === 0 ? (
          <EmptyState icon={BellOff} title="No alerts" description="This incident has no alerts." />
        ) : (
          <AlertTable alerts={alerts} />
        )}
      </section>
    </>
  )
}
