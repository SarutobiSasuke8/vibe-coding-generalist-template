# Template Health Dashboard

The template health dashboard gives agents and humans one place to inspect readiness.

## Command

```bash
agentops health
```

Use JSON output for automation:

```bash
agentops health --json
```

## What It Checks

- agent doc alignment
- agent runtime readiness
- `DESIGN.md` presence and token coverage
- unresolved TODO placeholders in core setup files
- configured install/dev/test/lint/build commands
- session memory surface

## Status Meaning

| Status | Meaning |
|---|---|
| `pass` | The surface exists and appears ready. |
| `warn` | The surface exists but still needs project-specific setup. |
| `fail` | A required file, contract, or check is missing. |

## Recommended Use

Run health after:

- creating a project from the template
- running `agentops init`
- changing `AGENTS.md`, adapters, `DESIGN.md`, or project setup docs
- before handing the repo to another agent

Health is a dashboard, not a release gate. Use `agentops check`, `agentops design check`, tests, and project-specific verification for hard gates.
