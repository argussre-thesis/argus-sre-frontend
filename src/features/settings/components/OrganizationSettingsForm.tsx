import { useState, type FormEvent } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useUpdateOrganizationSettings } from '@/features/settings/hooks'
import type { Organization } from '@/types/organization'

type Props = {
  org: Organization
}

export function OrganizationSettingsForm({ org }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [minutes, setMinutes] = useState(String(org.incidentGroupingWindowMinutes))
  const [autoInvestigate, setAutoInvestigate] = useState(org.autoInvestigateEnabled)
  const update = useUpdateOrganizationSettings()
  const changed =
    Number(minutes) !== org.incidentGroupingWindowMinutes ||
    autoInvestigate !== org.autoInvestigateEnabled

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate({
      incidentGroupingWindowMinutes: Number(minutes),
      autoInvestigateEnabled: autoInvestigate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="grouping-window">Incident grouping window (minutes)</FieldLabel>
        {/* The backend's rule: a whole number from 0 to 1440. */}
        <Input
          id="grouping-window"
          type="number"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
          required
          min={0}
          max={1440}
          step={1}
          disabled={!isAdmin}
        />
        <FieldDescription>
          A new firing alert joins an open incident on the same cluster that was created within this
          many minutes. With 0, only alerts in the same notification are grouped.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="auto-investigate">Investigate automatically</FieldLabel>
          <FieldDescription>
            A new firing alert starts an investigation. Incidents are always created, and you can
            still start an investigation by hand.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="auto-investigate"
          checked={autoInvestigate}
          onCheckedChange={setAutoInvestigate}
          disabled={!isAdmin}
        />
      </Field>
      <FieldError>{update.error?.message}</FieldError>
      <div className="flex items-center gap-4">
        {isAdmin ? (
          <Button type="submit" disabled={!changed || update.isPending}>
            {update.isPending ? 'Saving…' : 'Save'}
          </Button>
        ) : (
          <AdminRequiredDialog trigger={<Button>Save</Button>} />
        )}
        {update.isSuccess && !changed && (
          <p role="status" className="text-sm text-muted-foreground">
            Saved
          </p>
        )}
      </div>
    </form>
  )
}
