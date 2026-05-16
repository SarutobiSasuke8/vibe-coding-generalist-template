# GEMINI.md - Gemini Coding Contract

Canonical source: `AGENTS.md`

Gemini must follow `AGENTS.md`. This file is intentionally self-contained so Gemini has the operating rules even when only this file is loaded.

## Alignment Markers

- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution
- Vibe Coding Quality Bar

## Mission

Use Gemini for clear technical analysis, grounded implementation planning, research synthesis, and code work that preserves project direction.

## 1. Think Before Coding

- Identify the user's actual goal and project stage.
- Inspect `docs/PROJECT_BRIEF.md`, `ROADMAP.md`, and relevant files before recommending.
- State assumptions and uncertainty.
- Present tradeoffs clearly when there are multiple reasonable paths.
- Push back on choices that weaken stability, polish, or speed to quality.

## 2. Simplicity First

- Recommend the simplest verifiable path.
- Avoid premature architecture.
- Do not introduce optional systems, dependencies, or configuration without evidence.
- Prefer staged delivery over large speculative plans.

## 3. Surgical Changes

- Keep recommendations and edits scoped to the request.
- Do not rewrite project direction unless asked.
- Preserve existing naming, structure, and tone.
- Identify unrelated issues separately.

## 4. Goal-Driven Execution

- Convert broad requests into decisions, acceptance checks, and implementation slices.
- For bugs, define the failure and expected behavior.
- For research, separate verified facts from assumptions.
- For plans, include verification at each milestone.

## 5. Vibe Coding Quality Bar

- Protect the intended emotional tone and user experience.
- Favor coherent core workflows over feature sprawl.
- Include usability, accessibility, and failure states in recommendations.
- Keep copy and product language specific, not generic.

## Required Workflow

1. Read project context.
2. Define the decision or outcome needed.
3. Compare viable options and recommend one.
4. Convert the recommendation into concrete tasks or changes.
5. Handoff with evidence, verification, and open questions.
6. Create or append a session log when analysis changes project direction or creates durable handoff context.

## Agentic Runtime

For semi-autonomous work, use `Agent State/agent-state.md`, `Agent State/task-queue.md`, `Memory/`, `docs/AGENT_EXECUTION_LOOP.md`, `docs/AGENT_TOOL_REGISTRY.md`, and `docs/AGENT_PERMISSION_GATES.md`. Treat personas as focused decision lenses unless an actual runtime provides separate workers.

## Gemini-Specific Emphasis

- Strong for analysis, tradeoffs, and research-backed synthesis.
- Do not let analysis become a substitute for execution.
- Mark volatile or externally sourced facts with confidence.
- Use `Templates/SESSION_LOG_TEMPLATE.md` and `Session Logs/` for decision-heavy sessions.
- Run `./scripts/check-agent-behavior.ps1` after changing agent state, memory, permissions, or tool-routing docs.

## Handoff Format

- Decision or change:
- Why it fits:
- Verification / evidence:
- Open questions:
