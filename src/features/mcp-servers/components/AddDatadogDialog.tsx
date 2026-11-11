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
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { McpServerHeadersField } from '@/features/mcp-servers/components/McpServerHeadersField'
import { McpServerNameField } from '@/features/mcp-servers/components/McpServerNameField'
import { useCreateMcpServer } from '@/features/mcp-servers/hooks'
import { datadogMcpSites } from '@/features/mcp-servers/integrations'
import { mcpServerErrors } from '@/features/mcp-servers/mcpServerErrors'
import { parseHeaderRows } from '@/features/mcp-servers/mcpServerHeaders'

const initialValues = {
  name: 'datadog',
  url: datadogMcpSites[0].url,
  headerRows: [{ name: 'Authorization', value: 'Bearer ' }],
}

type Props = {
  trigger: ReactNode
}

export function AddDatadogDialog({ trigger }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [headersError, setHeadersError] = useState<string>()
  const create = useCreateMcpServer()
  const { nameError, urlError, tokenError, otherError } = mcpServerErrors(create.error)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setValues(initialValues)
      setHeadersError(undefined)
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The prefilled value on its own would pass the header rules and save a server that can't connect.
    if (values.headerRows.some((row) => /^bearer$/i.test(row.value.trim()))) {
      setHeadersError('Paste your access token after "Bearer ".')
      return
    }
    const parsed = parseHeaderRows(values.headerRows)
    if ('error' in parsed) {
      setHeadersError(parsed.error)
      return
    }
    setHeadersError(undefined)
    create.mutate(
      { name: values.name, url: values.url, headers: parsed.headers },
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
            <DialogTitle>Add Datadog</DialogTitle>
            <DialogDescription>
              Let the agent use Datadog's MCP server. An admin must enable MCP Access in your
              Datadog organization settings.
            </DialogDescription>
          </DialogHeader>
          <McpServerNameField
            value={values.name}
            onChange={(name) => setValues({ ...values, name })}
            error={nameError}
          />
          <Field>
            <FieldLabel htmlFor="datadog-site">Datadog site</FieldLabel>
            <Select value={values.url} onValueChange={(url) => setValues({ ...values, url })}>
              <SelectTrigger id="datadog-site" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datadogMcpSites.map((site) => (
                  <SelectItem key={site.url} value={site.url}>
                    {site.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>The domain you use to open Datadog.</FieldDescription>
          </Field>
          <McpServerHeadersField
            rows={values.headerRows}
            onChange={(headerRows) => setValues({ ...values, headerRows })}
            error={headersError ?? tokenError}
            description="Paste a service or personal access token after Bearer, with only the access you want the agent to have. Or replace this with two headers, DD_API_KEY and DD_APPLICATION_KEY."
            showValues
          />
          <FieldError>{urlError ?? otherError}</FieldError>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Adding…' : 'Add Datadog'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
