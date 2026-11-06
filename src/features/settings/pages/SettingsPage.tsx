import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizationSettingsForm } from '@/features/settings/components/OrganizationSettingsForm'
import { SlackSection } from '@/features/settings/components/SlackSection'
import { useCurrentOrganization } from '@/features/settings/hooks'

export function SettingsPage() {
  const { data: org, isPending, isError, error, refetch } = useCurrentOrganization()

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your organization, how alerts become incidents and investigations, and Slack."
      />
      {isPending ? (
        <Skeleton className="h-24 w-full max-w-md" />
      ) : isError ? (
        <ErrorState title="Couldn't load settings" error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <dl className="grid max-w-md grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Organization</dt>
            <dd>{org.name}</dd>
            <dt className="text-muted-foreground">Your role</dt>
            <dd>{org.currentUserRole === 'org:admin' ? 'Admin' : 'Member'}</dd>
            <dt className="text-muted-foreground">Members</dt>
            <dd>{org.memberCount}</dd>
          </dl>
          {/* The key resets the form's values when the active organization changes. */}
          <OrganizationSettingsForm key={org.id} org={org} />
        </>
      )}
      <SlackSection />
    </>
  )
}
