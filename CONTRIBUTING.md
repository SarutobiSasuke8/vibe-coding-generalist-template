# Contributing

## Working Agreement

- Read `AGENTS.md` before making changes.
- Keep changes scoped to the issue or request.
- Update tests or verification steps when behavior changes.
- Follow `docs/QUALITY_RATCHET.md`: every meaningful behavior change should leave a durable test, eval, smoke check, QA note, or documented reason.
- Update docs when commands, setup, or workflows change.
- Run `./scripts/check-agent-docs.ps1` after changing agent instruction files.

## Pull Requests

Every PR should include:

- What changed.
- Why it changed.
- How it was verified.
- What ratchet was added or why none was practical.
- Any risks, tradeoffs, or follow-ups.

## Agent Instruction Changes

When changing agent behavior:

1. Update `AGENTS.md` first.
2. Update adapters only with tool-specific emphasis.
3. Run `./scripts/check-agent-docs.ps1`.
4. Mention the reason for the instruction change in the PR.
