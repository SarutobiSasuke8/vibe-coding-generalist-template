# Roadmap

Use this file for direction, milestones, and tradeoffs. Keep tactical tasks in `TODO.md`.

## Now

- Clarify the problem, user, and success criteria.
- Build the smallest useful working version.
- Establish install, run, test, and build commands.
- Keep agent adapters aligned with `AGENTS.md`.
- Complete the setup checklist after creating a project from the template.
- Capture important build sessions in `Session Logs/`.

## Next

- Improve reliability and error handling.
- Add tests around the first important workflows.
- Prepare a simple deployment or sharing path.
- Add project-specific agent rules only after repeated patterns prove they are needed.

## Later

- Harden architecture after the useful shape is proven.
- Add analytics, observability, or usage feedback if relevant.
- Document operating playbooks for recurring work.

## Decisions

| Date | Decision | Reason | Revisit When |
|---|---|---|---|
| TODO | TODO | TODO | TODO |

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Project goal is vague | Agents may build impressive but irrelevant features | Keep `docs/PROJECT_BRIEF.md` current |
| Commands are missing | Verification becomes inconsistent | Fill in `AGENTS.md` during setup |
| Scope expands too quickly | Prototype stalls | Keep `TODO.md` focused on vertical slices |
| Agent docs drift | Different tools follow different rules | Run `./scripts/check-agent-docs.ps1` and keep adapters thin |
| Starter placeholders remain too long | Agents lack concrete context and produce generic work | Run strict mode once project setup is complete |
| Session memory stays in chat | Future agents lose decisions and rationale | Use `Session Logs/` for meaningful sessions |
