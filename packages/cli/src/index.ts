#!/usr/bin/env node

import { cwd, exit } from "node:process";
import { runChecks } from "./checks.js";
import { runDoctor } from "./doctor.js";
import { runMaintenance } from "./maintenance.js";
import { blockTask, completeTask, getNextTask, listTasks, loadQueue, startTask } from "./tasks.js";

type ParsedArgs = {
  command: string;
  rest: string[];
  json: boolean;
  strict: boolean;
  rootDir: string;
  note?: string;
  includeTests: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const args = [...argv];
  const command = args.shift() ?? "help";
  const rest: string[] = [];
  let json = false;
  let strict = false;
  let rootDir = cwd();
  let note: string | undefined;
  let includeTests = true;

  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--json") {
      json = true;
    } else if (arg === "--strict") {
      strict = true;
    } else if (arg === "--root") {
      rootDir = args.shift() ?? rootDir;
    } else if (arg === "--note" || arg === "--verification" || arg === "--reason") {
      note = args.shift() ?? "";
    } else if (arg === "--no-tests") {
      includeTests = false;
    } else if (arg) {
      rest.push(arg);
    }
  }

  return { command, rest, json, strict, rootDir, note, includeTests };
}

function printHelp() {
  console.log(`agentops

Usage:
  agentops check [--strict] [--json] [--root <path>]
  agentops status [--json] [--root <path>]
  agentops next [--json] [--root <path>]
  agentops start [task-id] [--root <path>]
  agentops complete --verification <note> [--root <path>]
  agentops block --reason <note> [--root <path>]
  agentops init
  agentops sync
  agentops doctor [--json] [--root <path>]
  agentops maintenance [--json] [--no-tests] [--root <path>]

Implemented:
  check   Validate the repo agent operating layer.
  doctor  Report current agentic readiness and next action.
  status  Show current agent task status.
  next    Show the current active, verify, or ready task.
  start   Move a ready task to active and update agent state.
  complete Move the active task to done with a verification note.
  block   Move the active task to blocked with a reason.
  maintenance Run the read-only autonomous maintenance check.

Scaffolded:
  init    Planned initializer for template files.
  sync    Planned adapter sync from AGENTS.md.
`);
}

function notImplemented(command: string) {
  console.log(`${command} is scaffolded but not implemented yet.`);
  console.log("Use agentops check for the current functional CLI surface.");
}

const parsed = parseArgs(process.argv.slice(2));

if (parsed.command === "check") {
  const result = runChecks({ rootDir: parsed.rootDir, strict: parsed.strict });
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(parsed.strict ? "Agent docs are aligned in strict mode." : "Agent docs are aligned.");
    for (const warning of result.warnings) {
      console.warn(`Warning: ${warning}`);
    }
  } else {
    console.error("Agent doc alignment check failed:");
    for (const error of result.errors) {
      console.error(` - ${error}`);
    }
    for (const warning of result.warnings) {
      console.warn(`Warning: ${warning}`);
    }
  }
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "doctor") {
  const result = runDoctor({ rootDir: parsed.rootDir });
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Agentops doctor: ${result.readiness}`);
    console.log("");
    console.log("Summary:");
    console.log(`- Current goal: ${result.summary.currentGoal}`);
    console.log(`- Active task: ${result.summary.activeTask}`);
    console.log(`- Next ready task: ${result.summary.nextReadyTask}`);
    console.log(`- Blockers: ${result.summary.blockers}`);
    console.log(`- Verification: ${result.summary.verificationStatus}`);
    console.log("");
    console.log("Checks:");
    for (const check of result.checks) {
      console.log(`- ${check.status.toUpperCase()} ${check.name}: ${check.detail}`);
    }
    console.log("");
    console.log("Next actions:");
    for (const action of result.nextActions) {
      console.log(`- ${action}`);
    }
  }
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "status") {
  const queue = loadQueue(parsed.rootDir);
  const tasks = listTasks(queue);
  const result = {
    tasks,
    counts: tasks.reduce<Record<string, number>>((counts, task) => {
      counts[task.section] = (counts[task.section] ?? 0) + 1;
      return counts;
    }, {})
  };
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Agent task status:");
    for (const task of tasks) {
      console.log(`- ${task.section}: ${task.id} ${task.text}`);
    }
    if (tasks.length === 0) {
      console.log("- No task IDs found.");
    }
  }
  exit(0);
}

if (parsed.command === "next") {
  const result = getNextTask(parsed.rootDir);
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.message);
  }
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "start") {
  const result = startTask(parsed.rootDir, parsed.rest[0]);
  console.log(result.message);
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "complete") {
  const result = completeTask(parsed.rootDir, parsed.note ?? "");
  console.log(result.message);
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "block") {
  const result = blockTask(parsed.rootDir, parsed.note ?? "");
  console.log(result.message);
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "maintenance") {
  const result = runMaintenance({ rootDir: parsed.rootDir, includeTests: parsed.includeTests });
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Agentops maintenance: ${result.ok ? "pass" : "fail"} (${result.readiness})`);
    console.log("Read-only: yes");
    console.log("");
    console.log("Summary:");
    console.log(`- Active task: ${result.summary.activeTask}`);
    console.log(`- Next ready task: ${result.summary.nextReadyTask}`);
    console.log(`- Task count: ${result.summary.taskCount}`);
    console.log("");
    console.log("Steps:");
    for (const step of result.steps) {
      console.log(`- ${step.status.toUpperCase()} ${step.name}: ${step.detail}`);
    }
    console.log("");
    console.log("Next actions:");
    for (const action of result.nextActions) {
      console.log(`- ${action}`);
    }
  }
  exit(result.ok ? 0 : 1);
}

if (["init", "sync"].includes(parsed.command)) {
  notImplemented(parsed.command);
  exit(0);
}

printHelp();
