# Setup Checklist

Use this after creating a new repository from this template.

## Required

- [ ] Replace project identity fields in `AGENTS.md`.
- [ ] Fill in `docs/PROJECT_BRIEF.md`.
- [ ] Replace command placeholders in `AGENTS.md`.
- [ ] Review `docs/PERSONA_COUNCIL.md` and decide how much of the persona council to keep active.
- [ ] Choose package manager and stack conventions.
- [ ] Read `docs/QUALITY_RATCHET.md` and choose the first critical behavior to put under contract.
- [ ] Read `docs/AGENT_EXECUTION_LOOP.md` and decide the first safe agentic workflow.
- [ ] Review `docs/AGENT_TOOL_REGISTRY.md` and adjust tool permissions for this project.
- [ ] Review `docs/AGENT_PERMISSION_GATES.md` and add project-specific approval gates.
- [ ] Update `README.md` with the actual project name and usage.
- [ ] Review persona files and decide whether to keep private frontmatter.
- [ ] Decide which personas are active for this project and whether to use the full council protocol.
- [ ] Decide whether session log `owner` should be personal, team, or blank.
- [ ] Create the first session log when the initial project setup is complete.
- [ ] Run `./scripts/check-agent-docs.ps1 -Strict`.
- [ ] Run `./scripts/check-agent-behavior.ps1`.
- [ ] Make the first commit.

## Recommended

- [ ] Add real install, run, test, lint, and build commands.
- [ ] Add `.env.example` values for required configuration.
- [ ] Add first test or smoke-check command.
- [ ] Fill out `QA/TEST_PLAN.md` for the first real workflow.
- [ ] Fill out `QA/AGENT_BEHAVIOR_CHECKS.md` for any autonomous or semi-autonomous agent workflows.
- [ ] Replace starter entries in `Agent State/agent-state.md` and `Agent State/task-queue.md`.
- [ ] Add stable facts, first decisions, known failures, and open questions to `Memory/`.
- [ ] Start `QA/REGRESSION_LOG.md` if any bug, edge case, or known fragile behavior already exists.
- [ ] Add deployment target notes.
- [ ] Replace `TODO.md` starter tasks with the actual working queue.
- [ ] Replace `ROADMAP.md` starter direction with real milestones.

## Optional

- [ ] Add project-specific Cursor rules only when needed.
- [ ] Add project-specific Copilot notes only when needed.
- [ ] Add GitHub secrets/environment documentation.
- [ ] Add screenshots or design references.
- [ ] Replace the sample session log with the first real project session log.
