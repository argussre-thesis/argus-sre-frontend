export type HeaderRow = { name: string; value: string }

export type McpServerFormValues = {
  name: string
  url: string
  authMode: 'token' | 'headers'
  token: string
  headerRows: HeaderRow[]
}

export const emptyHeaderRow: HeaderRow = { name: '', value: '' }
export const maxHeaders = 20

const reservedNames = [
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
  'content-type',
  'accept',
  'mcp-session-id',
  'mcp-protocol-version',
]

// The backend's rules, checked here because its own answer is only "Request body validation failed".
export function parseHeaderRows(
  rows: HeaderRow[],
): { headers: Record<string, string> } | { error: string } {
  if (rows.length === 0) return { error: 'Add at least one header.' }
  if (rows.length > maxHeaders) return { error: `Use at most ${maxHeaders} headers.` }

  const seen = new Set<string>()
  for (const row of rows) {
    const name = row.name.trim()
    const lowerName = name.toLowerCase()
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(name)) {
      return {
        error: 'Header names use up to 100 letters, numbers, hyphens or underscores.',
      }
    }
    if (reservedNames.includes(lowerName)) {
      return { error: `${name} is set automatically and can't be changed.` }
    }
    if (seen.has(lowerName)) return { error: `${name} is listed more than once.` }
    seen.add(lowerName)
    if (!/^[\x20-\x7E]{1,8192}$/.test(row.value.trim())) {
      return { error: `Enter a value for ${name} in plain ASCII on one line.` }
    }
  }

  // fromEntries, because assigning a header named __proto__ would silently drop it.
  return {
    headers: Object.fromEntries(rows.map((row) => [row.name.trim(), row.value.trim()])),
  }
}
