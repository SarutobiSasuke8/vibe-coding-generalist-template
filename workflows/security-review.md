# Security Review Workflow

Metadata:

- trigger: auth, secrets, file system, network, deployment, external messaging, or user data changes
- inputs: changed files, data flow, permissions, environment variables, deployment target
- expected output: defensive security findings and mitigations
- verification: secrets and permission gates are checked

## Steps

1. Identify trust boundaries.
2. Check for secrets or credentials in tracked files.
3. Review file, network, shell, and deployment actions against permission gates.
4. Look for prompt-injection or untrusted-input risks when agents are involved.
5. Verify environment variable documentation.
6. Recommend concrete mitigations.

## Handoff

Record recurring issues in `QA/REGRESSION_LOG.md` or `Memory/failures.md`.
