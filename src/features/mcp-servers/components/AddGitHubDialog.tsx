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
import { FieldError } from '@/components/ui/field'
import { McpServerNameField } from '@/features/mcp-servers/components/McpServerNameField'
import { McpServerTokenField } from '@/features/mcp-servers/components/McpServerTokenField'
import { useCreateMcpServer } from '@/features/mcp-servers/hooks'
import { githubMcpUrl } from '@/features/mcp-servers/integrations'
import { mcpServerErrors } from '@/features/mcp-servers/mcpServerErrors'

const initialValues = { name: 'github', token: '' }

type Props = {
  trigger: ReactNode
}

export function AddGitHubDialog({ trigger }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const create = useCreateMcpServer()
  const { nameError, urlError, tokenError, otherError } = mcpServerErrors(create.error)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setValues(initialValues)
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    create.mutate(
      { name: values.name, url: githubMcpUrl, token: values.token.trim() },
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
            <DialogTitle>Add GitHub</DialogTitle>
            <DialogDescription>
              Let the agent use GitHub's MCP server with your token.
            </DialogDescription>
          </DialogHeader>
          <McpServerNameField
            value={values.name}
            onChange={(name) => setValues({ ...values, name })}
            error={nameError}
          />
          <McpServerTokenField
            value={values.token}
            onChange={(token) => setValues({ ...values, token })}
            error={tokenError}
            required
            description="Create a fine-grained personal access token and give it only the access you want the agent to have. Investigations start on their own from alerts."
          />
          <FieldError>{urlError ?? otherError}</FieldError>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Adding…' : 'Add GitHub'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
