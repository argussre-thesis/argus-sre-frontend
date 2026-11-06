import { Plug } from 'lucide-react'
import datadogLogo from '@/assets/logos/datadog.svg'
import githubLogo from '@/assets/logos/github.svg'
import grafanaLogo from '@/assets/logos/grafana.svg'
import type { IntegrationKind } from '@/features/mcp-servers/integrations'
import { cn } from '@/lib/utils'

type Props = {
  kind: IntegrationKind
  className?: string
}

export function IntegrationIcon({ kind, className = 'size-5' }: Props) {
  if (kind === 'grafana') return <img src={grafanaLogo} alt="" className={className} />
  if (kind === 'datadog') return <img src={datadogLogo} alt="" className={className} />
  // GitHub's logo is near-black, so it would disappear on the dark theme.
  if (kind === 'github') {
    return <img src={githubLogo} alt="" className={cn(className, 'dark:invert')} />
  }
  return <Plug className={className} aria-hidden />
}
