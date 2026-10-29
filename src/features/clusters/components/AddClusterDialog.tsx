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
import { useCreateCluster } from '@/features/clusters/hooks'

export function AddClusterDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const create = useCreateCluster()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setName('')
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    create.mutate(name)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add cluster
        </Button>
      </DialogTrigger>
      <DialogContent
        // The token is never shown again, so a stray click outside must not close it.
        onInteractOutside={create.data ? (event) => event.preventDefault() : undefined}
      >
        {create.data ? (
          <>
            <DialogHeader>
              <DialogTitle>Cluster {create.data.cluster.name} added</DialogTitle>
              <DialogDescription>
                Copy the runner token and store it somewhere safe, such as a password manager or a
                Kubernetes Secret. You need it to install the runner. It is shown only once.
              </DialogDescription>
            </DialogHeader>
            <CopyField label="Runner token" value={create.data.token} />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Add cluster</DialogTitle>
              <DialogDescription>
                Register a Kubernetes cluster. Its runner connects with the token you get next.
              </DialogDescription>
            </DialogHeader>
            <Field data-invalid={create.isError || undefined}>
              <FieldLabel htmlFor="cluster-name">Name</FieldLabel>
              {/* The backend's rule: a DNS-1123 label. The "-" is escaped for the v-flag regex browsers use. */}
              <Input
                id="cluster-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={63}
                pattern="[a-z0-9]([a-z0-9\-]*[a-z0-9])?"
                placeholder="prod-eu-1"
                autoComplete="off"
                aria-invalid={create.isError || undefined}
              />
              <FieldDescription>
                The value of the cluster label on your alerts. Lowercase letters, digits and "-",
                up to 63 characters. It can't be changed later.
              </FieldDescription>
              <FieldError>{create.error?.message}</FieldError>
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Adding…' : 'Add cluster'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
