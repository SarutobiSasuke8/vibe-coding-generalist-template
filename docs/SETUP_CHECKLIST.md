# Setup Checklist

Use this after creating a new repository from this template.

> **Tip:** `./scripts/init.sh` (or `init.ps1`) automates most of the **Required** items below. It prompts for project name, project type, vibe, primary user, commands, primary agent, stage, and personas tier (`minimal` / `standard` / `full`), then runs the drift check. The list below is the manual fallback or post-init polish.

## Strict mode

The drift check has two modes:

- **Standard** (`./scripts/check-agent-docs.sh` / `./scripts/check-agent-docs.ps1`) -- required files, headings, alignment markers, adapter line cap, persona placement, session log index. CI runs this on every PR.
- **Strict** (`--strict` / `-Strict`) -- everything above, plus fails on unresolved `TODO` placeholders or Mustache-style template tokens (literal double-brace placeholders) in `AGENTS.md`, `docs/PROJECT_BRIEF.md`, the adapters, `README.md`, `ROADMAP.md`, `TODO.md`, and any file under `docs/` (excluding `docs/examples/`, `Templates/`, and `personas/optional/`).

The public template repo is *expected* to fail strict mode -- it ships with `TODO` placeholders for forkers to fill in. Strict mode is the gate to run **after** init, in your fork, before the first real handoff or release.

## Required

- [ ] Replace project identity fields in `AGENTS.md`.
- [ ] Fill in `docs/PROJECT_BRIEF.md`.
- [ ] Replace command placeholders in `AGENTS.md`.
- [ ] Confirm code style fields in `AGENTS.md` are accurate for the chosen stack.
- [ ] Review `docs/PERSONA_COUNCIL.md` and decide how much of the persona council to keep active.
- [ ] Choose package manager and stack conventions.
- [ ] Update `README.md` with the actual project name and usage.
- [ ] Review persona files and decide whether to keep private frontmatter.
- [ ] Decide which personas are active for this project and whether to use the full council protocol.
- [ ] Decide whether session logs should stay local-only or whether this project intentionally publishes selected logs.
- [ ] Create the first local session log when the initial project setup is complete.
- [ ] Run strict mode: `./scripts/check-agent-docs.ps1 -Strict` on Windows or `./scripts/check-agent-docs.sh --strict` where Bash is available.
- [ ] Make the first commit.

## Recommended

- [ ] Add real install, run, test, lint, and build commands.
- [ ] Add `.env.example` values for required configuration.
- [ ] Add first test or smoke-check command.
- [ ] Add deployment target notes.
- [ ] Replace `TODO.md` starter tasks with the actual working queue.
- [ ] Replace `ROADMAP.md` starter direction with real milestones.
- [ ] Review `docs/RELEASE_CHECKLIST.md` before the first public release.

## Optional

- [ ] Add project-specific Cursor rules only when needed.
- [ ] Add project-specific Copilot notes only when needed.
- [ ] Add GitHub secrets/environment documentation.
- [ ] Add screenshots or design references.
- [ ] Replace the sample session log with the first real project session log.
