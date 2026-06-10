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

## Current Themes

Update this section as durable themes emerge from the logs. Keep entries non-sensitive: this index is committed even when the logs themselves are not.
