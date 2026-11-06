# Frontend context

> Living document for `argus-sre-frontend/`: decisions, status, and what the backend does or doesn't give us.
> Last updated: 2026-11-05
> How code is written here: `CLAUDE.md`. The whole project: `../CONTEXT.md`. API contract: `../argus-sre-backend/src/Usage.md`. Source for the docs pages: `../USER-GUIDE.md`.

---

## 1. What it is

The web UI of Argus. Users sign in, pick their organization, see incidents, open one to read its alerts and the agent's RCA, start an investigation, and later chat about it. The browser only talks to the backend (`/api/v1`, Clerk session token); never to the agent service or the gateway.

---

## 2. Decisions

| Area | Decision | Why / note |
|---|---|---|
| Framework | Vite 8 + React 19 + TypeScript 7 (`strict` set explicitly), SPA | User, `CLAUDE.md` (2026-10-28). Replaces the Next.js line in `../CONTEXT.md` §3 |
| Routing | React Router 8, data router (`createBrowserRouter`, `RouterProvider` from `react-router/dom`) | |
| Auth | Clerk Core 3: `@clerk/react` (`@clerk/clerk-react` is deprecated) + `@clerk/ui` passed as `ui` (bundled, not CDN) with its `shadcn` theme | `@clerk/themes` still targets Core 2. `ClerkProvider` sits inside the router (`routerPush`/`routerReplace`) and reads `VITE_CLERK_PUBLISHABLE_KEY` itself |
| Organization | Clerk's **active organization** (picked with `OrganizationSwitcher`), not in the URL. Its id goes into every org-scoped query key | `ProtectedLayout` shows `OrganizationList` until one is active, so pages can call `useOrgId()` |
| UI kit | shadcn 4.23, **Radix** base (user's choice), Nova preset, Lucide icons, Geist font; `cn` package instead of `clsx` + `tailwind-merge` | |
| Lint | oxlint (Vite template default), not ESLint. Overrides for generated code: `src/components/ui/**`, `src/hooks/use-mobile.ts` | |
| Server data | TanStack Query 5. `staleTime` 30s, no retry on a 4xx (429 included), at most 2 retries otherwise | The backend allows 100 requests / 15 min per IP |
| HTTP | One wrapper, `lib/api-client.ts`: `VITE_API_URL` + `/api/v1`, Clerk `getToken()` (works outside React), unwraps `data`, throws `ApiError {status, code, message, details}` | Not the envelope (e.g. the limiter's 429) → `HTTP_<status>`; unreachable → `NETWORK_ERROR` |
| API types | Written by hand in `src/types/` from `Usage.md` | No OpenAPI spec (user, 2026-10-28): about a day of backend work (response schemas for ~23 routes); revisit once the API settles |
| Theme | shadcn **Neutral** (user, 2026-10-28, compared live with Slate and Blue accent, light and dark) | A tweakcn export can still replace the base variables in `src/index.css`; keep the status block |
| Status colours | **"Traffic light"** (user, 2026-10-28; "Calm", with resolved grey, was the other option). Tokens `--warning`, `--info`, `--success` in `index.css` (light = 700 shades for 4.5:1 text, dark = 400), Badge variants of the same names, tinted | Defined once in `lib/status.ts`, shown only through `StatusBadge` |
| Dark mode | Dark first. `dark` class on `<html>`, set by an inline script in `index.html` before the first paint, from `localStorage` `argus-theme`; `ThemeToggle` flips it | No theme provider (shortcut, see §6) |
| Lists | Filters in the URL search params (`?status=OPEN&cluster=…`), replace, not push | Back from an incident, or a shared link, keeps them |
| RCA rendering | `react-markdown` 10 (user OK, 2026-10-30), no `remark-gfm`, no raw HTML (its default: the report is model output built from untrusted alerts; `javascript:` links stripped). Elements styled through its `components` map with theme tokens, no typography plugin; report headings start at h3 | The agent's prompt asks for `##` sections, bullets, inline code and command blocks only, nothing GFM. A prompt that adds tables needs `remark-gfm` |
| Dev port | 3000 (`strictPort`) | The backend's CORS allows `FRONTEND_URL=http://localhost:3000` |
| Admin-only actions | **Shown to everyone; a member who clicks one gets a small dialog saying it requires admin privileges** (user, 2026-11-05; they were hidden). `AdminRequiredDialog`; the Add dialogs and row menus check `useIsOrgAdmin` themselves, so pages and tables know nothing about roles. Resolve and Investigate are open to members | A member can see what exists and why they can't use it. The backend still checks |
| Add to Slack button | Slack's own image from its CDN (user, 2026-11-05), inside a real `Button`. An exception to "lucide only" and "theme tokens only", in this one place | Lucide has no Slack icon any more, and an image needs no hex colours in our code. Slack's docs page for the button (marked legacy) states no usage rules either way |
| Hosting | Vercel; `vercel.json` rewrites every path to `index.html` (2026-10-29) | Without it a refresh on `/sign-in`, `/incidents/…` gave Vercel's 404. Production uses Clerk's production instance (`pk_live_…`) on the user's domain; the backend's `FRONTEND_URL` must be that domain |

**Status → colour (Traffic light).** In code so far: incident and alert status, unknown cluster, test, runner never connected, alert source never received / no clusters, investigation status. The rest is decided, added to `lib/status.ts` when first shown.

| Badge variant | Used for |
|---|---|
| `destructive` (red) | incident OPEN, alert FIRING, severity `critical`, investigation `failed` |
| `warning` (amber) | severity `warning`, unknown cluster, runner never connected, alert source never received or with no clusters left (setup problems) |
| `info` (blue) | investigation `running`, severity `info` |
| `success` (green) | incident / alert RESOLVED, investigation `done` |
| `secondary` (grey) | test incident, unknown or other severity |

---

## 3. Status

| Step | What | Status |
|---|---|---|
| 1 | Scaffold: Vite react-ts, Tailwind v4, `@/` alias, shadcn init, `typecheck` script | ✅ 2026-10-28 |
| 2 | Clerk, QueryClient, React Router; sign-in / sign-up; one protected layout with the org gate | ✅ 2026-10-28 |
| 3 | `api-client.ts`, query defaults, `useOrgId`; first call `GET /organizations/:orgId` on a basic Settings page | ✅ 2026-10-28 |
| 4 | Theme + status colours chosen (live preview, since deleted); sidebar shell, `ThemeToggle`, `PageHeader`, `ErrorState` | ✅ 2026-10-28 |
| 5 | Incidents list: status and cluster filters, cursor paging ("Load more"), `StatusBadge`, `EmptyState`, relative times; the home page | ✅ 2026-10-28 |
| 6 | Incident page, in four parts: **6a** ✅ 2026-10-29 route `/incidents/:incidentId` (list titles link to it), summary, alerts table; **6b** ✅ 2026-10-29 Resolve (open incidents only; the response replaces the cached incident, lists marked stale); **6c** ✅ 2026-10-30 an "Investigation" section: the newest run (status, started, finished, model + effort; the error when failed), polled every 15s while `running` (runs take ~10–30s) and not after an error until Retry; Investigate / Investigate again, hidden for test and unknown-cluster incidents (the backend's 409s, the reason shown instead), disabled while a run is going; after a start, or any start error (`INVESTIGATION_RUNNING` = an automatic run got there first), the runs are refetched; **6d** ✅ 2026-10-30 the done run's report (`RcaReport`) under the run summary; with more than one run, a picker ("Run 3 · Done · 2 hours ago", user's idea) next to the button, newest by default and again after Investigate is pressed; **6e** ✅ 2026-10-30 alert details (user's idea): a chevron on each alert row opens an extra row with every label (`key=value` badges), every annotation (http(s) values as links, e.g. `runbook_url`), when it ended (set only on resolve) and the fingerprint; each row opens on its own, all start closed | ✅ 2026-10-30 |
| 7 | Clusters and alert sources: **C1** ✅ 2026-10-29 Clusters page (read-only, sidebar entry); **C2** ✅ 2026-10-29 add cluster (name checked in the browser with the backend's DNS-1123 rule), runner token shown once with Copy, an outside click can't close it; **C3** ✅ 2026-10-30 a row menu (admins only) with Rotate token (confirm, then the new token shown once, like C2) and Delete (confirm, says what happens; refreshes clusters and every incidents query); **S1** ✅ 2026-10-30 Alert sources page (read-only, sidebar entry): name, clusters, last alert, added; **S2** ✅ 2026-10-30 add (name, cluster checkboxes, cluster label under a collapsed "Advanced"; "Add" stays disabled until a cluster is ticked), then the webhook URL (`VITE_API_URL` + `/webhooks/v1/alerts`) and token shown once with Copy, like C2; **S3** ✅ 2026-10-30 a row menu (admins only): Edit (name, clusters, cluster label, prefilled from the current values; "Advanced" opens by itself for a non-default label), Rotate token (confirm, then URL + new token once), Delete (confirm). Edit and delete also refresh incidents (an alert shows its source's name, or "Deleted source"). Admin-only actions hidden for members (`useIsOrgAdmin`, Clerk's `orgRole`; the backend still checks) | ✅ 2026-10-30 |

**Next (user, 2026-11-05).** All three items are built. Next on the project's list is the agent service part of MCP servers (`../CONTEXT.md` §4.7 step 3). Explain the sub-steps and wait for the go-ahead before writing code (`../CONTEXT.md` §5.9 working agreements); the user does the commits.

The `mcp_server` migration is applied (user, 2026-11-05). The backend is pushed at `ac6f3a0`.

1. **Admin-only actions, shown rather than hidden.** ✅ Built 2026-11-05 on Clusters and Alert sources (§2), including the row menus: a member can open a menu and see its items, and clicking one shows the message. New admin actions follow the same pattern: `if (!isAdmin) return <AdminRequiredDialog trigger={trigger} />` in an Add dialog, or `open={isAdmin && dialog === 'x'}` plus `<AdminRequiredDialog open={!isAdmin && dialog !== null} … />` in a row menu. Checked with a one-off page (not kept): the real pages and dialogs in headless Chrome with Clerk stubbed, as member and admin, every action on both pages, and no requests from a member. Not checked with a real member account.
2. **MCP servers page.** ✅ Built 2026-11-05, in `features/mcp-servers/`, modelled on alert sources (API: `../argus-sre-backend/src/Usage.md` "MCP servers"; design: `../CONTEXT.md` §4.7). The user tried it and reported it works well (2026-11-05). Agent runs don't use these servers yet, so saving one changes nothing until `../CONTEXT.md` §4.7 step 3, although the page says the agent can use their tools.
   - Page at `/mcp-servers`, sidebar entry next to Alert sources: a table (name, URL, added; a long URL is cut off, the full value in its tooltip), empty state.
   - **Add:** name, URL, token (a password field), with the read-only advice. No "shown once" view, since the customer supplies the token; it closes on success.
   - **Edit:** always sends name and URL, the token only if typed. The token field becomes required while the URL differs from the saved one, and says why.
   - **Delete:** the new shared `ConfirmDialog`, which the clusters' and alert sources' Delete dialogs now use too.
   - **Errors:** name taken under Name, `INVALID_MCP_URL` under URL, `MCP_TOKEN_REQUIRED` under Token (reachable if someone else changed the URL meanwhile), anything else under the form. The browser stops a bad name or a token with spaces, because the backend's own answer to those is only "Request body validation failed". Spaces around a token are trimmed.
   - Add and Edit scroll inside the dialog (`max-h-svh overflow-y-auto`): the form is about 590px tall, and `DialogContent` doesn't scroll by default.
   - Checked with a one-off page (not kept): the real app (router, layouts, sidebar) in headless Chrome, Clerk stubbed, against a fake API that records requests: exact request bodies, each error's place, every field rule, the four states, member and admin, a 480px-tall window, and both moved Delete dialogs. Not confirmed separately: a real member account.
3. **Slack settings, on the Settings page.** ✅ Built 2026-11-05 in `features/settings/`, from the backend's `slack.controller.ts` and `slackModel.ts`. **Not yet run against the real backend or real Slack.** `Usage.md` still has no Slack section (open: the session was frontend only). The API:
   - `GET /organizations/:organizationId/slack` (members): `{ connected: false }` or `{ connected: true, teamName, channelName, installedAt }`. `channelName` is Slack's, with its `#`.
   - `POST …/slack/install` (admins): `{ url }`, and the browser goes there. Slack's consent page picks the channel.
   - The browser comes back to `/settings?slack=<outcome>`, one of `connected`, `cancelled`, `cannot_post` (saved, but the test message failed), `workspace_taken` (connected to another org), `error`.
   - `DELETE …/slack` (admins): `{ connected: false }`, or `404 SLACK_NOT_CONNECTED`.

   What the page does:
   - **Not connected:** Slack's own Add to Slack button; a failed start shows under it with Retry.
   - **Connected:** workspace, channel, when, a line about `/invite @argus` for private channels, and Disconnect through `ConfirmDialog`. The status is refreshed after a failed disconnect too, so a 404 (someone else already did it) just shows the Add button.
   - **Coming back:** one message per outcome, kept in state while the param is removed from the URL, so a refresh doesn't repeat it. An unknown value shows nothing. Coming back is a full page load, so the status is fresh without any refresh code. "Slack connected" and the `cannot_post` message hide if the org is no longer connected (Disconnect pressed on the same page).
   - **Members:** the admin message on both buttons; the `GET` allows them, so they see the status.
   - Known gap: uninstalling from Slack's side isn't handled yet (`../CONTEXT.md` §8), so the page can still say connected after that.
   - The redirect goes to the backend's `FRONTEND_URL`, so testing from `localhost:3000` against staging needs staging's `FRONTEND_URL` set to it (§5). Disconnect is real: it uninstalls the app from the workspace.
   - Checked with a one-off page (not kept): the real app in headless Chrome, Clerk stubbed, a fake API, and a fake Slack page that redirects back: the round trip, each outcome, `bogus`, `constructor` and `__proto__`, disconnect with its failures, both roles, the states, and the real image loading from Slack's CDN.

**Later** (recorded 2026-10-30, none started).

Ready now (the backend already has what they need):
- **Browser check** of the steps not yet checked (see below), before building more on them.
- **Transcript** of a run, from `GET …/investigations/:investigationId/messages` (built): first read-only under the report, then evidence links from the RCA's citations (`` `list_pods {"namespace":"demo"}` ``, matched to a tool call by name + args, as the agent service's `src/citations.ts` does). Skip OpenAI's encrypted reasoning (§6); Claude's `thinking` blocks: show or hide, not decided.
- **Editing the grouping window** (admins) on Settings: `PATCH /organizations/:organizationId/settings {incidentGroupingWindowMinutes}`, 0–1440.
- A **"page not found"** page, **route-level code splitting** (or lazy `RcaReport` alone), a real **favicon** (all in §6).

Waiting on the backend or the agent service:
- **Investigation on/off switch and trigger rules** (`../CONTEXT.md` §4.4; was the backend's next item, not placed in the 2026-10-30 order, §4.5): a Settings UI for admins, the switch plus rules as lists of `{label, op, value}` conditions.
- **Investigation effort as an org setting**, lite / balanced / max, and the model no longer shown on a run (user, 2026-10-30; needs the backend and the agent service first; today the run summary shows `model (effort)`).
- **Conversations** (chat; replaced "chat on an investigation" 2026-10-30, `../CONTEXT.md` §4.5): Slack comes first, the web chat UI after. A web conversation is seen only by the person chatting.

Suggested order for the ready ones (not decided): browser check → grouping window → transcript → not-found page and code splitting.

Checked by the user in the browser (2026-10-28): sign-in, the org gate and the shell (the theme preview was inside it). Each step: `npm run typecheck`, `npm run lint`, a build. No test runner yet; new logic was checked with one-off scripts that load the real files through Vite (not kept): `api-client` (every response shape, against a fake server and the real backend's 401), `formatRelativeTime` (11 cases), `listIncidents`' query string, the cluster-name `pattern` compiled with the `v` flag browsers use (11 names), the cluster-label `pattern` the same way (9 names), `RcaReport` rendered through Vite's SSR loader (headings, lists, code, bold; `<script>` not rendered, a `javascript:` link stripped, external links get `target=_blank rel=noreferrer`, no `node` attribute), `AlertDetails` the same way (label badges, a `runbook_url` link, a `javascript:` value shown as text and not linked, empty parts hidden), the investigations polling rule against TanStack's `QueryObserver` with a fake API (running → done stops; done never polls; an error stops it with stale "running" data; a refetch resumes it). Steps 6a, 6b, C1, C2 (2026-10-29) and C3, S1, S2, S3, 6c, 6d, 6e (2026-10-30) are not checked in the browser yet. Adding Vitest needs the user's OK.

---

## 4. Where things are

```
src/
  app/                router.tsx, RootLayout (ClerkProvider), AuthLayout, ProtectedLayout (auth + org gate + shell),
                      AppSidebar (nav list: add one entry per page), queryClient.ts, useOrgId.ts, useIsOrgAdmin.ts
  components/ui/      shadcn, generated (badge has the warning/info/success variants). `npx shadcn add` asks before
                      overwriting an existing file and stops when it can't ask: run it from Bash as `yes n | npx shadcn@latest add …`
  components/common/  PageHeader, ErrorState, EmptyState, StatusBadge, ThemeToggle, RelativeTime, CopyField, AdminRequiredDialog,
                      ConfirmDialog
  hooks/use-mobile.ts shadcn, generated (components.json's `hooks` alias)
  features/
    incidents/        api, hooks, IncidentFilterBar, IncidentTable, IncidentsPage (list);
                      IncidentSummary, IncidentInvestigation (section, fetches its own runs) + InvestigationPicker,
                      InvestigationSummary, RcaReport, AlertTable + AlertRow + AlertDetails, IncidentPage (one incident)
    clusters/         api, hooks (also used by the incidents filter), ClusterTable, ClusterActions (row menu),
                      AddClusterDialog, RotateClusterTokenDialog, DeleteClusterDialog, ClustersPage
    alert-sources/    api (+ `webhookUrl`), hooks, AlertSourceTable, AddAlertSourceDialog, ClusterChecklist and
                      ClusterLabelField (form parts, shared by add and edit), AlertSourceActions (row menu),
                      EditAlertSourceDialog + EditAlertSourceForm, RotateAlertSourceTokenDialog, DeleteAlertSourceDialog,
                      AlertSourcesPage
    mcp-servers/      api, hooks, McpServerTable, McpServerActions (row menu), McpServerFields (form parts, shared by add
                      and edit), AddMcpServerDialog, EditMcpServerDialog + EditMcpServerForm, DeleteMcpServerDialog,
                      McpServersPage
    settings/         api, hooks, SettingsPage; SlackSection (fetches its own status) + AddToSlackButton,
                      SlackConnectionDetails, SlackOutcomeAlert
  lib/                api-client.ts, status.ts, utils.ts (cn, formatRelativeTime)
  types/              organization, incident, cluster, alert-source, investigation, mcp-server, slack
```

---

## 5. Dev setup

- `.env.local` (gitignored): `VITE_API_URL` (the backend's origin, without `/api/v1`): `http://localhost:5000`, or staging `https://staging.api.argussre.com` (staging's `FRONTEND_URL` must then be `http://localhost:3000`); `VITE_CLERK_PUBLISHABLE_KEY` (`pk_test_…`, the development instance). `.env.example` lists both. Only `VITE_`-prefixed variables reach the browser, and Vite builds them in, so a change on Vercel needs a redeploy.
- `npm run dev` → http://localhost:3000. The backend (`npm run dev` in `../argus-sre-backend`, port 5000) must have `FRONTEND_URL=http://localhost:3000`.
- Calling the API by hand: `Authorization: Bearer <await window.Clerk.session.getToken()>` from the browser console (expires in about a minute).

---

## 6. Backend gaps and known shortcuts

**From the backend:**
- **Rate limit** 100 requests / 15 min per IP on `/api`. CORS now runs before it (user, 2026-10-28), so preflights don't count. Still: poll slowly (step 6), and every page's queries count.
- **Incident list** has no investigation status or alert severity; `investigationStartedAt` isn't in any incident response. Showing "investigated" in the list needs a backend change.
- **Transcript** (`…/messages`): on OpenAI runs each AI message carries ~30k characters of encrypted reasoning, stored twice (`additional_kwargs.reasoning`, `response_metadata.output`). The UI must ignore them; the payload is large.
- **Chat** isn't built (agent service step 8); no SSE yet, so investigation progress is polled.
- **Runner status**: `lastConnectedAt` is set only when a runner connects (its token verify), so the Clusters page can show "last connected", not "connected now". Live status needs the gateway's connection state in the API.

**Ours:**
- `ThemeToggle` keeps the theme on `<html>` + `localStorage` only; move it into a provider once another component must react to it (e.g. a toast library's `theme` prop).
- The Add to Slack image is hotlinked from `platform.slack-edge.com`. It worked on 2026-11-05, but Slack only documents that button on a page marked legacy, so it may go away. The alt text keeps the button usable; self-host the PNGs in `public/` if that happens.
- Main bundle 792 KB (239 KB gzipped, 2026-11-05; 777 KB / 235 KB on 2026-10-30, +119 KB for `react-markdown` and its parser; 658 KB before it; 617 KB / 189 KB gzipped on 2026-10-29, 548 KB on 2026-10-28), over Vite's 500 KB warning, mostly Clerk's bundled UI. Route-level lazy loading later; lazy-loading `RcaReport` alone would take `react-markdown` out of the first load.
- Incident page: Resolve has no "are you sure" (offered, not asked for; a manual resolve can't be undone); no in-page back link (the sidebar, and the browser's Back, which keeps the list's filters); only the title in a list row is a link; a very long label value doesn't wrap (the `Badge` is `nowrap`), so the alerts table scrolls sideways (a side panel, the existing `Sheet`, if real alerts need it).
- Delete dialogs share `ConfirmDialog` (2026-11-05). The Rotate dialogs are still near copies for clusters and alert sources (and the add dialogs' token view), because they go on to show a token; MCP servers have neither.
- `ConfirmDialog` doesn't close itself on success: what it acts on leaves the page and takes the dialog with it (a deleted row). Anything that stays on the page needs it closed some other way.
- Row menus (clusters, alert sources, MCP servers): `DropdownMenu modal={false}` (a modal menu opening a modal dialog can leave the page unclickable in Radix). Closing a dialog opened from it doesn't return focus to the menu button.
- Add alert source: the cluster checklist doesn't scroll on its own (fine for a few clusters, the API allows 100); a cluster label made invalid and then hidden by closing "Advanced" isn't checked by the browser (the backend's 400 shows under the form).
- Investigation section: the picker remembers a chosen older run until Investigate is pressed (an automatic run that starts meanwhile doesn't take over the view); a run stuck in `running` polls 60 requests / 15 min, over half the rate limit, until the page is left or the tab hidden; it fetches its own data (not passed down by the page) so the page stays short.
- Unknown URLs show React Router's default error screen.
- Clerk's "membership required" / session tasks not tried; the org gate covers a signed-in user without an active org.
- `npm audit`: 3 low, all in the shadcn CLI (`deepmerge`), not in the bundle.
- The favicon is still Vite's logo.
