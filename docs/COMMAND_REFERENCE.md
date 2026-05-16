# Command Reference

## Current Scripts

### `./scripts/check-agent-docs.ps1`

Validates the repo-level agent operating layer.

Useful options:

```powershell
./scripts/check-agent-docs.ps1
./scripts/check-agent-docs.ps1 -Strict
./scripts/check-agent-docs.ps1 -Json
```

The check covers required files, canonical headings, adapter markers, adapter safety phrases, private template leaks, workflow metadata, config metadata, and selected broken Markdown links.

### `./scripts/check-agent-behavior.ps1`

Validates the agentic runtime scaffold:

- `Agent State/`
- `Memory/`
- `docs/AGENT_EXECUTION_LOOP.md`
- `docs/AGENT_TOOL_REGISTRY.md`
- `docs/AGENT_PERMISSION_GATES.md`
- `QA/AGENT_BEHAVIOR_CHECKS.md`

Run it after changing tool permissions, state files, memory conventions, or execution-loop rules.

## Planned CLI

### `agentops check`

Cross-platform version of the current validation script. It should support human-readable output, JSON output, strict mode, and CI-friendly exit codes.

### `agentops init`

Initialize a repo from the template. Early versions can copy files and prompt for project metadata. Later versions should support minimal, standard, and full modes.

### `agentops sync`

Regenerate generated adapter sections from `AGENTS.md` while preserving custom sections.

### `agentops doctor`

Report current agentic readiness and the next useful action from `Agent State/` and `Memory/`.

```bash
agentops doctor
agentops doctor --json
agentops doctor --root ./some-project
```

The doctor command checks runtime files, summarizes current goal, active task, next ready task, blockers, verification status, and suggests the next action for a single-orchestrator agent run.
