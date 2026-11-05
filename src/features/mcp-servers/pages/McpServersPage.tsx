import { Plug } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { AddMcpServerDialog } from '@/features/mcp-servers/components/AddMcpServerDialog'
import { McpServerTable } from '@/features/mcp-servers/components/McpServerTable'
import { useMcpServers } from '@/features/mcp-servers/hooks'

export function McpServersPage() {
  const mcpServers = useMcpServers()

  function renderList() {
    if (mcpServers.isPending) {
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )
    }
    if (mcpServers.isError) {
      return (
        <ErrorState
          title="Couldn't load MCP servers"
          error={mcpServers.error}
          onRetry={() => mcpServers.refetch()}
        />
      )
    }
    if (mcpServers.data.length === 0) {
      return (
        <EmptyState
          icon={Plug}
          title="No MCP servers yet"
          description="Add a remote MCP server to give the agent more tools, for example Grafana queries."
        />
      )
    }
    return <McpServerTable mcpServers={mcpServers.data} />
  }

  return (
    <>
      <PageHeader
        title="MCP servers"
        description="Remote MCP servers whose tools the agent can use."
        actions={<AddMcpServerDialog />}
      />
      {renderList()}
    </>
  )
}
