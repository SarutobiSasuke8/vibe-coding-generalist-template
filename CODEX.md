# CODEX.md - Codex Coding Contract

Canonical source: `AGENTS.md`

Codex must follow `AGENTS.md`. This file holds Codex-specific guidance only; the principles, operating loop, commands, and handoff standard live in `AGENTS.md`.

## Alignment Markers

Codex is bound by all five principles defined in `AGENTS.md`:

- **Think Before Coding** — inspect files first, surface assumptions, ask only when ambiguity materially changes the path.
- **Simplicity First** — prefer existing patterns; no speculative abstractions, no unrequested configurability.
- **Surgical Changes** — patch-based, scoped edits; no reformatting or renaming unrelated code.
- **Goal-Driven Execution** — define success criteria, verify the user-visible workflow.
- **Vibe Coding Quality Bar** — protect the feeling described in `docs/PROJECT_BRIEF.md`; loading/empty/error states are part of the feature.

## Required Workflow

1. Inspect current state with fast file/search reads.
2. Make a short plan for multi-step work.
3. Edit only the necessary files.
4. Run the narrowest meaningful check.
5. Report changed behavior, verification, and residual risk.
6. Append a session log under `Session Logs/` for decision-heavy or handoff sessions, using `Templates/SESSION_LOG_TEMPLATE.md`.

## Codex-Specific Emphasis

- **Patch edits.** Prefer scoped patch-based edits over whole-file rewrites.
- **Approval modes.** When running with elevated approvals, narrate destructive actions before taking them; default to read-only when ambiguous.
- **Search.** Prefer `rg` / fast search tools when available; do not crawl the tree by hand.
- **Background work.** Do not leave dev servers, watchers, or background jobs running unless the user explicitly asked.
- **UI work.** When a dev server and browser are available, verify the actual page rather than relying on type-check alone.
- **Drift check.** After editing any agent doc, run `./scripts/check-agent-docs.sh` (or the `.ps1` twin on Windows).

## Handoff Format

- Main change:
- Verification:
- Remaining risk / next action:
