# Ralph Loop — Autonomous Iteration Protocol

The Ralph loop is an autonomous execution pattern for Claude Code where the agent iterates on a bounded task without stopping to ask for approval at each step. It runs until the goal is met or a defined stop condition is reached.

Named after the community technique popularized in the Claude Code ecosystem. Useful for vibe coding because it keeps you out of the approval loop for tasks that have a clear definition of done.

---

## When to use it

Good candidates:

- Fix all failing tests
- Resolve all lint errors across the repo
- Implement a fully spec'd feature end-to-end (use `/spec` first)
- Migrate all instances of a pattern to a new one
- Scaffold a complete module from a clear brief

Bad candidates:

- Open-ended creative work where human steering is part of the process
- Anything touching auth, payments, secrets, or prod infrastructure
- Tasks where the definition of done is subjective or unclear
- Changes that affect shared state visible to other users

If you are unsure whether the task is bounded enough for a Ralph loop, spec it first with `/spec`.

---

## How to trigger it

Give Claude a goal statement with an explicit stop condition:

```
Run autonomously. Goal: implement the user settings page per the spec in SESSION_LOG. 
Stop when: all acceptance criteria are met and there are no TypeScript errors. 
Do not ask for approval between steps. Report when done.
```

Or for cleanup tasks:

```
Run autonomously. Fix all ESLint errors in src/. Stop when lint passes clean. Report what changed.
```

---

## Guard rails for vibe coding

The Ralph loop trades human oversight for speed. Apply these guardrails:

1. **Spec first for features.** Use `/spec` to define acceptance criteria before starting the loop. The loop needs a clear finish line.
2. **Commit before starting.** Run `git add -A && git commit -m "pre-loop checkpoint"` so you have a clean rollback point.
3. **Set a scope boundary.** Tell Claude which directories or files are in scope. Prevent loop sprawl.
4. **Review the diff when done.** The loop ran unsupervised. Read what changed before shipping.
5. **Stop conditions must be verifiable.** "Tests pass" or "lint is clean" are good. "Looks good" is not.

---

## Relationship to the persona council

The Ralph loop and the persona council serve different purposes:

- **Council** — multi-perspective judgment on *what* to build or *whether* to build it. Use before starting work.
- **Ralph loop** — autonomous execution of *how* to build something already decided. Use after the scope is clear.

A common pattern: run `/council` or `/spec` to agree on the goal, then hand off to a Ralph loop for implementation.

---

## Session logging

After a Ralph loop, create a session log with `/session-log`. Autonomous sessions are the ones most worth capturing — they move fast and the decisions made mid-loop are easy to lose.
