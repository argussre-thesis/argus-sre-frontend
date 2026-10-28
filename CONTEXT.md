# Frontend context

> Living document for `argus-sre-frontend/`: decisions, status, and what the backend does or doesn't give us.
> Last updated: 2026-10-28
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
| Dev port | 3000 (`strictPort`) | The backend's CORS allows `FRONTEND_URL=http://localhost:3000` |

**Status → colour (Traffic light).** In code so far: incident status, unknown cluster, test. The rest is decided, added to `lib/status.ts` when first shown.

| Badge variant | Used for |
|---|---|
| `destructive` (red) | incident OPEN, alert FIRING, severity `critical`, investigation `failed` |
| `warning` (amber) | severity `warning`, unknown cluster |
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
| 6 | Incident page: alerts, Resolve, Investigate, the investigation's status (slow polling), the RCA with `react-markdown` | **next** |

Later, not ordered: the transcript / timeline (evidence links from the RCA's citations), clusters and alert sources pages (tokens shown once), editing the grouping window (admin), chat (after the agent service's step 8), a "page not found" page, route-level code splitting.

Checked by the user in the browser (2026-10-28): sign-in, the org gate and the shell (the theme preview was inside it). Each step: `npm run typecheck`, `npm run lint`, a build. No test runner yet; new logic was checked with one-off scripts that load the real files through Vite (not kept): `api-client` (every response shape, against a fake server and the real backend's 401), `formatRelativeTime` (11 cases), `listIncidents`' query string. Adding Vitest needs the user's OK.

---

## 4. Where things are

```
src/
  app/                router.tsx, RootLayout (ClerkProvider), AuthLayout, ProtectedLayout (auth + org gate + shell),
                      AppSidebar (nav list: add one entry per page), queryClient.ts, useOrgId.ts
  components/ui/      shadcn, generated (badge has the warning/info/success variants)
  components/common/  PageHeader, ErrorState, EmptyState, StatusBadge, ThemeToggle
  hooks/use-mobile.ts shadcn, generated (components.json's `hooks` alias)
  features/
    incidents/        api, hooks (useInfiniteQuery), IncidentFilterBar, IncidentTable, IncidentsPage
    clusters/         api, hooks (for the incidents filter; no page yet)
    settings/         api, hooks, SettingsPage (read-only)
  lib/                api-client.ts, status.ts, utils.ts (cn, formatRelativeTime)
  types/              organization, incident, cluster
```

---

## 5. Dev setup

- `.env.local` (gitignored): `VITE_API_URL=http://localhost:5000` (the backend's origin, without `/api/v1`), `VITE_CLERK_PUBLISHABLE_KEY`. `.env.example` lists both. Only `VITE_`-prefixed variables reach the browser.
- `npm run dev` → http://localhost:3000. The backend (`npm run dev` in `../argus-sre-backend`, port 5000) must have `FRONTEND_URL=http://localhost:3000`.
- Calling the API by hand: `Authorization: Bearer <await window.Clerk.session.getToken()>` from the browser console (expires in about a minute).

---

## 6. Backend gaps and known shortcuts

**From the backend:**
- **Rate limit** 100 requests / 15 min per IP on `/api`. CORS now runs before it (user, 2026-10-28), so preflights don't count. Still: poll slowly (step 6), and every page's queries count.
- **Incident list** has no investigation status or alert severity; `investigationStartedAt` isn't in any incident response. Showing "investigated" in the list needs a backend change.
- **Transcript** (`…/messages`): on OpenAI runs each AI message carries ~30k characters of encrypted reasoning, stored twice (`additional_kwargs.reasoning`, `response_metadata.output`). The UI must ignore them; the payload is large.
- **Chat** isn't built (agent service step 8); no SSE yet, so investigation progress is polled.

**Ours:**
- `ThemeToggle` keeps the theme on `<html>` + `localStorage` only; move it into a provider once another component must react to it (e.g. a toast library's `theme` prop).
- Main bundle 548 KB (170 KB gzipped), over Vite's 500 KB warning, mostly Clerk's bundled UI. Route-level lazy loading later.
- Unknown URLs show React Router's default error screen.
- Clerk's "membership required" / session tasks not tried; the org gate covers a signed-in user without an active org.
- `npm audit`: 3 low, all in the shadcn CLI (`deepmerge`), not in the bundle.
- The favicon is still Vite's logo.
