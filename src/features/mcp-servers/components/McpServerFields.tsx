import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ApiError } from '@/lib/api-client'
import type { CreateMcpServerInput } from '@/types/mcp-server'

type Props = {
  values: CreateMcpServerInput
  onChange: (values: CreateMcpServerInput) => void
  error: Error | null
  tokenRequired: boolean
  tokenDescription: string
}

function messageFor(error: Error | null, code: string) {
  return error instanceof ApiError && error.code === code ? error.message : undefined
}

export function McpServerFields({
  values,
  onChange,
  error,
  tokenRequired,
  tokenDescription,
}: Props) {
  const nameError = messageFor(error, 'MCP_SERVER_NAME_TAKEN')
  const urlError = messageFor(error, 'INVALID_MCP_URL')
  const tokenError = messageFor(error, 'MCP_TOKEN_REQUIRED')
  const otherError = nameError || urlError || tokenError ? undefined : error?.message

  return (
    <>
      <Field data-invalid={Boolean(nameError) || undefined}>
        <FieldLabel htmlFor="mcp-server-name">Name</FieldLabel>
        {/* The backend's rule. The "-" is escaped for the v-flag regex browsers use. */}
        <Input
          id="mcp-server-name"
          value={values.name}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
          required
          maxLength={20}
          pattern="[a-z0-9\-]+"
          placeholder="prod-grafana"
          autoComplete="off"
          aria-invalid={Boolean(nameError) || undefined}
        />
        <FieldDescription>
          Prefixes this server's tools, e.g. prod-grafana_query_prometheus. Up to 20 lowercase
          letters, numbers or hyphens.
        </FieldDescription>
        <FieldError>{nameError}</FieldError>
      </Field>
      <Field data-invalid={Boolean(urlError) || undefined}>
        <FieldLabel htmlFor="mcp-server-url">URL</FieldLabel>
        <Input
          id="mcp-server-url"
          type="url"
          value={values.url}
          onChange={(event) => onChange({ ...values, url: event.target.value })}
          required
          maxLength={2048}
          placeholder="https://mcp.example.com/mcp"
          autoComplete="off"
          aria-invalid={Boolean(urlError) || undefined}
        />
        <FieldDescription>The server's https address, reachable from the internet.</FieldDescription>
        <FieldError>{urlError}</FieldError>
      </Field>
      <Field data-invalid={Boolean(tokenError) || undefined}>
        <FieldLabel htmlFor="mcp-server-token">Token</FieldLabel>
        {/* "new-password" keeps password managers out: a filled-in password would replace the stored token. */}
        <Input
          id="mcp-server-token"
          type="password"
          value={values.token}
          onChange={(event) => onChange({ ...values, token: event.target.value })}
          required={tokenRequired}
          maxLength={8192}
          pattern="\s*\S+\s*"
          title="Enter the token without spaces"
          autoComplete="new-password"
          aria-invalid={Boolean(tokenError) || undefined}
        />
        <FieldDescription>{tokenDescription}</FieldDescription>
        <FieldError>{tokenError}</FieldError>
      </Field>
      <FieldError>{otherError}</FieldError>
    </>
  )
}
