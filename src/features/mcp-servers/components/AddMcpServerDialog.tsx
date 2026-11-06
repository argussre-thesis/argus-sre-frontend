import { useState, type FormEvent, type ReactNode } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
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
import { McpServerFields } from '@/features/mcp-servers/components/McpServerFields'
import { useCreateMcpServer } from '@/features/mcp-servers/hooks'

const emptyValues = { name: '', url: '', token: '' }

type Props = {
  trigger: ReactNode
}

export function AddMcpServerDialog({ trigger }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(emptyValues)
  const create = useCreateMcpServer()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setValues(emptyValues)
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    create.mutate(
      { ...values, token: values.token.trim() },
      { onSuccess: () => handleOpenChange(false) },
    )
  }

  if (!isAdmin) return <AdminRequiredDialog trigger={trigger} />

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-svh overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Add MCP server</DialogTitle>
            <DialogDescription>
              A remote MCP server that you run or a vendor hosts. Argus connects to it with a bearer
              token.
            </DialogDescription>
          </DialogHeader>
          <McpServerFields
            values={values}
            onChange={setValues}
            error={create.error}
            tokenRequired
            tokenDescription="Use a read-only token. Argus can use every tool this server exposes, and investigations start on their own from alerts."
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Adding…' : 'Add MCP server'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
