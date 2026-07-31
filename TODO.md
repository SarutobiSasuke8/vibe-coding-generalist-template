# TODO

Use this file for actionable template work. Keep items concrete. Forks should replace this content with their own queue after running init; until then, this is the template's own working list.

## Now

- [ ] #task Tag the `v0.2.0` release once the subagents branch lands on `main` (after release checklist passes).
- [ ] #task Tag `v0.3.0` once the CLI/runtime merge passes the release checklist.
- [ ] #task Reconcile `agentops init` with `scripts/init.sh` / `init.ps1` — both fill placeholders; decide which owns the flow and make the other delegate.
- [ ] #task Update `docs/CLI_ROADMAP.md` now that the first CLI exists in `packages/cli`.

## Soon

- [ ] #task Add a "screenshots or diagram of repo structure" pass to `README.md` if a stranger still has trouble orienting.
- [ ] #task Add a contribution guide for persona and workflow additions (`CONTRIBUTING.md` is currently a stub).
- [ ] #task Decide whether to publish a 60-second "what is this" GIF or screencast for the README.

## Parking lot

- [ ] #task Trim each persona from ~200 lines to ~80 (identity, judgment lens, good output) — the mandatory 7-section response formats fight the "no process theatre" anti-vibe.
- [ ] #task Consider renaming `Session Logs/` to `session-logs/` (spaces in paths add quoting friction for shell-driven agents); breaking change, decide before the fork base grows.
- [ ] #task Decide whether the long-term CLI should be called `vibe`, `agentops`, or another command.
- [ ] #task Decide whether future CLI work lives in a separate repo or a monorepo.
- [ ] #task Decide what future-product details belong in public docs versus local planning notes.
- [ ] #task Implement future CLI commands: `vibe init`, `vibe check`, `vibe sync`, `vibe doctor`, `vibe upgrade`.
- [ ] #task Define the future config schema (`vibe.config.yml` / `agentops.config.yml`).
- [ ] #task Define generated vs user-owned file ownership rules for safe upgrades.
- [ ] #task Design persona pack metadata for installable specialist tiers.
- [ ] #task Design workflow pack metadata for spec, review, handoff, retro, TODO triage, and session logging.
- [ ] #task Explore a future local web UI (`vibe studio`) only after the CLI is proven.
- [ ] #task Explore multi-repo support only after CLI demand is proven.

## Done (v0.1.0)

- [x] Stabilize the public template before splitting out a CLI.
- [x] Verify README quickstart accuracy.
- [x] Verify `scripts/init.ps1` and `scripts/init.sh` from a fresh test directory.
- [x] Verify strict-mode behavior after placeholders are replaced (PowerShell init smoke test).
- [x] Cross-check that PowerShell and bash drift checks behave identically.
- [x] Confirm minimal / standard / full persona tier behavior works as documented; smoke tests cover both `full` and `standard` flows.
- [x] Add `docs/WHY.md` explaining the philosophy and the problem it solves.
- [x] Add `docs/FAQ.md` consolidating common questions.
- [x] Add a worked example brief at `docs/examples/PROJECT_BRIEF.example.md`.
- [x] Add template version metadata for the first public release; init now stamps `.vibe-template-version` for upgrade detection.
- [x] Add release notes for `v0.1.0` in `CHANGELOG.md`.
- [x] Add a fresh-clone acceptance checklist (`docs/RELEASE_CHECKLIST.md`).
- [x] Document strict mode in `docs/SETUP_CHECKLIST.md` and `docs/FAQ.md`.
