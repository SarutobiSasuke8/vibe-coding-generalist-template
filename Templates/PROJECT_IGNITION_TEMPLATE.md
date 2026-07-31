# Project Ignition Template

Lightweight Spec Kit-inspired starter for serious build candidates.

Use this when a project is bigger than a bug fix and smaller than a full architecture ceremony. The goal is to make the first build slice clear before implementation starts.

## 1. Source Context

- Vault note:
- Existing roadmap:
- Existing technical plan:
- Existing validation plan:
- Related repo:
- Owner:

## 2. Product Spec

Create `spec.md`.

Required sections:

- Product summary
- User stories, prioritized
- Acceptance scenarios
- Functional requirements
- Non-goals
- Success criteria
- Assumptions

Rule: user value first, implementation second.

## 3. Implementation Plan

Create `plan.md`.

Required sections:

- Summary
- Technical context
- Architecture decision
- Data and AI boundary
- Quality gates
- Project structure
- Known complexity

Rule: name the boring default and justify anything heavier.

## 4. Contracts

Create `contracts/` only if the build has APIs, tool calls, AI structured output, imports, exports, or permission boundaries.

For AI features, every contract must say:

- What AI can do
- What AI cannot do
- What gets written to durable state
- What requires confirmation

## 5. Quickstart

Create `quickstart.md`.

It should describe one seeded scenario that proves the first useful loop.

Required sections:

- Seed data
- Validation flow
- Acceptance criteria

## 6. Tasks

Create `tasks.md`.

Organize by:

- Setup
- Foundation
- One phase per user story
- Polish

Then create `tasks-mvp-trimmed.md`.

Rule: no implementation starts from the full list. Implementation starts from the trimmed list.

## 7. Vault Backlink

Update the relevant vault project note with:

- Sandbox/repo path
- Generated artifact path
- Current decision
- Next action

## 8. Stop Rule

If the artifact work does not produce a clearer first build slice, stop and return to normal Codex flow.
