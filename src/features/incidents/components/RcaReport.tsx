import Markdown, { type Components } from 'react-markdown'

type Props = {
  report: string
}

// Only children are passed on: react-markdown also hands each component its AST `node`,
// which must not reach the DOM. Report headings sit under the page's h2, so they start at h3.
const components: Components = {
  h1: ({ children }) => <h3 className="font-semibold">{children}</h3>,
  h2: ({ children }) => <h3 className="font-semibold">{children}</h3>,
  h3: ({ children }) => <h4 className="font-medium">{children}</h4>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 pl-4 text-muted-foreground">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-4 hover:text-primary"
    >
      {children}
    </a>
  ),
}

export function RcaReport({ report }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border p-4 text-sm leading-relaxed wrap-break-word">
      <Markdown components={components}>{report}</Markdown>
    </article>
  )
}
