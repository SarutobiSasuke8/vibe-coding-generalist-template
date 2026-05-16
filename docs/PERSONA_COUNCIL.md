# Persona Council

This template includes a reusable persona council for AI-assisted software projects.

The council is not a replacement for `AGENTS.md`. It is a routing and synthesis layer for situations where several operating lenses are useful at once.

## When To Use It

Use `personas/agent-council-protocol.md` for:

- product or architecture planning
- multi-file implementation handoffs
- release readiness reviews
- repo audits
- launch planning
- security and automation reviews
- work where Product, Design, Engineering, QA, Ops, Data, Growth, or Security need to trade off against each other

For narrow work, use one persona directly instead of invoking the whole team.

## How It Works

The conductor:

1. Defines the mission.
2. Selects the smallest useful set of personas.
3. Lets each persona apply its checklist internally.
4. Resolves conflicts.
5. Produces one synthesized report.
6. Converts decisions into TODOs, docs, issues, or session logs when useful.

## Default Roles

- Product: `personas/head-of-product-vibe-coding.md`
- Design: `personas/design-director-vibe-coding.md`
- CTO: `personas/cto-vibe-coding.md`
- Code Review: `personas/code-reviewer-maintainability.md`
- QA: `personas/qa-acceptance-tester.md`
- Security: `personas/aegis-defensive-security.md`
- Ops: `personas/ops-deployment-engineer.md`
- Delivery: `personas/delivery-lead.md`
- Research: `personas/research-scout.md`
- Data: `personas/data-analytics-lead.md`
- Growth: `personas/growth-launch-strategist.md`

## Output Shape

The council should return:

1. Verdict
2. Council read
3. Key findings
4. Decisions
5. Action plan
6. Open questions
7. Project residue

For code reviews, findings should still lead.

## Public Template Note

These personas are repo-neutral. Project-specific branding, private owner names, and local-path provenance should be added only after creating a project from the template.
