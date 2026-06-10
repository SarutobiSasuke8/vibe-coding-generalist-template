# Agent Alignment

This template uses one canonical contract plus multiple tool adapters.

## Source of Truth

`AGENTS.md` is canonical.

Adapters must support it, not redefine it:

- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/vibe-coding-core.mdc`

Principle explanations live in:

- `docs/AGENT_OPERATING_PRINCIPLES.md`
- `docs/PERSONA_COUNCIL.md`

Persona prompts live in:

- `personas/head-of-product-vibe-coding.md`
- `personas/cto-vibe-coding.md`
- `personas/agent-council-protocol.md`
- `personas/design-director-vibe-coding.md`
- `personas/code-reviewer-maintainability.md`
- `personas/qa-acceptance-tester.md`
- `personas/delivery-lead.md`
- `personas/ops-deployment-engineer.md`
- `personas/research-scout.md`
- `personas/data-analytics-lead.md`
- `personas/growth-launch-strategist.md`
- `personas/aegis-defensive-security.md`

## Required Shared Markers

Every adapter must include these markers:

- `Canonical source:`
- `Think Before Coding`
- `Simplicity First`
- `Surgical Changes`
- `Goal-Driven Execution`
- `Vibe Coding Quality Bar`

These markers make drift easier to catch.

## Update Protocol

When changing agent behavior:

1. Update `AGENTS.md` first.
2. Update `docs/AGENT_OPERATING_PRINCIPLES.md` if the principle explanation changed.
3. Update each adapter only with tool-specific emphasis.
4. Update persona files when role routing, council behavior, or handoff rules change. Subagent wrappers in `.claude/agents/` load persona files at runtime and rarely need edits; touch them only when a persona is added, renamed, or removed.
5. Run `./scripts/check-agent-docs.sh` (or `./scripts/check-agent-docs.ps1` on Windows).
6. Update `README.md` if files, setup steps, or template structure changed.
7. When adding a slash command to `.claude/commands/`, list it in `AGENTS.md` — the drift check enforces this.

## Adapter Rule

Adapters should be thin.

Good adapter content:

- Tool-specific workflow notes.
- Handoff format.
- Any known limitation of that agent/tool.

Bad adapter content:

- A second full copy of `AGENTS.md`.
- Contradictory principles.
- Project facts that belong in `docs/PROJECT_BRIEF.md`.
- Roadmap items that belong in `ROADMAP.md`.

## Drift Check

Run:

```bash
./scripts/check-agent-docs.sh     # macOS / Linux / git-bash
./scripts/check-agent-docs.ps1    # Windows PowerShell
```

The check fails if required files, required headings, adapter markers, minimum self-contained adapter content, subagent frontmatter, or the AGENTS.md slash-command listing are missing.

Use strict mode after a new project has replaced starter placeholders:

```bash
./scripts/check-agent-docs.sh --strict
./scripts/check-agent-docs.ps1 -Strict
```

Strict mode also fails on unresolved `TODO` placeholders in the highest-impact setup files.
