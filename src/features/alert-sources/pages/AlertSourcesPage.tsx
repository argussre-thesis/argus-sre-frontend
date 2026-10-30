import { Webhook } from 'lucide-react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { AddAlertSourceDialog } from '@/features/alert-sources/components/AddAlertSourceDialog'
import { AlertSourceTable } from '@/features/alert-sources/components/AlertSourceTable'
import { useAlertSources } from '@/features/alert-sources/hooks'

export function AlertSourcesPage() {
  const alertSources = useAlertSources()
  const isAdmin = useIsOrgAdmin()

  function renderList() {
    if (alertSources.isPending) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )
    }
    if (alertSources.isError) {
      return (
        <ErrorState
          title="Couldn't load alert sources"
          error={alertSources.error}
          onRetry={() => alertSources.refetch()}
        />
      )
    }
    if (alertSources.data.length === 0) {
      return (
        <EmptyState
          icon={Webhook}
          title="No alert sources yet"
          description="Add an alert source to get a webhook token for Grafana or Alertmanager."
        />
      )
    }
    return <AlertSourceTable alertSources={alertSources.data} canManage={isAdmin} />
  }

  return (
    <>
      <PageHeader
        title="Alert sources"
        description="Where your alerts come from: a Grafana instance or an Alertmanager, each with its own webhook token."
        actions={isAdmin && <AddAlertSourceDialog />}
      />
      {renderList()}
    </>
  )
}
