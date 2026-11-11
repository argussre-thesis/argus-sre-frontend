import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { McpServerHeadersField } from '@/features/mcp-servers/components/McpServerHeadersField'
import { McpServerNameField } from '@/features/mcp-servers/components/McpServerNameField'
import { McpServerTokenField } from '@/features/mcp-servers/components/McpServerTokenField'
import { mcpServerErrors } from '@/features/mcp-servers/mcpServerErrors'
import type { McpServerFormValues } from '@/features/mcp-servers/mcpServerHeaders'

type Props = {
  values: McpServerFormValues
  onChange: (values: McpServerFormValues) => void
  error: Error | null
  headersError: string | undefined
  tokenRequired: boolean
  tokenDescription: string
  headersDescription: string
}

export function McpServerFields({
  values,
  onChange,
  error,
  headersError,
  tokenRequired,
  tokenDescription,
  headersDescription,
}: Props) {
  const { nameError, urlError, tokenError, otherError } = mcpServerErrors(error)

  return (
    <>
      <McpServerNameField
        value={values.name}
        onChange={(name) => onChange({ ...values, name })}
        error={nameError}
      />
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
        <FieldDescription>
          The server's https address, reachable from the internet. Only servers using Streamable
          HTTP are supported, not SSE or stdio.
        </FieldDescription>
        <FieldError>{urlError}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="mcp-server-auth">Authentication</FieldLabel>
        <Select
          value={values.authMode}
          onValueChange={(authMode: McpServerFormValues['authMode']) =>
            onChange({ ...values, authMode })
          }
        >
          <SelectTrigger id="mcp-server-auth" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="token">Bearer token</SelectItem>
            <SelectItem value="headers">Custom headers</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {values.authMode === 'token' ? (
        <McpServerTokenField
          value={values.token}
          onChange={(token) => onChange({ ...values, token })}
          error={tokenError}
          required={tokenRequired}
          description={tokenDescription}
        />
      ) : (
        <McpServerHeadersField
          rows={values.headerRows}
          onChange={(headerRows) => onChange({ ...values, headerRows })}
          error={headersError ?? tokenError}
          description={headersDescription}
        />
      )}
      <FieldError>{otherError}</FieldError>
    </>
  )
}
