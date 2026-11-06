import { ApiError } from '@/lib/api-client'

function messageFor(error: Error | null, code: string) {
  return error instanceof ApiError && error.code === code ? error.message : undefined
}

export function mcpServerErrors(error: Error | null) {
  const nameError = messageFor(error, 'MCP_SERVER_NAME_TAKEN')
  const urlError = messageFor(error, 'INVALID_MCP_URL')
  const tokenError = messageFor(error, 'MCP_TOKEN_REQUIRED')
  const otherError = nameError || urlError || tokenError ? undefined : error?.message
  return { nameError, urlError, tokenError, otherError }
}
