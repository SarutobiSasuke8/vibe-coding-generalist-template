import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export type DoctorOptions = {
  rootDir: string;
};

export type DoctorCheck = {
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type DoctorReport = {
  ok: boolean;
  readiness: "ready" | "needs-attention";
  summary: {
    currentGoal: string;
    activeTask: string;
    nextReadyTask: string;
    blockers: string;
    verificationStatus: string;
  };
  checks: DoctorCheck[];
  nextActions: string[];
};

export function runDoctor(options: DoctorOptions): DoctorReport {
  const rootDir = resolve(options.rootDir);
  const statePath = "Agent State/agent-state.md";
  const queuePath = "Agent State/task-queue.md";
  const checks: DoctorCheck[] = [];

  const state = readIfExists(rootDir, statePath);
  const queue = readIfExists(rootDir, queuePath);
  const agents = readIfExists(rootDir, "AGENTS.md");
  const projectBrief = readIfExists(rootDir, "docs/PROJECT_BRIEF.md");

  addFileCheck(checks, rootDir, statePath, "Agent state file");
  addFileCheck(checks, rootDir, queuePath, "Agent task queue");
  addFileCheck(checks, rootDir, "Memory/decisions.md", "Decision memory");
  addFileCheck(checks, rootDir, "Memory/failures.md", "Failure memory");
  addFileCheck(checks, rootDir, "docs/AGENT_TOOL_REGISTRY.md", "Tool registry");
  addFileCheck(checks, rootDir, "docs/AGENT_PERMISSION_GATES.md", "Permission gates");
  addFileCheck(checks, rootDir, "QA/AGENT_BEHAVIOR_CHECKS.md", "Agent behavior checks");

  if (agents?.includes("Agentic Runtime Layer")) {
    checks.push({ name: "Runtime contract", status: "pass", detail: "AGENTS.md references the agentic runtime layer." });
  } else {
    checks.push({ name: "Runtime contract", status: "fail", detail: "AGENTS.md does not reference the agentic runtime layer." });
  }

  const currentGoal = cleanValue(extractSection(state, "Current Goal"));
  const activeTask = firstActionLine(extractSection(queue, "Active"));
  const verifyTask = firstActionLine(extractSection(queue, "Verify"));
  const nextReadyTask = firstActionLine(extractSection(queue, "Ready"));
  const blockers = cleanValue(extractSection(state, "Blockers"));
  const verificationStatus = cleanValue(extractSection(state, "Verification Status"));

  if (activeTask !== "No active agent task.") {
    checks.push({ name: "Active task", status: "pass", detail: activeTask });
  } else if (verifyTask !== "No task waiting for verification.") {
    checks.push({ name: "Active task", status: "warn", detail: `Verification task is waiting: ${verifyTask}` });
  } else if (nextReadyTask !== "No ready task.") {
    checks.push({ name: "Active task", status: "warn", detail: `No active task. Next ready task: ${nextReadyTask}` });
  } else {
    checks.push({ name: "Active task", status: "warn", detail: "No active or ready agent task found." });
  }

  if (projectBrief && /\bTODO\b/.test(projectBrief)) {
    checks.push({ name: "Project brief", status: "warn", detail: "Project brief still contains TODO placeholders." });
  } else if (projectBrief) {
    checks.push({ name: "Project brief", status: "pass", detail: "Project brief appears project-specific." });
  } else {
    checks.push({ name: "Project brief", status: "fail", detail: "Project brief is missing." });
  }

  const nextActions = buildNextActions({ activeTask, verifyTask, nextReadyTask, projectBrief });
  const ok = checks.every((check) => check.status !== "fail");
  const readiness = ok && checks.every((check) => check.status === "pass") ? "ready" : "needs-attention";

  return {
    ok,
    readiness,
    summary: {
      currentGoal,
      activeTask,
      nextReadyTask,
      blockers,
      verificationStatus
    },
    checks,
    nextActions
  };
}

function addFileCheck(checks: DoctorCheck[], rootDir: string, relativePath: string, name: string) {
  checks.push({
    name,
    status: existsSync(join(rootDir, relativePath)) ? "pass" : "fail",
    detail: relativePath
  });
}

function readIfExists(rootDir: string, relativePath: string): string | undefined {
  const path = join(rootDir, relativePath);
  if (!existsSync(path)) {
    return undefined;
  }
  return readFileSync(path, "utf8");
}

function extractSection(content: string | undefined, heading: string): string {
  if (!content) {
    return "";
  }
  const escapedHeading = escapeRegex(heading);
  const pattern = new RegExp(`(?:^|\\n)## ${escapedHeading}\\s*\\r?\\n([\\s\\S]*?)(?=\\n## |$)`);
  return pattern.exec(content)?.[1]?.trim() ?? "";
}

function firstActionLine(section: string): string {
  const line = section
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.length > 0 && !item.startsWith("<!--"));
  if (!line) {
    return "No ready task.";
  }
  return line.replace(/^- \[ \]\s*/, "").trim();
}

function cleanValue(section: string): string {
  const cleaned = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
  return cleaned || "Not set.";
}

function buildNextActions(input: {
  activeTask: string;
  verifyTask: string;
  nextReadyTask: string;
  projectBrief: string | undefined;
}): string[] {
  const actions: string[] = [];
  if (input.activeTask === "No active agent task." && input.nextReadyTask !== "No ready task.") {
    actions.push(`Promote the ready task to active: ${input.nextReadyTask}`);
  }
  if (input.verifyTask !== "No task waiting for verification.") {
    actions.push(`Verify the waiting task: ${input.verifyTask}`);
  }
  if (input.projectBrief && /\bTODO\b/.test(input.projectBrief)) {
    actions.push("Replace TODO placeholders in docs/PROJECT_BRIEF.md.");
  }
  if (actions.length === 0) {
    actions.push("Pick one bounded ready task and run the execution loop.");
  }
  return actions;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
