# RIPER Workflow — Optional Phase-Gate Protocol

RIPER is a structured workflow that enforces phase separation to prevent premature execution. It is an *optional* protocol, not the default operating mode for this template.

Use RIPER when starting a complex feature, a risky refactor, or any task where jumping into code before understanding the problem has burned you before.

---

## The five phases

| Phase | What happens | What is forbidden |
|---|---|---|
| **R**esearch | Understand the problem, read relevant code, identify constraints | Proposing solutions |
| **I**nnovate | Brainstorm possible approaches, explore tradeoffs | Choosing an approach |
| **P**lan | Commit to one approach, write a step-by-step implementation plan | Writing code |
| **E**xecute | Implement exactly the plan, no scope creep | Changing the plan mid-stream |
| **R**eview | Verify against acceptance criteria, surface residual risk | Starting new work |

Each phase must be explicitly completed before the next begins. The agent states which phase it is in at the start of each response.

---

## When to use it

Good candidates:

- Features that touch multiple systems or have non-obvious dependencies
- Refactors where behavior preservation is critical
- Security-sensitive changes (use AEGIS persona during Review)
- Any task where past "just start coding" attempts went sideways

Not worth the overhead for:

- Small bug fixes with a clear cause
- Straightforward UI changes
- Tasks where you already have a solid spec from `/spec`

---

## How to invoke it

Tell Claude to follow RIPER for a specific task:

```
Follow the RIPER workflow for this feature. Start in Research phase.
Read docs/RIPER_WORKFLOW.md first.
```

Claude will label each phase and wait for your explicit "proceed to [next phase]" before moving forward. You can accelerate through phases you trust and slow down on phases that feel risky.

---

## Relationship to the operating loop

The RIPER phases map onto the existing operating loop in `AGENTS.md`:

- Research + Innovate → "Understand the request and inspect relevant files"
- Plan → "Define success criteria before implementing"
- Execute → "Make the smallest coherent change"
- Review → "Verify with the narrowest meaningful check"

RIPER makes these phases explicit and enforces the gates. The operating loop is the default; RIPER is what you use when you need the gates enforced rather than implied.

---

## Relationship to other protocols

- Use `/spec` output as the input to the Plan phase — skip Research and Innovate if you already have a good spec.
- After Execute, use `/review` to run the Code Reviewer and QA personas on the output.
- After Review, use `/session-log` to capture the outcome.
