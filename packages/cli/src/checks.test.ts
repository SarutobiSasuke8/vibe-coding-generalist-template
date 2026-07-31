import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import assert from "node:assert/strict";
import { runChecks } from "./checks.js";
import { exportDesignTokens, runDesignCheck } from "./design.js";
import { runDoctor } from "./doctor.js";
import { runHealth } from "./health.js";
import { runInit } from "./init.js";
import { runMaintenance } from "./maintenance.js";
import { blockTask, completeTask, getNextTask, startTask } from "./tasks.js";

test("reports missing required files", () => {
  const root = makeTempRepo();
  const result = runChecks({ rootDir: root });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("Missing required file: AGENTS.md")));
});

test("strict mode reports TODO placeholders", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);

  const result = runChecks({ rootDir: root, strict: true });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("Strict mode")));
});

test("doctor reports next ready agent task", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  const result = runDoctor({ rootDir: root });

  assert.equal(result.ok, true);
  assert.equal(result.summary.nextReadyTask, "[A-001] #task Write a focused test.");
  assert.ok(result.nextActions.some((action) => action.includes("Promote the ready task")));
});

test("task commands start, complete, and update state", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  const next = getNextTask(root);
  assert.equal(next.ok, true);
  assert.equal(next.task?.id, "A-001");

  const started = startTask(root, "A-001");
  assert.equal(started.ok, true);
  assert.match(readFileSync(join(root, "Agent State", "task-queue.md"), "utf8"), /## Active\s+- \[ \] \[A-001\]/);

  const completed = completeTask(root, "npm test passed");
  assert.equal(completed.ok, true);
  const queue = readFileSync(join(root, "Agent State", "task-queue.md"), "utf8");
  assert.match(queue, /## Done\s+- \[x\] \[A-001\].*verification: npm test passed/s);
  assert.match(readFileSync(join(root, "Agent State", "agent-state.md"), "utf8"), /Status: done/);
});

test("task commands block the active task with a reason", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  assert.equal(startTask(root).ok, true);
  const blocked = blockTask(root, "needs API key");

  assert.equal(blocked.ok, true);
  assert.match(readFileSync(join(root, "Agent State", "task-queue.md"), "utf8"), /## Blocked\s+- \[ \] \[A-001\].*blocked: needs API key/s);
});

test("maintenance reports read-only readiness without npm tests", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  const result = runMaintenance({ rootDir: root, includeTests: false });

  assert.equal(result.readOnly, true);
  assert.equal(result.summary.taskCount, 2);
  assert.ok(result.steps.some((step) => step.name === "doctor"));
  assert.ok(result.steps.some((step) => step.name === "npm-test" && step.status === "skip"));
});

test("maintenance writes JSON report artifact", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  const result = runMaintenance({ rootDir: root, includeTests: false, outFile: "reports/maintenance.json" });

  const reportPath = join(root, "reports", "maintenance.json");
  assert.equal(result.readOnly, true);
  assert.equal(result.artifactPath, reportPath);
  assert.equal(existsSync(reportPath), true);
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.equal(report.readOnly, true);
  assert.equal(report.summary.taskCount, 2);
});

test("design check validates DESIGN.md and exports CSS tokens", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);

  const check = runDesignCheck({ rootDir: root });
  assert.equal(check.ok, true);
  assert.equal(check.tokens.colors > 0, true);

  const exported = exportDesignTokens({ rootDir: root, outFile: "dist/design-tokens.css" });
  assert.equal(exported.ok, true);
  assert.equal(existsSync(join(root, "dist", "design-tokens.css")), true);
  assert.match(readFileSync(join(root, "dist", "design-tokens.css"), "utf8"), /--color-primary/);
});

test("health reports template dashboard items", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);

  const result = runHealth({ rootDir: root });

  assert.equal(result.ok, true);
  assert.ok(result.items.some((item) => item.name === "Design contract"));
  assert.ok(result.nextActions.length > 0);
});

test("init fills core project placeholders", () => {
  const root = makeTempRepo();
  writeMinimalValidRepo(root);
  writeMinimalAgentRuntime(root);
  writeInitTargets(root);

  const result = runInit({
    rootDir: root,
    name: "Recipe Ledger",
    type: "web app",
    primaryUser: "home cooks",
    stage: "prototype",
    goal: "Help home cooks save reliable recipes and rebuild grocery lists.",
    packageManager: "npm",
    install: "npm install",
    dev: "npm run dev",
    test: "npm test",
    lint: "npm run lint",
    build: "npm run build",
    mode: "standard",
    desiredVibe: "calm and exact",
    adaptDesign: "Keep default DESIGN.md and favor dense recipe management screens."
  });

  assert.equal(result.ok, true);
  assert.ok(result.changedFiles.includes("AGENTS.md"));
  assert.match(readFileSync(join(root, "AGENTS.md"), "utf8"), /Project name: `Recipe Ledger`/);
  assert.match(readFileSync(join(root, "agentops.config.yml"), "utf8"), /name: "Recipe Ledger"/);
  assert.match(readFileSync(join(root, "agentops.config.yml"), "utf8"), /mode: standard/);
  assert.match(readFileSync(join(root, "DESIGN.md"), "utf8"), /Project Adaptation Notes/);
  assert.match(readFileSync(join(root, "Memory", "project-facts.md"), "utf8"), /Project name: Recipe Ledger/);
  assert.match(readFileSync(join(root, "Agent State", "task-queue.md"), "utf8"), /\[A-001\] #task Replace remaining project setup placeholders/);
});

function makeTempRepo() {
  const root = join(tmpdir(), `agentops-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  return root;
}

function writeMinimalValidRepo(root: string) {
  const dirs = [
    ".github",
    ".github/workflows",
    ".cursor/rules",
    "docs",
    "Agent State",
    "Memory",
    "QA",
    "scripts",
    "workflows"
  ];
  for (const dir of dirs) {
    mkdirSync(join(root, dir), { recursive: true });
  }

  const agents = [
    "## Project Identity",
    "TODO",
    "## Product Goal",
    "## Non-Negotiable Standard",
    "## Operating Loop",
    "## Agentic Runtime Layer",
    "## Core Principles",
    "## Commands",
    "## Verification Policy",
    "## Agent Coordination",
    "## Handoff Standard"
  ].join("\n");

  writeFileSync(join(root, "AGENTS.md"), agents);
  writeFileSync(join(root, "VERSION"), "0.1.0");
  writeFileSync(join(root, "agentops.config.yml"), "templateVersion: 0.1.0\n");
  writeFileSync(
    join(root, "DESIGN.md"),
    [
      "---",
      "colors:",
      "  primary: \"#176B5B\"",
      "  accent: \"#3F6FD9\"",
      "  canvas: \"#F7F8F4\"",
      "  surface: \"#FFFFFF\"",
      "  ink: \"#151A18\"",
      "  body: \"#34413D\"",
      "  muted: \"#66736F\"",
      "  success: \"#1F7A5C\"",
      "  warning: \"#B88418\"",
      "  error: \"#B5473F\"",
      "  focus: \"#3F6FD9\"",
      "typography:",
      "  body-md:",
      "    fontFamily: \"Inter, sans-serif\"",
      "    fontSize: 16px",
      "rounded:",
      "  md: 8px",
      "spacing:",
      "  md: 16px",
      "components:",
      "  button-primary:",
      "    height: 40px",
      "  button-secondary:",
      "    height: 40px",
      "  button-icon:",
      "    size: 40px",
      "  input:",
      "    height: 40px",
      "  panel:",
      "    padding: 24px",
      "  work-card:",
      "    padding: 16px",
      "  code-panel:",
      "    padding: 16px",
      "  badge:",
      "    padding: 4px 10px",
      "---",
      "## Overview",
      "## How Agents Should Use This File",
      "Read docs/PROJECT_BRIEF.md and personas/design-director-vibe-coding.md.",
      "## Colors",
      "## Typography",
      "## Layout",
      "## Components",
      "## Responsive Behavior",
      "## Accessibility",
      "## Do's and Don'ts",
      "## Agent Prompt Guide",
      "## Known Gaps"
    ].join("\n")
  );

  const adapter = `${"Canonical source:\nThink Before Coding\nSimplicity First\nSurgical Changes\nGoal-Driven Execution\nVibe Coding Quality Bar\n".repeat(20)}`;
  for (const file of ["CLAUDE.md", "CODEX.md", "GEMINI.md"]) {
    writeFileSync(join(root, file), adapter);
  }
  writeFileSync(join(root, ".github/copilot-instructions.md"), adapter);
  writeFileSync(join(root, ".cursor/rules/vibe-coding-core.mdc"), adapter);

  const brief = [
    "## Summary",
    "## Vibe",
    "## User",
    "## Problem",
    "## Product Promise",
    "## Core Workflows",
    "## Success Criteria",
    "## Non-Goals",
    "## Constraints",
    "## Quality Gates",
    "## Technical Notes",
    "## Open Questions"
  ].join("\n");

  writeFileSync(join(root, "docs/PROJECT_BRIEF.md"), brief);
  for (const file of ["ADAPTERS.md", "COMMAND_REFERENCE.md", "FAQ.md", "TEMPLATE_HEALTH.md", "TEMPLATE_MODES.md", "TEMPLATE_UPGRADE_STRATEGY.md", "WHY.md"]) {
    writeFileSync(join(root, "docs", file), "# Test\n");
  }
  writeFileSync(join(root, "scripts/check-agent-docs.ps1"), "");
  writeFileSync(join(root, "workflows/README.md"), "");
  writeFileSync(join(root, "workflows/first-vertical-slice.md"), "Metadata:\ntrigger:\ninputs:\nexpected output:\nverification:\n## Steps\n## Handoff\n");
}

function writeMinimalAgentRuntime(root: string) {
  writeFileSync(
    join(root, "Agent State", "agent-state.md"),
    [
      "# Agent State",
      "## Current Goal",
      "Ship the next small agent task.",
      "## Active Task",
      "- Status: ready",
      "## Blockers",
      "None.",
      "## Verification Status",
      "Not started."
    ].join("\n")
  );
  writeFileSync(
    join(root, "Agent State", "task-queue.md"),
    [
      "# Agent Task Queue",
      "## Inbox",
      "- [ ] [A-999] #task Placeholder.",
      "## Active",
      "No active agent task.",
      "## Verify",
      "No task waiting for verification.",
      "## Ready",
      "- [ ] [A-001] #task Write a focused test.",
      "## Blocked",
      "No blocked agent task.",
      "## Done",
      "No completed agent tasks yet."
    ].join("\n")
  );
  writeFileSync(join(root, "Memory", "decisions.md"), "# Decisions\n");
  writeFileSync(join(root, "Memory", "failures.md"), "# Failures\n");
  writeFileSync(join(root, "docs", "AGENT_TOOL_REGISTRY.md"), "# Tool Registry\n");
  writeFileSync(join(root, "docs", "AGENT_PERMISSION_GATES.md"), "# Permission Gates\n");
  writeFileSync(join(root, "QA", "AGENT_BEHAVIOR_CHECKS.md"), "# Agent Behavior Checks\n");
}

function writeInitTargets(root: string) {
  writeFileSync(
    join(root, "AGENTS.md"),
    [
      "# AGENTS.md - Canonical Agent Contract",
      "## Project Identity",
      "- Project name: `TODO`",
      "- Project type: `TODO`",
      "- Primary user: `TODO`",
      "- Current stage: `prototype | active build | maintenance | archived`",
      "## Product Goal",
      "```text",
      "TODO: one or two paragraphs explaining what good looks like, who it helps, and what feeling it should create.",
      "```",
      "## Non-Negotiable Standard",
      "## Operating Loop",
      "## Agentic Runtime Layer",
      "## Core Principles",
      "Think Before Coding",
      "Simplicity First",
      "Surgical Changes",
      "Goal-Driven Execution",
      "Vibe Coding Quality Bar",
      "## Commands",
      "```bash",
      "# Install dependencies",
      "TODO",
      "# Run development server",
      "TODO",
      "# Run tests",
      "TODO",
      "# Run lint/type checks",
      "TODO",
      "# Check agent behavior scaffold",
      "./scripts/check-agent-behavior.ps1",
      "# Build",
      "TODO",
      "```",
      "- Package manager: `TODO`",
      "## Verification Policy",
      "## Agent Coordination",
      "## Handoff Standard"
    ].join("\n")
  );
  writeFileSync(
    join(root, "agentops.config.yml"),
    [
      "schemaVersion: 1",
      "templateVersion: 0.1.0",
      "project:",
      "  name: TODO",
      "  type: TODO",
      "  stage: prototype",
      "  primaryUser: TODO",
      "  mode: standard",
      "design:",
      "  requireForUiWork: true",
      "  adaptationNotes: \"Use the default DESIGN.md.\"",
      "commands:",
      "  install: TODO",
      "  dev: TODO",
      "  test: TODO",
      "  lint: TODO",
      "  build: TODO"
    ].join("\n")
  );
  writeFileSync(
    join(root, "Agent State", "agent-state.md"),
    [
      "# Agent State",
      "## Current Goal",
      "TODO: Define the concrete outcome the orchestrator is trying to achieve.",
      "## Active Task",
      "- Status: inbox",
      "## Last Action",
      "TODO",
      "## Next Action",
      "TODO",
      "## Blockers",
      "- TODO",
      "## Verification Status",
      "- Current check:"
    ].join("\n")
  );
  writeFileSync(
    join(root, "docs", "PROJECT_BRIEF.md"),
    [
      "# Project Brief",
      "## Summary",
      "TODO: What is this project in one paragraph?",
      "## Vibe",
      "- Desired feeling: TODO",
      "- Reference products / experiences: TODO",
      "- Anti-vibe: TODO",
      "- First impression target: TODO",
      "## User",
      "- Primary user: TODO",
      "- Secondary users: TODO",
      "- User skill level: TODO",
      "- Context of use: TODO",
      "## Problem",
      "TODO: What pain, opportunity, or workflow does this address?",
      "## Product Promise",
      "TODO: What should users be able to trust this product to do?",
      "## Constraints",
      "- Stack: TODO",
      "## Open Questions",
      "- [ ] #task TODO"
    ].join("\n")
  );
  writeFileSync(
    join(root, "Memory", "project-facts.md"),
    ["# Project Facts", "## Facts", "- TODO"].join("\n")
  );
  writeFileSync(
    join(root, "Memory", "decisions.md"),
    ["# Decisions", "| Date | Decision | Reason | Revisit When |", "|---|---|---|---|", "| TODO | TODO | TODO | TODO |"].join("\n")
  );
}
