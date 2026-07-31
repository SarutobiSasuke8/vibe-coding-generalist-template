---
description: Produce a structured handoff note for the current session
---

Produce a handoff in the AGENTS.md standard format for the work done in this session.

Steps:
1. Identify the changes from this session: read `git status`, `git diff`, and consult the conversation history for what was actually done (not what was planned).
2. Format the handoff exactly as:

   ```
   ## Change
   <one paragraph: what changed and why, in user-visible terms>

   ## Files
   - path/to/file.ext
   - path/to/other.ext

   ## Verification
   - <command run> — <result>
   - <UI/manual check performed> — <outcome>
   - <anything skipped, with reason>

   ## Risks / follow-ups
   - <residual risk or next action>
   ```

3. Be concrete: name commands and outcomes, not "tested it works".
4. If a session log was created, link it under Files.
5. Do not invent verification — if it was skipped, say so.
