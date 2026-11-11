import { useUser } from '@clerk/react'
import { PageHeader } from '@/components/common/PageHeader'
import { ContactForm } from '@/features/contact/components/ContactForm'

export function AppContactPage() {
  const { user } = useUser()

  return (
    <>
      <PageHeader title="Contact" description="Ask a question, report a problem, or make a request about your data." />
      <ContactForm defaultEmail={user?.primaryEmailAddress?.emailAddress} />
    </>
  )
}
