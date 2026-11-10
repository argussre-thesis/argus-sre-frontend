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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useUpdateOrganizationSettings } from '@/features/settings/hooks'
import type { AgentLevel, Organization } from '@/types/organization'

type Props = {
  org: Organization
}

export function OrganizationSettingsForm({ org }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [minutes, setMinutes] = useState(String(org.incidentGroupingWindowMinutes))
  const [autoInvestigate, setAutoInvestigate] = useState(org.autoInvestigateEnabled)
  const [investigationLevel, setInvestigationLevel] = useState(org.investigationLevel)
  const [conversationLevel, setConversationLevel] = useState(org.conversationLevel)
  const [webSearch, setWebSearch] = useState(org.webSearchToolEnabled)
  const update = useUpdateOrganizationSettings()
  const changed =
    Number(minutes) !== org.incidentGroupingWindowMinutes ||
    autoInvestigate !== org.autoInvestigateEnabled ||
    investigationLevel !== org.investigationLevel ||
    conversationLevel !== org.conversationLevel ||
    webSearch !== org.webSearchToolEnabled

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate({
      incidentGroupingWindowMinutes: Number(minutes),
      autoInvestigateEnabled: autoInvestigate,
      investigationLevel,
      conversationLevel,
      webSearchToolEnabled: webSearch,
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
      <LevelField
        id="investigation-level"
        label="Investigation effort"
        description="How hard the agent works on an investigation. Higher is slower and costs more."
        value={investigationLevel}
        onChange={setInvestigationLevel}
        disabled={!isAdmin}
      />
      <LevelField
        id="conversation-level"
        label="Conversation effort"
        description="How hard the agent works when you chat with it, e.g. in Slack."
        value={conversationLevel}
        onChange={setConversationLevel}
        disabled={!isAdmin}
      />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="web-search">Web search</FieldLabel>
          <FieldDescription>
            The agent can search the web in investigations and conversations. Searches are billed
            per use.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="web-search"
          checked={webSearch}
          onCheckedChange={setWebSearch}
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

type LevelFieldProps = {
  id: string
  label: string
  description: string
  value: AgentLevel
  onChange: (value: AgentLevel) => void
  disabled: boolean
}

function LevelField({ id, label, description, value, onChange, disabled }: LevelFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={(v) => onChange(v as AgentLevel)} disabled={disabled}>
        <SelectTrigger id={id} className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}
