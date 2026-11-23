# Argus SRE: Frontend

This is the web app of **Argus SRE**, a platform that investigates Kubernetes incidents automatically. When an alert fires, an AI agent gathers telemetry from the cluster and writes a root cause analysis that engineers can then discuss in a chat.

This app is where teams set Argus up and work their incidents: they connect clusters and alert sources, then read the reports and chat with the agent.

## Where it fits

```
Browser ──▶ Frontend ──REST API──▶ Backend ──▶ Agent service ──▶ Gateway ◀── Runner (in cluster)
               │
               └── Clerk (sign-in, organizations)
```

| Repo | Role |
| --- | --- |
| **argus-sre-frontend** | Web app |
| [argus-sre-backend](https://github.com/argussre-thesis/argus-sre-backend) | API, webhooks, database |
| [argus-sre-agent-service](https://github.com/argussre-thesis/argus-sre-agent-service) | AI investigations and chat |
| [argus-sre-gateway](https://github.com/argussre-thesis/argus-sre-gateway) | Accepts runner connections |
| [argus-sre-runner](https://github.com/argussre-thesis/argus-sre-runner) | Runs inside the customer's cluster |

## What's in it

**Public pages:** landing page, contact, privacy and terms. Sign-in and sign-up are handled by Clerk.

**The app** (`/app`, signed in, per organization)
- **Overview:** a setup checklist that walks a new team through connecting everything.
- **Incidents:** a filterable, paged list. Each incident shows its alerts, its investigations, the RCA report, and a chat with the agent.
- **Clusters:** add a cluster and get the commands to install the runner in it, including token rotation.
- **Alert sources:** create webhook endpoints for Grafana or Alertmanager, each with its own token.
- **Integrations:** MCP servers that give the agent extra tools (for example Grafana).
- **Settings:** organization settings, members, invitations and Slack.

## Tech stack

React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS with shadcn/ui, Clerk. Deployed on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

The app needs the [backend](https://github.com/argussre-thesis/argus-sre-backend) running at `VITE_API_URL`, and a Clerk publishable key.

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.
