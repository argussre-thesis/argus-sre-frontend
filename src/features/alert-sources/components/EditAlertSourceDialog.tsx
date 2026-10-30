import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EditAlertSourceForm } from '@/features/alert-sources/components/EditAlertSourceForm'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAlertSourceDialog({ alertSource, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* The form mounts on every open, so it starts from the source's current values. */}
        <EditAlertSourceForm alertSource={alertSource} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
