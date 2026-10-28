# Argus Frontend

Web UI for Argus, an autonomous SRE / incident-triage platform for Kubernetes.
Users sign in, see incidents, open an incident to read its timeline and the agent's RCA report, and chat with the agent about it.

The developer is not a frontend specialist. Prefer simple, boring, readable code over clever code. Consistency matters more than novelty.

## Stack

- Vite + React + TypeScript (strict mode)
- React Router for routing
- Tailwind CSS v4 + shadcn/ui for all UI
- Clerk (React SDK) for auth, styled with Clerk's shadcn theme
- TanStack Query for all server data
- react-markdown for rendering RCA reports
- shadcn charts (Recharts) when charts are needed

Do not add other UI libraries, CSS-in-JS, state managers (Redux, Zustand, etc.) or data-fetching libraries. Ask before installing any new dependency.

## Environment

- The developer is on Windows. Give all commands as PowerShell.
- Backend (Node) base URL: `VITE_API_URL`. Clerk key: `VITE_CLERK_PUBLISHABLE_KEY`. Never hardcode either.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.

## Folder structure

```
src/
  app/            router, providers (Clerk, QueryClient, theme), root layout
  components/
    ui/           shadcn components (generated, see rules below)
    common/       shared app components (PageHeader, EmptyState, ErrorState, StatusBadge...)
  features/
    incidents/
      api.ts          API calls for this feature
      hooks.ts        TanStack Query hooks wrapping api.ts
      components/     components used only by this feature
      pages/          route-level pages
    chat/
    settings/
  lib/
    api-client.ts   the single fetch wrapper (base URL, Clerk token, errors)
    status.ts       severity/status -> label + badge variant mapping
    utils.ts        cn() and small helpers
  types/          shared API types
```

- New feature = new folder in `features/` with the same shape.
- If a component is used by two or more features, move it to `components/common/`.
- Import with the `@/` alias, never long relative paths like `../../../`.

## UI rules

- Build every screen from shadcn components. Before writing a new component, check `components/ui` and `components/common`, then the shadcn registry (use the shadcn MCP server). Add components with `npx shadcn@latest add <name>`.
- Do not edit files in `components/ui/` for one-off styling. Need a variant? Add it with `cva` in that component, or wrap it in `components/common/`.
- Colors come only from theme tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`...). No hex, rgb, or Tailwind palette colors (`bg-blue-500`), no arbitrary values (`w-[437px]`, `text-[#333]`).
- The theme lives only in `src/index.css` (exported from tweakcn). Changing the look = editing those CSS variables, nothing else.
- Severity and status colors are defined once in `lib/status.ts` and rendered through `StatusBadge`. Never pick a status color inline.
- Spacing: stick to the Tailwind scale (`gap-2`, `gap-4`, `p-4`, `p-6`). Pages use the same container and `PageHeader`.
- Every data view handles four states: loading (Skeleton), empty (EmptyState), error (ErrorState), and data.
- Icons: lucide-react only.
- Look and feel: calm, dense, professional ops tool (think Grafana / Linear). Dark mode first, light mode must also work. Neutral palette; color is reserved for meaning (severity, status, errors). No gradients, glow effects, or decorative animation.
- Basic accessibility: real `<button>`/`<a>` elements, labels on inputs, `aria-label` on icon-only buttons.

## Data and API rules

- All HTTP goes through `lib/api-client.ts`. It adds the base URL and the Clerk session token (`getToken()`) and throws a typed error on non-2xx. The backend already verifies Clerk tokens.
- Each feature's `api.ts` holds plain async functions. `hooks.ts` wraps them in `useQuery` / `useMutation`.
- Components never call `fetch` or the api client directly. They use hooks.
- Query keys follow `[feature, ...params]`, e.g. `['incidents', 'list', filters]`, `['incidents', id]`.
- Server data lives in TanStack Query, not in `useState` or context. Local UI state (open dialog, selected tab) stays in `useState`.
- API types live in `src/types/`. If the backend exposes an OpenAPI spec, generate them from it instead of writing them by hand. Never use `any`; use `unknown` and narrow.
- Chat streaming logic lives in one hook in `features/chat/`. Components only consume its state.

## Auth (Clerk)

- Use Clerk's prebuilt components (`<SignIn />`, `<SignUp />`, `<UserButton />`). Do not build custom auth forms.
- Apply Clerk's shadcn theme so auth UI matches the app. The import path differs between Clerk versions: check the installed package version and its docs before wiring it up.
- Every route except sign-in/sign-up is protected. Protection is done once, in the router/layout, not per page.

## Code style

- Function components with named exports. One component per file; file name matches the component (`IncidentTimeline.tsx`). Hooks are `useSomething` in `hooks.ts` or `useSomething.ts`.
- Keep components under ~150 lines. If it grows, extract subcomponents.
- Pages compose; they fetch via hooks and pass data down. Small components receive props and render.
- Props typed with a `type Props = {...}` above the component.
- Minimal comments. Only explain *why* something non-obvious is done, never *what* the code does.
- No dead code, commented-out code, or unused exports. Delete instead of commenting out.
- No `console.log` left in committed code.
- Prettier formats the code; don't fight it.

## How to work with me

- Read a file before editing it; I may have reformatted it or trimmed comments.
- Work in small steps. Explain what you plan to do, do one step, then wait for my go-ahead before the next.
- Do not run git commits. I handle all commits.
- Ask before installing packages, changing config files (vite, tsconfig, eslint), or restructuring folders.
- Before saying a step is done, run `npm run typecheck` and `npm run lint` and fix what they report.
- Reuse before creating: search the codebase for an existing component, hook, or helper first.
- If a request conflicts with these rules, say so instead of silently breaking them.