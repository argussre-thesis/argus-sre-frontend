import { Server } from 'lucide-react'
import { AddClusterDialog } from '@/components/common/AddClusterDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { ClusterTable } from '@/features/clusters/components/ClusterTable'
import { useClusters } from '@/features/clusters/hooks'
import { useOpenIncidentsSummary } from '@/features/incidents/hooks'

export function ClustersPage() {
  const clusters = useClusters()
  // shortcut: counts come from one page of 100 open incidents, so past that they can run low.
  // Replace with a count per cluster in the API when the backend has one.
  const open = useOpenIncidentsSummary()

  function renderList() {
    if (clusters.isPending) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )
    }
    if (clusters.isError) {
      return (
        <ErrorState
          title="Couldn't load clusters"
          error={clusters.error}
          onRetry={() => clusters.refetch()}
        />
      )
    }
    if (clusters.data.length === 0) {
      return (
        <EmptyState
          icon={Server}
          title="No clusters yet"
          description="Register a cluster so its runner can connect and alerts can be matched to it."
        />
      )
    }
    return <ClusterTable clusters={clusters.data} openIncidents={open.data?.incidents} />
  }

  return (
    <>
      <PageHeader
        title="Clusters"
        description="Kubernetes clusters the agent can investigate, one runner each."
        actions={<AddClusterDialog />}
      />
      {renderList()}
    </>
  )
}
