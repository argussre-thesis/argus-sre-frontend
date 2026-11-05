import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { McpServerFields } from '@/features/mcp-servers/components/McpServerFields'
import { useUpdateMcpServer } from '@/features/mcp-servers/hooks'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServer: McpServer
  onSaved: () => void
}

export function EditMcpServerForm({ mcpServer, onSaved }: Props) {
  const [values, setValues] = useState({ name: mcpServer.name, url: mcpServer.url, token: '' })
  const update = useUpdateMcpServer(mcpServer.id)
  const urlChanged = values.url !== mcpServer.url

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate(
      { name: values.name, url: values.url, token: values.token.trim() || undefined },
      { onSuccess: onSaved },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>Edit MCP server {mcpServer.name}</DialogTitle>
        <DialogDescription>
          The current token isn't shown. Renaming changes the prefix of this server's tools.
        </DialogDescription>
      </DialogHeader>
      <McpServerFields
        values={values}
        onChange={setValues}
        error={update.error}
        tokenRequired={urlChanged}
        tokenDescription={
          urlChanged
            ? "Required because the URL changed, so the current token isn't sent to a new address. Use a read-only token."
            : 'Leave blank to keep the current token. A new one should be read-only too.'
        }
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Saving…' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}
