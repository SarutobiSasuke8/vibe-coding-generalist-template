# CLI Roadmap

This repo should stay focused on becoming a release-worthy public template before CLI work splits out.

The CLI is the next product layer: a command-line tool that automates project initialization, agent-doc checks, adapter sync, repo health reporting, and future upgrades.

## Current Position

The template is the source of truth for now.

Do not split a CLI repo until the template is stable enough that a user can fork it, run init, pass checks, and understand the operating model without private explanation.

## Why a CLI?

The current template asks users to manually understand and maintain several files:

- `AGENTS.md`
- tool-specific adapters
- `docs/PROJECT_BRIEF.md`
- persona files
- session log structure
- drift checks
- setup checklist

A CLI turns that into a guided workflow.

Instead of "copy these files and edit TODOs," the experience becomes:

```bash
vibe init
vibe check
vibe sync
vibe doctor
```

## Recommended Split Point

Split CLI work into a second repo or package only after these are true:

- README quickstart is accurate.
- PowerShell init smoke test passes.
- Bash init smoke test passes in CI.
- Standard drift check passes locally and in CI.
- Strict mode behavior is documented.
- Minimal and full persona tier behavior is verified.
- Template version metadata exists.
- `docs/WHY.md` explains the public philosophy.
- A `v0.1.0` release can be tagged with confidence.

Until then, keep improving this repo.

## MVP Commands

### `vibe init`

Initializes a repo by asking setup questions and writing the right files.

Responsibilities:

- Project name.
- Project type or stage.
- Product goal or vibe.
- Primary user.
- Primary agent.
- Enabled agent tools.
- Persona tier.
- Install, dev, test, lint, and build commands.
- Placeholder replacement.
- Drift check after setup.

### `vibe check`

Runs the agent-doc alignment checks.

Responsibilities:

- Required file checks.
- Adapter marker checks.
- Adapter line limits.
- Canonical heading checks.
- Persona location checks.
- Session log index checks.
- Strict placeholder checks.
- Optional JSON output for CI.

### `vibe sync`

Regenerates thin adapter files from the canonical contract.

Responsibilities:

- Preserve tool-specific notes.
- Regenerate generated sections.
- Report diffs.
- Support dry-run mode.
- Avoid overwriting user-owned sections silently.

### `vibe doctor`

Reports agent-readiness health.

Responsibilities:

- Missing project brief.
- Missing verification commands.
- Stale placeholders.
- Adapter drift.
- Missing session log structure.
- Weak or empty roadmap.
- Recommended next actions.

## Non-Goals for CLI MVP

The first CLI should not:

- Require a hosted account.
- Require AI API keys.
- Manage secrets.
- Replace Git.
- Become a full task manager.
- Generate stack-specific app code.
- Hide the Markdown files from the user.

The CLI should make the file-based system easier to use, not turn it into a black box.

## Possible Package Shapes

### Separate Repo

Use when:

- The CLI needs its own release cadence.
- It gains dependencies or build tooling.
- It is published as a package or binary.

Possible names:

- `vibe-cli`
- `agentops-cli`
- `agent-ops-os`

### Monorepo

Use when:

- The template and CLI need to evolve together.
- Shared fixtures and templates become important.
- There are multiple packages: core, CLI, studio, packs.

Possible shape:

```text
agent-ops-os/
  packages/
    core/
    cli/
    templates/
    checks/
  examples/
  docs/
```

## Implementation Language

Recommended first choice: TypeScript.

Reasons:

- Fast iteration.
- Familiar to many web/tooling developers.
- Good CLI libraries.
- Easy JSON/YAML handling.
- Natural path to a future local web UI.

Alternatives:

- Go for single-binary distribution.
- Python for script-like speed.
- Rust for maximum robustness, with slower iteration.

## Future Product Layers

After CLI MVP:

- Template upgrade system.
- Persona and workflow packs.
- `vibe studio` local browser UI.
- Multi-repo scanning.
- Hosted dashboard.
- Team governance.
- Optional pack registry.

## Guiding Rule

The CLI should only split out when it is clearly automating stable behavior.

If the behavior is still being discovered, keep it in the template. If the behavior is stable and repetitive, move it into the CLI.
