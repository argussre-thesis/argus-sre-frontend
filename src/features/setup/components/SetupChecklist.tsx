import { ErrorState } from '@/components/common/ErrorState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAlertSources } from '@/features/alert-sources/hooks'
import { useClusters } from '@/features/clusters/hooks'
import { useSlackStatus } from '@/features/settings/hooks'
import { SetupStep } from '@/features/setup/components/SetupStep'

export function SetupChecklist() {
  const clusters = useClusters()
  const alertSources = useAlertSources()
  const slack = useSlackStatus()

  const error = clusters.error ?? alertSources.error ?? slack.error
  if (error) {
    return (
      <ErrorState
        title="Couldn't load the setup checklist"
        error={error}
        onRetry={() => {
          for (const query of [clusters, alertSources, slack]) {
            if (query.isError) void query.refetch()
          }
        }}
      />
    )
  }
  // No skeleton: most organizations are set up, and a placeholder that then vanishes would make Overview jump.
  if (!clusters.data || !alertSources.data || !slack.data) return null

  const steps = [
    {
      title: 'Register a cluster',
      description: 'Give Argus a name for each Kubernetes cluster you want investigated.',
      done: clusters.data.length > 0,
      action: 'Add a cluster',
      to: '/app/clusters',
    },
    {
      title: 'Install the runner',
      description: "Deploy the runner in your cluster with its token. It lets the agent read the cluster's state.",
      done: clusters.data.some((cluster) => cluster.lastConnectedAt !== null),
      action: 'Open clusters',
      to: '/app/clusters',
    },
    {
      title: 'Add an alert source',
      description: 'Point your alerting tool at a webhook so firing alerts open incidents.',
      done: alertSources.data.length > 0,
      action: 'Add an alert source',
      to: '/app/alert-sources',
    },
    {
      title: 'Connect Slack',
      description: 'Post investigation reports to a channel and chat with the agent there.',
      done: slack.data.connected,
      action: 'Open settings',
      to: '/app/settings#slack',
    },
  ]
  const doneCount = steps.filter((step) => step.done).length
  if (doneCount === steps.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up Argus</CardTitle>
        <CardDescription>
          {doneCount} of {steps.length} done. This list goes away once every step is done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y divide-border">
          {steps.map((step) => (
            <SetupStep key={step.title} {...step} />
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
