# Vibe Coding Generalist Template

A reusable starter repo for AI-assisted software projects with aligned agent instructions, vibe coding personas, and drift checks.

Use this as a GitHub template repository when starting a new app, tool, prototype, automation, or experiment where several coding agents may touch the same codebase.

## What This Includes

- `AGENTS.md` - canonical operating contract for all AI coding agents.
- `CLAUDE.md` - Claude adapter aligned to `AGENTS.md`.
- `CODEX.md` - Codex adapter aligned to `AGENTS.md`.
- `GEMINI.md` - Gemini adapter aligned to `AGENTS.md`.
- `.github/copilot-instructions.md` - GitHub Copilot adapter.
- `.cursor/rules/vibe-coding-core.mdc` - Cursor always-on project rule.
- `TODO.md` - task capture and triage surface.
- `ROADMAP.md` - milestone and direction tracker.
- `personas/` - reusable product, design, engineering, QA, security, ops, delivery, research, data, and growth personas plus the council orchestration protocol.
- `docs/PERSONA_COUNCIL.md` - public-facing explainer for the persona council workflow.
- `docs/AGENT_OPERATING_PRINCIPLES.md` - shared principle explanation.
- `docs/AGENT_ALIGNMENT.md` - update protocol for keeping agent files in sync.
- `docs/PROJECT_BRIEF.md` - project context, constraints, and success criteria.
- `docs/SETUP_CHECKLIST.md` - first-use conversion checklist.
- `docs/SESSION_LOGGING.md` - rules for durable session memory.
- `Session Logs/` - append-only records for meaningful build sessions.
- `Templates/SESSION_LOG_TEMPLATE.md` - reusable session log format.
- `scripts/check-agent-docs.ps1` - local alignment check.
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
8. Keep `ROADMAP.md` high signal: direction, milestones, known tradeoffs.

## Persona Council

For multi-agent or multi-perspective work, use `personas/agent-council-protocol.md`.

The council lets a conductor route work through Product, Design, CTO, Code Review, QA, Security, Ops, Delivery, Research, Data, and Growth without producing eleven disconnected reports. See `docs/PERSONA_COUNCIL.md` for the public-facing overview.

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

## Suggested Repo Shape

```text
.
+-- .github/
|   +-- copilot-instructions.md
|   `-- workflows/
|       `-- agent-docs.yml
+-- .cursor/
|   `-- rules/
|       `-- vibe-coding-core.mdc
+-- docs/
|   +-- AGENT_ALIGNMENT.md
|   +-- AGENT_OPERATING_PRINCIPLES.md
|   +-- PERSONA_COUNCIL.md
|   +-- PROJECT_BRIEF.md
|   +-- SESSION_LOGGING.md
|   `-- SETUP_CHECKLIST.md
+-- personas/
|   +-- README.md
|   +-- agent-council-protocol.md
|   +-- aegis-defensive-security.md
|   +-- code-reviewer-maintainability.md
|   +-- cto-vibe-coding.md
|   +-- data-analytics-lead.md
|   +-- delivery-lead.md
|   +-- design-director-vibe-coding.md
|   +-- growth-launch-strategist.md
|   +-- head-of-product-vibe-coding.md
|   +-- ops-deployment-engineer.md
|   +-- qa-acceptance-tester.md
|   `-- research-scout.md
+-- Session Logs/
|   `-- _Session Logs Index.md
+-- scripts/
|   `-- check-agent-docs.ps1
+-- Templates/
|   `-- SESSION_LOG_TEMPLATE.md
+-- AGENTS.md
+-- CHANGELOG.md
+-- CLAUDE.md
+-- CODEX.md
+-- CONTRIBUTING.md
+-- GEMINI.md
+-- LICENSE
+-- ROADMAP.md
`-- TODO.md
```

## Operating Rhythm

- Keep the project brief current enough that a new agent can become useful fast.
- Put temporary work in `TODO.md`; promote durable direction into `ROADMAP.md`.
- Update `AGENTS.md` when repeated mistakes or repo-specific conventions appear.
- Use `personas/agent-council-protocol.md` for multi-persona audits, plans, reviews, and implementation handoffs.
- Capture meaningful multi-file or decision-heavy sessions in `Session Logs/`.
- Run `./scripts/check-agent-docs.ps1` after changing agent instructions.
- Use `./scripts/check-agent-docs.ps1 -Strict` after the template placeholders are replaced.
- Prefer small, verifiable changes over sprawling rewrites.
