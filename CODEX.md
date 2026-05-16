# CODEX.md - Codex Coding Contract

Canonical source: `AGENTS.md`

Codex must follow `AGENTS.md`. This file is intentionally self-contained so Codex has the operating rules even when only this file is loaded.

## Alignment Markers

- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution
- Vibe Coding Quality Bar

## Mission

Implement useful, reliable, polished changes with minimal blast radius. Move from context to code to verification without inventing extra scope.

## 1. Think Before Coding

- Inspect relevant files before editing.
- State assumptions when they affect the implementation.
- Ask only when ambiguity materially changes the path.
- Surface tradeoffs when multiple options are plausible.
- Push back on overcomplicated or vibe-breaking requests.

## 2. Simplicity First

- Prefer existing project patterns.
- Avoid speculative abstractions and unused configuration.
- Add dependencies only when they clearly reduce complexity or risk.
- Keep APIs and state shape narrow.
- Simplify before handing off if the solution became bigger than the problem.

## 3. Surgical Changes

- Use scoped, patch-based edits.
- Do not reformat unrelated code.
- Do not delete or rename unrelated files.
- Preserve comments and user-authored text unless editing them is required.
- Clean up only artifacts introduced by your own changes.

## 4. Goal-Driven Execution

- Define success criteria for non-trivial changes.
- Bug fix: identify or reproduce the failure first when practical.
- Feature: verify the user-visible workflow.
- Refactor: verify unchanged behavior.
- Docs/scripts: verify paths, commands, and output.

## 5. Vibe Coding Quality Bar

- Protect the product feeling described in `docs/PROJECT_BRIEF.md`.
- For frontend work, check responsive layout, interaction states, and real rendering when practical.
- Favor complete core flows over scattered feature fragments.
- Treat loading, empty, and error states as part of the feature.

## Required Workflow

1. Inspect current state with fast search/file reads.
2. Make a short plan for multi-step work.
3. Edit only the necessary files.
4. Run the narrowest meaningful check.
5. Report changed behavior, verification, and residual risk.
6. Create or append a session log for meaningful multi-file, architectural, debugging, or handoff-heavy sessions.

## Agentic Runtime

For semi-autonomous work, use `Agent State/agent-state.md`, `Agent State/task-queue.md`, `Memory/`, `docs/AGENT_EXECUTION_LOOP.md`, `docs/AGENT_TOOL_REGISTRY.md`, and `docs/AGENT_PERMISSION_GATES.md`. Prefer one orchestrator with bounded specialist checks over broad persona swarms.

## Codex-Specific Emphasis

- Prefer `rg`/fast search when available.
- Use patch-based edits for manual file changes.
- Do not leave dev servers, watchers, or background jobs running unless requested.
- For UI work, verify the actual page when a dev server/browser is available.
- Use `Templates/SESSION_LOG_TEMPLATE.md` and `Session Logs/` when decisions or handoff context should persist.
- Run `./scripts/check-agent-behavior.ps1` after changing agent state, memory, permissions, or tool-routing docs.

## Handoff Format

- Main change:
- Verification:
- Remaining risk / next action:
