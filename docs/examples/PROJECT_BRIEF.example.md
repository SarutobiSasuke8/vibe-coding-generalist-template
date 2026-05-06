# Project Brief — Sparkbar (worked example)

> This is a fully-filled-out example for a fictional project. Use it to see what
> a "good" `docs/PROJECT_BRIEF.md` looks like before you fill in your own.
> The real placeholder lives at `docs/PROJECT_BRIEF.md`.

## Summary

Sparkbar is a single-user daily habit tracker that turns one screen of taps into a streak of small wins. It runs as a local-first web app, syncs optionally to a single device, and never nags. The goal is to make a streak feel like momentum, not surveillance.

## Vibe

- Desired feeling: calm pride. The kind of quiet "yeah, I did that" you feel closing a notebook.
- Reference products / experiences: Streaks (iOS), the paper habit grid in *Atomic Habits*, the muji notebook aesthetic.
- Anti-vibe: gamified panic — no flame icons, no "you broke your streak!" red bars, no leaderboards.
- First impression target: open the app, see today's three habits in under one second, tap once.

## User

- Primary user: a single adult, mildly tech-fluent, tracking 1–5 personal habits.
- Secondary users: none. Not designed for teams, kids, coaches, or shared accounts.
- User skill level: comfortable with web apps; not interested in configuration.
- Context of use: phone or laptop, mornings and evenings, often in under 10 seconds.

## Problem

Existing habit apps assume you'll engage daily with their *app*. The user wants to engage daily with their *habit*. Most apps over-gamify, push notifications, and turn lapses into negative emotional events that make the app itself worth quitting. Sparkbar is the smallest possible interface between intention and a checkmark.

## Product Promise

- Tapping a habit marks it done for today, instantly, with no confirmation step.
- A missed day never produces guilt-shaped UI.
- Data is yours — exportable as CSV at any time, no account required to start.
- Loads in under 1 second on a 3-year-old phone.

## Core Workflows

1. User opens the app and sees today's habits as a row of bars; tapping a bar fills it.
2. User adds a new habit from a single-screen form: name + optional emoji.
3. User reviews the past 30 days as a calendar grid; each cell is filled or empty.

## Success Criteria

- A new user can create their first habit and check it off in under 30 seconds.
- The 30-day calendar renders in under 200ms with 5 habits × 30 days.
- Zero notifications by default; the app works fully without push permission.
- After 7 days of use, retention check-in: did the user stop using the app *or* the habit? Only the latter is acceptable churn.

## Non-Goals

- Multi-user or team features.
- Native mobile apps (web is enough).
- AI-suggested habits or coaching prompts.
- Integrations with health platforms (Apple Health, Fitbit, etc.).

## Constraints

- Time: 4 weekends to first usable version.
- Budget: $0 infra; deploy on a free tier.
- Stack: TypeScript + a minimal web framework; SQLite via local persistence; one-screen design.
- Deployment target: a single static-hosted page with a tiny backend for optional sync.
- Data sensitivity: low — habit names only, no health data, no PII required.
- Performance expectations: <1s cold load, <100ms tap-to-fill on mid-tier phones.
- Accessibility expectations: WCAG AA contrast, keyboard navigable, respects `prefers-reduced-motion`.

## Quality Gates

- Core workflow (open → tap habit → see it filled) works end-to-end.
- Empty state ("no habits yet") and error state (sync failed) both designed.
- UI is responsive from 320px wide to desktop.
- Project commands in `AGENTS.md` are accurate and runnable.
- Test coverage on the streak-calculation logic specifically.

## Technical Notes

- Architecture: SPA with local-first storage; optional sync via single REST endpoint.
- Data model: `habits(id, name, emoji, created_at)`, `checkins(habit_id, date)`.
- External services: none required for v1; optional Cloudflare Workers for sync.
- Authentication/authorization: none in v1; sync uses a single shared device token.
- Observability/logging: client-side error log surfaced to console; no analytics.

## Open Questions

- [ ] #task Should "today" reset at midnight local or 4am to forgive late-night users?
- [ ] #task Is sync a v1 feature or v2?

## References

- *Atomic Habits*, James Clear — habit framing.
- The original 2014 Streaks app (iOS) — interaction reference.
