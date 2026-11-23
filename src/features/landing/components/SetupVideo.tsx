export function SetupVideo() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Set it up in four steps</h2>
        <p className="max-w-prose text-muted-foreground">
          Connect a cluster, add an alert source, connect Grafana and Slack, then see it work on a real alert.
        </p>
      </div>
      <video
        src="/videos/setup.mp4"
        poster="/videos/setup-poster.jpg"
        aria-label="Argus setup walkthrough, ending with an investigated alert"
        className="aspect-video w-full rounded-lg border"
        preload="none"
        muted
        controls
        playsInline
      />
    </section>
  )
}
