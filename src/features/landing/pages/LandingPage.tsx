import { useAuth } from '@clerk/react'
import { CirclePlay } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { DemoDialog } from '@/features/landing/components/DemoDialog'
import { LandingFacts } from '@/features/landing/components/LandingFacts'
import { FlowAnimation } from '@/features/landing/components/FlowAnimation'
import { LoopVideo } from '@/features/landing/components/LoopVideo'
import { SafetyCards } from '@/features/landing/components/SafetyCards'
import { SetupVideo } from '@/features/landing/components/SetupVideo'
import { integrations } from '@/features/landing/integrations'
import { cn } from '@/lib/utils'

export function LandingPage() {
  const { isSignedIn } = useAuth()
  const cta = isSignedIn
    ? { to: '/app', label: 'Open the app' }
    : { to: '/sign-up', label: 'Create an account' }

  return (
    <div className="flex flex-col gap-24">
      <section className="flex flex-col items-center gap-6 text-center lg:py-8">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          An SRE agent that investigates your Kubernetes alerts.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Argus groups alerts from Grafana and Alertmanager into incidents, inspects the live cluster
          through a read-only runner, and writes a root cause report that shows the checks behind it.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild size="lg">
            <Link to={cta.to}>{cta.label}</Link>
          </Button>
          <div className="group relative isolate">
            <span
              aria-hidden
              className="absolute -inset-1 -z-10 animate-pulse rounded-lg bg-primary/50 blur-md group-hover:animate-none group-hover:bg-primary/80 motion-reduce:animate-none"
            />
            <DemoDialog
              video="demo"
              title="Argus demo"
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary hover:bg-background dark:border-primary dark:bg-background dark:hover:bg-background"
                >
                  <CirclePlay aria-hidden />
                  Watch the demo
                </Button>
              }
            />
          </div>
        </div>
        <ul
          aria-label="Works with"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-sm text-muted-foreground"
        >
          {integrations.map((item) => (
            <li key={item.name} className="flex items-center gap-2">
              <img src={item.logo} alt="" className={cn('size-5', item.logoClass)} />
              {item.name}
            </li>
          ))}
        </ul>
      </section>

      <LoopVideo />
      <FlowAnimation />
      <SetupVideo />
      <SafetyCards />
      <LandingFacts />

      <section className="flex flex-col items-start gap-4 border-t pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Let the next alert investigate itself</h2>
        <p className="max-w-prose text-muted-foreground">
          Create an organization, register a cluster and add your alert webhook.
        </p>
        <Button asChild size="lg">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      </section>
    </div>
  )
}
