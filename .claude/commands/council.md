---
description: Run a persona council review with parallel subagents
---

Read `personas/agent-council-protocol.md` and `AGENTS.md`.

**If a specific task or question was provided:** Route through the minimum set of personas that covers the risk — do not invoke every role for a narrow task. Use the routing table in `personas/agent-council-protocol.md` to decide which roles are relevant.

**If no task or question was provided:** Run a full project review and advisory session. Read `docs/PROJECT_BRIEF.md`, `ROADMAP.md`, and `TODO.md` to load project context. Then route through all relevant council roles to produce a holistic review of the project's current state — covering product direction, technical health, open risks, delivery posture, and recommended next actions.

**Execution — fan out via subagents:** Each persona has a subagent in `.claude/agents/` (see the mapping table in `docs/SUBAGENTS.md`). Launch the selected personas as parallel subagents in a single message. Give each one: the mission and success criteria, the specific files / diff / question in scope, and the compact council report format from `personas/agent-council-protocol.md`. Subagents cannot see this conversation — the prompt must be self-contained.

You are the conductor: synthesize the returned reports into one council report using the format in the protocol, resolving conflicts with its conflict-resolution order. Do not paste the raw subagent reports back-to-back.

**Fallback:** If subagents are unavailable, apply the persona files sequentially in-context (check `personas/optional/` for any persona not in `personas/`) and synthesize the same way.
