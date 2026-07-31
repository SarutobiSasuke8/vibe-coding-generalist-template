#!/usr/bin/env node

import { cwd, exit } from "node:process";
import { runChecks } from "./checks.js";
import { exportDesignTokens, runDesignCheck } from "./design.js";
import { runDoctor } from "./doctor.js";
import { runHealth } from "./health.js";
import { runInit } from "./init.js";
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
  values: Record<string, string>;
  outFile?: string;
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
  const values: Record<string, string> = {};
  let outFile: string | undefined;

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
    } else if (arg === "--out") {
      outFile = args.shift() ?? "";
    } else if (arg?.startsWith("--")) {
      const key = arg.slice(2);
      values[key] = args.shift() ?? "";
    } else if (arg) {
      rest.push(arg);
    }
  }

  return { command, rest, json, strict, rootDir, note, includeTests, values, outFile };
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
  agentops init --name <name> --type <type> --primary-user <user> --stage <stage> --goal <goal> --package-manager <pm> --install <cmd> --dev <cmd> --test <cmd> --lint <cmd> --build <cmd> [--mode <lite|standard|full-agentic>] [--desired-vibe <vibe>] [--adapt-design <note>]
  agentops design check [--json] [--root <path>]
  agentops design tokens [--out <path>] [--root <path>]
  agentops health [--json] [--root <path>]
  agentops sync
  agentops doctor [--json] [--root <path>]
  agentops maintenance [--json] [--no-tests] [--out <path>] [--root <path>]

Implemented:
  check   Validate the repo agent operating layer.
  doctor  Report current agentic readiness and next action.
  status  Show current agent task status.
  next    Show the current active, verify, or ready task.
  start   Move a ready task to active and update agent state.
  complete Move the active task to done with a verification note.
  block   Move the active task to blocked with a reason.
  init    Fill the main template placeholders for a real project.
  design  Check DESIGN.md or export CSS variables from its tokens.
  health  Show one template health dashboard across docs, runtime, commands, and design.
  maintenance Run the read-only autonomous maintenance check.

Scaffolded:
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

if (parsed.command === "design") {
  const subcommand = parsed.rest[0] ?? "check";
  if (subcommand === "check") {
    const result = runDesignCheck({ rootDir: parsed.rootDir });
    if (parsed.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`Design check: ${result.ok ? "pass" : "fail"}`);
      console.log(`Tokens: ${result.tokens.colors} colors, ${result.tokens.typography} typography styles, ${result.tokens.components} components`);
      for (const check of result.checks) {
        console.log(`- ${check.status.toUpperCase()} ${check.name}: ${check.detail}`);
      }
    }
    exit(result.ok ? 0 : 1);
  }

  if (subcommand === "tokens") {
    const result = exportDesignTokens({ rootDir: parsed.rootDir, outFile: parsed.outFile });
    if (parsed.json) {
      console.log(JSON.stringify(result, null, 2));
    } else if (parsed.outFile) {
      console.log(result.message);
    } else {
      console.log(result.css);
    }
    exit(result.ok ? 0 : 1);
  }

  console.error(`Unknown design subcommand: ${subcommand}`);
  exit(1);
}

if (parsed.command === "health") {
  const result = runHealth({ rootDir: parsed.rootDir });
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Template health: ${result.readiness}`);
    console.log("");
    console.log("Dashboard:");
    for (const item of result.items) {
      console.log(`- ${item.status.toUpperCase()} ${item.name}: ${item.detail}`);
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
  const result = runMaintenance({ rootDir: parsed.rootDir, includeTests: parsed.includeTests, outFile: parsed.outFile });
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
    if (result.artifactPath) {
      console.log("");
      console.log(`Report written: ${result.artifactPath}`);
    }
  }
  exit(result.ok ? 0 : 1);
}

if (parsed.command === "init") {
  const result = runInit({
    rootDir: parsed.rootDir,
    name: parsed.values.name ?? "",
    type: parsed.values.type ?? "",
    primaryUser: parsed.values["primary-user"] ?? parsed.values.primaryUser ?? "",
    stage: parsed.values.stage ?? "",
    goal: parsed.values.goal ?? "",
    packageManager: parsed.values["package-manager"] ?? parsed.values.packageManager ?? "",
    install: parsed.values.install ?? "",
    dev: parsed.values.dev ?? "",
    test: parsed.values.test ?? "",
    lint: parsed.values.lint ?? "",
    build: parsed.values.build ?? "",
    mode: parsed.values.mode ?? "",
    desiredVibe: parsed.values["desired-vibe"] ?? parsed.values.desiredVibe ?? "",
    adaptDesign: parsed.values["adapt-design"] ?? parsed.values.adaptDesign ?? ""
  });
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.message);
    if (result.changedFiles.length > 0) {
      console.log("Changed files:");
      for (const file of result.changedFiles) {
        console.log(`- ${file}`);
      }
    }
  }
  exit(result.ok ? 0 : 1);
}

if (["sync"].includes(parsed.command)) {
  notImplemented(parsed.command);
  exit(0);
}

printHelp();
