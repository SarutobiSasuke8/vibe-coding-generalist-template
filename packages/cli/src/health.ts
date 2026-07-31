import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runChecks } from "./checks.js";
import { runDesignCheck } from "./design.js";
import { runDoctor } from "./doctor.js";

export type HealthItem = {
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type HealthReport = {
  ok: boolean;
  readiness: "ready" | "needs-attention";
  items: HealthItem[];
  nextActions: string[];
};

export function runHealth(options: { rootDir: string }): HealthReport {
  const rootDir = resolve(options.rootDir);
  const items: HealthItem[] = [];
  const checks = runChecks({ rootDir });
  const doctor = runDoctor({ rootDir });
  const design = runDesignCheck({ rootDir });

  items.push({ name: "Agent docs", status: checks.ok ? "pass" : "fail", detail: checks.ok ? "Aligned." : `${checks.errors.length} error(s).` });
  items.push({
    name: "Agent runtime",
    status: doctor.ok ? (doctor.readiness === "ready" ? "pass" : "warn") : "fail",
    detail: doctor.readiness
  });
  items.push({ name: "Design contract", status: design.ok ? "pass" : "fail", detail: `${design.tokens.colors} colors, ${design.tokens.components} components.` });

  const placeholders = countPlaceholders(rootDir);
  items.push({
    name: "Placeholders",
    status: placeholders === 0 ? "pass" : "warn",
    detail: placeholders === 0 ? "No TODO placeholders found in core setup files." : `${placeholders} TODO placeholder(s) remain in core setup files.`
  });

  const commands = readIfExists(rootDir, "agentops.config.yml");
  const commandTodo = commands ? /\b(install|dev|test|lint|build): TODO\b/.test(commands) : true;
  items.push({
    name: "Commands",
    status: commandTodo ? "warn" : "pass",
    detail: commandTodo ? "One or more command placeholders remain." : "Core commands are configured."
  });

  const sessionLogIndex = existsSync(join(rootDir, "Session Logs", "_Session Logs Index.md"));
  items.push({
    name: "Session memory",
    status: sessionLogIndex ? "pass" : "warn",
    detail: sessionLogIndex ? "Session log index exists." : "Session log index missing or not installed in this mode."
  });

  const nextActions = [
    ...checks.errors.slice(0, 3).map((error) => `Fix check error: ${error}`),
    ...doctor.nextActions.slice(0, 2)
  ];
  if (placeholders > 0) {
    nextActions.push("Run agentops init or replace remaining TODO placeholders.");
  }
  if (!design.ok) {
    nextActions.push("Run agentops design check and repair DESIGN.md.");
  }
  if (nextActions.length === 0) {
    nextActions.push("Build the first vertical slice and add one quality ratchet.");
  }

  const ok = items.every((item) => item.status !== "fail");
  const readiness = ok && items.every((item) => item.status === "pass") ? "ready" : "needs-attention";
  return { ok, readiness, items, nextActions };
}

function countPlaceholders(rootDir: string): number {
  let count = 0;
  for (const file of ["AGENTS.md", "docs/PROJECT_BRIEF.md", "agentops.config.yml", "TODO.md", "ROADMAP.md"]) {
    const content = readIfExists(rootDir, file);
    if (content) {
      count += content.match(/\bTODO\b/g)?.length ?? 0;
    }
  }
  return count;
}

function readIfExists(rootDir: string, relativePath: string): string | undefined {
  const path = join(rootDir, relativePath);
  if (!existsSync(path)) {
    return undefined;
  }
  return readFileSync(path, "utf8");
}
