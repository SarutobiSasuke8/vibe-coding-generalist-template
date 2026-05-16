# FAQ

## Is this a prompt library?

No. It includes prompts, but the main product is the repo operating contract: canonical rules, adapters, project context, workflow packs, runtime state, memory, and checks.

## Why not put everything in one agent file?

Different tools read different files. `AGENTS.md` stays canonical, while adapters give each tool enough context to behave well without duplicating the whole system.

## Should adapters be manually edited?

Only for tool-specific notes. Shared behavior belongs in `AGENTS.md`. Future CLI sync should regenerate generated adapter sections while preserving clearly marked custom sections.

## Is the agent runtime mandatory?

No. For small edits, use the contract and checks. Use `Agent State/`, `Memory/`, and `docs/AGENT_EXECUTION_LOOP.md` when work is multi-step, risky, or likely to resume across sessions.

## What should I do first after cloning?

Fill in `docs/PROJECT_BRIEF.md`, update commands in `AGENTS.md`, run `./scripts/check-agent-docs.ps1`, then run strict mode once starter placeholders are intentionally resolved.

## Can this work without a CLI?

Yes. The current template is file-first. The CLI should make setup, checks, sync, and doctor reports easier, not become the only way to use the system.

## What belongs in `Memory/`?

Stable facts, decisions, failures, and open questions that future agents should not rediscover. Do not use it for temporary scratch notes.

## What makes a workflow pack valid?

A workflow should define its trigger, inputs, steps, expected output, verification, and handoff. If it cannot say when to run or what artifact it produces, it is not ready.
