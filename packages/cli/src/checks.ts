import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export type CheckOptions = {
  rootDir: string;
  strict?: boolean;
};

export type CheckResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

const requiredFiles = [
  "AGENTS.md",
  "DESIGN.md",
  "CLAUDE.md",
  "CODEX.md",
  "GEMINI.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/vibe-coding-core.mdc",
  "agentops.config.yml",
  "VERSION",
  "docs/ADAPTERS.md",
  "docs/COMMAND_REFERENCE.md",
  "docs/FAQ.md",
  "docs/PROJECT_BRIEF.md",
  "docs/TEMPLATE_HEALTH.md",
  "docs/TEMPLATE_MODES.md",
  "docs/TEMPLATE_UPGRADE_STRATEGY.md",
  "docs/WHY.md",
  "scripts/check-agent-docs.ps1",
  "workflows/first-vertical-slice.md",
  "workflows/README.md"
];

const adapterFiles = [
  "CLAUDE.md",
  "CODEX.md",
  "GEMINI.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/vibe-coding-core.mdc"
];

const requiredMarkers = [
  "Canonical source:",
  "Think Before Coding",
  "Simplicity First",
  "Surgical Changes",
  "Goal-Driven Execution",
  "Vibe Coding Quality Bar"
];

const canonicalHeadings = [
  "## Project Identity",
  "## Product Goal",
  "## Non-Negotiable Standard",
  "## Operating Loop",
  "## Agentic Runtime Layer",
  "## Core Principles",
  "## Commands",
  "## Verification Policy",
  "## Agent Coordination",
  "## Handoff Standard"
];

const projectBriefHeadings = [
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
];

const designSections = [
  "## Overview",
  "## How Agents Should Use This File",
  "## Colors",
  "## Typography",
  "## Components",
  "## Responsive Behavior",
  "## Accessibility",
  "## Agent Prompt Guide"
];

const forbiddenTemplatePhrases = [
  "Astraeus",
  "ChatGPT Pro",
  "[[Alexei Udall]]",
  "Obsidian Vault",
  "C:\\Dev",
  "C:\\Users"
];

export function runChecks(options: CheckOptions): CheckResult {
  const rootDir = resolve(options.rootDir);
  const errors: string[] = [];
  const warnings: string[] = [];

  const fileExists = (path: string) => existsSync(join(rootDir, path)) && statSync(join(rootDir, path)).isFile();
  const read = (path: string) => readFileSync(join(rootDir, path), "utf8");

  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  if (fileExists("VERSION")) {
    const version = read("VERSION").trim();
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      errors.push(`VERSION must be semantic version format, found: ${version}`);
    }
    if (fileExists("agentops.config.yml") && !read("agentops.config.yml").includes(`templateVersion: ${version}`)) {
      errors.push("agentops.config.yml templateVersion does not match VERSION");
    }
  }

  if (fileExists("AGENTS.md")) {
    const agents = read("AGENTS.md");
    for (const heading of canonicalHeadings) {
      if (!agents.includes(heading)) {
        errors.push(`AGENTS.md missing required heading: ${heading}`);
      }
    }
  }

  if (fileExists("docs/PROJECT_BRIEF.md")) {
    const brief = read("docs/PROJECT_BRIEF.md");
    for (const heading of projectBriefHeadings) {
      if (!brief.includes(heading)) {
        errors.push(`docs/PROJECT_BRIEF.md missing required heading: ${heading}`);
      }
    }
  }

  if (fileExists("DESIGN.md")) {
    const design = read("DESIGN.md");
    for (const section of designSections) {
      if (!design.includes(section)) {
        errors.push(`DESIGN.md missing required section: ${section}`);
      }
    }
    for (const marker of ["colors:", "typography:", "components:", "personas/design-director-vibe-coding.md"]) {
      if (!design.includes(marker)) {
        errors.push(`DESIGN.md missing marker: ${marker}`);
      }
    }
  }

  for (const file of adapterFiles) {
    if (!fileExists(file)) {
      continue;
    }
    const content = read(file);
    for (const marker of requiredMarkers) {
      if (!content.includes(marker)) {
        errors.push(`Missing marker '${marker}' in ${file}`);
      }
    }
    if (content.length < 900) {
      errors.push(`Adapter appears too thin to be self-contained: ${file}`);
    }
    if (content.length > 8000) {
      warnings.push(`Adapter may be too large and should stay thin: ${file}`);
    }
  }

  for (const file of listTextFiles(rootDir)) {
    const content = readFileSync(file, "utf8");
    for (const phrase of forbiddenTemplatePhrases) {
      if (content.includes(phrase)) {
        errors.push(`Template file contains non-portable phrase '${phrase}': ${relative(rootDir, file)}`);
      }
    }
  }

  const workflowDir = join(rootDir, "workflows");
  if (existsSync(workflowDir)) {
    for (const file of readdirSync(workflowDir)) {
      if (!file.endsWith(".md") || file === "README.md") {
        continue;
      }
      const content = readFileSync(join(workflowDir, file), "utf8");
      for (const marker of ["Metadata:", "trigger:", "inputs:", "expected output:", "verification:", "## Steps", "## Handoff"]) {
        if (!content.includes(marker)) {
          errors.push(`Workflow file missing marker '${marker}': workflows/${file}`);
        }
      }
    }
  }

  if (options.strict) {
    for (const file of ["AGENTS.md", "docs/PROJECT_BRIEF.md", "agentops.config.yml"]) {
      if (fileExists(file) && /\bTODO\b/.test(read(file))) {
        errors.push(`Strict mode: unresolved TODO placeholder in ${file}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

function listTextFiles(rootDir: string): string[] {
  const results: string[] = [];
  const ignored = new Set([".git", "node_modules", "dist", "build", ".next"]);

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (ignored.has(entry.name)) {
        continue;
      }
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(md|mdc|txt|yml|yaml)$/i.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results;
}
