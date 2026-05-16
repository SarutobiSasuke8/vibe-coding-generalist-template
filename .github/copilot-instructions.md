# GitHub Copilot Instructions

Canonical source: `AGENTS.md`

Follow `AGENTS.md`. This file is intentionally self-contained enough to guide Copilot suggestions in editors and pull requests.

## Alignment Markers

- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution
- Vibe Coding Quality Bar

## Core Rules

- Prefer existing code style, file organization, and naming.
- Keep suggestions small and relevant to the current file or task.
- Avoid broad rewrites unless explicitly requested.
- Do not introduce new dependencies without a clear reason.
- Preserve comments and user-authored text unless the task requires editing them.
- Add comments only for non-obvious logic.
- Preserve session logging files and templates when changing project workflow docs.
- Preserve `Agent State/`, `Memory/`, and agent permission docs when suggesting agentic workflow changes.

## Coding Principles

- Think Before Coding: surface assumptions in comments or PR notes when ambiguity matters.
- Simplicity First: avoid speculative abstractions, config, and features.
- Surgical Changes: touch only the code needed for the requested behavior.
- Goal-Driven Execution: suggest tests or checks with behavior changes.
- Vibe Coding Quality Bar: keep UI suggestions polished, accessible, responsive, and aligned with the project brief.

## Tests and Verification

- Add or update tests when changing behavior.
- Keep tests focused on the changed behavior.
- Prefer concrete acceptance checks over vague "works" language.
- Do not remove tests unless they are replaced or explicitly obsolete.
- If a PR changes major behavior or architecture, update or request a session log in `Session Logs/`.
- If a PR changes agentic behavior, update or request `QA/AGENT_BEHAVIOR_CHECKS.md` and `./scripts/check-agent-behavior.ps1`.
