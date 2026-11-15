import { CopyField } from '@/components/common/CopyField'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CommandSteps } from '@/features/clusters/components/CommandSteps'
import { useRotateClusterToken } from '@/features/clusters/hooks'
import { runnerRotateSteps } from '@/features/clusters/runnerInstall'
import type { Cluster } from '@/types/cluster'

type Props = {
  cluster: Cluster
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RotateClusterTokenDialog({ cluster, open, onOpenChange }: Props) {
  const rotate = useRotateClusterToken(cluster.id)

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) rotate.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        // grid-cols-1 caps the column at the dialog width, so long commands scroll instead of widening it.
        className={rotate.data ? 'grid-cols-1 sm:max-w-2xl' : undefined}
        // The token is never shown again, so a stray click outside must not close it.
        onInteractOutside={rotate.data ? (event) => event.preventDefault() : undefined}
      >
        {rotate.data ? (
          <>
            <DialogHeader>
              <DialogTitle>New runner token for {cluster.name}</DialogTitle>
              <DialogDescription>
                The old token no longer works, so the runner is disconnected until you update it.
                The new token is shown only once.
              </DialogDescription>
            </DialogHeader>
            <CopyField label="Runner token" value={rotate.data.token} />
            <CommandSteps
              title="Update the runner"
              steps={runnerRotateSteps(rotate.data.token)}
              note="The runner reads its token only when it starts, so the restart is required. If you installed it in another namespace, change -n argus-runner."
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rotate the runner token for {cluster.name}?</DialogTitle>
              <DialogDescription>
                You get a new token, and the current one stops working at once. The runner can't
                connect until you update it with the new token.
              </DialogDescription>
            </DialogHeader>
            {rotate.isError && (
              <ErrorState
                title="Couldn't rotate the token"
                error={rotate.error}
                onRetry={() => rotate.mutate()}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={rotate.isPending} onClick={() => rotate.mutate()}>
                {rotate.isPending ? 'Rotating…' : 'Rotate token'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
