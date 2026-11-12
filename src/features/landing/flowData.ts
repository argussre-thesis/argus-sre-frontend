import { BellRing, Bot, Boxes, FileText, Plug, Waypoints, Webhook, type LucideIcon } from 'lucide-react'

// Geometry is in the SVG's own units (viewBox 0 0 760 540), not CSS pixels.

export type FlowNode = {
  id: string
  kind: 'zone' | 'box' | 'chip'
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  icon?: LucideIcon
  // The node is dimmed until this scene.
  from: number
}

export type FlowLink = {
  id: string
  d: string
  tone?: 'alert'
}

export type FlowScene = {
  title: string
  text: string
  focus: string[]
  // Drawn one after the other, in this order.
  links: string[]
}

export const nodes: FlowNode[] = [
  { id: 'yours', kind: 'zone', x: 8, y: 8, w: 250, h: 524, label: 'Your infrastructure', from: 0 },
  { id: 'argus', kind: 'zone', x: 290, y: 96, w: 462, h: 436, label: 'Argus', from: 0 },
  { id: 'clusterA', kind: 'box', x: 22, y: 40, w: 222, h: 130, label: 'prod-eu-1', icon: Boxes, from: 0 },
  { id: 'clusterB', kind: 'box', x: 22, y: 184, w: 222, h: 130, label: 'prod-us-1', icon: Boxes, from: 0 },
  { id: 'runnerA', kind: 'chip', x: 146, y: 116, w: 86, h: 44, label: 'Runner', sub: 'read-only', from: 0 },
  { id: 'runnerB', kind: 'chip', x: 146, y: 260, w: 86, h: 44, label: 'Runner', sub: 'read-only', from: 0 },
  { id: 'alerting', kind: 'box', x: 22, y: 346, w: 222, h: 172, label: 'Grafana or Alertmanager', icon: BellRing, from: 1 },
  { id: 'gateway', kind: 'box', x: 306, y: 128, w: 200, h: 56, label: 'Gateway', sub: 'Routes tool calls', icon: Waypoints, from: 0 },
  { id: 'backend', kind: 'box', x: 306, y: 400, w: 200, h: 116, label: 'Backend', sub: 'Your alert webhook', icon: Webhook, from: 1 },
  { id: 'agent', kind: 'box', x: 556, y: 216, w: 180, h: 100, label: 'Agent', sub: 'Investigates the incident', icon: Bot, from: 2 },
  { id: 'tools', kind: 'box', x: 556, y: 8, w: 180, h: 64, label: 'Grafana, GitHub, Datadog', sub: 'MCP servers you connect', icon: Plug, from: 3 },
  { id: 'report', kind: 'box', x: 556, y: 400, w: 180, h: 116, label: 'Root cause report', sub: 'In the app and in Slack', icon: FileText, from: 4 },
]

export const links: FlowLink[] = [
  { id: 'runnerA-gateway', d: 'M232 138 C 270 138, 270 148, 306 148' },
  { id: 'runnerB-gateway', d: 'M232 282 C 275 282, 265 166, 306 166' },
  { id: 'clusterA-alerting', d: 'M22 105 H14 V430 H22', tone: 'alert' },
  { id: 'clusterB-alerting', d: 'M100 314 V346' },
  { id: 'alerting-backend', d: 'M244 458 H306', tone: 'alert' },
  { id: 'backend-agent', d: 'M506 420 C 550 420, 590 370, 590 316' },
  { id: 'agent-gateway', d: 'M556 250 C 526 250, 536 156, 506 156' },
  { id: 'agent-tools', d: 'M646 216 V72' },
  { id: 'agent-report', d: 'M680 316 V400' },
]

export const scenes: FlowScene[] = [
  {
    title: 'A runner in each cluster',
    text: 'Argus starts with the clusters you already run. A read-only runner in each one opens the connection itself, outbound, to the Argus gateway. No inbound ports.',
    focus: ['runnerA', 'runnerB', 'gateway'],
    links: ['runnerA-gateway', 'runnerB-gateway'],
  },
  {
    title: 'Alerts become one incident',
    text: 'Something breaks, and Grafana or Alertmanager fires as it does today. The alerts go to your Argus webhook, where repeats are dropped and related alerts are grouped into a single incident.',
    focus: ['alerting', 'backend'],
    links: ['clusterA-alerting', 'alerting-backend'],
  },
  {
    title: 'The agent asks the cluster',
    text: 'The agent gets the incident and calls tools such as list_problem_pods. The gateway routes each call to the runner in the right cluster, which answers with a short summary, not the raw objects.',
    focus: ['agent', 'gateway', 'runnerA'],
    links: ['backend-agent', 'agent-gateway', 'runnerA-gateway'],
  },
  {
    title: 'It checks your other tools',
    text: 'Through the MCP servers you connect, the agent queries Grafana, reads recent GitHub changes, or asks Datadog.',
    focus: ['agent', 'tools'],
    links: ['agent-tools'],
  },
  {
    title: 'You get the report',
    text: 'The root cause and the evidence behind it appear in the app and in your Slack channel.',
    focus: ['agent', 'report'],
    links: ['agent-report'],
  },
]

// Element ids of the steps in FlowSteps, read back by FlowAnimation to tell which one is in view.
export const stepIds = scenes.map((_, index) => `flow-step-${index}`)
