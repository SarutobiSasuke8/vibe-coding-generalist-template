# Subagents

Claude Code can delegate work to **subagents**: separate agent instances defined by Markdown files in `.claude/agents/`. Each has its own system prompt, its own context window, and (optionally) its own restricted tool set. This template ships one subagent per persona, which turns the persona council from "one model role-playing eleven voices" into real parallel, isolated reviewers.

This doc covers what they are, why this template uses them, when to reach for them (and when not to), and how to run and extend them.

## What ships in this template

Each subagent is a thin wrapper that loads its persona file — from `personas/`, or `personas/optional/` if init demoted it — then operates as an isolated, read-only judgment lens.

| Subagent | Persona file | Use for |
|---|---|---|
| `head-of-product` | `head-of-product-vibe-coding.md` | User value, scope, priorities |
| `cto` | `cto-vibe-coding.md` | Architecture, tradeoffs, technical direction |
| `qa-acceptance-tester` | `qa-acceptance-tester.md` | Acceptance criteria, ship readiness |
| `code-reviewer` | `code-reviewer-maintainability.md` | Diff review, coupling, regression risk |
| `design-director` | `design-director-vibe-coding.md` | UX clarity, states, polish, accessibility |
| `security-reviewer` | `aegis-defensive-security.md` | Secrets, injection, unsafe automation |
| `ops-engineer` | `ops-deployment-engineer.md` | CI/CD, environments, rollback |
| `data-analytics` | `data-analytics-lead.md` | Metrics, instrumentation, privacy bounds |
| `growth-strategist` | `growth-launch-strategist.md` | Positioning, launch assets, credible claims |
| `delivery-lead` | `delivery-lead.md` | Milestones, sequencing, next actions |
| `research-scout` | `research-scout.md` | Assumption validation, options, sources (has web access) |

All are read-only by design: they report findings; the main conversation (or you) decides what to change. This is enforced two ways — their `tools` frontmatter omits Edit/Write, and their prompts say so.

## Why subagents instead of "act as persona X"

Asking the main conversation to role-play a persona works, but subagents are structurally better for review work:

1. **Context isolation.** A QA pass might read twenty files and run the test suite. In the main conversation, all of that output stays in context and crowds out your actual work. A subagent does the reading in its own context and returns only the findings.
2. **Parallelism.** A council run can launch Product, CTO, QA, and Security simultaneously instead of sequentially. Four reviews in roughly the time of one.
3. **Role fidelity.** A persona adopted mid-conversation inherits everything already said and drifts toward agreeing with it. A subagent starts clean from the persona file and judges the work cold — closer to a real independent reviewer.
4. **Tool scoping.** Subagents can be restricted to read-only tools. The reviewer physically cannot "helpfully fix" the code it is reviewing — which protects the Surgical Changes principle.

## When to use them

- **Council runs.** `/council` routes the relevant personas and fans them out in parallel. This is the flagship use.
- **Review passes.** `/review` dispatches `code-reviewer` and `qa-acceptance-tester` on the current diff.
- **Proactive delegation.** Claude auto-delegates based on each subagent's `description` — e.g. after a multi-file change it may offer to run `code-reviewer` unprompted.
- **Explicit requests.** "Use the security-reviewer subagent on the auth changes." Works any time.
- **Read-heavy research.** `research-scout` can chew through docs and web sources without flooding your main context.

## When NOT to use them

Subagents have real costs. Skip them when:

- **The task is small.** A one-file change does not need a four-persona fan-out. A quick in-context look is faster and cheaper.
- **You need a conversation.** A subagent gets one prompt and returns one report; you cannot interject mid-run. Use the main conversation (or plan mode) for work that needs back-and-forth.
- **The work is implementation, not judgment.** These subagents are deliberately read-only. The main conversation implements; subagents advise and verify.
- **Latency or token budget matters.** Each subagent re-reads the persona file, contract, and brief. Parallel runs multiply token usage. Proportionality is the rule: the council exists to protect quality, not to perform process.

A good default: implement in the main conversation, then spend one subagent (usually `code-reviewer` or `qa-acceptance-tester`) verifying, and reserve multi-persona fan-outs for decisions and audits that genuinely have multiple risk surfaces.

## How to run them

In Claude Code:

- **Slash commands:** `/council <task>` and `/review` use subagents automatically.
- **Explicitly:** name the subagent — "Have the cto subagent assess this migration plan."
- **Manage:** the `/agents` built-in command lists, edits, and creates subagents interactively.

A fan-out prompt from the conductor should give each subagent: the mission, the specific files or diff in scope, and the report format expected back (the council protocol defines a compact format). Subagents cannot see the conversation — anything they need must be in the prompt or in the repo's files. This is exactly why `AGENTS.md` and `docs/PROJECT_BRIEF.md` matter: they are how an isolated subagent gets briefed.

## How they relate to personas

The persona files in `personas/` remain the single source of truth for each role's judgment. The subagent files contain no persona content — only loading instructions and ground rules — so editing a persona automatically updates its subagent, personas keep working in Cursor/Codex/Gemini (which read the persona files directly), and the tier system (`personas/optional/`) needs no special handling because every wrapper checks both locations.

## Adding your own

1. Create `.claude/agents/<name>.md` with `name` (must match the filename), `description`, and optionally `tools` frontmatter, then the system prompt as the body.
2. Write the `description` for the *delegator*: it is how Claude decides when to hand work to this subagent. Say when to use it, and whether it is read-only.
3. If it wraps a persona, follow the existing wrapper shape: load the persona file from either location, read `AGENTS.md` and the brief, state the ground rules.
4. Run `./scripts/check-agent-docs.sh` — the drift check validates subagent frontmatter and requires the three core subagents (`head-of-product`, `cto`, `qa-acceptance-tester`).

Implementation subagents (with Edit/Write tools) are possible, but add them deliberately: an isolated agent that edits files is harder to supervise than one that reports. If you add one, give it a narrow mission and keep the Ralph-loop guardrails from `docs/RALPH_LOOP.md` (checkpoint commit first, review the diff after).

## Notes for other tools

Subagents are a Claude Code feature. Codex, Cursor, Gemini, and Copilot ignore `.claude/agents/` entirely — they use the persona files directly via `personas/agent-council-protocol.md`, run sequentially in one context. The council protocol documents both execution modes.
