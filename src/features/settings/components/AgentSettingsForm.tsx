import { useState, type FormEvent } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AgentLevelField } from '@/features/settings/components/AgentLevelField'
import { SettingsSaveRow } from '@/features/settings/components/SettingsSaveRow'
import { useUpdateOrganizationSettings } from '@/features/settings/hooks'
import type { Organization } from '@/types/organization'

type Props = {
  org: Organization
}

export function AgentSettingsForm({ org }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [investigationLevel, setInvestigationLevel] = useState(org.investigationLevel)
  const [conversationLevel, setConversationLevel] = useState(org.conversationLevel)
  const [webSearch, setWebSearch] = useState(org.webSearchToolEnabled)
  const [maxModelCalls, setMaxModelCalls] = useState(String(org.maxModelCalls))
  const update = useUpdateOrganizationSettings()
  const changed =
    investigationLevel !== org.investigationLevel ||
    conversationLevel !== org.conversationLevel ||
    webSearch !== org.webSearchToolEnabled ||
    Number(maxModelCalls) !== org.maxModelCalls

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // PATCH …/settings requires every field, so the incident settings go along as saved.
    update.mutate({
      incidentGroupingWindowMinutes: org.incidentGroupingWindowMinutes,
      autoInvestigateEnabled: org.autoInvestigateEnabled,
      investigationLevel,
      conversationLevel,
      webSearchToolEnabled: webSearch,
      maxModelCalls: Number(maxModelCalls),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <AgentLevelField
        id="investigation-level"
        label="Investigation effort"
        description="How hard the agent works on an investigation. Higher is slower and costs more."
        value={investigationLevel}
        onChange={setInvestigationLevel}
        disabled={!isAdmin}
      />
      <AgentLevelField
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
      <Field>
        <FieldLabel htmlFor="max-model-calls">Max model calls</FieldLabel>
        <Input
          id="max-model-calls"
          type="number"
          value={maxModelCalls}
          onChange={(event) => setMaxModelCalls(event.target.value)}
          required
          min={5}
          max={100}
          step={1}
          disabled={!isAdmin}
        />
        <FieldDescription>
          How many model calls one investigation or conversation turn may make, the final answer
          included. The agent is told this budget, and a run that reaches it fails.
        </FieldDescription>
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
