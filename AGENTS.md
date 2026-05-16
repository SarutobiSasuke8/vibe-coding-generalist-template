# AGENTS.md - Canonical Agent Contract

This is the source of truth for all AI coding agents working in this repository.

Every model-specific instruction file must stay aligned with this contract:

- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/vibe-coding-core.mdc`

When this file changes, update the adapters and run:

```powershell
./scripts/check-agent-docs.ps1
```

## Project Identity

- Project name: `TODO`
- Project type: `TODO`
- Primary user: `TODO`
- Current stage: `prototype | active build | maintenance | archived`
- Product owner persona: `personas/head-of-product-vibe-coding.md`
- Technical owner persona: `personas/cto-vibe-coding.md`
- Persona council protocol: `personas/agent-council-protocol.md`

## Product Goal

Describe the real user-facing outcome this repo exists to create.

```text
TODO: one or two paragraphs explaining what good looks like, who it helps, and what feeling it should create.
```

## Non-Negotiable Standard

The project must be useful, reliable, and vibe-true.

Speed matters, but only as speed to quality. Do not ship impressive-looking work that fails under ordinary use. Do not bury uncertainty. Do not inflate scope. Protect the product feeling and the codebase at the same time.

## Operating Loop

For non-trivial work, follow this loop:

1. Understand the request and inspect relevant files.
2. State assumptions, ambiguities, and tradeoffs when they matter.
3. Define success criteria before implementing.
4. Make the smallest coherent change.
5. Verify with the narrowest meaningful check.
6. Add or update the quality ratchet when behavior changes.
7. Report what changed, what was verified, and what risk remains.

For trivial one-line fixes, use judgment and keep the handoff concise.

## Agentic Runtime Layer

This template supports practical agentic behavior through a single-orchestrator workflow. Treat the personas as callable operating modes unless the user or runtime explicitly provides separate agents.

Use these files when work is more than a one-shot edit:

- `Agent State/agent-state.md` - current goal, active task, blocker, last action, next action, and verification state.
- `Agent State/task-queue.md` - agent-executable queue with `inbox`, `ready`, `active`, `blocked`, `verify`, and `done` sections.
- `Memory/project-facts.md` - stable execution facts future agents should not rediscover.
- `Memory/decisions.md` - append-only decisions that should shape future behavior.
- `Memory/failures.md` - repeatable failures and the ratchets that prevent them.
- `Memory/open-questions.md` - questions that materially change implementation, risk, cost, or product direction.
- `docs/AGENT_EXECUTION_LOOP.md` - plan -> act -> observe -> revise -> verify -> log -> continue/stop.
- `docs/AGENT_TOOL_REGISTRY.md` - tool safety classes and allowed actions.
- `docs/AGENT_PERMISSION_GATES.md` - actions that require approval before execution.
- `QA/AGENT_BEHAVIOR_CHECKS.md` - behavioral checks for agent workflows.

Before autonomous or semi-autonomous work, choose one bounded task, check the tool registry, respect permission gates, and keep state current. Do not simulate multi-agent behavior by producing many persona reports when one orchestrator plus focused specialist checks would be clearer.

## Core Principles

These principles are adapted from the Karpathy-style agent guidance in `docs/AGENT_OPERATING_PRINCIPLES.md`.

### 1. Think Before Coding

Do not silently choose an interpretation when multiple plausible meanings exist.

- State assumptions explicitly.
- Ask when the ambiguity changes implementation or risk.
- Present tradeoffs when there are multiple reasonable paths.
- Push back when a simpler or safer path better serves the goal.
- Stop and name confusion before building on it.

### 2. Simplicity First

Build the minimum thing that solves the actual problem well.

- No speculative features.
- No abstractions for single-use code.
- No configurability that was not requested.
- No framework churn unless the current stack blocks the goal.
- If a simpler implementation would be easier to verify and maintain, choose it.

### 3. Surgical Changes

Touch only what the task requires.

- Do not reformat, rename, or refactor adjacent code for taste.
- Match existing style even if you would design it differently from scratch.
- Preserve user-authored comments and docs unless the task asks to edit them.
- Clean up imports, variables, and files made obsolete by your own change.
- Mention unrelated issues instead of fixing them silently.

### 4. Goal-Driven Execution

Turn vague tasks into verifiable outcomes.

- Bug fix: reproduce or identify the failing behavior, then fix it.
- Feature: define the user-visible behavior and acceptance checks.
- Refactor: preserve behavior before and after.
- UI change: verify the actual screen when practical.
- Docs change: verify links, filenames, and instructions are coherent.

### 5. Vibe Coding Quality Bar

Every product decision should support the intended feeling of the project.

- The first meaningful screen or workflow should feel intentional.
- Core flows need loading, empty, and error states when applicable.
- UI should be responsive, legible, and hard to break through normal use.
- Copy should be clear, specific, and free of generic filler.
- Polish is not decoration; it is part of whether the product works.

## Commands

Update these as soon as the stack is known.

```bash
# Install dependencies
TODO

# Run development server
TODO

# Run tests
TODO

# Run lint/type checks
TODO

# Check agent behavior scaffold
./scripts/check-agent-behavior.ps1

# Build
TODO
```

## Code Style

- Language/framework: `TODO`
- Package manager: `TODO`
- Formatting: `TODO`
- Test framework: `TODO`
- Naming conventions: follow surrounding code unless documented here.
- Dependency policy: prefer existing dependencies; add new ones only when they clearly reduce risk or complexity.

## Verification Policy

Before finishing a code change, run the narrowest useful verification:

- Unit or integration tests for changed logic.
- Type check or lint for typed/frontend projects.
- Build for packaging or deployment-sensitive changes.
- Browser/manual smoke test for UI changes.
- Script output check for automation changes.

If verification cannot be run, say exactly why and describe the residual risk.

For agent workflow or autonomy changes, also run:

```powershell
./scripts/check-agent-behavior.ps1
```

If the behavior check cannot run, state why and identify which permission, state, memory, or execution-loop contract could regress.

## Quality Ratchet

Durable quality rules live in `docs/QUALITY_RATCHET.md`.

When behavior changes, add or update at least one durable signal: test, regression test, browser/API smoke check, LLM eval, QA artifact, or documentation of a decision/failure mode. For bug fixes, prefer a regression test that would have caught the issue.

Use `QA/TEST_PLAN.md` for planned coverage, `QA/QA_REPORT_TEMPLATE.md` for manual or browser QA, and `QA/REGRESSION_LOG.md` for failures that should not recur.

## Documentation Rules

- Durable project context lives in `docs/PROJECT_BRIEF.md`.
- Agent principles live in `docs/AGENT_OPERATING_PRINCIPLES.md`.
- Agent sync rules live in `docs/AGENT_ALIGNMENT.md`.
- Quality ratchet rules live in `docs/QUALITY_RATCHET.md`.
- Session logging rules live in `docs/SESSION_LOGGING.md`.
- QA planning and regression memory live in `QA/`.
- Upcoming work lives in `TODO.md`.
- Medium-term direction lives in `ROADMAP.md`.
- Reusable role prompts live in `personas/`.
- Session logs live in `Session Logs/` and use `Templates/SESSION_LOG_TEMPLATE.md`.

## Agent Coordination

When multiple agents are involved:

- Avoid editing the same files at the same time.
- Prefer one orchestrator and bounded specialist workers over broad persona swarms.
- Assign each worker a clear file scope, goal, and verification responsibility.
- State which files or areas you changed.
- Do not overwrite another agent's reasoning without cause.
- Use `TODO.md` for unresolved follow-ups instead of burying them in chat.
- Use `Agent State/task-queue.md` for agent-executable work that needs status tracking.
- Update `Memory/decisions.md`, `Memory/failures.md`, or `Memory/project-facts.md` when the session creates durable knowledge.
- Create or append a session log for meaningful multi-file, architectural, debugging, or handoff-heavy sessions.
- Run `./scripts/check-agent-docs.ps1` after changing agent instruction files.

When multiple personas are involved, use `personas/agent-council-protocol.md` to route the work, resolve conflicts, and produce one synthesized report instead of separate persona reports.

## Git Hygiene

- Do not revert work you did not make.
- Do not use destructive git commands unless explicitly requested.
- Keep commits focused when asked to commit.
- Mention changed files and verification in handoff notes.

## Handoff Standard

When finishing, report:

- What changed.
- What was verified.
- Any remaining risk or useful next action.
