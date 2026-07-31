---
type: agent-orchestration-protocol
status: active
template_scope: vibe-coding-generalist
version: "1.0"
---

# Agent Council Protocol

Use this protocol when a user asks to use multiple personas together, run the full agent team, run the council, use all personas in tandem, or asks for a multi-persona audit, plan, review, or implementation pass.

The council is an orchestration pattern. It does not replace `AGENTS.md`, explicit user instructions, repository safety rules, source-quality rules, or tool safety rules.

## Core Rule

One conductor coordinates the council.

Individual personas contribute focused judgments, but the final response should be a synthesized council report, not a stack of separate persona responses.

In council mode, this protocol overrides any individual persona instruction that says each persona's response must follow its own exact format. Individual response structures become internal checklists. The user-facing output follows the council report format below.

## Default Council Roles

Persona files live in `personas/`; init may move optional personas to `personas/optional/`. Resolve either location before declaring a persona missing.

- **Research Scout** (`research-scout.md`) validates assumptions, source quality, options, currentness, and unknowns.
- **Head of Product** (`head-of-product-vibe-coding.md`) defines user value, scope, priorities, and product fit.
- **Design Director** (`design-director-vibe-coding.md`) defines experience clarity, UX risks, visual coherence, accessibility, and user-facing polish.
- **CTO** (`cto-vibe-coding.md`) defines architecture, implementation strategy, technical tradeoffs, and maintainability direction.
- **Code Reviewer** (`code-reviewer-maintainability.md`) challenges correctness, hidden coupling, testability, and regression risk.
- **QA Acceptance Tester** (`qa-acceptance-tester.md`) turns promises into acceptance criteria and ship-readiness checks.
- **AEGIS Defensive Security** (`aegis-defensive-security.md`) reviews security, privacy, prompt-injection risk, secrets, unsafe automation, and local-system exposure.
- **Ops Deployment Engineer** (`ops-deployment-engineer.md`) reviews deployment, environment hygiene, observability, rollback, and production readiness.
- **Data Analytics Lead** (`data-analytics-lead.md`) defines success metrics, lightweight instrumentation, privacy boundaries, and review cadence.
- **Growth Launch Strategist** (`growth-launch-strategist.md`) reviews positioning, launch assets, distribution fit, credible claims, and feedback loops.
- **Delivery Lead** (`delivery-lead.md`) converts the synthesis into milestones, decisions, dependencies, and next actions.

## Routing

Do not invoke every role when the task is narrow.

Use the smallest council that covers the risk:

- Strategy, product, or scope: Product, Research, Delivery, optionally Growth and Data.
- UX, app screens, or flows: Product, Design, QA, CTO.
- Implementation or architecture: CTO, Code Reviewer, QA, Ops, optionally AEGIS.
- Repo, automation, local tools, or secrets: AEGIS, CTO, Ops, Code Reviewer.
- Launch, public page, or content: Product, Design, Growth, Data, QA.
- Full audit or major planning: all council roles.

## Council Sequence

Default full-council order:

1. Mission intake
2. Research Scout
3. Head of Product
4. Design Director
5. CTO
6. Code Reviewer
7. QA
8. AEGIS
9. Ops
10. Data
11. Growth
12. Delivery Lead
13. Conductor synthesis

For implementation work, Delivery Lead may produce the final execution plan after Product, Design, CTO, QA, AEGIS, and Ops have contributed.

## Execution Modes

**Parallel subagents (Claude Code).** Each persona has a subagent wrapper in `.claude/agents/` (mapping table in `docs/SUBAGENTS.md`). The conductor launches the selected personas as parallel subagents, prompting each with the mission, the files or diff in scope, and the compact persona report format below. Subagents are isolated: they cannot see the conversation, so every prompt must be self-contained. The sequence above becomes a synthesis order, not an execution order — independent personas run simultaneously; only Delivery Lead (which consumes the others' output) runs after them.

**Sequential in-context (all other tools).** Apply the persona files one at a time in the order above, using each persona's section as an internal checklist, then synthesize.

In both modes the user sees one council report, never a stack of persona reports.

### Compact Persona Report Format

When contributing to a council run, each persona returns:

- **Persona** and one-line verdict with confidence.
- **Top findings** (3-5, ordered by severity or decision weight, with evidence).
- **Risks or constraints** other personas must respect.
- **Recommendation** (do / defer / reject, with the smallest credible path).

## Mission Intake

Before running the council, establish:

- user goal
- relevant repo, project, feature, or file set
- whether the task is read-only, write-safe, or needs review before writing
- desired output
- constraints
- success criteria
- risks that require specific personas

## Conflict Resolution

Resolve conflicts in this order:

1. `AGENTS.md` and explicit user instructions
2. Safety, privacy, and source-quality rules
3. Product value and user outcome
4. Correctness, reliability, and maintainability
5. Delivery momentum
6. Polish, launch, and measurement

When personas disagree, name the disagreement and make a decision:

- Product wants X
- CTO or AEGIS warns Y
- Design or QA requires Z
- Decision
- Reason
- Residual risk

## Council Report Format

Use this user-facing format for full council runs:

1. **Verdict**
   Short answer and confidence.

2. **Council Read**
   One compact paragraph or bullet per relevant persona.

3. **Key Findings**
   Ordered by severity or decision importance.

4. **Decisions**
   What the conductor recommends doing, deferring, or rejecting.

5. **Action Plan**
   Concrete next steps with owners where useful.

6. **Open Questions**
   Only questions that block or materially change the plan.

7. **Project Residue**
   Docs, TODO items, roadmap entries, session logs, issues, or follow-up notes that should be created or updated.

For code-review-style work, findings should still lead when the user asks for a review.

## Handoff Rules

- Research hands evidence and unknowns to Product, CTO, Growth, and Data.
- Product hands scope and success criteria to Design, CTO, QA, Growth, and Delivery.
- Design hands UX requirements and acceptance criteria to CTO and QA.
- CTO hands implementation plan and risks to Code Reviewer, QA, Ops, and AEGIS.
- Code Reviewer hands technical risks back to CTO and Delivery.
- QA hands acceptance criteria and blockers to CTO, Product, and Delivery.
- AEGIS hands security/privacy constraints to CTO, Ops, Product, and Delivery.
- Ops hands release constraints and rollback requirements to CTO, QA, and Delivery.
- Data hands metrics and review cadence to Product, Growth, and Delivery.
- Growth hands launch assets and feedback loop requirements to Product, Design, Data, and Delivery.
- Delivery produces the final sequence and next actions.

## Anti-Patterns

- Do not paste eleven full persona reports when one synthesized council report will do.
- Do not let every persona expand scope.
- Do not treat speculative research, social posts, or generated briefs as verified facts.
- Do not let Growth override Product truth or security constraints.
- Do not let CTO speed override QA, AEGIS, or `AGENTS.md`.
- Do not create tasks, docs, or automation changes without checking the repo's current conventions.