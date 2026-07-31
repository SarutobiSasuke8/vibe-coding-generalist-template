import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export type DesignCheck = {
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type DesignReport = {
  ok: boolean;
  checks: DesignCheck[];
  tokens: {
    colors: number;
    typography: number;
    rounded: number;
    spacing: number;
    components: number;
  };
};

export type DesignTokensResult = {
  ok: boolean;
  message: string;
  outFile?: string;
  css: string;
};

type DesignFrontmatter = {
  content: string;
  colors: Record<string, string>;
  typography: Record<string, Record<string, string>>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, Record<string, string>>;
};

const requiredSections = [
  "## Overview",
  "## How Agents Should Use This File",
  "## Colors",
  "## Typography",
  "## Layout",
  "## Components",
  "## Responsive Behavior",
  "## Accessibility",
  "## Do's and Don'ts",
  "## Agent Prompt Guide",
  "## Known Gaps"
];

const requiredColorRoles = ["primary", "accent", "canvas", "surface", "ink", "body", "muted", "success", "warning", "error", "focus"];
const requiredComponents = ["button-primary", "button-secondary", "button-icon", "input", "panel", "work-card", "code-panel", "badge"];

export function runDesignCheck(options: { rootDir: string }): DesignReport {
  const rootDir = resolve(options.rootDir);
  const checks: DesignCheck[] = [];
  const designPath = join(rootDir, "DESIGN.md");

  if (!existsSync(designPath)) {
    return {
      ok: false,
      checks: [{ name: "DESIGN.md", status: "fail", detail: "Missing root DESIGN.md." }],
      tokens: { colors: 0, typography: 0, rounded: 0, spacing: 0, components: 0 }
    };
  }

  const design = parseDesign(readFileSync(designPath, "utf8"));
  checks.push({ name: "DESIGN.md", status: "pass", detail: "Found root design contract." });

  for (const section of requiredSections) {
    checks.push({
      name: `Section ${section}`,
      status: design.content.includes(section) ? "pass" : "fail",
      detail: design.content.includes(section) ? "Present." : "Missing required design guidance section."
    });
  }

  for (const role of requiredColorRoles) {
    checks.push({
      name: `Color ${role}`,
      status: design.colors[role] ? "pass" : "fail",
      detail: design.colors[role] ? design.colors[role] : "Missing required color role."
    });
  }

  for (const component of requiredComponents) {
    checks.push({
      name: `Component ${component}`,
      status: design.components[component] ? "pass" : "fail",
      detail: design.components[component] ? "Tokenized." : "Missing required component token."
    });
  }

  if (!design.content.includes("docs/PROJECT_BRIEF.md")) {
    checks.push({ name: "Project brief link", status: "warn", detail: "DESIGN.md should tell agents to cross-check docs/PROJECT_BRIEF.md." });
  }

  if (!design.content.includes("personas/design-director-vibe-coding.md")) {
    checks.push({ name: "Design persona link", status: "warn", detail: "DESIGN.md should name the Design Director persona as the judgement layer." });
  }

  const tokens = {
    colors: Object.keys(design.colors).length,
    typography: Object.keys(design.typography).length,
    rounded: Object.keys(design.rounded).length,
    spacing: Object.keys(design.spacing).length,
    components: Object.keys(design.components).length
  };

  return {
    ok: checks.every((check) => check.status !== "fail"),
    checks,
    tokens
  };
}

export function exportDesignTokens(options: { rootDir: string; outFile?: string }): DesignTokensResult {
  const rootDir = resolve(options.rootDir);
  const designPath = join(rootDir, "DESIGN.md");
  if (!existsSync(designPath)) {
    return { ok: false, message: "Missing DESIGN.md.", css: "" };
  }

  const design = parseDesign(readFileSync(designPath, "utf8"));
  const css = toCss(design);
  const outFile = options.outFile ? resolve(rootDir, options.outFile) : undefined;

  if (outFile) {
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, css);
  }

  return {
    ok: true,
    message: outFile ? `Design tokens written to ${outFile}.` : "Design tokens generated.",
    outFile,
    css
  };
}

function parseDesign(content: string): DesignFrontmatter {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)?.[1] ?? "";
  return {
    content,
    colors: parseScalarMap(frontmatter, "colors"),
    typography: parseNestedMap(frontmatter, "typography"),
    rounded: parseScalarMap(frontmatter, "rounded"),
    spacing: parseScalarMap(frontmatter, "spacing"),
    components: parseNestedMap(frontmatter, "components")
  };
}

function parseScalarMap(frontmatter: string, section: string): Record<string, string> {
  const block = extractTopLevelBlock(frontmatter, section);
  const values: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const match = /^  ([A-Za-z0-9_-]+):\s*(.+?)\s*$/.exec(line);
    if (match) {
      values[match[1]] = cleanYamlValue(match[2]);
    }
  }
  return values;
}

function parseNestedMap(frontmatter: string, section: string): Record<string, Record<string, string>> {
  const block = extractTopLevelBlock(frontmatter, section);
  const values: Record<string, Record<string, string>> = {};
  let current: string | undefined;

  for (const line of block.split(/\r?\n/)) {
    const parent = /^  ([A-Za-z0-9_-]+):\s*$/.exec(line);
    if (parent) {
      current = parent[1];
      values[current] = {};
      continue;
    }
    const child = /^    ([A-Za-z0-9_-]+):\s*(.+?)\s*$/.exec(line);
    if (child && current) {
      values[current][child[1]] = cleanYamlValue(child[2]);
    }
  }

  return values;
}

function extractTopLevelBlock(frontmatter: string, section: string): string {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${section}:`);
  if (start === -1) {
    return "";
  }

  const block: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z0-9_-]+:\s*$/.test(line)) {
      break;
    }
    block.push(line);
  }
  return block.join("\n");
}

function toCss(design: DesignFrontmatter): string {
  const lines = [":root {"];
  for (const [name, value] of Object.entries(design.colors)) {
    lines.push(`  --color-${name}: ${value};`);
  }
  for (const [name, value] of Object.entries(design.rounded)) {
    lines.push(`  --radius-${name}: ${value};`);
  }
  for (const [name, value] of Object.entries(design.spacing)) {
    lines.push(`  --space-${name}: ${value};`);
  }
  for (const [name, token] of Object.entries(design.typography)) {
    for (const [property, value] of Object.entries(token)) {
      lines.push(`  --type-${name}-${kebab(property)}: ${value};`);
    }
  }
  lines.push("}");
  lines.push("");
  lines.push("body {");
  lines.push("  background: var(--color-canvas);");
  lines.push("  color: var(--color-body);");
  lines.push("  font-family: var(--type-body-md-font-family);");
  lines.push("  font-size: var(--type-body-md-font-size);");
  lines.push("  line-height: var(--type-body-md-line-height);");
  lines.push("}");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function cleanYamlValue(value: string): string {
  return value.replace(/^["']|["']$/g, "");
}

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
