# AGENTS.md - Canonical Agent Contract

This is the source of truth for all AI coding agents working in this repository.

Every model-specific instruction file must stay aligned with this contract:

- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/vibe-coding-core.mdc`

When this file changes, update the adapters and run the drift check:

```bash
./scripts/check-agent-docs.sh     # macOS / Linux / git-bash
./scripts/check-agent-docs.ps1    # Windows PowerShell
```

## Project Identity

- Project name: `TODO`
- Project type: `TODO`
- Primary agent: `TODO`
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
6. Report what changed, what was verified, and what risk remains.

For trivial one-line fixes, use judgment and keep the handoff concise.

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

## Documentation Rules

- Durable project context lives in `docs/PROJECT_BRIEF.md`.
- Agent principles live in `docs/AGENT_OPERATING_PRINCIPLES.md`.
- Agent sync rules live in `docs/AGENT_ALIGNMENT.md`.
- Session logging rules live in `docs/SESSION_LOGGING.md`.
- Upcoming work lives in `TODO.md`.
- Medium-term direction lives in `ROADMAP.md`.
- Reusable role prompts live in `personas/`.
- Session logs live in `Session Logs/` and use `Templates/SESSION_LOG_TEMPLATE.md`.
- Slash commands live in `.claude/commands/` and are invoked with `/command-name` in Claude Code.
- Persona subagents for Claude Code live in `.claude/agents/`; usage guidance lives in `docs/SUBAGENTS.md`.

## Slash Commands

These commands are available when working in Claude Code. Invoke them with `/command-name`.

- `/brief` — load and summarize current project context from `AGENTS.md` and `docs/PROJECT_BRIEF.md`.
- `/spec` — draft a feature spec (goal, scope, acceptance criteria, approach, risks) before writing any code.
- `/council` — run a persona council review on a task or question using `personas/agent-council-protocol.md`.
- `/review` — review recent changes through the Code Reviewer and QA Acceptance Tester lenses.
- `/session-log` — create or append a session log entry in `Session Logs/`.
- `/drift-check` — run the agent doc alignment check and report the result.
- `/handoff` — produce a structured handoff note for the current session.
- `/todo-triage` — sort `TODO.md` into Now / Soon / Parking lot with success criteria and first actions.
- `/retro` — end-of-session retrospective; surfaces what to codify in `AGENTS.md` and what to add to `TODO.md`.

## Subagents (Claude Code)

Persona subagents live in `.claude/agents/` — one isolated, read-only reviewer per persona. `/council` and `/review` fan work out to them in parallel and synthesize one report. Use a single subagent (`code-reviewer` or `qa-acceptance-tester`) to verify implementation work; reserve multi-persona fan-outs for decisions and audits with multiple risk surfaces. Other tools ignore `.claude/agents/` and use the persona files directly. See `docs/SUBAGENTS.md`.

## Optional Workflow Protocols

These protocols are available for specific situations. They are not the default operating mode.

- **Ralph loop** (`docs/RALPH_LOOP.md`) — autonomous iteration for bounded tasks with a clear definition of done. Use for: fix all tests, implement a fully spec'd feature, migrate a pattern across the repo. Requires a commit checkpoint before starting and a diff review when done.
- **RIPER** (`docs/RIPER_WORKFLOW.md`) — phase-gated workflow enforcing Research → Innovate → Plan → Execute → Review in sequence. Use when jumping straight into code on a complex task has burned you before. Invoke by telling Claude to follow RIPER for a specific task.

## Agent Coordination

When multiple agents are involved:

- Avoid editing the same files at the same time.
- State which files or areas you changed.
- Do not overwrite another agent's reasoning without cause.
- Use `TODO.md` for unresolved follow-ups instead of burying them in chat.
- Create or append a session log for meaningful multi-file, architectural, debugging, or handoff-heavy sessions.
- Run `./scripts/check-agent-docs.sh` (or `./scripts/check-agent-docs.ps1` on Windows) after changing agent instruction files.

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
