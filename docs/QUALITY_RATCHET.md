# Quality Ratchet

This project uses a quality ratchet: every meaningful build session should leave behind a stronger floor for the next agent or human.

The goal is not process theater. The goal is to make regression harder than progress.

## Ratchet Rule

When behavior changes, add or update at least one durable signal:

- automated test
- regression test
- browser or API smoke check
- LLM eval or structured output check
- documentation of a decision, constraint, or failure mode
- release or approval gate for risky actions

If no durable signal is added, say why in the handoff.

## What Must Be Under Contract

Prioritize contracts for:

- user-visible workflows
- auth, permissions, privacy, and secrets
- payments, data writes, migrations, deletion, and exports
- agent autonomy, tool calls, approvals, and destructive actions
- prompt outputs that downstream code or users depend on
- integrations with external APIs, filesystems, browsers, queues, or scheduled jobs

## Bug Fix Standard

Every bug fix should include one of:

- a regression test that fails before the fix and passes after
- a browser/API reproduction note plus a durable smoke check
- an explicit reason a test is not practical yet, with a follow-up task

Do not fix the same class of bug twice without creating a ratchet.

## Feature Standard

Every feature should define:

- the user-visible behavior
- the risky edge cases
- the minimum test or verification layer
- the fallback, empty, loading, and error states when relevant
- any behavior future agents must not silently change

## Agent Behavior Standard

When an agent workflow is part of the product or delivery process, test behavior as behavior.

Useful behavioral contracts:

- asks before destructive changes
- stops at approval gates
- emits the required schema
- refuses unsafe tool use
- preserves user-authored work
- reports uncertainty rather than inventing facts
- creates a handoff note when context matters

## Coverage Guidance

Coverage is a proxy, not the prize.

Aim for high coverage on important behavior, especially the surfaces above. Do not chase meaningless assertions just to move a percentage. A small number of sharp tests is better than a large suite of existence checks.

For mature projects, set a numeric coverage target once the stack is known. Until then, use this priority order:

1. critical workflows
2. regression tests for real failures
3. integration boundaries
4. edge cases and error paths
5. broad line coverage

## Review Questions

Before finishing meaningful work, answer:

- What behavior did this change put under contract?
- What can still regress silently?
- What did we learn that future agents should inherit?
- Did this touch an irreversible or high-risk surface?
- Is there a new test, eval, QA artifact, or documented reason not to add one?

