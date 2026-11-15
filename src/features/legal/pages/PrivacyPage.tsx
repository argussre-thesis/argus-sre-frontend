import { LegalDocument, type LegalSection } from '@/features/legal/components/LegalDocument'

const sections: LegalSection[] = [
  {
    heading: 'What we collect',
    items: [
      'Account details: your name, email address and the organizations you belong to. Sign-in is handled by Clerk, our authentication provider.',
      'Setup details: cluster names, alert source names, the addresses of integrations you add and the credentials you give us for them, and your organization settings.',
      'Alerts: whatever your Grafana or Alertmanager sends to your webhook, including labels, annotations and timestamps.',
      "Cluster data read during an investigation: details of pods, deployments, nodes and events, and container logs. The runner can't read Kubernetes Secrets. Logs can contain personal data if your applications write it there.",
      'Investigations and conversations: the reports, the checks the agent ran and their results, and the messages you send the agent.',
      'Slack: if you connect it, your workspace and channel names, an access token for our Slack app, and the thread messages that mention or reply to Argus.',
      'Technical data: IP addresses and request logs, used for rate limiting, security and debugging.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'We use this data to run the service: to group alerts into incidents, investigate them, show and send you the results, keep the service secure and fix problems.',
      "We don't sell your data, use it for advertising, or train AI models on it.",
    ],
  },
  {
    heading: 'Who receives it',
    paragraphs: ['We share data only with the providers the service runs on:'],
    items: [
      'Clerk, for accounts and sign-in.',
      'Vercel and Oracle Cloud, which host the service, and our database host.',
      'Anthropic and OpenAI, whose models power the agent. Alert and cluster data relevant to an incident is sent to them during an investigation or conversation.',
      'Slack, if you connect it: incident summaries and reports are posted to the channel you choose.',
      'Integrations you add, such as Grafana, GitHub or Datadog: the agent sends them queries using the credentials you gave us.',
    ],
  },
  {
    heading: 'How we protect it',
    items: [
      'Connections to Argus are encrypted in transit.',
      'Runner and webhook tokens are shown once and stored only as a hash.',
      'Slack tokens and integration credentials are encrypted before they are stored.',
      'The runner has read-only access to your cluster and connects outbound, so no inbound ports are opened.',
    ],
  },
  {
    heading: 'Cookies and browser storage',
    paragraphs: [
      'Clerk sets cookies that keep you signed in. We store your light or dark theme choice in your browser. We use no analytics or advertising trackers.',
    ],
  },
  {
    heading: 'How long we keep it',
    paragraphs: [
      'We keep your data while your organization uses Argus. Incidents, alerts and investigations stay until you ask us to delete them or close your organization. Deleting a cluster, alert source or integration removes its tokens and credentials at once.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      `You can ask us for a copy of your data, to correct it, or to delete it, from the contact page. If you are in the European Economic Area or the United Kingdom, you also have the right to object to or restrict how we use your data, and to complain to your data protection authority.`,
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'If we change this policy we will update this page and its date. For a change that matters, we will also tell organization admins by email.',
    ],
  },
]

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      updated="11 November 2026"
      intro={`Argus SRE ("Argus", "we") investigates incidents in your Kubernetes clusters. This page says what data we handle to do that, who else receives it, and what you can ask of us.`}
      sections={sections}
    />
  )
}
