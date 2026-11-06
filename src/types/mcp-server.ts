export type McpServer = {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}

export type CreateMcpServerInput = {
  name: string
  url: string
  token: string
}

// Without a token the stored one is kept. Changing the URL requires one.
export type UpdateMcpServerInput = Partial<CreateMcpServerInput>
