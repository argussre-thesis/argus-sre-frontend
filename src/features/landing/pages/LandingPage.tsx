import { useAuth } from '@clerk/react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { IncidentPreview } from '@/features/landing/components/IncidentPreview'
import { LandingFacts } from '@/features/landing/components/LandingFacts'
import { LandingSteps } from '@/features/landing/components/LandingSteps'

export function LandingPage() {
  const { isSignedIn } = useAuth()
  const cta = isSignedIn
    ? { to: '/app', label: 'Open the app' }
    : { to: '/sign-up', label: 'Create an account' }

  return (
    <div className="flex flex-col gap-24">
      <section className="grid items-start gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6 lg:pt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            An SRE agent that investigates your Kubernetes alerts.
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
            Argus groups alerts from Grafana and Alertmanager into incidents, inspects the live cluster
            through a read-only runner, and writes a root cause report that shows the checks behind it.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link to={cta.to}>{cta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>
        <IncidentPreview />
      </section>

      <LandingSteps />
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
