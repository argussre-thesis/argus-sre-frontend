import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { CopyField } from '@/components/common/CopyField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { defaultClusterLabel, webhookUrl } from '@/features/alert-sources/api'
import { ClusterChecklist } from '@/features/alert-sources/components/ClusterChecklist'
import { ClusterLabelField } from '@/features/alert-sources/components/ClusterLabelField'
import { useCreateAlertSource } from '@/features/alert-sources/hooks'
import { ApiError } from '@/lib/api-client'

export function AddAlertSourceDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [clusterIds, setClusterIds] = useState<string[]>([])
  const [clusterLabel, setClusterLabel] = useState(defaultClusterLabel)
  const create = useCreateAlertSource()
  const nameTaken =
    create.error instanceof ApiError && create.error.code === 'ALERT_SOURCE_NAME_TAKEN'

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setName('')
      setClusterIds([])
      setClusterLabel(defaultClusterLabel)
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    create.mutate({ name, clusterIds, clusterLabel })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add alert source
        </Button>
      </DialogTrigger>
      <DialogContent
        // The token is never shown again, so a stray click outside must not close it.
        onInteractOutside={create.data ? (event) => event.preventDefault() : undefined}
      >
        {create.data ? (
          <>
            <DialogHeader>
              <DialogTitle>Alert source {create.data.alertSource.name} added</DialogTitle>
              <DialogDescription>
                Point your Grafana contact point or Alertmanager at the webhook URL, with the token
                as a Bearer authorization header. Copy the token now: it is shown only once.
              </DialogDescription>
            </DialogHeader>
            <CopyField label="Webhook URL" value={webhookUrl} />
            <CopyField label="Webhook token" value={create.data.token} />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Add alert source</DialogTitle>
              <DialogDescription>
                A Grafana instance or an Alertmanager that sends alerts to Argus. You get its webhook
                token next.
              </DialogDescription>
            </DialogHeader>
            <Field data-invalid={nameTaken || undefined}>
              <FieldLabel htmlFor="alert-source-name">Name</FieldLabel>
              <Input
                id="alert-source-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                placeholder="grafana-cloud"
                autoComplete="off"
                aria-invalid={nameTaken || undefined}
              />
              <FieldDescription>A name you recognize the sender by.</FieldDescription>
              {nameTaken && <FieldError>{create.error?.message}</FieldError>}
            </Field>
            <ClusterChecklist selected={clusterIds} onChange={setClusterIds} />
            <ClusterLabelField value={clusterLabel} onChange={setClusterLabel} />
            {create.isError && !nameTaken && <FieldError>{create.error.message}</FieldError>}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {/* Checkboxes can't use the browser's "required", so the button waits for one. */}
              <Button type="submit" disabled={create.isPending || clusterIds.length === 0}>
                {create.isPending ? 'Adding…' : 'Add alert source'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
