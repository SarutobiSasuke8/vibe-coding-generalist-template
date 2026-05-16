# Why This Template Exists

AI coding tools are powerful, but most repos still brief them through scattered chat context, stale prompt files, and tool-specific instructions that drift apart.

This template gives a repo a durable operating layer:

- `AGENTS.md` defines the shared contract.
- Tool adapters keep Claude, Codex, Cursor, Copilot, and Gemini aligned.
- `docs/PROJECT_BRIEF.md` keeps product context outside chat.
- `Agent State/` and `Memory/` make longer agentic work resumable.
- Personas and workflows give agents focused operating modes.
- Checks catch missing files, drift, private references, placeholders, and broken structure.

The goal is not ceremony. The goal is to make AI-assisted work predictable enough that a new agent can enter the repo, understand the project, make a bounded change, verify it, and leave behind useful memory.

## Product Position

This is agent ops for software repos.

It sits above individual coding agents. Claude, Codex, Cursor, Copilot, and Gemini may all touch the codebase, but the repo should own the durable rules.

## Design Principles

- The repo is the source of truth.
- Humans can inspect every rule.
- Generated sections are clearly marked.
- Checks should catch drift before humans feel it.
- Minimal mode should stay genuinely small.
- Workflow packs are optional and installable.
- Hosted or team features come later, after the local contract works.

## Non-Goals

- Replace Git.
- Replace task management systems.
- Require an AI API key.
- Require a hosted account.
- Hide policy in a remote dashboard.
- Turn every project into a heavyweight process.
