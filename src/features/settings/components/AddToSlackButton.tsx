import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { useInstallSlack } from '@/features/settings/hooks'

export function AddToSlackButton() {
  const isAdmin = useIsOrgAdmin()
  const install = useInstallSlack()

  const button = (
    <Button
      variant="link"
      className="h-auto w-fit p-0"
      disabled={install.isPending}
      onClick={isAdmin ? () => install.mutate() : undefined}
    >
      {/* Slack's own button, from its CDN. If it ever goes away, the alt text still works as the label. */}
      <img
        alt="Add to Slack"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        width={139}
        height={40}
      />
    </Button>
  )

  if (!isAdmin) return <AdminRequiredDialog trigger={button} />

  return (
    <div className="flex flex-col gap-2">
      {button}
      {install.isError && (
        <ErrorState
          title="Couldn't start connecting to Slack"
          error={install.error}
          onRetry={() => install.mutate()}
        />
      )}
    </div>
  )
}
