import { BellOff, SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTable } from '@/features/incidents/components/AlertTable'
import { IncidentSummary } from '@/features/incidents/components/IncidentSummary'
import { useIncident } from '@/features/incidents/hooks'
import { ApiError } from '@/lib/api-client'

export function IncidentPage() {
  // The route is /incidents/:incidentId, so the param is always set.
  const { incidentId = '' } = useParams()
  const incident = useIncident(incidentId)

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
      <PageHeader title={incident.data.title} />
      <IncidentSummary incident={incident.data} />
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
