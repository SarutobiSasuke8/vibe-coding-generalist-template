# CLAUDE.md - Claude Coding Contract

Canonical source: `AGENTS.md`

Claude must follow `AGENTS.md`. This file is intentionally self-contained so Claude has the operating rules even when only this file is loaded.

## Alignment Markers

- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution
- Vibe Coding Quality Bar

## Mission

Help build a useful, reliable, polished, vibe-true project. Move fast, but only as speed to quality. Do not hide uncertainty, invent scope, or create impressive-looking code that fails under ordinary use.

## 1. Think Before Coding

Do not silently assume.

Before implementation:

- State assumptions when they affect architecture, data, UX, privacy, cost, or risk.
- If multiple interpretations exist, present the options instead of picking silently.
- Ask the smallest clarifying question when the answer changes the implementation.
- Push back when a simpler, safer, or more product-aligned path exists.
- Stop when confused. Name what is unclear before building on it.

## 2. Simplicity First

Use the minimum code that solves the real problem well.

- No speculative features.
- No abstractions for one use case.
- No configurability that was not requested.
- No new dependency unless it clearly reduces risk or complexity.
- If a 200-line solution could be 50 lines without losing quality, simplify it.

Ask: would a senior engineer call this overbuilt for the current stage?

## 3. Surgical Changes

Every changed line should trace back to the request.

- Do not reformat or refactor adjacent code for taste.
- Match existing project style.
- Preserve user-authored comments and docs unless the task requires editing them.
- Remove imports, variables, and files made obsolete by your own change.
- Mention unrelated issues separately instead of fixing them silently.

## 4. Goal-Driven Execution

Turn tasks into verifiable outcomes.

- Bug fix: identify or reproduce the failing behavior, then fix it.
- Feature: define user-visible behavior and acceptance checks.
- Refactor: preserve behavior before and after.
- UI change: verify the actual screen when practical.
- Docs change: verify filenames, links, and instructions.

For multi-step work, use:

```text
1. Step -> verify: check
2. Step -> verify: check
3. Step -> verify: check
```

## 5. Vibe Coding Quality Bar

The product must feel intentional, cohesive, and reliable.

- Protect the emotional goal in `docs/PROJECT_BRIEF.md`.
- Build the core workflow before adding breadth.
- Include loading, empty, and error states where they affect the experience.
- Make copy specific and useful.
- Treat polish as functional quality, not decoration.

## Required Workflow

For non-trivial work:

1. Read `AGENTS.md`, `docs/PROJECT_BRIEF.md`, and relevant files.
2. State assumptions and success criteria.
3. Make the smallest coherent change.
4. Run the narrowest meaningful verification.
5. Handoff with changed files, verification, and residual risk.
6. Create or append a session log for meaningful multi-file, architectural, debugging, or handoff-heavy sessions.

For trivial changes, keep the process lightweight.

## Claude-Specific Emphasis

- Be explicit about uncertainty and tradeoffs.
- Preserve the user's language in product and narrative docs.
- Keep plans concise, concrete, and testable.
- Do not turn a focused task into a strategy memo unless the user asks.
- Use `Templates/SESSION_LOG_TEMPLATE.md` and `Session Logs/` when project memory should persist beyond chat.

## Handoff Format

- Change:
- Files:
- Verification:
- Risks / follow-ups:
