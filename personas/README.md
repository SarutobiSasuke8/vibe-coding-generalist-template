# Personas

This folder contains reusable role prompts for vibe-coded software projects.

Use one persona for a focused pass, or use `agent-council-protocol.md` when several personas should work together.

## Tiers

Personas come in two tiers. The drift check accepts an optional persona living in either `personas/` or `personas/optional/` — pick whichever fits your project's complexity.

### Core (always present in `personas/`)

- `head-of-product-vibe-coding.md`
- `cto-vibe-coding.md`
- `qa-acceptance-tester.md`

These three cover the minimum needed to make agent-driven work feel intentional, technically grounded, and verifiably done.

### Optional (in `personas/` or `personas/optional/`)

`scripts/init.ps1` (or `init.sh`) moves these into `personas/optional/` when you choose the **minimal** tier; choose **full** to keep them all in `personas/`.

- `design-director-vibe-coding.md`
- `code-reviewer-maintainability.md`
- `aegis-defensive-security.md`
- `ops-deployment-engineer.md`
- `delivery-lead.md`
- `research-scout.md`
- `data-analytics-lead.md`
- `growth-launch-strategist.md`

### When to promote an optional persona back to core

Move a persona out of `personas/optional/` and back into `personas/` when its concerns become recurring rather than situational. Examples:

- **Design Director** → core when UI work becomes the dominant surface.
- **Aegis** → core when the project handles user data, auth, or external traffic.
- **Ops Engineer** → core once a deploy pipeline exists.
- **Code Reviewer** → core once multiple agents or contributors regularly land changes.

Promotion is a one-line `git mv`; no other config changes needed.

## Council Orchestration

- `agent-council-protocol.md` - routing, sequence, conflict resolution, and shared report format for multi-persona work.

## Claude Code Subagents

Each persona has a thin subagent wrapper in `.claude/agents/` so Claude Code can run it as an isolated, read-only reviewer (and run several in parallel for council work). The wrappers load the persona file from `personas/` or `personas/optional/`, so the tier system needs no extra configuration. Persona files stay the single source of truth: edit the persona, and the subagent picks it up. See `docs/SUBAGENTS.md`.

## Template Safety

These personas are repo-neutral. They should not include private vault links, personal owner fields, or company-specific claims. `aegis-defensive-security.md` is a defensive security persona for the current repository and local development workflow, not a company-branded role.
