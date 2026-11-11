import { ContactForm } from '@/features/contact/components/ContactForm'

export function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="text-muted-foreground">
          Ask a question, report a problem, or make a request about your data.
        </p>
      </header>
      <ContactForm />
    </div>
  )
}
