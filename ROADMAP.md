# Roadmap

Use this file for direction, milestones, and tradeoffs. Keep tactical tasks in `TODO.md`.

See `docs/PROJECT_BRIEF.md` for the full product vision.

## Phase 0 - Stabilize the Template (current)

Goal: make the public repo a trustworthy starting point that a stranger can use without guidance.

- [x] Verify init scripts run cleanly on Windows and Git Bash
- [x] Confirm drift check behavior in strict and non-strict modes
- [x] Make README quickstart accurate (every command listed runs without error)
- [x] Finish setup checklist
- [ ] Ensure all adapter docs are intentionally thin (not leaking content from `AGENTS.md`)
- [x] Add version/release notes discipline
- [ ] Clean `TODO.md` and `ROADMAP.md` placeholders in generated output

Acceptance criteria:
- Fresh clone -> init -> `check-agent-docs.sh --strict` passes with no manual intervention
- CI runs checks on every PR
- README quickstart is truthful

## Phase 1 - Polish the Public Template

Goal: make the template feel polished enough that adoption doesn't require explanation.

- [x] Add `docs/WHY.md` explaining the philosophy and the problem it solves
- [ ] Add screenshots or a diagram explaining repo structure
- [ ] Add a full command reference in the README or docs
- [ ] Add contribution guide for persona and workflow additions
- [ ] Add `docs/TEMPLATE_UPGRADE_STRATEGY.md`
- [ ] Tag first real release (v0.1.0)
- [ ] Ensure example project brief is realistic and instructive

Acceptance criteria:
- A stranger understands the repo in under 10 minutes
- A stranger initializes a working project in under 15 minutes
- The repo communicates a real product point of view, not just boilerplate

## Phase 2 - CLI MVP

Goal: automate what the template currently asks humans to do manually.

Core commands: `init`, `check`, `sync`, `doctor`

- [ ] Choose implementation language (TypeScript recommended for iteration speed)
- [ ] Define config schema (`agentops.config.yml` or `vibe.config.yml`)
- [ ] Extract template rendering logic into a reusable core
- [ ] Port drift check into CLI (`vibe check`)
- [ ] Implement `vibe init` with current script behavior
- [ ] Implement `vibe sync` to regenerate adapters from canonical contract
- [ ] Implement `vibe doctor` for repo health reporting
- [ ] Support Windows, macOS, and Linux
- [ ] Add JSON output for CI integration
- [ ] Add dry-run mode
- [ ] Publish installation instructions

Acceptance criteria:
- `vibe init` initializes a repo from scratch with no manual steps
- `vibe check` replaces or wraps existing drift scripts
- `vibe check --strict` exits nonzero when checks fail
- CLI has automated tests

## Phase 3 - Upgrade System

Goal: make existing projects maintainable over time as the template evolves.

- [ ] Add template version metadata to generated files
- [ ] Track which sections are generated vs user-owned
- [ ] Implement `vibe upgrade --dry-run`
- [ ] Add migration files between template versions
- [ ] Add conflict detection for user-edited sections

Acceptance criteria:
- A project initialized at version N can upgrade to N+1
- User-authored content is never overwritten silently
- Conflicts are clearly reported

## Phase 4 - Workflow and Persona Packs

Goal: turn repeated operating patterns into installable modules.

- [ ] Define pack metadata format
- [ ] Package personas separately from core
- [ ] Package workflows separately from core
- [ ] Add `vibe add persona <name>` and `vibe add workflow <name>`
- [ ] Publish official starter packs

## Later

- Local browser UI (`vibe studio`)
- Multi-repo scanning and organization dashboard
- Team governance and PR enforcement

## Decisions

| Date | Decision | Reason | Revisit When |
|---|---|---|---|
| 2026-05-06 | Keep CLI out of this repo until Phase 2 begins | Template should be stable before adding a build step | When Phase 1 acceptance criteria are met |
| 2026-05-06 | Stack-agnostic template; no language scaffolding | Keeps the repo forkable by any project type | If a specific stack becomes the clear primary use case |

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Template becomes generic boilerplate | Low adoption; agents produce unguided work | Keep a strong point of view; include excellent examples |
| Init scripts break on a platform | Blocks first-time users | Test on Windows, macOS, and Linux before each release |
| Upgrade system is hard to build safely | Users can't benefit from template improvements | Mark generated sections; use dry-run diffs; prefer additive migrations |
| Multi-agent tooling changes quickly | Adapters go stale | Keep adapters thin; generate from canonical contract |
| Scope expands before Phase 0 is done | Template stays unreliable | Finish Phase 0 before starting Phase 1 work |
