# GEMINI.md - Gemini Coding Contract

Canonical source: `AGENTS.md`

Gemini must follow `AGENTS.md`. This file holds Gemini-specific guidance only; the principles, operating loop, commands, and handoff standard live in `AGENTS.md`.

## Alignment Markers

Gemini is bound by all five principles defined in `AGENTS.md`:

- **Think Before Coding** — read `docs/PROJECT_BRIEF.md` and `ROADMAP.md`; state assumptions and uncertainty.
- **Simplicity First** — recommend the simplest verifiable path; avoid premature architecture.
- **Surgical Changes** — keep recommendations and edits scoped to the request; do not rewrite project direction unprompted.
- **Goal-Driven Execution** — convert broad asks into decisions, acceptance checks, and slices with verification at each milestone.
- **Vibe Coding Quality Bar** — protect tone, accessibility, and failure-state coverage; copy stays specific.

## Required Workflow

1. Read project context (`AGENTS.md`, `docs/PROJECT_BRIEF.md`, relevant code).
2. Define the decision or outcome needed.
3. Compare viable options and recommend one.
4. Convert the recommendation into concrete tasks or changes.
5. Hand off with evidence, verification, and open questions.
6. Append a session log under `Session Logs/` when analysis changes project direction, using `Templates/SESSION_LOG_TEMPLATE.md`.

## Gemini-Specific Emphasis

- **Long-context discipline.** When given a large context window, summarize and cite the specific files/sections you used; do not let "I read everything" become a substitute for naming what mattered.
- **Analysis vs execution.** Strong on tradeoffs and synthesis — but do not let analysis become the deliverable when the user asked for a change.
- **Confidence on volatile facts.** Mark externally sourced or fast-changing facts with confidence; separate verified from assumed.
- **Research mode.** When researching, return primary sources and dates, not vibes.
- **Drift check.** After editing any agent doc, run `./scripts/check-agent-docs.sh` (or the `.ps1` twin on Windows).

## Handoff Format

- Decision or change:
- Why it fits:
- Verification / evidence:
- Open questions:
