# Session Logging

Session logs preserve project memory that would otherwise disappear into chat.

This template borrows the vault pattern used in larger project logs:

- executive summary
- trigger
- starting state
- work completed
- decisions
- files touched
- verification
- open threads
- what worked
- what to do differently
- connected references

## Where Logs Live

Use:

```text
Session Logs/
```

Actual session logs are local-only by default. They are ignored by Git so private strategy, handoff context, local paths, and working notes do not accidentally ship to GitHub.

Keep only the public folder index tracked:

```text
Session Logs/_Session Logs Index.md
```

Use the reusable template:

```text
Templates/SESSION_LOG_TEMPLATE.md
```

## When To Log

Create or append a session log when a session includes:

- meaningful product or architecture decisions
- multi-file implementation work
- debugging findings worth preserving
- user feedback that changes direction
- repo setup or automation changes
- handoff context for another agent

Do not force session logs for tiny edits.

## Public Safety

Before sharing or force-adding a session log, check that it does not include:

- private strategy
- local filesystem paths
- credentials or secrets
- client or personal names that should not be public
- monetization or commercial plans that belong in private notes
- raw chat excerpts that reveal more context than the repo needs

The default recommendation is to keep logs local and summarize public-safe outcomes in `CHANGELOG.md`, `TODO.md`, or `ROADMAP.md`.

## Naming

Recommended filename:

```text
YYYY-MM-DD-session-log-short-topic.md
```

Examples:

```text
2026-05-03-session-log-agent-template-optimization.md
2026-05-03-session-log-auth-flow-debugging.md
```

## Mutability

Session logs are append-only.

Do not rewrite old session history. If new context changes the interpretation, append a dated update.
