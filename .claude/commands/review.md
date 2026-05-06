Read `AGENTS.md`, `personas/code-reviewer-maintainability.md`, and `personas/qa-acceptance-tester.md`.

Run `git diff HEAD~1 --name-only` to identify recently changed files, then read the relevant diffs.

Apply the Code Reviewer and QA Acceptance Tester lenses. Report:

1. **Correctness risks** — logic errors, edge cases, silent failures
2. **Missing states** — loading, empty, error states that affect the experience
3. **Acceptance gaps** — user-visible behavior that isn't yet met
4. **Follow-up items** — things worth fixing that are outside the current change

Do not rewrite code unless the user asks. Surface findings only. If changes look solid, say so clearly.
