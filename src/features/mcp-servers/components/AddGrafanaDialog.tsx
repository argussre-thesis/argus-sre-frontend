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
import { Input } from '@/components/ui/input'
import { McpServerNameField } from '@/features/mcp-servers/components/McpServerNameField'
import { McpServerTokenField } from '@/features/mcp-servers/components/McpServerTokenField'
import { useCreateMcpServer } from '@/features/mcp-servers/hooks'
import { grafanaMcpUrl, parseGrafanaStack } from '@/features/mcp-servers/integrations'
import { mcpServerErrors } from '@/features/mcp-servers/mcpServerErrors'

const initialValues = { name: 'grafana', grafanaUrl: '', token: '' }

type Props = {
  trigger: ReactNode
}

export function AddGrafanaDialog({ trigger }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [addressError, setAddressError] = useState<string>()
  const create = useCreateMcpServer()
  const { nameError, urlError, tokenError, otherError } = mcpServerErrors(create.error)
  const grafanaUrlError = addressError ?? urlError

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setValues(initialValues)
      setAddressError(undefined)
      create.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const stack = parseGrafanaStack(values.grafanaUrl)
    if (!stack) {
      setAddressError(
        'Enter a Grafana Cloud address like https://your-stack.grafana.net. For any other Grafana, use Custom MCP.',
      )
      return
    }
    const url = grafanaMcpUrl(stack)
    if (!url) {
      setAddressError("Grafana can't be added here: VITE_GRAFANA_MCP_HOST is not set.")
      return
    }
    setAddressError(undefined)
    create.mutate(
      { name: values.name, url, token: values.token.trim() },
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
            <DialogTitle>Add Grafana</DialogTitle>
            <DialogDescription>
              Let the agent query metrics and logs from your Grafana Cloud stack.
            </DialogDescription>
          </DialogHeader>
          <McpServerNameField
            value={values.name}
            onChange={(name) => setValues({ ...values, name })}
            error={nameError}
          />
          <Field data-invalid={Boolean(grafanaUrlError) || undefined}>
            <FieldLabel htmlFor="grafana-url">Grafana URL</FieldLabel>
            <Input
              id="grafana-url"
              value={values.grafanaUrl}
              onChange={(event) => setValues({ ...values, grafanaUrl: event.target.value })}
              required
              maxLength={2048}
              placeholder="https://your-stack.grafana.net"
              autoComplete="off"
              aria-invalid={Boolean(grafanaUrlError) || undefined}
            />
            <FieldDescription>Any page of your Grafana Cloud stack works.</FieldDescription>
            <FieldError>{grafanaUrlError}</FieldError>
          </Field>
          <McpServerTokenField
            value={values.token}
            onChange={(token) => setValues({ ...values, token })}
            error={tokenError}
            required
            description="A Grafana service account token with read-only access, since investigations start on their own from alert text."
          />
          <FieldError>{otherError}</FieldError>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Adding…' : 'Add Grafana'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
