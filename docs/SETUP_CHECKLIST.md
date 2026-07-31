# Setup Checklist

Use this after creating a new repository from this template.

> **Tip:** `./scripts/init.sh` (or `init.ps1`) automates most of the **Required** items below. It prompts for project name, project type, vibe, primary user, commands, primary agent, stage, personas tier (`minimal` / `standard` / `full`), and session-log mode (local-only or committed — pick committed for teams or cloud agents); generates the brief, README, TODO, ROADMAP, and a clean session-log index; then runs the drift check. The list below is the manual fallback or post-init polish.

## Strict mode

The drift check has two modes:

- **Standard** (`./scripts/check-agent-docs.sh` / `./scripts/check-agent-docs.ps1`) -- required files, headings, alignment markers, adapter line cap, persona placement, session log index. CI runs this on every PR.
- **Strict** (`--strict` / `-Strict`) -- everything above, plus fails on unresolved `TODO` placeholders or Mustache-style template tokens (literal double-brace placeholders) in `AGENTS.md`, `docs/PROJECT_BRIEF.md`, the adapters, `README.md`, `ROADMAP.md`, `TODO.md`, and any file under `docs/` (excluding `docs/examples/`, `Templates/`, and `personas/optional/`).

The public template repo is *expected* to fail strict mode -- it ships with `TODO` placeholders for forkers to fill in. Strict mode is the gate to run **after** init, in your fork, before the first real handoff or release.

## Required

- [ ] Replace project identity fields in `AGENTS.md`.
- [ ] Fill in `docs/PROJECT_BRIEF.md`.
- [ ] Replace command placeholders in `AGENTS.md`.
- [ ] Review `DESIGN.md` and adapt it if the product needs a domain-specific visual language.
- [ ] Choose a template mode from `docs/TEMPLATE_MODES.md`.
- [ ] Confirm code style fields in `AGENTS.md` are accurate for the chosen stack.
- [ ] Review `docs/PERSONA_COUNCIL.md` and decide how much of the persona council to keep active.
- [ ] Choose package manager and stack conventions.
- [ ] Update `README.md` with the actual project name and usage.
- [ ] Review persona files and decide whether to keep private frontmatter.
- [ ] Decide which personas are active for this project and whether to use the full council protocol.
- [ ] Decide whether session logs stay local-only (default) or are committed — see the tradeoff in `docs/SESSION_LOGGING.md`; teams and cloud-agent workflows should commit them.
- [ ] Read `docs/SUBAGENTS.md` so you know when to fan work out to the persona subagents and when not to.
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
- [ ] Read `docs/QUALITY_RATCHET.md` and choose the first critical behavior to put under contract.
- [ ] Read `docs/AGENT_EXECUTION_LOOP.md` and decide the first safe agentic workflow.
- [ ] Review `docs/AGENT_TOOL_REGISTRY.md` and `docs/AGENT_PERMISSION_GATES.md` and adjust for this project.
- [ ] Replace starter entries in `Agent State/agent-state.md` and `Agent State/task-queue.md`.
- [ ] Run `agentops health` for a single readiness dashboard once placeholders are replaced.

## Optional

- [ ] Add project-specific Cursor rules only when needed.
- [ ] Add project-specific Copilot notes only when needed.
- [ ] Add GitHub secrets/environment documentation.
- [ ] Add screenshots or design references.
- [ ] Replace the sample session log with the first real project session log.
