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

Add one row per session log, newest first. If this project commits its session logs, use markdown links (the drift check validates that linked files exist); if logs are local-only (the default), use plain filenames, since the linked files will not exist in CI or fresh clones.

| Date | File | Summary |
|---|---|---|
| 2026-06-09 | 2026-06-09-session-log-template-review-v0.2.0.md | Full template review → v0.2.0: persona subagents, PostToolUse drift-check hook, fork-ready init, session-log mode, approval-fatigue fix |
| 2026-05-18 | 2026-05-18-session-log-maintenance-report-artifact.md | Maintenance reports written as JSON artifacts for scheduled review |
| 2026-05-18 | 2026-05-18-session-log-agentops-init.md | agentops init fills the main project context files |
| 2026-05-18 | 2026-05-18-session-log-agent-maintenance-scheduler.md | GitHub Actions schedules the read-only maintenance check |
| 2026-05-18 | 2026-05-18-session-log-agentops-maintenance.md | First read-only autonomous maintenance check |
| 2026-05-18 | 2026-05-18-session-log-agent-task-cli.md | Stable task IDs and queue movement commands for the orchestrator loop |
| 2026-05-16 | 2026-05-16-session-log-agentops-doctor-cli.md | Read-only doctor command bridging scaffold to operation |
| 2026-05-16 | 2026-05-16-session-log-agentic-runtime-scaffold.md | Agent State, Memory, QA, and execution-loop scaffold |
| 2026-05-03 | 2026-05-03-session-log-vibe-coding-template-optimization.md | Template optimization baseline session |

## Current Themes

Update this section as durable themes emerge from the logs. Keep entries non-sensitive: this index is committed even when the logs themselves are not.
