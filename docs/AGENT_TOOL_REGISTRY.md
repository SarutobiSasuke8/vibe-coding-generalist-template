# Agent Tool Registry

Use this registry to decide what an agent may do alone, what needs approval, and what is forbidden.

## Safety Classes

- safe: may run without asking when scoped to the task
- approval-needed: ask before running
- forbidden: do not run

## Default Tools

| Tool / Action | Class | Notes |
|---|---|---|
| Read files, search files, inspect git status | safe | Prefer fast, non-destructive commands. |
| Edit project files | safe | Keep edits scoped and preserve user-authored work. |
| Run tests, lint, type checks, builds | safe | Stop if the command appears destructive or unexpectedly expensive. |
| Browser smoke tests on local apps | safe | Use for UI verification when a dev server is available. |
| Create session logs, QA notes, TODO entries, memory updates | safe | Keep durable residue concise and useful. |
| Install dependencies | approval-needed | May change lockfiles, security posture, or spend time/network. |
| Start long-running services | approval-needed | Use only when needed; stop or report running sessions. |
| Commit changes | approval-needed | Allowed when the user explicitly asks for a commit. |
| Push branches, open PRs, deploy, promote releases | approval-needed | External side effects require approval. |
| Modify secrets, environment variables, credentials, auth settings | approval-needed | Never expose secret values in logs or docs. |
| Send email, Slack, Discord, social posts, or external messages | approval-needed | Human approval required for outbound communication. |
| Purchase domains, paid APIs, cloud resources, ads, or subscriptions | approval-needed | Spending requires explicit approval. |
| Delete files, rename large trees, rewrite history, force push | approval-needed | Must explain scope and risk first. |
| Exfiltrate secrets, bypass access controls, disable security gates | forbidden | Refuse and propose a safe alternative. |

## Tool Use Notes

- Use the least powerful tool that can complete the step.
- Capture failed commands in `Memory/failures.md` only when the failure can recur.
- Add project-specific tools here when a repo gains APIs, deploy targets, databases, queues, or automations.
