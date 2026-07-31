# Template Modes

Template modes let a project choose the amount of operating structure it needs.

## Modes

| Mode | Use when | Keep |
|---|---|---|
| `lite` | A quick prototype, small script, or throwaway experiment needs agent clarity without heavy process. | `AGENTS.md`, `DESIGN.md`, `docs/PROJECT_BRIEF.md`, `TODO.md`, `README.md`, core checks |
| `standard` | Most product, app, automation, and internal-tool projects. | Everything in lite plus personas, QA, workflows, setup checklist, command reference |
| `full-agentic` | The repo will use semi-autonomous agents, recurring maintenance, or handoffs across sessions/tools. | Everything in standard plus `Agent State/`, `Memory/`, session logs, maintenance workflows, permission gates |

## Default

Use `standard` unless the project clearly wants either minimalism or a durable autonomous workflow.

## Init Guidance

Use:

```bash
agentops init --mode standard --desired-vibe "calm, fast, and trustworthy" --adapt-design "Use the default DESIGN.md and tighten density for operational screens."
```

Mode is recorded in `agentops.config.yml` and `Memory/project-facts.md`. It is intentionally advisory for now: the template does not delete files automatically. Pruning should be explicit so project history and user-authored work are not lost.

## Agent Guidance

- In `lite`, avoid invoking the full council unless the user asks.
- In `standard`, use specialist personas as review lenses for meaningful product, design, security, QA, or architecture decisions.
- In `full-agentic`, keep `Agent State/`, `Memory/`, and session logs current enough for another agent to resume safely.
