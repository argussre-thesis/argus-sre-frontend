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
import {
  emptyHeaderRow,
  parseHeaderRows,
  type McpServerFormValues,
} from '@/features/mcp-servers/mcpServerHeaders'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServer: McpServer
  onSaved: () => void
}

function tokenDescription(urlChanged: boolean, authChanged: boolean) {
  if (urlChanged) {
    return "Required because the URL changed, so the current credentials aren't sent to a new address. Use a read-only token."
  }
  if (authChanged) return 'Required because a token replaces the current headers. Use a read-only token.'
  return 'Leave blank to keep the current token. A new one should be read-only too.'
}

function headersDescription(mcpServer: McpServer, urlChanged: boolean, authChanged: boolean) {
  if (urlChanged) {
    return "Required because the URL changed, so the current credentials aren't sent to a new address."
  }
  if (authChanged) return 'Required because headers replace the current token.'
  return `Current headers: ${mcpServer.headerNames.join(', ')}. Their values aren't shown. Leave this empty to keep them, or add headers to replace all of them.`
}

export function EditMcpServerForm({ mcpServer, onSaved }: Props) {
  const storedAuthMode = mcpServer.headerNames.length > 0 ? 'headers' : 'token'
  const [values, setValues] = useState<McpServerFormValues>({
    name: mcpServer.name,
    url: mcpServer.url,
    authMode: storedAuthMode,
    token: '',
    headerRows: storedAuthMode === 'headers' ? [] : [emptyHeaderRow],
  })
  const [headersError, setHeadersError] = useState<string>()
  const update = useUpdateMcpServer(mcpServer.id)
  const urlChanged = values.url !== mcpServer.url
  const authChanged = values.authMode !== storedAuthMode
  const credentialsRequired = urlChanged || authChanged

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { name, url } = values
    if (values.authMode === 'token') {
      update.mutate({ name, url, token: values.token.trim() || undefined }, { onSuccess: onSaved })
      return
    }
    if (values.headerRows.length === 0 && !credentialsRequired) {
      setHeadersError(undefined)
      update.mutate({ name, url }, { onSuccess: onSaved })
      return
    }
    const parsed = parseHeaderRows(values.headerRows)
    if ('error' in parsed) {
      setHeadersError(parsed.error)
      return
    }
    setHeadersError(undefined)
    update.mutate({ name, url, headers: parsed.headers }, { onSuccess: onSaved })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>Edit MCP server {mcpServer.name}</DialogTitle>
        <DialogDescription>
          The current credentials aren't shown. Renaming changes the prefix of this server's tools.
        </DialogDescription>
      </DialogHeader>
      <McpServerFields
        values={values}
        onChange={setValues}
        error={update.error}
        headersError={headersError}
        tokenRequired={credentialsRequired}
        tokenDescription={tokenDescription(urlChanged, authChanged)}
        headersDescription={headersDescription(mcpServer, urlChanged, authChanged)}
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
