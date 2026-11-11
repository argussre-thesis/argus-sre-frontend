import { Link } from 'react-router'
import kubernetesLogo from '@/assets/logos/kubernetes.svg'
import { AddClusterDialog } from '@/components/common/AddClusterDialog'
import { AddDatadogDialog } from '@/features/mcp-servers/components/AddDatadogDialog'
import { AddGitHubDialog } from '@/features/mcp-servers/components/AddGitHubDialog'
import { AddGrafanaDialog } from '@/features/mcp-servers/components/AddGrafanaDialog'
import { AddMcpServerDialog } from '@/features/mcp-servers/components/AddMcpServerDialog'
import { IntegrationCard } from '@/features/mcp-servers/components/IntegrationCard'
import { IntegrationCardButton } from '@/features/mcp-servers/components/IntegrationCardButton'
import { IntegrationIcon } from '@/features/mcp-servers/components/IntegrationIcon'
import { integrationKind, type IntegrationKind } from '@/features/mcp-servers/integrations'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  clusterCount: number
  mcpServers: McpServer[]
}

export function IntegrationCards({ clusterCount, mcpServers }: Props) {
  function serverCount(kind: IntegrationKind) {
    const count = mcpServers.filter((server) => integrationKind(server.url) === kind).length
    return (
      count > 0 && (
        <span className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'server' : 'servers'}
        </span>
      )
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <IntegrationCard
        icon={<img src={kubernetesLogo} alt="" className="size-7" />}
        dialog={
          <AddClusterDialog trigger={<IntegrationCardButton>Kubernetes</IntegrationCardButton>} />
        }
        description="Let the agent inspect a cluster through a runner you install in it."
        footer={
          clusterCount > 0 && (
            <Link
              to="/app/clusters"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {clusterCount} {clusterCount === 1 ? 'cluster' : 'clusters'}
            </Link>
          )
        }
      />
      <IntegrationCard
        icon={<IntegrationIcon kind="grafana" className="size-7" />}
        dialog={<AddGrafanaDialog trigger={<IntegrationCardButton>Grafana</IntegrationCardButton>} />}
        description="Let the agent query metrics and logs from your Grafana Cloud stack."
        footer={serverCount('grafana')}
      />
      <IntegrationCard
        icon={<IntegrationIcon kind="datadog" className="size-7" />}
        dialog={<AddDatadogDialog trigger={<IntegrationCardButton>Datadog</IntegrationCardButton>} />}
        description="Let the agent use Datadog with the access your token allows."
        footer={serverCount('datadog')}
      />
      <IntegrationCard
        icon={<IntegrationIcon kind="github" className="size-7" />}
        dialog={<AddGitHubDialog trigger={<IntegrationCardButton>GitHub</IntegrationCardButton>} />}
        description="Let the agent use GitHub with the access your token allows."
        footer={serverCount('github')}
      />
      <IntegrationCard
        icon={<IntegrationIcon kind="custom" className="size-7" />}
        dialog={
          <AddMcpServerDialog trigger={<IntegrationCardButton>Custom MCP</IntegrationCardButton>} />
        }
        description="Connect any remote MCP server with a bearer token or custom headers."
        footer={serverCount('custom')}
      />
    </div>
  )
}
