# Why This Template Exists

AI coding agents are powerful, but they are not naturally grounded in a project.

They forget context between sessions. They follow different instruction formats. They can overbuild, under-verify, rewrite nearby code for taste, or confidently pursue the wrong interpretation when the repo does not give them a durable operating contract.

This template exists to make AI-assisted software work less fragile.

## The Problem

Most AI-assisted repos eventually accumulate scattered instructions:

- One note for Claude.
- Another for Cursor.
- A Copilot instruction file.
- A README that says something different.
- Important decisions trapped in chat.
- No clear rule for when to verify, log, review, or hand off.

The result is drift. Different agents behave differently in the same project, and future sessions have to rediscover what past sessions already learned.

## The Bet

The repo should be the source of truth.

Instead of relying on one chat thread or one tool's memory, the project should carry its own operating layer:

- `AGENTS.md` defines the canonical contract.
- Tool adapters stay thin and point back to that contract.
- `docs/PROJECT_BRIEF.md` explains the product and quality bar.
- Personas provide specialist lenses when judgment matters.
- Session logs preserve decisions and handoff context.
- Drift checks catch misalignment before it becomes behavior.

This is not process for its own sake. It is a small amount of structure that keeps AI-generated work useful, reliable, and aligned.

## What Good Looks Like

A good agent-ready repo should let a new AI coding agent answer:

- What is this project trying to become?
- Who is it for?
- What feeling or quality bar matters?
- What files should I read before acting?
- What kind of changes are out of scope?
- How should I verify my work?
- How should I hand off what changed?
- Where do durable decisions live?

If the agent cannot answer those questions, it is guessing.

## Why Multiple Agent Files?

Different tools read different files.

This template supports Claude Code, Codex, Cursor, Gemini, Copilot, and future tools by keeping one canonical contract and generating or maintaining thin adapters around it.

The goal is not to duplicate instructions. The goal is to make every tool enter the same project with the same expectations.

## Why Personas?

Software projects need different kinds of judgment at different moments.

A product decision, architecture decision, QA pass, security review, launch plan, and deployment plan should not all sound like the same generic assistant. Personas give agents reusable lenses for the moments where a single coding perspective is too narrow.

The persona council protocol keeps that from becoming noise: multiple perspectives should synthesize into one useful recommendation, not a pile of disconnected reports.

## Why Session Logs?

Chat is not durable project memory.

Meaningful sessions often include tradeoffs, decisions, bugs, constraints, and follow-ups that future agents need. Session logs turn those into repo-owned context.

They are especially useful after:

- Multi-file changes.
- Architecture decisions.
- Debugging sessions.
- Persona council reviews.
- Release or handoff work.
- Any session where the next agent would otherwise have to ask, "Why is it like this?"

## Why Drift Checks?

Agent instructions rot quietly.

The drift check makes sure required files exist, adapters remain thin, important headings are present, optional personas are accounted for, and strict mode catches unresolved setup placeholders.

This matters because the cost of stale instructions is paid later in worse agent behavior.

## What This Is Not

This is not:

- A framework for app code.
- A replacement for Git.
- A project management system.
- A hosted AI service.
- A prompt dump.
- A promise that agents will never make mistakes.

It is a repo-native operating contract for AI-assisted work.

## Long-Term Direction

The template is the first layer.

The larger product direction is an Agent Ops OS: a CLI and, eventually, optional UI that can initialize, check, sync, upgrade, and govern agent-ready repos across tools and teams.

The public template should stay useful on its own. Future tooling should automate the patterns, not hide them.
