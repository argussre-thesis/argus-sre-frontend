const steps = [
  {
    title: 'Connect a cluster',
    text: 'Register the cluster and install the runner in it. The runner only reads, and it dials out to Argus.',
  },
  {
    title: 'Send your alerts',
    text: 'Point a Grafana contact point or an Alertmanager receiver at your Argus webhook.',
  },
  {
    title: 'Argus investigates',
    text: 'Related alerts become one incident. The agent checks pods, logs, events and recent rollouts in the live cluster.',
  },
  {
    title: 'Read the report',
    text: 'The root cause and its evidence land in the app and in your Slack channel. Ask follow-up questions in the thread.',
  },
]

export function LandingSteps() {
  return (
    <section id="how-it-works" className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">From alert to root cause</h2>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2 border-t pt-4">
            <span className="font-mono text-sm text-muted-foreground">{index + 1}</span>
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
