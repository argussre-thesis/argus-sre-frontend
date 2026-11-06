export type McpServer = {
  id: string
  name: string
  url: string
  // Empty for a server using a token. Header values are never returned.
  headerNames: string[]
  createdAt: string
  updatedAt: string
}

// A server has exactly one of a token and headers.
export type CreateMcpServerInput = { name: string; url: string } & (
  | { token: string; headers?: never }
  | { headers: Record<string, string>; token?: never }
)

// Without credentials the stored ones are kept. Changing the URL requires new ones.
export type UpdateMcpServerInput = {
  name?: string
  url?: string
  token?: string
  headers?: Record<string, string>
}
