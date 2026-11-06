export type OrganizationSettings = {
  incidentGroupingWindowMinutes: number
  autoInvestigateEnabled: boolean
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
