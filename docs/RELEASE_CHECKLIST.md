# Release Checklist

Use this before tagging a template release.

## Scope

- [ ] Release goal is clear in `CHANGELOG.md`.
- [ ] `VERSION` contains the intended version.
- [ ] `README.md` quickstart is accurate.
- [ ] `ROADMAP.md` reflects the current phase.
- [ ] `TODO.md` has no completed work still listed as next.

## Fresh-Clone Checks

- [ ] Create a fresh temporary copy of the repo.
- [ ] Run `./scripts/init.ps1` on Windows, or `./scripts/init.sh` on macOS/Linux.
- [ ] Confirm generated `AGENTS.md` has project identity, commands, stage, and code style placeholders replaced.
- [ ] Confirm generated `docs/PROJECT_BRIEF.md` is project-specific, not template-specific.
- [ ] Run strict mode in the initialized repo.

## Verification

- [ ] Run `./scripts/check-agent-docs.ps1`.
- [ ] Run `./scripts/test-init.ps1`.
- [ ] Run `./scripts/check-agent-docs.sh` where Bash is available.
- [ ] Run `./scripts/test-init.sh` where Bash is available.
- [ ] Confirm GitHub Actions pass on the release branch.

## Manual Review

- [ ] Scan for corrupted encoding artifacts.
- [ ] Check that public docs do not include local paths, private names, or machine-specific references.
- [ ] Check that all required docs are linked from `README.md` or another discoverable doc.
- [ ] Check that `docs/SETUP_CHECKLIST.md` matches actual init behavior.
- [ ] Check that strict mode failures are clear and actionable.

## Release

- [ ] Commit the release changes.
- [ ] Tag the release.
- [ ] Push the tag.
- [ ] Create GitHub release notes from `CHANGELOG.md`.
- [ ] Open a follow-up issue or TODO section for anything deferred.
