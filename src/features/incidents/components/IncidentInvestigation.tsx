import { Bot } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { InvestigationSummary } from '@/features/incidents/components/InvestigationSummary'
import { useInvestigateIncident, useInvestigations } from '@/features/incidents/hooks'
import type { Incident } from '@/types/incident'

type Props = {
  incident: Incident
}

// The backend refuses these two with a 409, so the button isn't offered.
function whyNotInvestigable(incident: Incident) {
  if (incident.isTest) return 'Test incidents are never investigated.'
  if (!incident.cluster) {
    return "This incident has no known cluster, so there is no runner to ask. Check the alert source's clusters and cluster label."
  }
  return null
}

export function IncidentInvestigation({ incident }: Props) {
  const investigations = useInvestigations(incident.id)
  const investigate = useInvestigateIncident(incident.id)
  const latest = investigations.data?.[0]
  const running = latest?.status === 'running'
  const blocked = whyNotInvestigable(incident)

  function buttonLabel() {
    if (investigate.isPending) return 'Starting…'
    if (running) return 'Investigating…'
    return latest ? 'Investigate again' : 'Investigate'
  }

  function renderLatest() {
    if (investigations.isPending) {
      return <Skeleton className="h-16 w-full" />
    }
    if (investigations.isError) {
      return (
        <ErrorState
          title="Couldn't load the investigation"
          error={investigations.error}
          onRetry={() => investigations.refetch()}
        />
      )
    }
    if (!latest) {
      return (
        <EmptyState
          icon={Bot}
          title="Not investigated yet"
          description={blocked ?? 'Press Investigate to have the agent look into the cluster.'}
        />
      )
    }
    return <InvestigationSummary investigation={latest} />
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Investigation</h2>
        {!blocked && (
          <Button
            variant="outline"
            size="sm"
            disabled={investigate.isPending || investigations.isPending || running}
            onClick={() => investigate.mutate()}
          >
            <Bot />
            {buttonLabel()}
          </Button>
        )}
      </div>
      {investigate.isError && (
        <ErrorState
          title="Couldn't start the investigation"
          error={investigate.error}
          onRetry={() => investigate.mutate()}
        />
      )}
      {renderLatest()}
    </section>
  )
}
