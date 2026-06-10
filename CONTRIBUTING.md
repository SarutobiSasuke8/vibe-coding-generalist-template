# Contributing

## Working Agreement

- Read `AGENTS.md` before making changes.
- Keep changes scoped to the issue or request.
- Update tests or verification steps when behavior changes.
- Update docs when commands, setup, or workflows change.
- Run `./scripts/check-agent-docs.sh` (or `./scripts/check-agent-docs.ps1` on Windows) after changing agent instruction files.

## Pull Requests

Every PR should include:

- What changed.
- Why it changed.
- How it was verified.
- Any risks, tradeoffs, or follow-ups.

## Agent Instruction Changes

When changing agent behavior:

1. Update `AGENTS.md` first.
2. Update adapters only with tool-specific emphasis.
3. Run `./scripts/check-agent-docs.sh` (or `./scripts/check-agent-docs.ps1` on Windows).
4. Mention the reason for the instruction change in the PR.

