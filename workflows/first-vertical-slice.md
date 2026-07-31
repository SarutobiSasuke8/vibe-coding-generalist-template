# First Vertical Slice Workflow

Metadata:

- trigger: starting a new app, tool, automation, or feature before broad implementation
- inputs: project brief, target user, one workflow, available stack, design contract, verification command
- expected output: one working user-visible or command-line path with one meaningful check
- verification: core path runs end-to-end and has one durable ratchet

## Steps

1. Name the user and the exact outcome they need.
2. Pick one workflow that proves the product promise in the smallest coherent form.
3. Read `docs/PROJECT_BRIEF.md`, `DESIGN.md`, and `AGENTS.md`.
4. Define the first screen, command, API route, or automation entrypoint.
5. Build only the path needed for that outcome.
6. Include the minimum required loading, empty, error, and success state for that path.
7. Add one verification signal: test, smoke check, screenshot check, CLI output check, or QA note.
8. Update `TODO.md`, `ROADMAP.md`, or `Memory/decisions.md` only with durable follow-up context.

## Constraints

- Do not add secondary workflows until the first one works.
- Do not build settings, dashboards, onboarding, or abstractions unless they are required for the first path.
- Do not create a landing page when the user needs the actual tool.
- Do not skip `DESIGN.md` for UI work.

## Handoff

End with:

- the workflow that now works
- the file or command that proves it
- the ratchet added
- the next single workflow to build
