# Project Brief

This is the project context agents should read before product, architecture, UI, or roadmap work.

## Summary

A forkable, public template that gives any software repo a living agent operating layer. It aligns Claude Code, Codex, Cursor, Gemini, and Copilot to one canonical contract, ships a persona council, enforces alignment with a drift check, and provides the session memory and workflow rituals that prevent AI-assisted work from degrading over time.

The template is the first layer. The longer trajectory is a CLI and toolchain that automates what the template currently asks humans to do manually: initialize projects, sync adapters, verify alignment, and upgrade over time.

## Vibe

- Desired feeling: Disciplined but not bureaucratic. Like working with a capable, well-briefed teammate rather than a stranger you have to brief from scratch every session.
- Reference products / experiences: Thoughtful CLI tools that explain themselves. Projects where the README earns trust in under 5 minutes.
- Anti-vibe: Bloated boilerplate. Process theatre. Templates that look impressive but fail under ordinary use.
- First impression target: A developer forks this, reads the README, and immediately understands what it does and why it is worth the setup cost.

## User

- Primary user: Solo builders, indie hackers, and vibe coders who use AI coding agents heavily and want their repos to stay coherent as projects grow.
- Secondary users: Small team leads and senior engineers who want shared agent standards without heavyweight process.
- User skill level: Comfortable with Git, Markdown, and at least one AI coding tool. Not assumed to be DevOps or toolchain experts.
- Context of use: At the start of a new project (init), during active development (workflows, session logs), and when onboarding a new agent or contributor (brief, drift check).

## Problem

Modern software teams use multiple AI coding tools at once. Each tool has different instruction formats, memory behavior, and strengths. Without a shared operating contract, teams get inconsistent agent behavior, duplicated context, stale instructions, weak verification, and decisions trapped in chat that no future agent can find.

The deeper problem is that AI agents are powerful but stateless. They forget everything between sessions. They will confidently build the wrong thing if context is missing. They will do drive-by refactors, invent features, and ignore quality bars unless told otherwise. Most repos have no systematic answer to this.

## Product Promise

When a developer opens a repo built on this template, any AI agent should quickly understand:

- What this project is trying to become.
- What quality bar matters here.
- Which files contain durable context.
- How to plan, build, review, verify, and hand off work.
- Which personas or specialist lenses to apply.
- What not to touch.
- What has already been decided.
- How to keep instructions aligned as the project evolves.

## Core Workflows

1. **Init** - developer forks or clones, runs `./scripts/init.sh`, answers setup questions, and gets a fully configured agent-ready repo with no required placeholders remaining.
2. **Daily use** - agent reads `AGENTS.md` and `docs/PROJECT_BRIEF.md`, does work, creates or appends a session log, and hands off cleanly using `/handoff`.
3. **Drift check** - after changing any agent instruction file, developer or CI runs `./scripts/check-agent-docs.sh` to confirm adapters are aligned and under line limits.

## Success Criteria

- A stranger can fork the template, run init, and have a fully configured repo in under 15 minutes.
- Any AI agent handed this repo produces better-scoped, better-verified work than it would without the contract.
- `./scripts/check-agent-docs.sh --strict` passes after a clean init with no manual intervention.
- The README earns a developer's trust in under 5 minutes.

## Non-Goals

- This template does not generate, run, or host code. It governs how AI agents operate inside a repo.
- It does not replace Git, task managers, or project management tools.
- It does not require AI API keys, accounts, or external services.
- It does not manage secrets or credentials.
- Stack-specific scaffolding (Next.js, Rails, etc.) is intentionally out of scope - the template is stack-agnostic.

## Constraints

- Time: Maintained as a side project; scope must be achievable without a full-time team.
- Budget: Zero infrastructure cost. No hosted services required to use the template.
- Stack: Markdown, shell scripts (bash + PowerShell), and GitHub Actions. No build step for the template itself.
- Deployment target: Public GitHub repository used as a template.
- Data sensitivity: No user data. All context lives in the user's own repo files.
- Performance expectations: Drift check should complete in under 5 seconds on any reasonable machine.
- Accessibility expectations: All docs must be readable as plain Markdown without rendering.

## Quality Gates

- Fresh fork + init produces a repo where `check-agent-docs.sh --strict` passes.
- All adapter files stay under their line limits (drift check enforces this).
- README quickstart is accurate: every command listed runs without error.
- CI runs checks on every PR.
- No required placeholders remain in generated output after a full init.

## Technical Notes

- Architecture: File-based. The canonical contract is `AGENTS.md`. Thin adapters point at it. Scripts validate alignment.
- Data model: Markdown files with defined heading structures. No database.
- External services: GitHub (hosting, CI). No others required.
- Authentication/authorization: Not applicable. Public repo.
- Observability/logging: Session logs in `Session Logs/` using `Templates/SESSION_LOG_TEMPLATE.md`.

## Open Questions

- [ ] Should the CLI live in this repo or a separate one?
- [ ] What is the minimum config schema that covers init without requiring YAML knowledge?
- [ ] When does the template need explicit versioning to support safe upgrades?

## References

- [`AGENTS.md`](../AGENTS.md) - canonical agent contract
- [`docs/AGENT_OPERATING_PRINCIPLES.md`](AGENT_OPERATING_PRINCIPLES.md) - principles behind the operating loop
- [`docs/examples/PROJECT_BRIEF.example.md`](examples/PROJECT_BRIEF.example.md) - filled-in example
- [`ROADMAP.md`](../ROADMAP.md) - phased milestones and decisions
