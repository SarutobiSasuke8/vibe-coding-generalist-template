# CLAUDE.md - Claude Coding Contract

Canonical source: `AGENTS.md`

Claude must follow `AGENTS.md`. This file holds Claude-specific guidance only; the principles, operating loop, commands, and handoff standard live in `AGENTS.md`.

## Alignment Markers

Claude is bound by all five principles defined in `AGENTS.md`:

- **Think Before Coding** — surface assumptions, ask when ambiguity changes implementation, present tradeoffs.
- **Simplicity First** — minimum code that solves the real problem; no speculative features or abstractions.
- **Surgical Changes** — every changed line traces to the request; no drive-by refactors.
- **Goal-Driven Execution** — define success criteria, verify the actual behavior.
- **Vibe Coding Quality Bar** — protect the product feeling defined in `docs/PROJECT_BRIEF.md`.

## Required Workflow

1. Read `AGENTS.md`, `docs/PROJECT_BRIEF.md`, and the files relevant to the task.
2. State assumptions and success criteria before non-trivial work.
3. Make the smallest coherent change.
4. Run the narrowest meaningful verification.
5. Report change, files, verification, and residual risk.
6. Append a session log under `Session Logs/` for multi-file, architectural, debugging, or handoff-heavy work, using `Templates/SESSION_LOG_TEMPLATE.md`.

## Claude-Specific Emphasis

- **Plan mode etiquette.** Use plan mode for non-trivial implementations; write the plan to the location prompted, then call `ExitPlanMode`. Do not silently switch from plan to edit.
- **Hooks and settings.** Project-level Claude Code config lives in `.claude/settings.json`; per-machine overrides go in `.claude/settings.local.json` (gitignored).
- **Slash commands.** Use `/session-log`, `/drift-check`, and `/handoff` from `.claude/commands/` for the recurring workflows in this repo.
- **Subagents.** Persona subagents live in `.claude/agents/` — isolated, read-only reviewers. `/council` and `/review` fan out to them; use `code-reviewer` or `qa-acceptance-tester` to verify your own multi-file work. See `docs/SUBAGENTS.md`.
- **Todos.** For tasks with 3+ steps, drive work via the todo list and keep exactly one item `in_progress`.
- **Uncertainty.** Be explicit about what was verified vs assumed. Do not paper over confusion with fluent prose.
- **Drift check.** After editing any agent doc, run `./scripts/check-agent-docs.sh` (macOS/Linux) or `./scripts/check-agent-docs.ps1` (Windows). A `PostToolUse` hook in `.claude/settings.json` also runs it automatically after agent-doc edits; treat hook failures as blocking.

## Handoff Format

- Change:
- Files:
- Verification:
- Risks / follow-ups:
