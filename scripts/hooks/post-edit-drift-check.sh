#!/usr/bin/env bash
# PostToolUse hook for Claude Code: run the agent-doc drift check whenever an
# agent instruction file is edited. Wired up in .claude/settings.json.
#
# Receives the tool-use payload as JSON on stdin. Exit 0 = pass/skip.
# Exit 2 = drift check failed; stderr is fed back to Claude as blocking
# feedback so it fixes the alignment before moving on.
set -u

payload="$(cat)"

# Extract the edited file path without requiring jq.
file_path="$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
[[ -z "$file_path" ]] && exit 0

# Only react to files the drift check actually governs.
case "$file_path" in
    *AGENTS.md|*CLAUDE.md|*CODEX.md|*GEMINI.md) ;;
    *copilot-instructions.md) ;;
    */.cursor/rules/*) ;;
    */docs/*.md|docs/*.md) ;;
    */personas/*.md|personas/*.md) ;;
    */.claude/commands/*.md|*/.claude/agents/*.md) ;;
    *"Session Logs/_Session Logs Index.md") ;;
    *) exit 0 ;;
esac

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
check="$script_dir/../check-agent-docs.sh"
[[ -f "$check" ]] || exit 0

output="$(bash "$check" 2>&1)"
status=$?

if [[ "$status" -ne 0 ]]; then
    {
        echo "Drift check failed after editing $file_path."
        echo "$output"
        echo "Fix the alignment errors above before continuing (canonical rules live in AGENTS.md; see docs/AGENT_ALIGNMENT.md)."
    } >&2
    exit 2
fi

exit 0
