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

Use the reusable template:

```text
Templates/SESSION_LOG_TEMPLATE.md
```

## Local-Only vs Committed

The template defaults to **local-only** logs: `.gitignore` excludes `Session Logs/*.md` and tracks only the index. That protects private strategy, local paths, and working notes from accidentally shipping to a public repo.

Know what the default costs you. Local-only logs do not survive a fresh clone, do not reach a second machine or a collaborator, and do not reach cloud agents — a remote session (for example Claude Code on the web) runs in an ephemeral container, so any log it writes to an ignored path is destroyed when the container is reclaimed. If the point of session logs is memory that future agents can read, gitignored logs only deliver that on a single machine.

Choose deliberately:

- **Local-only (default)** — solo work on one machine, or projects where logs routinely contain sensitive context.
- **Committed** — teams, multi-machine work, or any project that uses cloud/remote agents. Redact instead of hiding: keep secrets and client names out of the logs, and let the rest travel with the repo.

Init asks which mode you want (default: local-only) and adjusts `.gitignore` for the committed mode; pass `--session-logs` / `-SessionLogs` to answer non-interactively. To switch later, edit the `Session Logs` block in `.gitignore`.

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
