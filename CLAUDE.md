# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Pim Fit is a Dutch-language personal fitness PWA (Progressive Web App) for tracking gym workouts and a running plan. It is designed to be installed on iPhone as a home screen app.

## No build step — two-file architecture

There is **no npm, no bundler, no package.json**. React 18 is loaded from CDN.

| File | Role |
|------|------|
| `app.jsx` | Development source — readable JSX |
| `index.html` | Deployed version — JSX pre-compiled to `React.createElement()` calls, inlined into a `<script>` tag |

**To run locally:** open `index.html` directly in a browser. For PWA/service worker features you need a local HTTP server:
```
python3 -m http.server 8080
# then open http://localhost:8080
```

**To deploy changes:** after editing `app.jsx`, manually convert JSX to `React.createElement()` calls and update `index.html`. Both files must stay in sync. The comment at the top of `app.jsx` says it is the source; `index.html` is the compiled production version.

**To force the service worker to fetch a fresh cache** after updating `index.html`, bump `VERSION` in `sw.js`.

## Architecture

The entire app lives in a single React component tree with no routing library. Navigation state is held in the top-level `App` component (at the bottom of both files). Key views:

- **`TodayTab`** — today's gym split, runs scheduled today, supplement tracker, weekly streak
- **`TrainingMode`** — full-screen active workout: set input grid, rest timer, exercise swap/notes
- **`ProgressTab`** — weight chart, running km chart, muscle volume this week, PR list
- **`RunPlanView`** — full running schedule (October 2026 → April 2027)

Bottom sheets (`Sheet`) are used for all modals/drawers. `RestBar` is a persistent strip above the tab bar during rest timers.

## Data storage

All state is persisted in `localStorage` with a `pf_` prefix. There is no backend.

Key storage keys:
- `pf_ex` — exercise history: `{ [exerciseId]: [{date, sets:[{weight,reps}]}] }`, max 60 entries per exercise
- `pf_bw` — body weight log: `[{date, w}]`, max 400 entries
- `pf_cal` — manually marked training days: `{ [dateKey]: true }`
- `pf_plan` — permanent exercise plan overrides per day
- `pf_custom_ex` — user-added custom exercises
- `pf_exnote` — per-exercise notes, keyed by lowercase exercise name
- `pf_runmove` — moved run dates: `{ [runId]: newDate }`
- `pf_run_<runId>` — run log: `{ done, skipped, km, sec, hr, feel, note, savedAt }`
- Per-day keys (all scoped to a `YYYY-MM-DD` date key):
  - `pf_split_<date>` — selected training split index (0–3)
  - `pf_rest_<date>` — rest day flag
  - `pf_done_<date>` — exercises marked done: `{ [exId]: bool }`
  - `pf_draft_<date>` — in-progress set rows: `{ [exId]: [{weight,reps,done}] }`
  - `pf_supps_<date>` — supplements checked: `{ [suppId]: bool }`
  - `pf_note_<date>` — free-text daily note
  - `pf_swap_<date>` — temporary exercise swaps: `{ [origId]: newId }`
  - `pf_order_<date>_<day>` — custom exercise order for a split

## Workout & running data

All workout and running data is **hardcoded as constants** at the top of the file:

- `WORKOUTS` — 4-day split (Upper A / Lower / Upper B / Upper C) with exercise objects `{id, name, detail, muscle, sets}`
- `SCHEDULE` — which split runs on which weekday: `{1:0, 2:1, 4:2}` (mon=Upper A, tue=Lower, thu=Upper B)
- `RUNPLAN` — week-by-week running schedule array; each week has `{s: startDate, p: phase, runs: [[date, text, kind, km?], ...]}`
- `GOALS` — race dates used for the countdown display
- `TARGETS` — weekly sets target per muscle group for the volume tracker

To add or change exercises or runs, edit these constants in both `app.jsx` and `index.html`.

## iOS PWA specifics

- `fitScreen()` works around iOS reporting a shorter `window.innerHeight` when in standalone mode; it sets `#root` height manually and toggles `html.short-vp` for the gap below the tab bar.
- Safe area insets are applied via `env(safe-area-inset-top/bottom)` in CSS.
- Audio is unlocked on first user interaction via `unlockAudio()` before `playBeep()` can work.
- `viewport-fit=cover` and `apple-mobile-web-app-capable` meta tags are required.
