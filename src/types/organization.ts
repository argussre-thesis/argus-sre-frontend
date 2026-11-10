export type AgentLevel = 'low' | 'medium' | 'high'

export type OrganizationSettings = {
  incidentGroupingWindowMinutes: number
  autoInvestigateEnabled: boolean
  investigationLevel: AgentLevel
  conversationLevel: AgentLevel
  webSearchToolEnabled: boolean
}

export type Organization = OrganizationSettings & {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  createdAt: string
  memberCount: number
  currentUserRole: string
}
