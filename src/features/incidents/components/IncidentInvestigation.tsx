import { Bot } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { InvestigationPicker } from '@/features/incidents/components/InvestigationPicker'
import { InvestigationSummary } from '@/features/incidents/components/InvestigationSummary'
import { RcaReport } from '@/features/incidents/components/RcaReport'
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
  // null = follow the newest run, so a new one shows up by itself.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const latest = investigations.data?.[0]
  const shown = investigations.data?.find((run) => run.id === selectedId) ?? latest
  const running = latest?.status === 'running'
  const blocked = whyNotInvestigable(incident)

  function startInvestigation() {
    setSelectedId(null)
    investigate.mutate()
  }

  function buttonLabel() {
    if (investigate.isPending) return 'Starting…'
    if (running) return 'Investigating…'
    return latest ? 'Investigate again' : 'Investigate'
  }

  function renderRun() {
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
    if (!shown) {
      return (
        <EmptyState
          icon={Bot}
          title="Not investigated yet"
          description={blocked ?? 'Press Investigate to have the agent look into the cluster.'}
        />
      )
    }
    return (
      <div className="flex flex-col gap-4">
        <InvestigationSummary investigation={shown} />
        {shown.report && <RcaReport report={shown.report} />}
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Investigation</h2>
        <div className="flex flex-wrap items-center gap-2">
          {shown && investigations.data && investigations.data.length > 1 && (
            <InvestigationPicker
              investigations={investigations.data}
              selectedId={shown.id}
              onSelect={setSelectedId}
            />
          )}
          {!blocked && (
            <Button
              variant="outline"
              size="sm"
              disabled={investigate.isPending || investigations.isPending || running}
              onClick={startInvestigation}
            >
              <Bot />
              {buttonLabel()}
            </Button>
          )}
        </div>
      </div>
      {investigate.isError && (
        <ErrorState
          title="Couldn't start the investigation"
          error={investigate.error}
          onRetry={startInvestigation}
        />
      )}
      {renderRun()}
    </section>
  )
}
