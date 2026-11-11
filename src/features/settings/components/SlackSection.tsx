import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import slackLogo from '@/assets/logos/slack.svg'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { AddToSlackButton } from '@/features/settings/components/AddToSlackButton'
import { SettingsCard } from '@/features/settings/components/SettingsCard'
import { SlackConnectionDetails } from '@/features/settings/components/SlackConnectionDetails'
import { SlackOutcomeAlert } from '@/features/settings/components/SlackOutcomeAlert'
import { useSlackStatus } from '@/features/settings/hooks'

export function SlackSection() {
  const slack = useSlackStatus()
  const [searchParams, setSearchParams] = useSearchParams()
  const [outcome] = useState(searchParams.get('slack'))

  // Slack's install comes back to ?slack=<outcome>. Clearing it stops a refresh repeating the message.
  useEffect(() => {
    if (searchParams.has('slack')) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  // Disconnecting on this page would otherwise leave "Slack connected" showing.
  const outcomeStillTrue =
    slack.data?.connected || (outcome !== 'connected' && outcome !== 'cannot_post')

  function renderStatus() {
    if (slack.isPending) return <Skeleton className="h-10 w-full" />
    if (slack.isError) {
      return (
        <ErrorState
          title="Couldn't load the Slack connection"
          error={slack.error}
          onRetry={() => slack.refetch()}
        />
      )
    }
    if (slack.data.connected) return <SlackConnectionDetails connection={slack.data} />
    return <AddToSlackButton />
  }

  return (
    <SettingsCard
      id="slack"
      title={
        <>
          <img src={slackLogo} alt="" className="size-4" />
          Slack
        </>
      }
      description="Argus posts each investigation's report to a channel, and answers when someone mentions @argus."
    >
      {outcome && outcomeStillTrue && <SlackOutcomeAlert outcome={outcome} />}
      {renderStatus()}
    </SettingsCard>
  )
}
