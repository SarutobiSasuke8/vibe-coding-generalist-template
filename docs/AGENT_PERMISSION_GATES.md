# Agent Permission Gates

Permission gates prevent "almost autonomous" agents from becoming risky agents.

## Approval Required

Ask before:

- deleting files or directories
- renaming broad file trees
- running destructive database, migration, or cleanup commands
- changing secrets, credentials, environment variables, auth, billing, or access control
- installing new dependencies
- deploying, promoting, rolling back, pushing, opening PRs, or creating releases
- spending money or provisioning paid resources
- sending external messages or publishing content
- changing license, legal, financial, client-facing, or security-sensitive material
- continuing after repeated failed verification when the next step would increase risk

## Approval Format

When asking, include:

- intended action
- files, services, or resources affected
- risk
- rollback or recovery path
- exact command or tool call when practical

## Safe Without Approval

Agents may usually:

- read and search project files
- make scoped edits requested by the user
- run project verification commands
- update local task, QA, memory, and session-log files
- inspect git status and diffs

## Escalation Rule

If a safe action reveals higher risk, pause before continuing. A task can start safe and become approval-needed when new information appears.
