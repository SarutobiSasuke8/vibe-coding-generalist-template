# Release Prep Workflow

Metadata:

- trigger: before tagging, publishing, deploying, or announcing a release
- inputs: changelog, roadmap, verification output, known risks
- expected output: release readiness summary
- verification: build/test/check commands are run or explicitly waived

## Steps

1. Confirm scope and version.
2. Run relevant checks.
3. Update `CHANGELOG.md`.
4. Confirm README setup instructions are truthful.
5. Check for unresolved placeholders in public docs.
6. Identify known risks and rollback path.

## Handoff

Release only when verification is complete or the risk is deliberately accepted by a human.
