#!/usr/bin/env bash
# Bash twin of check-agent-docs.ps1 - same rules, runs on Linux/macOS CI and
# in dev shells without PowerShell.
#
# Usage:
#   ./scripts/check-agent-docs.sh            # standard mode
#   ./scripts/check-agent-docs.sh --strict   # also fails on unresolved placeholders
#   ./scripts/check-agent-docs.sh --adapter-max-lines 80
set -u

strict=0
adapter_max_lines=80
while [[ $# -gt 0 ]]; do
    case "$1" in
        --strict|-Strict|-strict) strict=1 ;;
        --adapter-max-lines|-AdapterMaxLines)
            adapter_max_lines="$2"; shift ;;
        *) echo "Unknown arg: $1" >&2; exit 2 ;;
    esac
    shift
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"

errors=()
add_error() { errors+=("$1"); }

required_files=(
    "AGENTS.md"
    "CLAUDE.md"
    "CODEX.md"
    "GEMINI.md"
    ".github/copilot-instructions.md"
    ".cursor/rules/vibe-coding-core.mdc"
    "docs/AGENT_ALIGNMENT.md"
    "docs/CLI_ROADMAP.md"
    "docs/AGENT_OPERATING_PRINCIPLES.md"
    "docs/FAQ.md"
    "docs/PERSONA_COUNCIL.md"
    "docs/PROJECT_BRIEF.md"
    "docs/RELEASE_CHECKLIST.md"
    "docs/SETUP_CHECKLIST.md"
    "docs/SESSION_LOGGING.md"
    "docs/SUBAGENTS.md"
    "docs/WHY.md"
    "TODO.md"
    "ROADMAP.md"
    "README.md"
    "CONTRIBUTING.md"
    "CHANGELOG.md"
    "LICENSE"
    "VERSION"
    ".env.example"
    "Session Logs/_Session Logs Index.md"
    "Templates/SESSION_LOG_TEMPLATE.md"
    "personas/README.md"
    "personas/agent-council-protocol.md"
    "personas/head-of-product-vibe-coding.md"
    "personas/cto-vibe-coding.md"
    "personas/qa-acceptance-tester.md"
    ".claude/agents/head-of-product.md"
    ".claude/agents/cto.md"
    ".claude/agents/qa-acceptance-tester.md"
)

# Personas that init can demote to personas/optional/. Either location passes.
optional_personas=(
    "aegis-defensive-security.md"
    "code-reviewer-maintainability.md"
    "data-analytics-lead.md"
    "delivery-lead.md"
    "design-director-vibe-coding.md"
    "growth-launch-strategist.md"
    "ops-deployment-engineer.md"
    "research-scout.md"
)

adapter_files=(
    "CLAUDE.md"
    "CODEX.md"
    "GEMINI.md"
    ".github/copilot-instructions.md"
    ".cursor/rules/vibe-coding-core.mdc"
)

required_markers=(
    "Canonical source:"
    "Think Before Coding"
    "Simplicity First"
    "Surgical Changes"
    "Goal-Driven Execution"
    "Vibe Coding Quality Bar"
)

canonical_headings=(
    "## Project Identity"
    "## Product Goal"
    "## Non-Negotiable Standard"
    "## Operating Loop"
    "## Core Principles"
    "## Commands"
    "## Verification Policy"
    "## Agent Coordination"
    "## Handoff Standard"
)

brief_headings=(
    "## Summary"
    "## Vibe"
    "## User"
    "## Problem"
    "## Product Promise"
    "## Core Workflows"
    "## Success Criteria"
    "## Non-Goals"
    "## Constraints"
    "## Quality Gates"
    "## Technical Notes"
    "## Open Questions"
)

forbidden_adapter_phrases=(
    "ignore AGENTS.md"
    "override AGENTS.md"
    "do not follow AGENTS.md"
    "AGENTS.md is optional"
)

forbidden_template_phrases=(
    "Astraeus"
    "ChatGPT Pro"
    "[[Alexei Udall]]"
    "Obsidian Vault"
    'C:\Dev'
    'C:\Users'
)

strict_exempt_patterns=(
    "docs/examples/"
    "Templates/"
    "personas/optional/"
)

is_strict_exempt() {
    local p="$1"
    for pat in "${strict_exempt_patterns[@]}"; do
        if [[ "$p" == *"$pat"* ]]; then return 0; fi
    done
    return 1
}

# Required files exist
for f in "${required_files[@]}"; do
    [[ -e "$root/$f" ]] || add_error "Missing required file: $f"
done

# Optional personas may live in either personas/ or personas/optional/.
for p in "${optional_personas[@]}"; do
    if [[ ! -f "$root/personas/$p" && ! -f "$root/personas/optional/$p" ]]; then
        add_error "Missing optional persona (must live in personas/ or personas/optional/): $p"
    fi
done

# AGENTS.md headings + markers
agents_path="$root/AGENTS.md"
if [[ -f "$agents_path" ]]; then
    agents=$(cat "$agents_path")
    for h in "${canonical_headings[@]}"; do
        grep -qF -- "$h" <<<"$agents" || add_error "AGENTS.md missing required heading: $h"
    done
    for m in "${required_markers[@]:1}"; do
        grep -qF -- "$m" <<<"$agents" || add_error "AGENTS.md missing principle marker: $m"
    done
fi

# PROJECT_BRIEF headings
brief_path="$root/docs/PROJECT_BRIEF.md"
if [[ -f "$brief_path" ]]; then
    brief=$(cat "$brief_path")
    for h in "${brief_headings[@]}"; do
        grep -qF -- "$h" <<<"$brief" || add_error "docs/PROJECT_BRIEF.md missing required heading: $h"
    done
fi

version_path="$root/VERSION"
if [[ -f "$version_path" ]]; then
    version="$(tr -d '\r\n[:space:]' < "$version_path")"
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]]; then
        add_error "VERSION must contain a semantic version like 0.1.0"
    fi
fi

# Adapters: markers, min size, max lines, no contradictory phrases
for f in "${adapter_files[@]}"; do
    p="$root/$f"
    [[ -f "$p" ]] || continue
    content=$(cat "$p")
    for m in "${required_markers[@]}"; do
        grep -qF -- "$m" <<<"$content" || add_error "Missing marker '$m' in $f"
    done
    bytes=$(wc -c < "$p" | tr -d ' ')
    if [[ "$bytes" -lt 600 ]]; then
        add_error "Adapter appears too thin to be self-contained: $f"
    fi
    lines=$(wc -l < "$p" | tr -d ' ')
    if [[ "$lines" -gt "$adapter_max_lines" ]]; then
        add_error "Adapter exceeds line cap ($lines > $adapter_max_lines): $f. Trim to tool-specific guidance; canonical principles live in AGENTS.md."
    fi
    for phrase in "${forbidden_adapter_phrases[@]}"; do
        grep -qF -- "$phrase" <<<"$content" && add_error "Forbidden contradictory phrase '$phrase' in $f"
    done
done

# Persona + portable template scan for non-portable phrases
scan_paths=("README.md" "AGENTS.md" "docs" "personas" "Session Logs/_Session Logs Index.md" "Templates")
for item in "${scan_paths[@]}"; do
    p="$root/$item"
    [[ -e "$p" ]] || continue
    if [[ -d "$p" ]]; then
        # macOS find lacks -regextype; use -name with multiple -o
        files=$(find "$p" -type f \( -name '*.md' -o -name '*.mdc' -o -name '*.txt' -o -name '*.yml' -o -name '*.yaml' \))
    else
        files="$p"
    fi
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        for phrase in "${forbidden_template_phrases[@]}"; do
            if grep -qF -- "$phrase" "$file"; then
                rel="${file#$root/}"
                add_error "Template file contains non-portable phrase '$phrase': $rel"
            fi
        done
    done <<<"$files"
done

# Slash commands in .claude/commands/ must be listed in AGENTS.md so the
# canonical contract never drifts from the actual command set.
commands_dir="$root/.claude/commands"
if [[ -d "$commands_dir" && -f "$agents_path" ]]; then
    for cmd_file in "$commands_dir"/*.md; do
        [[ -e "$cmd_file" ]] || continue
        cmd_name="/$(basename "$cmd_file" .md)"
        if ! grep -qF -- "\`$cmd_name\`" "$agents_path"; then
            add_error "Slash command $cmd_name exists in .claude/commands/ but is not listed in AGENTS.md"
        fi
    done
fi

# Subagents: frontmatter must declare a description and a name matching the
# filename, or Claude Code delegation breaks silently.
agents_dir="$root/.claude/agents"
if [[ -d "$agents_dir" ]]; then
    for agent_file in "$agents_dir"/*.md; do
        [[ -e "$agent_file" ]] || continue
        base="$(basename "$agent_file" .md)"
        if ! grep -qE "^name:[[:space:]]*${base}[[:space:]]*$" "$agent_file"; then
            add_error "Subagent frontmatter 'name' must match filename: .claude/agents/$base.md"
        fi
        if ! grep -qE "^description:[[:space:]]*[^[:space:]]" "$agent_file"; then
            add_error "Subagent missing 'description' frontmatter: .claude/agents/$base.md"
        fi
    done
fi

# Session log index references must resolve
index_path="$root/Session Logs/_Session Logs Index.md"
if [[ -f "$index_path" ]]; then
    while IFS= read -r target; do
        [[ -z "$target" ]] && continue
        [[ "$target" =~ ^https?:// ]] && continue
        if [[ ! -f "$root/Session Logs/$target" ]]; then
            add_error "Session log index references missing file: $target"
        fi
    done < <(grep -oE '\]\([^)]+\.md\)' "$index_path" | sed -E 's/^\]\(//; s/\)$//')
fi

# Strict: unresolved placeholders
if [[ "$strict" -eq 1 ]]; then
    strict_files=("AGENTS.md" "docs/PROJECT_BRIEF.md" "README.md" "CLAUDE.md" "CODEX.md" "GEMINI.md" "ROADMAP.md" "TODO.md")
    while IFS= read -r f; do
        [[ -z "$f" ]] && continue
        rel="${f#$root/}"
        is_strict_exempt "$rel" && continue
        # dedupe
        skip=0
        for existing in "${strict_files[@]}"; do
            [[ "$existing" == "$rel" ]] && skip=1 && break
        done
        [[ $skip -eq 0 ]] && strict_files+=("$rel")
    done < <(find "$root/docs" -type f -name '*.md' 2>/dev/null)

    for f in "${strict_files[@]}"; do
        p="$root/$f"
        [[ -f "$p" ]] || continue
        is_strict_exempt "$f" && continue
        if grep -qE '(^[[:space:]]*(TODO:|TODO[[:space:]]*$|[-*][[:space:]]*TODO([:[:space:]]|$)|[0-9]+\.[[:space:]]*TODO([:[:space:]]|$))|^[[:space:]]*([-*][[:space:]]*)?[^:]+:[[:space:]]*(`TODO`|TODO)[[:space:]]*$|\|[[:space:]]*TODO[[:space:]]*(\||$))' "$p"; then
            add_error "Strict mode: unresolved TODO placeholder in $f"
        fi
        if grep -qE '\{\{[^}]+\}\}' "$p"; then
            add_error "Strict mode: unresolved {{...}} placeholder in $f"
        fi
    done
fi

if [[ ${#errors[@]} -gt 0 ]]; then
    echo "Agent doc alignment check failed:"
    for e in "${errors[@]}"; do
        echo " - $e"
    done
    exit 1
fi

if [[ "$strict" -eq 1 ]]; then
    echo "Agent docs are aligned in strict mode."
else
    echo "Agent docs are aligned."
fi
