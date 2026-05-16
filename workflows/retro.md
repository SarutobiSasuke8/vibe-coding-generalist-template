# Retro Workflow

Metadata:

- trigger: after a release, incident, difficult debugging session, or repeated failure
- inputs: timeline, observed failure, fix, verification, follow-ups
- expected output: lessons and quality ratchet updates
- verification: at least one future-facing prevention signal is identified

## Steps

1. Record what happened.
2. Separate facts from interpretation.
3. Identify what worked.
4. Identify what failed or slowed progress.
5. Add a quality ratchet: test, check, doc, alert, or regression note.
6. Convert follow-ups into concrete tasks.

## Handoff

Append durable failures to `Memory/failures.md` or `QA/REGRESSION_LOG.md` when they should not recur.
