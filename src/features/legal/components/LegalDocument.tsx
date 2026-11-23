import { Link } from 'react-router'
import { contactEnabled } from '@/lib/features'

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

type Props = {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export function LegalDocument({ title, updated, intro, sections }: Props) {
  return (
    <article className="flex max-w-prose flex-col gap-8 leading-relaxed">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Last updated {updated}</p>
      </header>
      <p>{intro}</p>
      {sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {section.items && (
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {contactEnabled && (
        <p>
          Questions?{' '}
          <Link to="/contact" className="underline underline-offset-4">
            Contact us
          </Link>
          .
        </p>
      )}
    </article>
  )
}
