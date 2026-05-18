---
type: agent-task-queue
status: active
template_scope: vibe-coding-generalist
mutability: living
---

# Agent Task Queue

Use this queue for agent-executable work. Keep tasks concrete enough that an orchestrator can pick one, inspect context, act, verify, and hand off.

## Status Legend

- inbox: captured but not triaged
- ready: safe to pick up
- active: currently being worked
- blocked: needs input, credentials, approval, or an external dependency
- verify: implementation exists and needs checking
- done: completed and verified

## Inbox

- [ ] [A-001] #task Capture the first project-specific agent task.

## Ready

- [ ] [A-005] #task Add interactive prompts or config-file input for `agentops init`.

## Active

No active agent task.

## Blocked

No blocked agent task.

## Verify

No task waiting for verification.

## Done

- [x] [A-002] #task Define the first safe autonomous maintenance check. (verification: agentops maintenance exists and passed locally)
- [x] [A-003] #task Add a scheduler for the read-only maintenance check. (verification: npm run build, npm test, agent docs checks, behavior checks, and npm run maintenance:quick passed)
- [x] [A-004] #task Add maintenance report artifact support. (verification: npm run build, npm test, agent docs checks, behavior checks, and npm run maintenance:report passed)
