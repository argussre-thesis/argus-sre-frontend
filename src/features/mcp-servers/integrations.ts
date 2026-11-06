export type IntegrationKind = 'grafana' | 'github' | 'custom'

export const githubMcpUrl = 'https://api.githubcopilot.com/mcp/'

const grafanaMcpHost = import.meta.env.VITE_GRAFANA_MCP_HOST

// Accepts any page of a Grafana Cloud stack, with or without https://. Same rule as our Caddy route.
export function parseGrafanaStack(input: string) {
  const trimmed = input.trim()
  const withScheme = trimmed.includes('://') ? trimmed : `https://${trimmed}`
  if (!URL.canParse(withScheme)) return null
  const match = new URL(withScheme).hostname.match(/^([a-z0-9][a-z0-9-]*)\.grafana\.net$/)
  return match ? match[1] : null
}

export function grafanaMcpUrl(stack: string) {
  return grafanaMcpHost ? `https://${grafanaMcpHost}/${stack}/mcp` : null
}

export function integrationKind(url: string): IntegrationKind {
  const { hostname } = new URL(url)
  if (hostname === grafanaMcpHost) return 'grafana'
  if (hostname === new URL(githubMcpUrl).hostname) return 'github'
  return 'custom'
}
