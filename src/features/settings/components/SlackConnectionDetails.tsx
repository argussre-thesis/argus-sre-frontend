import { useState } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { RelativeTime } from '@/components/common/RelativeTime'
import { Button } from '@/components/ui/button'
import { useDisconnectSlack } from '@/features/settings/hooks'
import type { SlackConnection } from '@/types/slack'

type Props = {
  connection: SlackConnection
}

export function SlackConnectionDetails({ connection }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [open, setOpen] = useState(false)
  const disconnect = useDisconnectSlack()

  const trigger = (
    <Button variant="destructive" className="shrink-0">
      Disconnect
    </Button>
  )

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Workspace</dt>
        <dd>{connection.teamName}</dd>
        <dt className="text-muted-foreground">Channel</dt>
        <dd>{connection.channelName}</dd>
        <dt className="text-muted-foreground">Connected</dt>
        <dd>
          <RelativeTime iso={connection.installedAt} />
        </dd>
      </dl>
      <p className="text-sm text-muted-foreground">
        If the channel is private, type /invite @argus there so Argus can post.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-destructive/50 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-destructive">Disconnect Slack</p>
          <p className="text-sm text-muted-foreground">Removes Argus from this workspace.</p>
        </div>
        {isAdmin ? (
          <ConfirmDialog
            trigger={trigger}
            title="Disconnect Slack?"
            description={`Argus is removed from the ${connection.teamName} workspace, and stops posting reports and answering @argus there. Past incidents are kept. You can connect again later.`}
            confirmLabel="Disconnect"
            pendingLabel="Disconnecting…"
            errorTitle="Couldn't disconnect Slack"
            action={disconnect}
            open={open}
            onOpenChange={setOpen}
          />
        ) : (
          <AdminRequiredDialog trigger={trigger} />
        )}
      </div>
    </div>
  )
}
