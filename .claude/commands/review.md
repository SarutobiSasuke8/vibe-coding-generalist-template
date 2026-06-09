---
description: Review recent changes through the Code Reviewer and QA lenses
---

Identify what to review: `git diff` for uncommitted work, otherwise `git diff HEAD~1` (or the range the user named).

Launch the `code-reviewer` and `qa-acceptance-tester` subagents in parallel (one message, two Task calls). Give each: the diff scope, the goal of the change as you understand it, and a request for findings ordered by severity. The subagents load their persona definitions themselves and cannot see this conversation, so the prompt must be self-contained.

If subagents are unavailable, read `personas/code-reviewer-maintainability.md` and `personas/qa-acceptance-tester.md` (check `personas/optional/` if not in `personas/`) and apply both lenses in-context.

Synthesize the two reports into one review:

1. **Correctness risks** — logic errors, edge cases, silent failures
2. **Missing states** — loading, empty, error states that affect the experience
3. **Acceptance gaps** — user-visible behavior that isn't yet met
4. **Follow-up items** — things worth fixing that are outside the current change

Do not rewrite code unless the user asks. Surface findings only. If changes look solid, say so clearly.
