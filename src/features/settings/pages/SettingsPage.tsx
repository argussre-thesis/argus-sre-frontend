import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentOrganization } from '@/features/settings/hooks'

export function SettingsPage() {
  const { data: org, isPending, isError, error } = useCurrentOrganization()

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      {isPending ? (
        <Skeleton className="h-24 w-full max-w-md" />
      ) : isError ? (
        <p className="text-sm text-destructive">{error.message}</p>
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
    </main>
  )
}
