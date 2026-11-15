import { Hash } from 'lucide-react'
import { SlackMessage } from '@/features/landing/components/SlackMessage'

const points = [
  'One message per incident, posted when the report is ready.',
  'The evidence goes in the thread, so the channel stays readable.',
  'Mention @argus in the thread to ask a follow-up. It answers with the incident in hand and the live cluster to check.',
]

export function SlackPreview() {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">The report comes to your Slack channel</h2>
        <p className="max-w-prose text-muted-foreground">
          Nobody keeps another dashboard open. Connect Slack once, and every report is posted where your team
          already talks.
        </p>
        <ul className="flex flex-col gap-3">
          {points.map((point) => (
            <li key={point} className="border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <figure className="flex flex-col gap-2">
        <div className="flex flex-col rounded-lg border bg-card text-sm">
          <p className="flex items-center gap-1 border-b px-4 py-3 font-medium">
            <Hash className="size-4 text-muted-foreground" aria-hidden />
            incidents
          </p>
          <div className="flex flex-col gap-4 p-4">
            <SlackMessage author="Argus" time="14:09" app>
              <p>
                <span className="font-semibold underline underline-offset-4">HighErrorRate on checkout</span>
                <br />
                <span className="text-muted-foreground">prod-eu-1, 3 alerts</span>
              </p>
              <p>
                <span className="font-semibold">Root cause</span>
                <br />
                The 14:02 rollout of checkout lowered its memory limit to 128Mi. Every new pod is killed on
                startup.
              </p>
              <p>
                <span className="font-semibold">Suggested fix</span>
                <br />
                Roll back the deployment, or raise the memory limit to its previous value.
              </p>
            </SlackMessage>
            <div className="ml-4 flex flex-col gap-4 border-l pl-6">
              <SlackMessage author="Maria" time="14:11">
                <p>
                  <span className="text-primary">@argus</span> did anything change in the checkout repo before
                  14:02?
                </p>
              </SlackMessage>
              <SlackMessage author="Argus" time="14:12" app>
                <p>
                  Yes. A pull request merged at 13:58 changed the memory limit of checkout from 512Mi to 128Mi.
                  Nothing else was merged in the hour before the first alert.
                </p>
              </SlackMessage>
            </div>
          </div>
        </div>
        <figcaption className="text-xs text-muted-foreground">An example thread, not a real incident.</figcaption>
      </figure>
    </section>
  )
}
