# Review Workflow

Metadata:

- trigger: before merging meaningful code, architecture, UI, or automation changes
- inputs: changed files, goal, acceptance criteria, verification output
- expected output: findings first, then residual risk and summary
- verification: reviewer names the checks inspected or missing

## Steps

1. Restate the intended outcome.
2. Inspect the changed surface area.
3. Prioritize correctness, regressions, missing tests, security, and maintainability.
4. List findings by severity with file references.
5. Identify missing verification or risky assumptions.
6. Provide a concise summary only after findings.

## Handoff

End with whether the change is ready, ready with follow-ups, or blocked.
