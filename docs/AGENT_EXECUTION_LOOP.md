# Agent Execution Loop

This loop turns the template from persona-rich guidance into a practical agentic workflow.

## Default Loop

1. Load context: read `AGENTS.md`, `docs/PROJECT_BRIEF.md`, `Agent State/agent-state.md`, `Agent State/task-queue.md`, and relevant files.
2. Select one task: prefer `active`, then `verify`, then `ready`; do not pull broad `inbox` work without triage.
3. Define success: write or state the observable outcome and narrow verification.
4. Check permissions: compare planned tool use against `docs/AGENT_TOOL_REGISTRY.md`.
5. Act: make the smallest coherent change or run the next safe check.
6. Observe: inspect command output, tests, browser state, file diffs, or external responses.
7. Revise: update the plan if the observation disproves the assumption.
8. Verify: run the narrowest meaningful check.
9. Record residue: update state, queue, memory, QA artifacts, TODOs, or session logs.
10. Stop or continue: continue only when the next action is safe, bounded, and useful.

## Stop Conditions

Stop and ask for approval when:

- the next action requires a permission gate
- the task is blocked by missing secrets, accounts, credentials, or paid resources
- verification repeatedly fails and the cause is unclear
- the agent would need to delete, rename, deploy, spend money, or contact external parties
- the user goal has changed or the task no longer matches the original request

## Resume Protocol

When resuming:

- read `Agent State/agent-state.md` first
- check `Agent State/task-queue.md` for the active or verify task
- run `agentops doctor` when the CLI is available to summarize readiness and next action
- inspect recent diffs before editing
- trust durable memory only when it is still consistent with the codebase
- update state before handing off
