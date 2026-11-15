import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { AgentSettingsForm } from '@/features/settings/components/AgentSettingsForm'
import { IncidentSettingsForm } from '@/features/settings/components/IncidentSettingsForm'
import { SettingsCard } from '@/features/settings/components/SettingsCard'
import { SlackSection } from '@/features/settings/components/SlackSection'
import { useCurrentOrganization } from '@/features/settings/hooks'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'organization', label: 'Organization' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'agent', label: 'Agent' },
  { id: 'slack', label: 'Slack' },
]
const sectionIds = sections.map((section) => section.id)

export function SettingsPage() {
  const { data: org, isPending, isError, error, refetch } = useCurrentOrganization()
  // A section counts as current once its top is in the upper part of the screen.
  const activeSection = useScrollSpy(sectionIds, 120)

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your organization, how alerts become incidents, how the agent works, and Slack."
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav aria-label="Settings sections" className="flex gap-1 lg:sticky lg:top-6 lg:w-48 lg:flex-col">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={section.id === activeSection ? 'location' : undefined}
              className={cn(
                'rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
                section.id === activeSection && 'bg-muted text-foreground',
              )}
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
                <IncidentSettingsForm key={org.id} org={org} />
              </SettingsCard>
              <SettingsCard
                id="agent"
                title="Agent"
                description="How the agent works in investigations and conversations."
              >
                <AgentSettingsForm key={org.id} org={org} />
              </SettingsCard>
            </>
          )}
          <SlackSection />
        </div>
      </div>
    </>
  )
}
