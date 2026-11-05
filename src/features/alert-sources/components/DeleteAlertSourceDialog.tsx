import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteAlertSource } from '@/features/alert-sources/hooks'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAlertSourceDialog({ alertSource, open, onOpenChange }: Props) {
  const remove = useDeleteAlertSource(alertSource.id)

  return (
    <ConfirmDialog
      title={`Delete alert source ${alertSource.name}?`}
      description="Its webhook token stops working, so alerts from this sender are rejected. Its past alerts and incidents are kept. This can't be undone."
      confirmLabel="Delete alert source"
      pendingLabel="Deleting…"
      errorTitle="Couldn't delete the alert source"
      action={remove}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
