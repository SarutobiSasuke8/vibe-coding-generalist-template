# Changelog

All notable changes to this project should be documented here.

The version recorded in `VERSION` is the template's own version, not the version of any project that forks it. This file follows [Keep a Changelog](https://keepachangelog.com/) loosely and uses semantic versioning.

## [Unreleased]

## [0.1.0] - 2026-05-08

First public template release. The repo is now stable enough that a stranger can fork it, run init, pass the drift check, and start a real project without author guidance.

### Added

- Canonical agent contract in `AGENTS.md`, with thin adapters for Claude (`CLAUDE.md`), Codex (`CODEX.md`), Gemini (`GEMINI.md`), Copilot (`.github/copilot-instructions.md`), and Cursor (`.cursor/rules/vibe-coding-core.mdc`).
- 11-persona council (3 core + 8 optional) under `personas/`, with the orchestration protocol in `personas/agent-council-protocol.md`.
- Three-tier persona setup: `minimal` (Product, CTO, QA), `standard` (adds Code Reviewer, Design Director, Delivery Lead), `full` (all 11). The init script demotes the personas the chosen tier does not keep into `personas/optional/`.
- Init scripts (`scripts/init.ps1` and `scripts/init.sh`) that prompt for project identity, vibe, commands, primary agent, stage, and personas tier, then fill placeholders and run the drift check.
- Drift-check scripts (`scripts/check-agent-docs.ps1` and `scripts/check-agent-docs.sh`) with standard and `--strict` modes, configurable adapter line cap, and a documented exemption list.
- Init smoke tests (`scripts/test-init.ps1` and `scripts/test-init.sh`) covering the `full` and `standard` tiers; both run in CI on every PR via `.github/workflows/agent-docs.yml`.
- Public-facing docs: `README.md`, `docs/WHY.md` (philosophy), `docs/FAQ.md` (common questions), `docs/SETUP_CHECKLIST.md` (manual fallback path), `docs/RELEASE_CHECKLIST.md`, `docs/CLI_ROADMAP.md`.
- Internal agent docs: `docs/AGENT_OPERATING_PRINCIPLES.md`, `docs/AGENT_ALIGNMENT.md`, `docs/PERSONA_COUNCIL.md`, `docs/PROJECT_BRIEF.md`, `docs/RALPH_LOOP.md`, `docs/RIPER_WORKFLOW.md`, `docs/SESSION_LOGGING.md`.
- Worked example brief at `docs/examples/PROJECT_BRIEF.example.md` (Sparkbar) so forkers know what "filled in" looks like.
- Claude Code scaffolding under `.claude/`: settings with read-only Bash defaults and slash commands `/brief`, `/spec`, `/council`, `/review`, `/session-log`, `/drift-check`, `/handoff`, `/todo-triage`, `/retro`.
- Session memory: append-only `Session Logs/` with `_Session Logs Index.md`, the template `Templates/SESSION_LOG_TEMPLATE.md`, and the policy in `docs/SESSION_LOGGING.md`.
- Release spine: `VERSION` file, this changelog, and `docs/RELEASE_CHECKLIST.md`.
- Upgrade-detection marker: init stamps `.vibe-template-version` in the fork root, recording the template version the fork was initialized from. Future CLI tooling will use this to suggest migrations.
- PR template (`.github/pull_request_template.md`) matching the AGENTS.md handoff format.

### Verified

- Fresh clone -> `./scripts/init.sh` -> `./scripts/check-agent-docs.sh` passes.
- Initialized fork -> `./scripts/check-agent-docs.sh --strict` passes.
- Both init smoke tests exercise `full` and `standard` tiers and verify persona demotion.
- CI runs both drift checks and both init tests on every PR.

### Known limitations

- No CLI yet -- everything is shell scripts and Markdown. The CLI roadmap (`docs/CLI_ROADMAP.md`) describes the split point for future tooling.
- No automatic upgrade path between template versions. Forks track template changes manually for now.
- Stack-agnostic by design -- the template ships no language or framework code.

[Unreleased]: https://github.com/SarutobiSasuke8/vibe-coding-generalist-template/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SarutobiSasuke8/vibe-coding-generalist-template/releases/tag/v0.1.0
