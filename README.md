# Health Tracking Dashboard

Personal health dashboard that tracks medication intake, ingests data from the
Bevel app API (when configured), and surfaces expert-backed recommendations
from a verbatim guideline base.

See [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md) for the full architecture
spec, operating rules, and safety scope.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- localStorage for persistence (no database)
- Designed for Vercel deployment

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Daily summary: adherence today, sleep, mood/energy, alerts, top 3 recommendations |
| `/medications` | Add medications, log intake (taken / missed / skipped), delete |
| `/metrics` | Manual entry for sleep, light exposure, caffeine, meals, exercise, mood, energy |
| `/trends` | 7- and 30-day adherence and sleep sparklines |
| `/recommendations` | Full list of recommendations matched to your data |
| `/settings` | Bevel API config, target metric ranges, audience, data reset |

## Loading the guideline base

The recommendation engine is **deliberately empty by default**. Until you load
guidelines, the dashboard returns the "Not covered" response defined in the
master prompt.

To add guidelines:

1. Paste the verbatim text into [`content/guidelines.md`](content/guidelines.md).
2. For each guideline, add a `GuidelineRule` object to
   [`lib/guideline-rules.ts`](lib/guideline-rules.ts). The `quote` field MUST
   match the verbatim text. The `trigger` function decides when the guideline
   applies to the user's logged data.
3. Preserve proper-noun spellings exactly: **Andrew Huberman**, **Brain
   Johnsson**, **Huberman Lab**, **Bevel**.

## Bevel API

The Bevel client (`lib/bevel.ts`) is a stub. It:

- Reads `bevelApiBaseUrl` and `bevelApiKey` from Settings.
- Calls `GET {baseUrl}/metrics` with a Bearer token, retrying with exponential
  backoff on 5xx / network errors.
- Maps responses via `mapBevelMetrics()` — currently a placeholder until the
  real field schema is known.

When unconfigured or unreachable, the dashboard surfaces a non-technical user
message and falls back to manual entry.

## Safety

- Not a medical device. Alerts are reminders, not prescriptions.
- For medication changes, always contact your prescribing clinician.
- The metric-entry notes field is scanned for emergency keywords. If matched,
  routine recommendations are paused and emergency-services guidance is shown.

## Deploy to Vercel

```bash
vercel
```

The project is configured for the default Next.js build — no extra env vars are
required. Bevel credentials are entered in Settings and stored in localStorage.

## Project structure

```
app/                Next.js App Router pages
components/         React UI components
lib/                Types, storage, recommendation engine, Bevel client, alerts
content/            Verbatim guideline base (markdown)
docs/               Architecture spec (master prompt)
```
