import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export type InitOptions = {
  rootDir: string;
  name: string;
  type: string;
  primaryUser: string;
  stage: string;
  goal: string;
  packageManager: string;
  install: string;
  dev: string;
  test: string;
  lint: string;
  build: string;
  mode?: string;
  desiredVibe?: string;
  adaptDesign?: string;
};

export type InitResult = {
  ok: boolean;
  message: string;
  changedFiles: string[];
  missingFields: string[];
};

const requiredFields: Array<keyof InitOptions> = [
  "name",
  "type",
  "primaryUser",
  "stage",
  "goal",
  "packageManager",
  "install",
  "dev",
  "test",
  "lint",
  "build"
];

export function runInit(options: InitOptions): InitResult {
  const missingFields = requiredFields.filter((field) => !String(options[field] ?? "").trim());
  if (missingFields.length > 0) {
    return {
      ok: false,
      message: `Missing required init fields: ${missingFields.join(", ")}`,
      changedFiles: [],
      missingFields
    };
  }

  const rootDir = resolve(options.rootDir);
  const changedFiles: string[] = [];
  const initOptions = normalizeInitOptions(options);

  updateFile(rootDir, "AGENTS.md", changedFiles, (content) => updateAgents(content, initOptions));
  updateFile(rootDir, "docs/PROJECT_BRIEF.md", changedFiles, (content) => updateProjectBrief(content, initOptions));
  updateFile(rootDir, "agentops.config.yml", changedFiles, (content) => updateConfig(content, initOptions));
  updateFile(rootDir, "DESIGN.md", changedFiles, (content) => updateDesign(content, initOptions));
  updateFile(rootDir, "Agent State/agent-state.md", changedFiles, (content) => updateAgentState(content, initOptions));
  updateFile(rootDir, "Agent State/task-queue.md", changedFiles, (content) => updateTaskQueue(content, initOptions));
  updateFile(rootDir, "Memory/project-facts.md", changedFiles, (content) => updateProjectFacts(content, initOptions));
  updateFile(rootDir, "Memory/decisions.md", changedFiles, (content) => updateDecisions(content, initOptions));

  return {
    ok: true,
    message: `Initialized ${initOptions.name} in ${initOptions.mode} mode.`,
    changedFiles,
    missingFields: []
  };
}

function updateFile(rootDir: string, relativePath: string, changedFiles: string[], updater: (content: string) => string) {
  const path = join(rootDir, relativePath);
  if (!existsSync(path)) {
    throw new Error(`Missing required init target: ${relativePath}`);
  }
  const before = readFileSync(path, "utf8");
  const after = updater(before);
  if (after !== before) {
    writeFileSync(path, after);
    changedFiles.push(relativePath);
  }
}

function updateAgents(content: string, options: InitOptions): string {
  let updated = content
    .replace(/- Project name: `[^`]*`/, `- Project name: \`${options.name}\``)
    .replace(/- Project type: `[^`]*`/, `- Project type: \`${options.type}\``)
    .replace(/- Primary user: `[^`]*`/, `- Primary user: \`${options.primaryUser}\``)
    .replace(/- Current stage: `[^`]*`/, `- Current stage: \`${options.stage}\``)
    .replace(/# Install dependencies\nTODO/, `# Install dependencies\n${options.install}`)
    .replace(/# Run development server\nTODO/, `# Run development server\n${options.dev}`)
    .replace(/# Run tests\nTODO/, `# Run tests\n${options.test}`)
    .replace(/# Run lint\/type checks\nTODO/, `# Run lint/type checks\n${options.lint}`)
    .replace(/# Build\nTODO/, `# Build\n${options.build}`)
    .replace(/- Package manager: `TODO`/, `- Package manager: \`${options.packageManager}\``);

  updated = replaceFencedTodo(updated, options.goal);
  return updated;
}

function updateProjectBrief(content: string, options: InitOptions): string {
  return content
    .replace(/TODO: What is this project in one paragraph\?/, `${options.name} is ${article(options.type)} ${options.type} for ${options.primaryUser}. ${options.goal}`)
    .replace(/- Desired feeling: TODO/, `- Desired feeling: ${options.desiredVibe}`)
    .replace(/- Reference products \/ experiences: TODO/, "- Reference products / experiences: TODO: add references during project setup")
    .replace(/- Anti-vibe: TODO/, "- Anti-vibe: generic, bloated, or hard to verify")
    .replace(/- First impression target: TODO/, `- First impression target: ${options.name} makes the next useful action clear.`)
    .replace(/- Design system notes: .*/, `- Design system notes: ${options.adaptDesign}`)
    .replace(/- Primary user: TODO/, `- Primary user: ${options.primaryUser}`)
    .replace(/- Secondary users: TODO/, "- Secondary users: TODO: define if needed")
    .replace(/- User skill level: TODO/, "- User skill level: TODO: define during project setup")
    .replace(/- Context of use: TODO/, "- Context of use: TODO: define during project setup")
    .replace(/TODO: What pain, opportunity, or workflow does this address\?/, "TODO: define the specific pain, opportunity, or workflow during project setup.")
    .replace(/TODO: What should users be able to trust this product to do\?/, options.goal)
    .replace(/- Stack: TODO/, `- Stack: ${options.type}`)
    .replace(/- \[ \] #task TODO/, "- [ ] #task Replace remaining project brief TODOs with project-specific context.");
}

function updateConfig(content: string, options: InitOptions): string {
  let updated = content
    .replace(/name: TODO/, `name: ${yamlValue(options.name)}`)
    .replace(/type: TODO/, `type: ${yamlValue(options.type)}`)
    .replace(/stage: .*/, `stage: ${yamlValue(options.stage)}`)
    .replace(/primaryUser: TODO/, `primaryUser: ${yamlValue(options.primaryUser)}`)
    .replace(/install: TODO/, `install: ${yamlValue(options.install)}`)
    .replace(/dev: TODO/, `dev: ${yamlValue(options.dev)}`)
    .replace(/test: TODO/, `test: ${yamlValue(options.test)}`)
    .replace(/lint: TODO/, `lint: ${yamlValue(options.lint)}`)
    .replace(/build: TODO/, `build: ${yamlValue(options.build)}`);

  if (updated.includes("mode:")) {
    updated = updated.replace(/mode: .*/, `mode: ${yamlValue(options.mode ?? "standard")}`);
  } else {
    updated = updated.replace(/primaryUser: .*/, (match) => `${match}\n  mode: ${yamlValue(options.mode ?? "standard")}`);
  }

  if (updated.includes("adaptationNotes:")) {
    updated = updated.replace(/adaptationNotes: .*/, `adaptationNotes: ${yamlValue(options.adaptDesign ?? "")}`);
  } else {
    updated = updated.replace(/requireForUiWork: .*/, (match) => `${match}\n  adaptationNotes: ${yamlValue(options.adaptDesign ?? "")}`);
  }

  return updated;
}

function updateDesign(content: string, options: InitOptions): string {
  const note = `Project adaptation note: ${options.name} starts with the default template design language. Desired feeling: ${options.desiredVibe}. ${options.adaptDesign}`;
  if (content.includes("## Project Adaptation Notes")) {
    return replaceSection(content, "Project Adaptation Notes", `- ${note}`);
  }
  return content.replace("## Known Gaps", `## Project Adaptation Notes\n\n- ${note}\n\n## Known Gaps`);
}

function updateAgentState(content: string, options: InitOptions): string {
  let updated = replaceSection(content, "Current Goal", options.goal);
  updated = replaceSection(
    updated,
    "Active Task",
    ["- Status: ready", "- Task: A-001 #task Replace remaining project setup placeholders.", "- Owner: orchestrator", "- Started:", "- Last updated:"].join("\n")
  );
  updated = replaceSection(updated, "Last Action", `Initialized ${options.name} with agentops init.`);
  updated = replaceSection(updated, "Next Action", "Run `agentops doctor`, then complete remaining setup placeholders.");
  updated = replaceSection(updated, "Blockers", "No current blockers.");
  updated = replaceSection(updated, "Verification Status", ["- Current check: agentops init", "- Result: initialized", "- Residual risk: remaining TODO placeholders may need project-specific context"].join("\n"));
  return updated;
}

function updateTaskQueue(content: string, _options: InitOptions): string {
  let updated = replaceSection(content, "Inbox", "- [ ] [A-001] #task Replace remaining project setup placeholders.");
  updated = replaceSection(updated, "Ready", "- [ ] [A-002] #task Run `agentops maintenance` after setup placeholders are resolved.");
  updated = replaceSection(updated, "Active", "No active agent task.");
  updated = replaceSection(updated, "Blocked", "No blocked agent task.");
  updated = replaceSection(updated, "Verify", "No task waiting for verification.");
  updated = replaceSection(updated, "Done", "No completed agent tasks yet.");
  return updated;
}

function updateProjectFacts(content: string, options: InitOptions): string {
  const facts = [
    `- Project name: ${options.name}`,
    `- Project type: ${options.type}`,
    `- Primary user: ${options.primaryUser}`,
    `- Stage: ${options.stage}`,
    `- Package manager: ${options.packageManager}`,
    `- Install command: ${options.install}`,
    `- Dev command: ${options.dev}`,
    `- Test command: ${options.test}`,
    `- Lint/type command: ${options.lint}`,
    `- Build command: ${options.build}`,
    `- Template mode: ${options.mode}`,
    `- Desired vibe: ${options.desiredVibe}`,
    `- Design adaptation: ${options.adaptDesign}`
  ].join("\n");
  return replaceSection(content, "Facts", facts);
}

function normalizeInitOptions(options: InitOptions): Required<InitOptions> {
  const mode = options.mode?.trim() || "standard";
  const desiredVibe = options.desiredVibe?.trim() || "useful, reliable, and focused";
  const adaptDesign = options.adaptDesign?.trim() || "Use the default DESIGN.md until product evidence suggests a domain-specific change.";
  return { ...options, mode, desiredVibe, adaptDesign };
}

function updateDecisions(content: string, options: InitOptions): string {
  return content.replace(
    /\| TODO \| TODO \| TODO \| TODO \|/,
    `| ${today()} | Initialize project as ${options.name} | Establish concrete project context for agents | Project goal or stack changes |`
  );
}

function replaceFencedTodo(content: string, replacement: string): string {
  return content.replace(/```text\nTODO:[\s\S]*?\n```/, `\`\`\`text\n${replacement}\n\`\`\``);
}

function replaceSection(content: string, heading: string, body: string): string {
  const pattern = new RegExp(`((?:^|\\n)## ${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(?=\\n## |$)`);
  return content.replace(pattern, (_match, headingText: string) => `${headingText}${body.trim()}\n`);
}

function yamlValue(value: string): string {
  if (/^[A-Za-z0-9_-]+$/.test(value)) {
    return value;
  }
  return JSON.stringify(value);
}

function article(value: string): string {
  return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
