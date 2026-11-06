import { RelativeTime } from '@/components/common/RelativeTime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IntegrationIcon } from '@/features/mcp-servers/components/IntegrationIcon'
import { McpServerActions } from '@/features/mcp-servers/components/McpServerActions'
import { integrationKind } from '@/features/mcp-servers/integrations'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServers: McpServer[]
}

export function McpServerTable({ mcpServers }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MCP server</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Credentials</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mcpServers.map((server) => (
            <TableRow key={server.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <IntegrationIcon kind={integrationKind(server.url)} />
                  {server.name}
                </div>
              </TableCell>
              <TableCell className="max-w-96 truncate text-muted-foreground" title={server.url}>
                {server.url}
              </TableCell>
              <TableCell className="max-w-48 truncate text-muted-foreground">
                {server.headerNames.join(', ') || 'Bearer token'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <RelativeTime iso={server.createdAt} />
              </TableCell>
              <TableCell className="text-right">
                <McpServerActions mcpServer={server} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
