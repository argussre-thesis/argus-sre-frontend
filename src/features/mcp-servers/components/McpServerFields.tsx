import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { McpServerNameField } from '@/features/mcp-servers/components/McpServerNameField'
import { McpServerTokenField } from '@/features/mcp-servers/components/McpServerTokenField'
import { mcpServerErrors } from '@/features/mcp-servers/mcpServerErrors'
import type { CreateMcpServerInput } from '@/types/mcp-server'

type Props = {
  values: CreateMcpServerInput
  onChange: (values: CreateMcpServerInput) => void
  error: Error | null
  tokenRequired: boolean
  tokenDescription: string
}

export function McpServerFields({
  values,
  onChange,
  error,
  tokenRequired,
  tokenDescription,
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
        <FieldDescription>The server's https address, reachable from the internet.</FieldDescription>
        <FieldError>{urlError}</FieldError>
      </Field>
      <McpServerTokenField
        value={values.token}
        onChange={(token) => onChange({ ...values, token })}
        error={tokenError}
        required={tokenRequired}
        description={tokenDescription}
      />
      <FieldError>{otherError}</FieldError>
    </>
  )
}
