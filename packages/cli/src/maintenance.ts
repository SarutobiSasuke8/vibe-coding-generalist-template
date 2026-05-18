import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { runChecks } from "./checks.js";
import { runDoctor } from "./doctor.js";
import { getNextTask, listTasks, loadQueue } from "./tasks.js";

export type MaintenanceOptions = {
  rootDir: string;
  includeTests?: boolean;
  outFile?: string;
};

export type MaintenanceStep = {
  name: string;
  status: "pass" | "warn" | "fail" | "skip";
  detail: string;
};

export type MaintenanceReport = {
  ok: boolean;
  readOnly: true;
  readiness: string;
  summary: {
    activeTask: string;
    nextReadyTask: string;
    taskCount: number;
  };
  steps: MaintenanceStep[];
  nextActions: string[];
  artifactPath?: string;
};

export function runMaintenance(options: MaintenanceOptions): MaintenanceReport {
  const rootDir = resolve(options.rootDir);
  const steps: MaintenanceStep[] = [];

  const doctor = runDoctor({ rootDir });
  steps.push({
    name: "doctor",
    status: doctor.ok ? "pass" : "fail",
    detail: doctor.readiness
  });

  let taskCount = 0;
  try {
    const queue = loadQueue(rootDir);
    taskCount = listTasks(queue).length;
    steps.push({
      name: "status",
      status: taskCount > 0 ? "pass" : "warn",
      detail: `${taskCount} task IDs found`
    });
  } catch (error) {
    steps.push({
      name: "status",
      status: "fail",
      detail: error instanceof Error ? error.message : String(error)
    });
  }

  const next = getNextTask(rootDir);
  steps.push({
    name: "next",
    status: next.ok ? "pass" : "warn",
    detail: next.message
  });

  const docCheck = runChecks({ rootDir });
  steps.push({
    name: "agent-docs",
    status: docCheck.ok ? "pass" : "fail",
    detail: docCheck.ok ? "Agent docs are aligned." : docCheck.errors.join("; ")
  });

  steps.push(runPowerShellCheck(rootDir, "agent-behavior", "./scripts/check-agent-behavior.ps1"));

  if (options.includeTests ?? true) {
    steps.push(runNpmTest(rootDir));
  } else {
    steps.push({
      name: "npm-test",
      status: "skip",
      detail: "Skipped by option."
    });
  }

  const ok = steps.every((step) => step.status === "pass" || step.status === "skip" || step.status === "warn");

  const report: MaintenanceReport = {
    ok,
    readOnly: true,
    readiness: doctor.readiness,
    summary: {
      activeTask: doctor.summary.activeTask,
      nextReadyTask: doctor.summary.nextReadyTask,
      taskCount
    },
    steps,
    nextActions: doctor.nextActions
  };

  if (options.outFile) {
    const outPath = resolveOutputPath(rootDir, options.outFile);
    mkdirSync(dirname(outPath), { recursive: true });
    report.artifactPath = outPath;
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  }

  return report;
}

function runPowerShellCheck(rootDir: string, name: string, scriptPath: string): MaintenanceStep {
  const command = process.platform === "win32" ? "powershell.exe" : "pwsh";
  const result = spawnSync(command, ["-NoProfile", "-File", scriptPath], {
    cwd: rootDir,
    encoding: "utf8",
    shell: false
  });
  return {
    name,
    status: result.status === 0 ? "pass" : "fail",
    detail: summarizeOutput(result.stdout, result.stderr)
  };
}

function runNpmTest(rootDir: string): MaintenanceStep {
  if (!existsSync(join(rootDir, "package.json"))) {
    return {
      name: "npm-test",
      status: "skip",
      detail: "No package.json found."
    };
  }
  const result = spawnSync("npm", ["test"], {
    cwd: rootDir,
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  return {
    name: "npm-test",
    status: result.status === 0 ? "pass" : "fail",
    detail: summarizeOutput(result.stdout, result.stderr)
  };
}

function summarizeOutput(stdout: string | null, stderr: string | null): string {
  const output = `${stdout ?? ""}\n${stderr ?? ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (output.length === 0) {
    return "No output.";
  }
  return output.slice(-4).join(" | ");
}

function resolveOutputPath(rootDir: string, outFile: string): string {
  return isAbsolute(outFile) ? outFile : join(rootDir, outFile);
}
