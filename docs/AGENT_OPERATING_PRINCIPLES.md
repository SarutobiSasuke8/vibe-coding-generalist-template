# Agent Operating Principles

This document explains the shared behavioral principles used by every agent adapter in this template.

`AGENTS.md` is still the canonical operating contract. This file is the reusable explanation layer.

## Why These Principles Exist

AI coding agents often fail in predictable ways:

- They assume intent silently.
- They overbuild.
- They refactor unrelated code.
- They make changes without a clear success condition.
- They optimize for visible progress instead of verified quality.

This template counters those failure modes with five shared principles.

## 1. Think Before Coding

Do not assume when ambiguity changes the implementation.

Good behavior:

- Name assumptions explicitly.
- Ask clarifying questions when the answer affects architecture, data, privacy, cost, or user experience.
- Present tradeoffs when multiple paths are plausible.
- Push back when the requested approach is likely to create avoidable complexity or product weakness.

Bad behavior:

- Choosing an interpretation silently.
- Building on uncertainty.
- Treating a vague request as permission for a large rewrite.

## 2. Simplicity First

Use the smallest solution that solves the actual problem well.

Good behavior:

- Prefer direct code over abstractions until repetition or complexity justifies abstraction.
- Avoid speculative features.
- Avoid new dependencies unless they clearly reduce risk or complexity.
- Keep APIs narrow.

Bad behavior:

- Adding configuration nobody asked for.
- Creating strategy/factory/plugin systems for a single use case.
- Replacing the stack because a small fix is awkward.

## 3. Surgical Changes

Every changed line should trace back to the user's request.

Good behavior:

- Match existing style.
- Touch only relevant files.
- Preserve comments and docs unless changing them is part of the task.
- Clean up artifacts created by your own changes.
- Mention unrelated issues separately.

Bad behavior:

- Drive-by refactors.
- Formatting churn.
- Renaming unrelated variables.
- Deleting old code because it looks unused without proving it is safe.

## 4. Goal-Driven Execution

Convert requests into verifiable outcomes.

Good behavior:

- Define acceptance checks.
- Add or run tests for behavior changes when feasible.
- Verify builds, type checks, or UI screens as appropriate.
- Explain residual risk when verification is unavailable.

Bad behavior:

- "I made it better" without an observable success condition.
- Fixing a bug without reproducing or identifying the failure.
- Shipping UI changes without checking the screen when a browser is available.

## 5. Vibe Coding Quality Bar

Vibe coding projects must feel alive, intentional, cohesive, and reliable.

Good behavior:

- Protect the emotional goal of the product.
- Build the core workflow first.
- Include loading, empty, and error states where they affect the experience.
- Use clear, specific copy.
- Treat polish as functional quality.

Bad behavior:

- More features with weaker core flows.
- Generic UI that ignores the product's feeling.
- Pretty screens that fail under normal use.

## Working Test

These principles are working if:

- Diffs are smaller and easier to review.
- Agents ask better questions before implementation.
- Code has fewer speculative abstractions.
- Verification is concrete.
- The product stays coherent while moving quickly.

