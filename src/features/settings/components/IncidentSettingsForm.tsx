import { useState, type FormEvent } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { SettingsSaveRow } from '@/features/settings/components/SettingsSaveRow'
import { useUpdateOrganizationSettings } from '@/features/settings/hooks'
import type { Organization } from '@/types/organization'

type Props = {
  org: Organization
}

export function IncidentSettingsForm({ org }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [minutes, setMinutes] = useState(String(org.incidentGroupingWindowMinutes))
  const [autoInvestigate, setAutoInvestigate] = useState(org.autoInvestigateEnabled)
  const update = useUpdateOrganizationSettings()
  const changed =
    Number(minutes) !== org.incidentGroupingWindowMinutes ||
    autoInvestigate !== org.autoInvestigateEnabled

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // PATCH …/settings requires every field, so the agent settings go along as saved.
    update.mutate({
      incidentGroupingWindowMinutes: Number(minutes),
      autoInvestigateEnabled: autoInvestigate,
      investigationLevel: org.investigationLevel,
      conversationLevel: org.conversationLevel,
      webSearchToolEnabled: org.webSearchToolEnabled,
      maxModelCalls: org.maxModelCalls,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
      <SettingsSaveRow
        changed={changed}
        pending={update.isPending}
        saved={update.isSuccess}
        error={update.error}
      />
    </form>
  )
}
