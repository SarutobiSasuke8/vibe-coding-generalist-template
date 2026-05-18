# Vibe Coding Generalist Template

A reusable starter repo for AI-assisted software projects with aligned agent instructions, vibe coding personas, runtime memory, and drift checks.

Template version: `0.1.0`

Use this as a GitHub template repository when starting a new app, tool, prototype, automation, or experiment where several coding agents may touch the same codebase.

## What This Includes

- `AGENTS.md` - canonical operating contract for all AI coding agents.
- `CLAUDE.md` - Claude adapter aligned to `AGENTS.md`.
- `CODEX.md` - Codex adapter aligned to `AGENTS.md`.
- `GEMINI.md` - Gemini adapter aligned to `AGENTS.md`.
- `.github/copilot-instructions.md` - GitHub Copilot adapter.
- `.cursor/rules/vibe-coding-core.mdc` - Cursor always-on project rule.
- `agentops.config.yml` and `VERSION` - template metadata for checks and future upgrades.
- `TODO.md` - task capture and triage surface.
- `ROADMAP.md` - milestone and direction tracker.
- `Agent State/` - active run state and agent-executable task queue.
- `Memory/` - durable project facts, decisions, failures, and open questions.
- `personas/` - reusable product, design, engineering, QA, security, ops, delivery, research, data, and growth personas plus the council orchestration protocol.
- `workflows/` - reusable workflow packs for reviews, handoffs, retros, releases, session logs, and triage.
- `examples/` - completed example artifacts for users to copy from.
- `docs/` - product philosophy, setup, adapter strategy, command reference, project brief, quality ratchet, session logging, and agentic runtime rules.
- `QA/` - test plan, QA report, regression log, and agent behavior checks.
- `Session Logs/` - append-only records for meaningful build sessions.
- `Templates/SESSION_LOG_TEMPLATE.md` - reusable session log format.
- `scripts/check-agent-docs.ps1` - local alignment check.
- `scripts/check-agent-behavior.ps1` - local agentic scaffold check.
- `.github/workflows/agent-docs.yml` - CI check for agent doc drift.
- `.github/pull_request_template.md` and issue templates - lightweight collaboration hygiene.
- `.env.example`, `CONTRIBUTING.md`, `CHANGELOG.md` - starter repo basics.
- `LICENSE` - MIT license for reuse.

## First Setup

1. Create a new repo from this template.
2. Replace placeholder project details in `docs/PROJECT_BRIEF.md`.
3. Update `AGENTS.md` with stack-specific commands and conventions.
4. Run `./scripts/check-agent-docs.ps1`.
5. Complete `docs/SETUP_CHECKLIST.md`.
6. Run `./scripts/check-agent-docs.ps1 -Strict` once placeholders are replaced.
7. Convert `TODO.md` from starter tasks into the real working queue.
8. Read `docs/QUALITY_RATCHET.md` and decide the first critical behavior to put under contract.
9. Keep `ROADMAP.md` high signal: direction, milestones, known tradeoffs.
10. Read `docs/AGENT_EXECUTION_LOOP.md`, then define the first safe agent task in `Agent State/task-queue.md`.
11. Run `./scripts/check-agent-behavior.ps1` before relying on autonomous or semi-autonomous workflows.

## Claude Code Skill Pack

The template ships a set of Claude Code slash commands in `.claude/commands/`. These work automatically in any project created from this template when opened with Claude Code.

| Command | Purpose |
|---|---|
| `/council` | Full multi-persona council review orchestrated by the Conductor |
| `/product` | Head of Product - vibe check, scope, quality gates |
| `/cto` | CTO - architecture, technical tradeoffs, implementation plan |
| `/qa` | QA Acceptance Tester - acceptance criteria, ship-readiness |
| `/security` | AEGIS - security, privacy, prompt injection, secrets |
| `/code-review` | Code Reviewer - correctness, coupling, regression risk |
| `/research` | Research Scout - assumptions, options, unknowns, source quality |

All commands accept a task description as an argument, for example `/council review the auth flow before launch`. They read `docs/PROJECT_BRIEF.md` and `AGENTS.md` for project context automatically.

For Cursor, Codex, Gemini, and Copilot, use the persona docs in `personas/` directly as prompts.

## Persona Council

For multi-agent or multi-perspective work, use `/council` in Claude Code or `personas/agent-council-protocol.md` in other tools.

The council routes work through Product, Design, CTO, Code Review, QA, Security, Ops, Delivery, Research, Data, and Growth - producing one synthesized report, not eleven disconnected ones. See `docs/PERSONA_COUNCIL.md` for the full overview.

## Agent System

This template uses a canonical-contract pattern:

```text
AGENTS.md
  -> CLAUDE.md
  -> CODEX.md
  -> GEMINI.md
  -> .github/copilot-instructions.md
  -> .cursor/rules/vibe-coding-core.mdc
```

`AGENTS.md` owns the shared rules. The other files are adapters for specific tools. When agent behavior changes, update `AGENTS.md` first, then update the adapters and run the alignment check.

## Planned CLI

The template is designed to become a CLI-backed product. The first commands are intentionally conservative:

```bash
agentops check
agentops status
agentops next
agentops start
agentops complete
agentops block
agentops maintenance
agentops init
agentops sync
agentops doctor
```

Current CLI status:

- `agentops check` validates the repo agent operating layer.
- `agentops doctor` reports current agentic readiness and next action from `Agent State/`.
- `agentops status`, `next`, `start`, `complete`, and `block` operate the markdown task queue.
- `agentops maintenance` runs the first read-only autonomous maintenance check.
- `.github/workflows/agent-maintenance.yml` schedules the read-only maintenance check weekly and supports manual runs.
- `agentops init` fills the main template placeholders for a real project.
- `agentops sync` is still scaffolded.

The current source of truth remains the Markdown template plus PowerShell checks. CLI commands should call shared validation logic rather than replacing the file-based contract with hidden state.

## Suggested Repo Shape

```text
.
+-- .claude/
|   `-- commands/
+-- .github/
|   +-- copilot-instructions.md
|   +-- ISSUE_TEMPLATE/
|   `-- workflows/
+-- .cursor/
|   `-- rules/
+-- Agent State/
|   +-- agent-state.md
|   `-- task-queue.md
+-- Memory/
|   +-- decisions.md
|   +-- failures.md
|   +-- open-questions.md
|   `-- project-facts.md
+-- QA/
+-- Templates/
+-- docs/
+-- examples/
+-- personas/
+-- scripts/
+-- Session Logs/
+-- workflows/
+-- agentops.config.yml
+-- AGENTS.md
+-- CHANGELOG.md
+-- CLAUDE.md
+-- CODEX.md
+-- CONTRIBUTING.md
+-- GEMINI.md
+-- LICENSE
+-- README.md
+-- ROADMAP.md
+-- TODO.md
`-- VERSION
```

## Operating Rhythm

- Keep the project brief current enough that a new agent can become useful fast.
- Put temporary work in `TODO.md`; promote durable direction into `ROADMAP.md`.
- Update `AGENTS.md` when repeated mistakes or repo-specific conventions appear.
- Use `personas/agent-council-protocol.md` for multi-persona audits, plans, reviews, and implementation handoffs.
- Use `Agent State/` and `Memory/` for agentic work that needs resumable state.
- Use `docs/AGENT_TOOL_REGISTRY.md` and `docs/AGENT_PERMISSION_GATES.md` before tool-heavy or risky automation.
- Capture meaningful multi-file or decision-heavy sessions in `Session Logs/`.
- Use `docs/QUALITY_RATCHET.md` when behavior changes: tests, evals, smoke checks, or documented risk should accumulate.
- Run `./scripts/check-agent-behavior.ps1` after changing the agentic runtime scaffold.
- Record recurring bugs and edge cases in `QA/REGRESSION_LOG.md`.
- Run `./scripts/check-agent-docs.ps1` after changing agent instructions.
- Use `./scripts/check-agent-docs.ps1 -Strict` after the template placeholders are replaced.
- Prefer small, verifiable changes over sprawling rewrites.
