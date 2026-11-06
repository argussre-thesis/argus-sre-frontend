export type SlackConnection = {
  connected: true
  teamName: string
  channelName: string
  installedAt: string
}

export type SlackStatus = { connected: false } | SlackConnection
