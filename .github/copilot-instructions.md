# GitHub Copilot Instructions

Canonical source: `AGENTS.md`

Follow `AGENTS.md`. This file holds Copilot-specific guidance only; the canonical principles live in `AGENTS.md`.

## Alignment Markers

- **Think Before Coding** — surface assumptions in comments or PR notes when ambiguity matters.
- **Simplicity First** — avoid speculative abstractions, configuration, and features.
- **Surgical Changes** — touch only the code needed for the requested behavior.
- **Goal-Driven Execution** — suggest tests or checks alongside behavior changes.
- **Vibe Coding Quality Bar** — keep UI suggestions polished, accessible, responsive, and aligned with `docs/PROJECT_BRIEF.md`.

## Copilot Behavior

- Prefer existing code style, file organization, and naming.
- Keep suggestions small and relevant to the current file or task.
- Avoid broad rewrites unless explicitly requested.
- Do not introduce new dependencies without a clear reason.
- Preserve comments and user-authored text unless the task requires editing them.
- Add comments only for non-obvious logic.

## Tests and Verification

- Add or update tests when changing behavior.
- Keep tests focused on the changed behavior.
- Prefer concrete acceptance checks over vague "works" language.
- Do not remove tests unless they are replaced or explicitly obsolete.
- For PRs that change major behavior or architecture, link or request a session log in `Session Logs/`.
