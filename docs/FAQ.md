# FAQ

Common questions about this template. The short version of this list lives in `README.md`; the README also covers what the template is and how to start.

## Setup

### Do I have to run the init script, or can I edit files by hand?

You can edit by hand. `docs/SETUP_CHECKLIST.md` walks the manual path. The init script just automates the same edits and runs the drift check at the end so you do not forget a placeholder.

### What does init actually change?

It writes project identity, commands, and stage into `AGENTS.md`; generates a starter `docs/PROJECT_BRIEF.md`, a project `README.md`, and starter `TODO.md` / `ROADMAP.md` files; resets the session log index; demotes personas the chosen tier does not keep into `personas/optional/`; applies the `--session-logs` choice (local-only by default, or committed) to `.gitignore`; and runs `scripts/check-agent-docs.*` to confirm everything still aligns. It does not run Git commands or install dependencies.

### Can I re-run init?

Yes. It is idempotent. By default it leaves already-customized fields alone; pass `--force` (bash) or `-Force` (PowerShell) to overwrite them. Pass `--non-interactive` / `-NonInteractive` to skip prompts in scripts and CI.

### Does init handle Windows and macOS/Linux?

Yes. `scripts/init.ps1` is the PowerShell entry point and `scripts/init.sh` is the bash entry point. They mirror each other. `scripts/test-init.ps1` and `scripts/test-init.sh` run as smoke tests in CI on every PR (see `.github/workflows/agent-docs.yml`).

## Adapters and agents

### Do I need all five agent adapters (Claude, Codex, Gemini, Copilot, Cursor)?

No, but the cost of keeping them is low (~150 lines total, all under the 80-line drift-check cap). The benefit is real: collaborators who use a different tool than you arrive with the same operating contract instead of having to reverse-engineer it. Delete an adapter only if you are confident no future contributor will use that tool.

### What does "thin adapter" actually mean?

The adapter exists to translate `AGENTS.md` into a tool's preferred location and vocabulary -- nothing more. It must reference `AGENTS.md` as canonical, mention the five core principles by name, fit under 80 lines, and add only the guidance that is genuinely tool-specific (Claude plan mode, Codex patch edits, Cursor inline edit size, etc.). The drift check enforces these constraints.

### What if a tool I use isn't in the list?

Add a new adapter file alongside the existing ones, mirror their shape, link `AGENTS.md` as canonical, and add it to the `requiredFiles` and `adapterFiles` arrays in both `scripts/check-agent-docs.ps1` and `scripts/check-agent-docs.sh`. Run the drift check; if it passes, the new adapter is part of the contract.

## Personas

### Do I need all 11 personas?

No. The init prompt offers three tiers:

- `minimal` (3): Product, CTO, QA -- the bare minimum for any project that ships.
- `standard` (6): adds Code Reviewer (maintainability), Design Director, and Delivery Lead -- the "ship it well" team most projects benefit from.
- `full` (11): adds Aegis (security), Data/Analytics, Growth/Launch, Ops/Deployment, and Research Scout -- useful when the project is mature enough to need those specialist lenses.

Personas the tier does not keep move to `personas/optional/`. The drift check accepts either location, so promoting a persona back is a `mv personas/optional/foo.md personas/` away.

### When should I actually invoke a persona?

When the question is too narrow for "generalist coding agent" to be the right voice. Quality, security, design, launch, deployment, and research are the recurring ones. Use `personas/agent-council-protocol.md` to route a multi-persona review and produce one synthesized report instead of N separate ones.

### Can I edit a persona, or write my own?

Yes -- they are reusable role prompts, not framework files. Match the existing shape: a short role definition, the kind of judgment the persona applies, and what good output looks like. Drop new personas into `personas/` (or `personas/optional/` for tier-specific ones) and update `personas/README.md` if discoverability matters. If you want Claude Code to run it as an isolated reviewer, add a subagent wrapper in `.claude/agents/` following the existing pattern.

## Subagents

### What are the persona subagents?

Each persona has a thin wrapper in `.claude/agents/` that Claude Code runs as a **subagent**: a separate agent instance with its own context window, a clean view of the persona file, and a read-only tool set. `/council` fans the relevant personas out as parallel subagents and synthesizes one report; `/review` does the same with `code-reviewer` and `qa-acceptance-tester`. See `docs/SUBAGENTS.md` for the full how/when/why.

### Why not just ask Claude to "act as the QA persona"?

That works, but the subagent version is structurally better for review work: it does not inherit the conversation's momentum (so it judges the work cold), its file-reading happens in its own context (so a 20-file QA pass does not crowd out your session), it can run in parallel with other personas, and its tool list physically prevents it from "helpfully" editing the code it is reviewing.

### Do subagents replace the persona files?

No. The persona files in `personas/` stay the single source of truth -- the wrappers load them at runtime from `personas/` or `personas/optional/`. Edit the persona and the subagent picks it up. Other tools (Codex, Cursor, Gemini, Copilot) ignore `.claude/agents/` and use the persona files directly.

## Drift check and strict mode

### What does the drift check actually check?

In standard mode: required files exist, optional personas live in either location, `AGENTS.md` has the canonical headings and principle markers, the project brief has its required headings, adapters carry the alignment markers and stay under the line cap, persona/template files contain no non-portable phrases, and the session log index resolves.

In `--strict` / `-Strict` mode: also fails on unresolved `TODO` placeholders or Mustache-style template tokens (e.g. a literal double-brace placeholder) in `AGENTS.md`, the project brief, the adapters, `README.md`, `ROADMAP.md`, `TODO.md`, and any file under `docs/` (excluding `docs/examples/`, `Templates/`, and `personas/optional/`).

### When should I run strict mode?

After running init (and ideally after any meaningful edit to project identity, commands, or the brief). The init script runs the standard check; strict is the right gate before the first real handoff or release. CI runs only the standard check on every PR -- strict failing in the public template repo is expected, because the template ships with deliberate `TODO` placeholders for forkers to fill in.

### The strict check fails in the public template repo. Is that a bug?

No. The template ships with `TODO` placeholders in `AGENTS.md` that are designed to be replaced during init. Strict mode is meant to be run *after* init, in your fork, to confirm every placeholder was filled. CI gates on the standard check, not strict, for this reason.

## Workflow rituals

### When should I write a session log?

When the next agent (you or someone else) would otherwise have to ask "why is it like this?" -- multi-file changes, architectural decisions, debugging sessions, persona council outputs, release work. `docs/SESSION_LOGGING.md` has the full criteria. Skip the log for trivial one-line fixes.

### When should I update `AGENTS.md` versus `TODO.md` versus `ROADMAP.md`?

`AGENTS.md` is for repeated mistakes and durable conventions: when you have corrected the same agent twice for the same thing, codify it. `TODO.md` is the working queue -- transient items, current sprint, immediate follow-ups. `ROADMAP.md` is the medium-term direction with phases, decisions, and risks. If a TODO survives more than two weeks, it probably belongs on the roadmap.

### What's the difference between slash commands, subagents, and skills?

Slash commands (`.claude/commands/`) are repo-local prompts that run in your current conversation. Subagents (`.claude/agents/`) are repo-local agent definitions that run in their own isolated context with their own tool restrictions. Skills are reusable instruction packages (`SKILL.md` files from plugins or user config) that Claude loads on demand; they appear in Claude Code's available-skills list. Repo-local commands and subagents ship with every fork, which makes them the safer bet for "every fork should have this."

### Should session logs be committed or local-only?

Local-only (the default) protects private context but means the logs do not survive a fresh clone, reach collaborators, or persist from cloud agent sessions (a remote container's local files are destroyed when it is reclaimed). Committed logs travel with the repo and act as real shared memory -- at the cost of needing redaction discipline. Pass `--session-logs committed` / `-SessionLogs committed` to init to switch; `docs/SESSION_LOGGING.md` has the full tradeoff.

## Versioning and upgrades

### What does `VERSION` mean?

It is the template's own semantic version, not your project's. The drift check validates it as `MAJOR.MINOR.PATCH` (with optional pre-release suffix). It exists so future tooling can detect when a fork is on an old template version and offer migration help. Until that tooling exists, treat it as a release marker.

### What is `.vibe-template-version`?

Init writes this file at the repo root, recording which template version your fork was initialized from. It is the upgrade-detection marker: future CLI tooling will read it and compare against the latest template `VERSION` to suggest migrations. Commit it after init -- it is meant to travel with the fork.

### How do I upgrade my fork when the template gets a new version?

For now, manually: read `CHANGELOG.md`, port relevant changes into your fork, and run the drift check. The CLI roadmap (`docs/CLI_ROADMAP.md`) sketches a `vibe upgrade` command that automates this once the template is stable enough for a CLI to wrap it.

### Where do I track my own project's version?

In your project, not in the template's `VERSION` file. Most projects track this in `package.json`, `pyproject.toml`, a Git tag, or a separate file. Leave the template `VERSION` alone unless you are intentionally forking the template itself.

## Stack and infrastructure

### Is this template stack-agnostic?

Yes. There is no language or framework code in the template. Add your stack after init; rename `.github/workflows/quality.yml.example` to `quality.yml` once you have real lint/test/build commands to wire up.

### What does CI actually run on every PR?

`.github/workflows/agent-docs.yml` runs both drift-check scripts (`pwsh` on `windows-latest`, `bash` on `ubuntu-latest`) and both init smoke tests. CI fails on standard-mode drift, missing required files, line-cap violations, line-limit violations, or smoke test failures.

### Does this require any hosted services or accounts?

No. Everything runs locally or in GitHub Actions. There are no API keys, no hosted dashboards, no required external services.

## Philosophy

### Why is this a template instead of a CLI?

Because the patterns must be stable before they are worth automating. `docs/CLI_ROADMAP.md` describes the split point: when the template is release-worthy and the workflow is settled, a CLI can wrap it. Building the CLI on shaky behavior would just lock in the wrong abstractions.

### Why so many files?

Most are short and serve a specific purpose. `AGENTS.md` is the contract; everything else is either a thin adapter, a worked example, a workflow definition, or a reusable persona. The structure is meant to make the *right* file findable, not to maximize file count. If a file feels redundant in your project, delete it -- the drift check will tell you if it was load-bearing.

### Read `docs/WHY.md` for the longer rationale.
