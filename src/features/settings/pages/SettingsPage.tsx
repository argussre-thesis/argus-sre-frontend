import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizationSettingsForm } from '@/features/settings/components/OrganizationSettingsForm'
import { SettingsCard } from '@/features/settings/components/SettingsCard'
import { SlackSection } from '@/features/settings/components/SlackSection'
import { useCurrentOrganization } from '@/features/settings/hooks'

const sections = [
  { id: 'organization', label: 'Organization' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'slack', label: 'Slack' },
]

export function SettingsPage() {
  const { data: org, isPending, isError, error, refetch } = useCurrentOrganization()

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your organization, how alerts become incidents and investigations, and Slack."
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav aria-label="Settings sections" className="flex gap-1 lg:sticky lg:top-6 lg:w-48 lg:flex-col">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex max-w-2xl min-w-0 flex-1 flex-col gap-6">
          {isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : isError ? (
            <ErrorState title="Couldn't load settings" error={error} onRetry={() => refetch()} />
          ) : (
            <>
              <SettingsCard id="organization" title="Organization" description="Who this workspace belongs to.">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Organization</dt>
                  <dd>{org.name}</dd>
                  <dt className="text-muted-foreground">Your role</dt>
                  <dd>{org.currentUserRole === 'org:admin' ? 'Admin' : 'Member'}</dd>
                  <dt className="text-muted-foreground">Members</dt>
                  <dd>{org.memberCount}</dd>
                </dl>
              </SettingsCard>
              <SettingsCard
                id="incidents"
                title="Incidents"
                description="How alerts are grouped into incidents and when they get investigated."
              >
                {/* The key resets the form's values when the active organization changes. */}
                <OrganizationSettingsForm key={org.id} org={org} />
              </SettingsCard>
            </>
          )}
          <SlackSection />
        </div>
      </div>
    </>
  )
}
