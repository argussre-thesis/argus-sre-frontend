import { Plug } from 'lucide-react'
import githubLogo from '@/assets/logos/github.svg'
import grafanaLogo from '@/assets/logos/grafana.svg'
import type { IntegrationKind } from '@/features/mcp-servers/integrations'

type Props = {
  kind: IntegrationKind
}

export function IntegrationIcon({ kind }: Props) {
  if (kind === 'grafana') return <img src={grafanaLogo} alt="" className="size-5" />
  // GitHub's logo is near-black, so it would disappear on the dark theme.
  if (kind === 'github') return <img src={githubLogo} alt="" className="size-5 dark:invert" />
  return <Plug className="size-5" aria-hidden />
}
