import datadogLogo from '@/assets/logos/datadog.svg'
import githubLogo from '@/assets/logos/github.svg'
import grafanaLogo from '@/assets/logos/grafana.svg'
import kubernetesLogo from '@/assets/logos/kubernetes.svg'
import slackLogo from '@/assets/logos/slack.svg'

type Integration = {
  name: string
  logo: string
  logoClass?: string
  text: string
}

export const integrations: Integration[] = [
  { name: 'Kubernetes', logo: kubernetesLogo, text: 'Pods, logs, events, deployments and nodes, read through the runner.' },
  { name: 'Grafana and Alertmanager', logo: grafanaLogo, text: 'Alerts arrive by webhook. Grafana data sources can be queried during an investigation.' },
  // GitHub's logo is near-black, so it would disappear on the dark theme.
  { name: 'GitHub', logo: githubLogo, logoClass: 'dark:invert', text: 'Recent commits and pull requests, to match a failure to a change.' },
  { name: 'Datadog', logo: datadogLogo, text: "Connected through Datadog's MCP server." },
  { name: 'Slack', logo: slackLogo, text: 'Reports posted to your channel, with follow-up questions in the thread.' },
]
