import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { SlackSection } from '@/features/settings/components/SlackSection'
import { useCurrentOrganization } from '@/features/settings/hooks'

export function SettingsPage() {
  const { data: org, isPending, isError, error, refetch } = useCurrentOrganization()

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your organization, how alerts are grouped into incidents, and Slack."
      />
      {isPending ? (
        <Skeleton className="h-24 w-full max-w-md" />
      ) : isError ? (
        <ErrorState title="Couldn't load settings" error={error} onRetry={() => refetch()} />
      ) : (
        <dl className="grid max-w-md grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Organization</dt>
          <dd>{org.name}</dd>
          <dt className="text-muted-foreground">Your role</dt>
          <dd>{org.currentUserRole === 'org:admin' ? 'Admin' : 'Member'}</dd>
          <dt className="text-muted-foreground">Members</dt>
          <dd>{org.memberCount}</dd>
          <dt className="text-muted-foreground">Incident grouping window</dt>
          <dd>{org.incidentGroupingWindowMinutes} min</dd>
        </dl>
      )}
      <SlackSection />
    </>
  )
}
