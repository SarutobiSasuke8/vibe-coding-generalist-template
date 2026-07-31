---
description: Run the agent doc alignment check
---

Run the agent doc drift check.

Steps:
1. If on Windows / pwsh available, run `./scripts/check-agent-docs.ps1`. Otherwise run `./scripts/check-agent-docs.sh`.
2. If the user passed `--strict` or `-Strict` as $ARGUMENTS, append the strict flag to the command.
3. Report the result in one short paragraph:
   - If exit 0: confirm green and which mode ran.
   - If non-zero: list the errors verbatim and suggest the smallest fix per error (e.g., adapter over line cap → trim that adapter; missing heading → add it).
4. Do not attempt to fix the errors automatically unless the user asks — surface them first.
