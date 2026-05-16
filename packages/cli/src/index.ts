#!/usr/bin/env node

import { cwd, exit } from "node:process";
import { runChecks } from "./checks.js";
import { runDoctor } from "./doctor.js";

type ParsedArgs = {
  command: string;
  json: boolean;
  strict: boolean;
  rootDir: string;
};

function parseArgs(argv: string[]): ParsedArgs {
  const args = [...argv];
  const command = args.shift() ?? "help";
  let json = false;
  let strict = false;
  let rootDir = cwd();

  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--json") {
      json = true;
    } else if (arg === "--strict") {
      strict = true;
    } else if (arg === "--root") {
      rootDir = args.shift() ?? rootDir;
    }
  }

  return { command, json, strict, rootDir };
}

function printHelp() {
  console.log(`agentops

Usage:
  agentops check [--strict] [--json] [--root <path>]
  agentops init
  agentops sync
  agentops doctor [--json] [--root <path>]

Implemented:
  check   Validate the repo agent operating layer.
  doctor  Report current agentic readiness and next action.

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

if (["init", "sync"].includes(parsed.command)) {
  notImplemented(parsed.command);
  exit(0);
}

printHelp();
