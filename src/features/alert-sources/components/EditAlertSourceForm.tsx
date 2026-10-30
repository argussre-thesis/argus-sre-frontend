import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ClusterChecklist } from '@/features/alert-sources/components/ClusterChecklist'
import { ClusterLabelField } from '@/features/alert-sources/components/ClusterLabelField'
import { useUpdateAlertSource } from '@/features/alert-sources/hooks'
import { ApiError } from '@/lib/api-client'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
  onSaved: () => void
}

export function EditAlertSourceForm({ alertSource, onSaved }: Props) {
  const [name, setName] = useState(alertSource.name)
  const [clusterIds, setClusterIds] = useState(alertSource.clusters.map((cluster) => cluster.id))
  const [clusterLabel, setClusterLabel] = useState(alertSource.clusterLabel)
  const update = useUpdateAlertSource(alertSource.id)
  const nameTaken =
    update.error instanceof ApiError && update.error.code === 'ALERT_SOURCE_NAME_TAKEN'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate({ name, clusterIds, clusterLabel }, { onSuccess: onSaved })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>Edit alert source {alertSource.name}</DialogTitle>
        <DialogDescription>The webhook token stays the same.</DialogDescription>
      </DialogHeader>
      <Field data-invalid={nameTaken || undefined}>
        <FieldLabel htmlFor="alert-source-edit-name">Name</FieldLabel>
        <Input
          id="alert-source-edit-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          autoComplete="off"
          aria-invalid={nameTaken || undefined}
        />
        {nameTaken && <FieldError>{update.error?.message}</FieldError>}
      </Field>
      <ClusterChecklist selected={clusterIds} onChange={setClusterIds} />
      <ClusterLabelField value={clusterLabel} onChange={setClusterLabel} />
      {update.isError && !nameTaken && <FieldError>{update.error.message}</FieldError>}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        {/* Checkboxes can't use the browser's "required", so the button waits for one. */}
        <Button type="submit" disabled={update.isPending || clusterIds.length === 0}>
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}
