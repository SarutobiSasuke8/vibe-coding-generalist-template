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

stamp="$temp_root/.vibe-template-version"
expected_version="$(tr -d '\r\n[:space:]' < "$source_root/VERSION")"
if [[ ! -f "$stamp" ]]; then
    echo "Missing .vibe-template-version stamp" >&2
    exit 1
fi
actual_version="$(tr -d '\r\n[:space:]' < "$stamp")"
if [[ "$actual_version" != "$expected_version" ]]; then
    echo "Version stamp mismatch: expected $expected_version, got $actual_version" >&2
    exit 1
fi

bash "$temp_root/scripts/check-agent-docs.sh"
bash "$temp_root/scripts/check-agent-docs.sh" --strict

# Standard-tier verification: demoted set should land under personas/optional/
standard_root="$temp_parent/repo-standard"
mkdir -p "$standard_root"
tar --exclude='.git' -C "$source_root" -cf - . | tar -C "$standard_root" -xf -

bash "$standard_root/scripts/init.sh" \
    --non-interactive \
    --project-name "Standard Tier Smoke" \
    --project-type "Web app" \
    --vibe "A standard-tier fork with the ship-it personas." \
    --primary-user "Solo builder" \
    --install "npm install" \
    --run "npm run dev" \
    --test "npm test" \
    --lint "npm run lint" \
    --build "npm run build" \
    --primary-agent "claude" \
    --current-stage "prototype" \
    --personas-tier "standard" >/dev/null

# Standard keeps Product/CTO/QA + code-reviewer + design-director + delivery-lead.
for kept in \
    "head-of-product-vibe-coding.md" \
    "cto-vibe-coding.md" \
    "qa-acceptance-tester.md" \
    "code-reviewer-maintainability.md" \
    "design-director-vibe-coding.md" \
    "delivery-lead.md"; do
    if [[ ! -f "$standard_root/personas/$kept" ]]; then
        echo "Standard tier missing kept persona: $kept" >&2
        exit 1
    fi
done

# Standard demotes the rest (security, data, growth, ops, research).
for demoted in \
    "aegis-defensive-security.md" \
    "data-analytics-lead.md" \
    "growth-launch-strategist.md" \
    "ops-deployment-engineer.md" \
    "research-scout.md"; do
    if [[ ! -f "$standard_root/personas/optional/$demoted" ]]; then
        echo "Standard tier did not demote persona: $demoted" >&2
        exit 1
    fi
    if [[ -f "$standard_root/personas/$demoted" ]]; then
        echo "Standard tier left persona in personas/ when it should have moved: $demoted" >&2
        exit 1
    fi
done

bash "$standard_root/scripts/check-agent-docs.sh"

echo "Bash init smoke test passed."
