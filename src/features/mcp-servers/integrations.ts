export type IntegrationKind = 'grafana' | 'datadog' | 'github' | 'custom'

export const githubMcpUrl = 'https://api.githubcopilot.com/mcp/'

// Datadog's government sites have no MCP server.
export const datadogMcpSites = [
  { label: 'US1 (datadoghq.com)', url: 'https://mcp.datadoghq.com/v1/mcp' },
  { label: 'US3 (us3.datadoghq.com)', url: 'https://mcp.us3.datadoghq.com/v1/mcp' },
  { label: 'US5 (us5.datadoghq.com)', url: 'https://mcp.us5.datadoghq.com/v1/mcp' },
  { label: 'EU1 (datadoghq.eu)', url: 'https://mcp.datadoghq.eu/v1/mcp' },
  { label: 'AP1 (ap1.datadoghq.com)', url: 'https://mcp.ap1.datadoghq.com/v1/mcp' },
  { label: 'AP2 (ap2.datadoghq.com)', url: 'https://mcp.ap2.datadoghq.com/v1/mcp' },
  { label: 'UK1 (uk1.datadoghq.com)', url: 'https://mcp.uk1.datadoghq.com/v1/mcp' },
]

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
  if (datadogMcpSites.some((site) => new URL(site.url).hostname === hostname)) return 'datadog'
  if (hostname === new URL(githubMcpUrl).hostname) return 'github'
  return 'custom'
}
