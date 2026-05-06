#!/usr/bin/env bash
# Smoke-test the Bash init path from a temp copy of this template.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_root="$(cd "$script_dir/.." && pwd)"
temp_parent="$(mktemp -d "${TMPDIR:-/tmp}/vibe-template-init-test.XXXXXX")"
temp_root="$temp_parent/repo"

cleanup() {
    rm -rf "$temp_parent"
}
trap cleanup EXIT

assert_contains() {
    local file="$1" expected="$2" label="$3"
    if ! grep -qF -- "$expected" "$file"; then
        echo "Missing expected $label: $expected" >&2
        exit 1
    fi
}

mkdir -p "$temp_root"
tar --exclude='.git' -C "$source_root" -cf - . | tar -C "$temp_root" -xf -

bash "$temp_root/scripts/init.sh" \
    --non-interactive \
    --project-name "Bootstrap Smoke Project" \
    --project-type "Node app" \
    --vibe "A small verified fork that feels ready to build from." \
    --primary-user "Solo builder" \
    --install "npm install" \
    --run "npm run dev" \
    --test "npm test" \
    --lint "npm run lint" \
    --build "npm run build" \
    --primary-agent "codex" \
    --current-stage "prototype" \
    --personas-tier "full"

agents="$temp_root/AGENTS.md"
assert_contains "$agents" 'Project name: `Bootstrap Smoke Project`' "project name"
assert_contains "$agents" 'Project type: `Node app`' "project type"
assert_contains "$agents" 'Primary agent: `codex`' "primary agent"
assert_contains "$agents" 'Primary user: `Solo builder`' "primary user"
assert_contains "$agents" 'Current stage: `prototype`' "current stage"
assert_contains "$agents" "A small verified fork that feels ready to build from." "product goal"
assert_contains "$agents" "npm install" "install command"
assert_contains "$agents" "npm run dev" "run command"
assert_contains "$agents" "npm test" "test command"
assert_contains "$agents" "npm run lint" "lint command"
assert_contains "$agents" "npm run build" "build command"

brief="$temp_root/docs/PROJECT_BRIEF.md"
assert_contains "$brief" "Bootstrap Smoke Project is a Node app project." "generated project brief summary"
assert_contains "$brief" "Primary user: Solo builder" "generated project brief user"

bash "$temp_root/scripts/check-agent-docs.sh"
bash "$temp_root/scripts/check-agent-docs.sh" --strict

echo "Bash init smoke test passed."
