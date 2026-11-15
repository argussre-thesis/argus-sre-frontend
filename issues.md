# UI/UX issues

From a browser check of every page on 2026-11-12, done with Playwright: desktop and 390px wide, dark and light mode, signed in to CMS-Markets.

## Bugs

- [ ] **Contact message box is two lines tall** (known, fine for now). `rows={8}` in `features/contact/components/ContactForm.tsx` does nothing because shadcn's Textarea has `field-sizing-content`. Fix: `className="min-h-40"`.

## UX

- [x] **Integrations cards don't look clickable.** Only a faint hover shows it. Cards already set up (Grafana, "1 server") look the same as the rest. Add an "+ Add" / "Connect" cue on each card, and a heading above the servers table.
- [x] **GitHub dialog text.** The name hint's example is `prod-grafana_query_prometheus`, a Grafana tool. The token hint ends with "Investigations start on their own from alerts.", which doesn't belong there. There's no link to GitHub's token page.
- [x] **Settings: the "Incidents" card mixes topics.** Split into an "Incidents" box and an "Agent" box, each with its own Save.
- [x] **Settings: the left menu doesn't show which section you're on.**
- [x] **Table columns run together.** A right-aligned number column sits right against the next column: "Firing alerts | Started" on Incidents, "Open incidents | Runner last connected" on Clusters. Add padding, or left-align the numbers.
- [x] **Alerts table: wide empty first column,** about 90px between the chevron and the alert name.
- [x] **Incident page has no link back** to the list.
- [x] **Overview:** the "Across all incidents" line under "Opened in the last 24h" is unclear. Now "Test incidents not counted", which is what it does.
- [x] **Phone width:** the incident and alert tables scroll sideways and hide Status. Low priority.
- [x] **Landing animation:** a big jump (End key, dragging the scrollbar) can skip step 05, so the diagram stays on step 04. Normal scrolling works. Low priority.

## Not checked

- How a report (`RcaReport`) looks in the app: no incident in the org has a finished report.
- The setup checklist: hidden, because all four steps are done in this org.
