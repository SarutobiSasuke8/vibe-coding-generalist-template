---
type: session-log-index
status: active
mutability: living
---

# Session Logs

Use this folder for durable records of meaningful AI coding sessions.

## Logging Rule

Create or append a session log when a session includes one or more of:

- Architectural or product decisions.
- Multiple files touched.
- Debugging with important findings.
- A handoff another agent or future session will need.
- User feedback that changes project direction.
- Any work that should not be reconstructed from chat history.

Small one-line fixes do not need a session log unless the user asks.

## Logs

- [Agent Task CLI](2026-05-18-session-log-agent-task-cli.md)
- [Agentops Doctor CLI](2026-05-16-session-log-agentops-doctor-cli.md)
- [Agentic Runtime Scaffold](2026-05-16-session-log-agentic-runtime-scaffold.md)
- [Sample - Template Setup](2026-05-03-session-log-vibe-coding-template-optimization.md)

## Current Themes

- Strong agent contracts need both a canonical source and self-contained adapters.
- Practical agentic behavior needs state, memory, tool permissions, verification, and stop conditions.
- A read-only doctor command is a useful first bridge from scaffold to single-orchestrator operation.
- Stable task IDs plus queue movement commands make the single-orchestrator loop operable before scheduling.
- Session logs preserve decisions, rationale, verification, and handoff context.
- Strict validation should fail until a newly generated project replaces setup placeholders.
