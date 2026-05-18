import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import assert from "node:assert/strict";
import { runChecks } from "./checks.js";
import { runDoctor } from "./doctor.js";
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
  for (const file of ["ADAPTERS.md", "COMMAND_REFERENCE.md", "FAQ.md", "TEMPLATE_UPGRADE_STRATEGY.md", "WHY.md"]) {
    writeFileSync(join(root, "docs", file), "# Test\n");
  }
  writeFileSync(join(root, "scripts/check-agent-docs.ps1"), "");
  writeFileSync(join(root, "workflows/README.md"), "");
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
