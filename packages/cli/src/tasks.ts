import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export type QueueSection = "Inbox" | "Ready" | "Active" | "Blocked" | "Verify" | "Done";

export type AgentTask = {
  id: string;
  text: string;
  section: QueueSection;
  raw: string;
};

export type QueueOperationResult = {
  ok: boolean;
  message: string;
  task?: AgentTask;
};

export type QueueState = {
  rootDir: string;
  queuePath: string;
  statePath: string;
  content: string;
  sections: Map<QueueSection, string[]>;
};

const queueSections: QueueSection[] = ["Inbox", "Ready", "Active", "Blocked", "Verify", "Done"];
const placeholderBySection: Record<QueueSection, string> = {
  Inbox: "No inbox agent tasks.",
  Ready: "No ready agent task.",
  Active: "No active agent task.",
  Blocked: "No blocked agent task.",
  Verify: "No task waiting for verification.",
  Done: "No completed agent tasks yet."
};

export function loadQueue(rootDir: string): QueueState {
  const resolvedRoot = resolve(rootDir);
  const queuePath = join(resolvedRoot, "Agent State", "task-queue.md");
  const statePath = join(resolvedRoot, "Agent State", "agent-state.md");
  if (!existsSync(queuePath)) {
    throw new Error("Missing Agent State/task-queue.md");
  }
  const content = readFileSync(queuePath, "utf8");
  return {
    rootDir: resolvedRoot,
    queuePath,
    statePath,
    content,
    sections: parseSections(content)
  };
}

export function listTasks(queue: QueueState): AgentTask[] {
  return queueSections.flatMap((section) =>
    (queue.sections.get(section) ?? [])
      .map((line) => parseTaskLine(line, section))
      .filter((task): task is AgentTask => Boolean(task))
  );
}

export function getNextTask(rootDir: string): QueueOperationResult {
  const queue = loadQueue(rootDir);
  const active = firstTaskInSection(queue, "Active");
  if (active) {
    return { ok: true, message: `Active task: ${formatTask(active)}`, task: active };
  }
  const verify = firstTaskInSection(queue, "Verify");
  if (verify) {
    return { ok: true, message: `Task waiting for verification: ${formatTask(verify)}`, task: verify };
  }
  const ready = firstTaskInSection(queue, "Ready");
  if (ready) {
    return { ok: true, message: `Next ready task: ${formatTask(ready)}`, task: ready };
  }
  return { ok: false, message: "No active, verify, or ready task found." };
}

export function startTask(rootDir: string, taskId?: string): QueueOperationResult {
  const queue = loadQueue(rootDir);
  if (firstTaskInSection(queue, "Active")) {
    return { ok: false, message: "Cannot start a task while another task is active." };
  }
  const task = taskId ? findTask(queue, taskId) : firstTaskInSection(queue, "Ready");
  if (!task) {
    return { ok: false, message: taskId ? `Task not found: ${taskId}` : "No ready task to start." };
  }
  if (task.section !== "Ready") {
    return { ok: false, message: `Task ${task.id} is in ${task.section}; only Ready tasks can be started.` };
  }
  moveTask(queue, task, "Active");
  writeQueue(queue);
  updateAgentState(queue.statePath, {
    status: "active",
    task: formatTask({ ...task, section: "Active" }),
    nextAction: "Run the execution loop for the active task.",
    lastAction: `Started ${task.id}.`
  });
  return { ok: true, message: `Started ${formatTask(task)}`, task: { ...task, section: "Active" } };
}

export function completeTask(rootDir: string, verification: string): QueueOperationResult {
  const queue = loadQueue(rootDir);
  const task = firstTaskInSection(queue, "Active");
  if (!task) {
    return { ok: false, message: "No active task to complete." };
  }
  if (!verification.trim()) {
    return { ok: false, message: "Completion requires a verification note." };
  }
  const completedTask = markDone(appendNote(task, `verification: ${verification.trim()}`));
  replaceTask(queue, task, completedTask);
  moveTask(queue, completedTask, "Done");
  writeQueue(queue);
  updateAgentState(queue.statePath, {
    status: "done",
    task: formatTask(completedTask),
    nextAction: "Pick the next ready task or run agentops doctor.",
    lastAction: `Completed ${task.id}.`,
    verification
  });
  return { ok: true, message: `Completed ${formatTask(completedTask)}`, task: { ...completedTask, section: "Done" } };
}

export function blockTask(rootDir: string, reason: string): QueueOperationResult {
  const queue = loadQueue(rootDir);
  const task = firstTaskInSection(queue, "Active");
  if (!task) {
    return { ok: false, message: "No active task to block." };
  }
  if (!reason.trim()) {
    return { ok: false, message: "Blocking requires a reason." };
  }
  const blockedTask = appendNote(task, `blocked: ${reason.trim()}`);
  replaceTask(queue, task, blockedTask);
  moveTask(queue, blockedTask, "Blocked");
  writeQueue(queue);
  updateAgentState(queue.statePath, {
    status: "blocked",
    task: formatTask(blockedTask),
    nextAction: "Resolve blocker or choose another ready task.",
    lastAction: `Blocked ${task.id}.`,
    blocker: reason
  });
  return { ok: true, message: `Blocked ${formatTask(blockedTask)}`, task: { ...blockedTask, section: "Blocked" } };
}

export function formatTask(task: AgentTask): string {
  return `${task.id} ${task.text}`.trim();
}

function parseSections(content: string): Map<QueueSection, string[]> {
  const sections = new Map<QueueSection, string[]>();
  for (const section of queueSections) {
    const pattern = new RegExp(`(?:^|\\n)## ${escapeRegex(section)}\\s*\\r?\\n([\\s\\S]*?)(?=\\n## |$)`);
    const body = pattern.exec(content)?.[1] ?? "";
    sections.set(
      section,
      body
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    );
  }
  return sections;
}

function parseTaskLine(line: string, section: QueueSection): AgentTask | undefined {
  if (!/^- \[[ xX]\]/.test(line)) {
    return undefined;
  }
  const normalized = line.replace(/^- \[[ xX]\]\s*/, "").trim();
  const match = /^\[([A-Z]+-\d{3})\]\s+(.+)$/.exec(normalized);
  if (!match) {
    return undefined;
  }
  return {
    id: match[1],
    text: match[2],
    section,
    raw: line
  };
}

function firstTaskInSection(queue: QueueState, section: QueueSection): AgentTask | undefined {
  return (queue.sections.get(section) ?? [])
    .map((line) => parseTaskLine(line, section))
    .find((task): task is AgentTask => Boolean(task));
}

function findTask(queue: QueueState, taskId: string): AgentTask | undefined {
  return listTasks(queue).find((task) => task.id.toLowerCase() === taskId.toLowerCase());
}

function moveTask(queue: QueueState, task: AgentTask, target: QueueSection) {
  removeTask(queue, task);
  const targetLines = withoutPlaceholder(queue.sections.get(target) ?? []);
  targetLines.push(task.raw);
  queue.sections.set(target, targetLines);
  normalizeEmptySections(queue);
}

function replaceTask(queue: QueueState, oldTask: AgentTask, newTask: AgentTask) {
  const lines = queue.sections.get(oldTask.section) ?? [];
  queue.sections.set(
    oldTask.section,
    lines.map((line) => (line === oldTask.raw ? newTask.raw : line))
  );
}

function removeTask(queue: QueueState, task: AgentTask) {
  const lines = queue.sections.get(task.section) ?? [];
  queue.sections.set(
    task.section,
    lines.filter((line) => line !== task.raw)
  );
}

function appendNote(task: AgentTask, note: string): AgentTask {
  return {
    ...task,
    raw: `${task.raw} (${note})`,
    text: `${task.text} (${note})`
  };
}

function markDone(task: AgentTask): AgentTask {
  return {
    ...task,
    raw: task.raw.replace(/^- \[[ xX]\]/, "- [x]")
  };
}

function normalizeEmptySections(queue: QueueState) {
  for (const section of queueSections) {
    const lines = withoutPlaceholder(queue.sections.get(section) ?? []);
    queue.sections.set(section, lines.length > 0 ? lines : [placeholderBySection[section]]);
  }
}

function withoutPlaceholder(lines: string[]): string[] {
  return lines.filter((line) => !Object.values(placeholderBySection).includes(line));
}

function writeQueue(queue: QueueState) {
  let content = queue.content;
  for (const section of queueSections) {
    const lines = queue.sections.get(section) ?? [placeholderBySection[section]];
    const body = `${lines.join("\n")}\n`;
    const pattern = new RegExp(`((?:^|\\n)## ${escapeRegex(section)}\\s*\\r?\\n)([\\s\\S]*?)(?=\\n## |$)`);
    content = content.replace(pattern, (_match, heading: string) => `${heading}${body}`);
  }
  writeFileSync(queue.queuePath, content);
}

function updateAgentState(
  statePath: string,
  update: {
    status: string;
    task: string;
    nextAction: string;
    lastAction: string;
    verification?: string;
    blocker?: string;
  }
) {
  if (!existsSync(statePath)) {
    return;
  }
  let content = readFileSync(statePath, "utf8");
  content = replaceSection(
    content,
    "Active Task",
    [
      `- Status: ${update.status}`,
      `- Task: ${update.task}`,
      "- Owner: orchestrator",
      `- Started: ${new Date().toISOString()}`,
      `- Last updated: ${new Date().toISOString()}`
    ].join("\n")
  );
  content = replaceSection(content, "Last Action", update.lastAction);
  content = replaceSection(content, "Next Action", update.nextAction);
  if (update.blocker) {
    content = replaceSection(content, "Blockers", `- ${update.blocker}`);
  } else if (update.status !== "blocked") {
    content = replaceSection(content, "Blockers", "No current blockers.");
  }
  if (update.verification) {
    content = replaceSection(
      content,
      "Verification Status",
      [`- Current check: ${update.verification}`, "- Result: passed", "- Residual risk: not yet reviewed"].join("\n")
    );
  }
  writeFileSync(statePath, content);
}

function replaceSection(content: string, heading: string, body: string): string {
  const pattern = new RegExp(`((?:^|\\n)## ${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(?=\\n## |$)`);
  if (!pattern.test(content)) {
    return content;
  }
  return content.replace(pattern, (_match, headingText: string) => `${headingText}${body.trim()}\n`);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
