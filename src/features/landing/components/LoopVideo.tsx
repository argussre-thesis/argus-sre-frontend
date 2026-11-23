import { CirclePlay } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoDialog } from '@/features/landing/components/DemoDialog'

export function LoopVideo() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Alerts go in, a root cause comes out</h2>
        <p className="max-w-prose text-muted-foreground">
          The agent checks the cluster, and the report lands in your Slack channel. Each finding names the check
          it came from.
        </p>
      </div>
      <video
        src="/videos/loop.mp4"
        poster="/videos/loop-poster.jpg"
        aria-label="An incident opens, the agent checks the cluster, and the report and a postmortem are posted in Slack"
        className="aspect-video w-full rounded-lg border"
        autoPlay={!reduceMotion}
        muted
        loop
        controls
        playsInline
      />
      <DemoDialog
        video="setup"
        title="Full Argus demo"
        trigger={
          <Button variant="link" className="self-start px-0">
            <CirclePlay aria-hidden />
            Watch the full demo, from setup to report
          </Button>
        }
      />
    </section>
  )
}
