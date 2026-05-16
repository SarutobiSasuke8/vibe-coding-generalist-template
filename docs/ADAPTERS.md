# Adapter Strategy

`AGENTS.md` is the canonical source. Adapter files translate the shared contract for specific tools.

## Adapter Files

| Tool | File |
|---|---|
| Claude | `CLAUDE.md` |
| Codex | `CODEX.md` |
| Gemini | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/vibe-coding-core.mdc` |

## Generated Sections

Future adapter sync should use generated-section markers:

```md
<!-- agentops:generated:start -->
Generated from AGENTS.md by agentops sync.
<!-- agentops:generated:end -->
```

Anything outside those markers is user-owned. Sync must preserve it unless the user explicitly approves overwriting it.

## Adapter Rules

- Include `Canonical source:` so humans and checks can trace the contract.
- Include the core principle names from `AGENTS.md`.
- Keep tool-specific guidance short.
- Do not contradict the canonical contract.
- Do not store product facts that belong in `docs/PROJECT_BRIEF.md`.
- Do not store live tasks that belong in `TODO.md` or `Agent State/task-queue.md`.

## Drift Policy

Adapters are allowed to differ in wording. They are not allowed to differ in authority, principles, permission gates, or handoff requirements.
