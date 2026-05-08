#!/usr/bin/env bash
# scripts/init.sh -- interactive bootstrap for projects forked from this template.
# Mirrors scripts/init.ps1.
set -u

force=0
non_interactive=0
project_name=""
project_type=""
vibe=""
primary_user=""
install_cmd=""
run_cmd=""
test_cmd=""
lint_cmd=""
build_cmd=""
primary_agent=""
current_stage=""
personas_tier=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --force|-Force) force=1 ;;
        --non-interactive|-NonInteractive) non_interactive=1 ;;
        --project-name) project_name="$2"; shift ;;
        --project-type) project_type="$2"; shift ;;
        --vibe) vibe="$2"; shift ;;
        --primary-user) primary_user="$2"; shift ;;
        --install) install_cmd="$2"; shift ;;
        --run) run_cmd="$2"; shift ;;
        --test) test_cmd="$2"; shift ;;
        --lint) lint_cmd="$2"; shift ;;
        --build) build_cmd="$2"; shift ;;
        --primary-agent) primary_agent="$2"; shift ;;
        --current-stage) current_stage="$2"; shift ;;
        --personas-tier) personas_tier="$2"; shift ;;
        *) echo "Unknown arg: $1" >&2; exit 2 ;;
    esac
    shift
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"

read_with_default() {
    local prompt="$1"
    local default="${2:-}"
    if [[ "$non_interactive" -eq 1 ]]; then
        printf '%s' "$default"
        return
    fi
    local suffix=""
    [[ -n "$default" ]] && suffix=" [$default]"
    read -r -p "${prompt}${suffix}: " value || value=""
    if [[ -z "$value" ]]; then
        printf '%s' "$default"
    else
        printf '%s' "$value"
    fi
}

confirm_choice() {
    local prompt="$1"; shift
    local default="$1"; shift
    local options=("$@")
    if [[ "$non_interactive" -eq 1 ]]; then
        printf '%s' "$default"
        return
    fi
    local rendered=""
    for o in "${options[@]}"; do
        if [[ "$o" == "$default" ]]; then rendered="${rendered}[$o]/"; else rendered="${rendered}${o}/"; fi
    done
    rendered="${rendered%/}"
    read -r -p "${prompt} (${rendered}): " value || value=""
    if [[ -z "$value" ]]; then
        printf '%s' "$default"
        return
    fi
    for o in "${options[@]}"; do
        if [[ "$o" == "$value" ]]; then printf '%s' "$value"; return; fi
    done
    echo "  (not a valid choice; using default '$default')" >&2
    printf '%s' "$default"
}

replace_in_file() {
    local rel="$1" pattern="$2" replacement="$3" mode="${4:-literal}"
    local path="$root/$rel"
    [[ -f "$path" ]] || return 1
    if ! command -v perl >/dev/null 2>&1; then
        echo "  perl not found; cannot patch $rel" >&2
        return 1
    fi
    PERL_PATTERN="$pattern" PERL_REPLACEMENT="$replacement" PERL_MODE="$mode" \
    perl -0777 -i -e '
        my $path = shift;
        local $/; open(my $fh, "<:raw", $path) or die $!;
        my $content = <$fh>; close $fh;
        my $orig = $content;
        my $pat = $ENV{PERL_PATTERN};
        my $rep = $ENV{PERL_REPLACEMENT};
        if ($ENV{PERL_MODE} eq "literal") {
            my $idx = index($content, $pat);
            exit 1 if $idx < 0;
            $content =~ s/\Q$pat\E/$rep/;
        } else {
            my $count = ($content =~ s/$pat/$rep/sm);
            exit 1 unless $count;
        }
        if ($content ne $orig) {
            open(my $out, ">:raw", $path) or die $!;
            print $out $content; close $out;
            print "  updated $path\n";
        }
    ' "$path"
}

write_project_brief() {
    local name="${project_name:-This project}"
    local type="${project_type:-Not specified yet}"
    local feeling="${vibe:-Not specified yet}"
    local user="${primary_user:-Not specified yet}"

    cat > "$root/docs/PROJECT_BRIEF.md" <<EOF
# Project Brief

This is the project context agents should read before product, architecture, UI, or roadmap work.

## Summary

$name is a $type project.

$feeling

## Vibe

- Desired feeling: $feeling
- Reference products / experiences: To be refined.
- Anti-vibe: To be refined.
- First impression target: To be refined.

## User

- Primary user: $user
- Secondary users: To be refined.
- User skill level: To be refined.
- Context of use: To be refined.

## Problem

To be refined.

## Product Promise

To be refined.

## Core Workflows

1. User does the primary action and gets the intended outcome.
2. User handles an empty, loading, or error state without confusion.
3. Maintainer runs the documented checks before shipping changes.

## Success Criteria

- The primary workflow works end-to-end.
- The project can be installed, run, verified, and built with the documented commands.
- The experience matches the intended vibe.

## Non-Goals

- To be refined.

## Constraints

- Time: To be refined.
- Budget: To be refined.
- Stack: To be refined.
- Deployment target: To be refined.
- Data sensitivity: To be refined.
- Performance expectations: To be refined.
- Accessibility expectations: To be refined.

## Quality Gates

- Core workflow works end-to-end.
- Loading, empty, and error states exist where relevant.
- UI is responsive across target screen sizes.
- Project commands in AGENTS.md are accurate.
- Tests/checks cover the most important changed behavior.

## Technical Notes

- Architecture: To be refined.
- Data model: To be refined.
- External services: To be refined.
- Authentication/authorization: To be refined.
- Observability/logging: To be refined.

## Open Questions

- [ ] Refine the product brief after the first working slice.

## References

- AGENTS.md
- ROADMAP.md
- TODO.md

EOF
    echo "  generated docs/PROJECT_BRIEF.md"
}

echo
echo "Vibe Coding Template -- interactive setup"
echo "----------------------------------------"

agents_path="$root/AGENTS.md"
already_customized=0
if ! grep -qF 'Project name: `TODO`' "$agents_path"; then
    already_customized=1
fi
if [[ "$already_customized" -eq 1 && "$force" -eq 0 ]]; then
    echo "AGENTS.md project identity is already customized." >&2
    echo "Re-run with --force to overwrite, or --non-interactive to skip prompts." >&2
    echo
fi

[[ -z "$project_name"  ]] && project_name=$(read_with_default "Project name")
[[ -z "$project_type"  ]] && project_type=$(read_with_default "Project type")
[[ -z "$vibe"          ]] && vibe=$(read_with_default "One-line vibe (the feeling/goal)")
[[ -z "$primary_user"  ]] && primary_user=$(read_with_default "Primary user")
[[ -z "$install_cmd"   ]] && install_cmd=$(read_with_default "Install command")
[[ -z "$run_cmd"       ]] && run_cmd=$(read_with_default "Run/dev command")
[[ -z "$test_cmd"      ]] && test_cmd=$(read_with_default "Test command")
[[ -z "$lint_cmd"      ]] && lint_cmd=$(read_with_default "Lint/type-check command")
[[ -z "$build_cmd"     ]] && build_cmd=$(read_with_default "Build command")
[[ -z "$primary_agent" ]] && primary_agent=$(confirm_choice "Primary agent" "claude" claude codex cursor gemini copilot)
[[ -z "$current_stage" ]] && current_stage=$(confirm_choice "Current stage" "prototype" prototype "active build" maintenance archived)
[[ -z "$personas_tier" ]] && personas_tier=$(confirm_choice "Personas tier (minimal=3 Product/CTO/QA, standard=6 +Code Reviewer/Design/Delivery, full=all 11)" "standard" minimal standard full)

echo
echo "Applying changes..."

if [[ -n "$project_name" && ( "$already_customized" -eq 0 || "$force" -eq 1 ) ]]; then
    replace_in_file "AGENTS.md" 'Project name: `TODO`' "Project name: \`$project_name\`" literal || true
    replace_in_file "README.md" "# Vibe Coding Generalist Template" "# $project_name" literal || true
fi

[[ -n "$project_type" ]] && replace_in_file "AGENTS.md" 'Project type: `TODO`' "Project type: \`$project_type\`" literal || true
[[ -n "$primary_agent" ]] && replace_in_file "AGENTS.md" 'Primary agent: `TODO`' "Primary agent: \`$primary_agent\`" literal || true
[[ -n "$primary_user" ]] && replace_in_file "AGENTS.md" 'Primary user: `TODO`' "Primary user: \`$primary_user\`" literal || true
[[ -n "$current_stage" ]] && replace_in_file "AGENTS.md" 'Current stage: `prototype | active build | maintenance | archived`' "Current stage: \`$current_stage\`" literal || true

if [[ -n "$vibe" ]]; then
    replace_in_file "AGENTS.md" '```text\nTODO: one or two paragraphs.*?\n```' "\`\`\`text
$vibe
\`\`\`" regex || true
fi

write_project_brief

[[ -n "$install_cmd" ]] && replace_in_file "AGENTS.md" '^# Install dependencies\nTODO\b'  "# Install dependencies
$install_cmd" regex || true
[[ -n "$run_cmd"     ]] && replace_in_file "AGENTS.md" '^# Run development server\nTODO\b' "# Run development server
$run_cmd" regex || true
[[ -n "$test_cmd"    ]] && replace_in_file "AGENTS.md" '^# Run tests\nTODO\b'              "# Run tests
$test_cmd" regex || true
[[ -n "$lint_cmd"    ]] && replace_in_file "AGENTS.md" '^# Run lint/type checks\nTODO\b'   "# Run lint/type checks
$lint_cmd" regex || true
[[ -n "$build_cmd"   ]] && replace_in_file "AGENTS.md" '^# Build\nTODO\b'                  "# Build
$build_cmd" regex || true

replace_in_file "AGENTS.md" 'Language/framework: `TODO`' "Language/framework: \`${project_type:-Not specified}\`" literal || true
replace_in_file "AGENTS.md" 'Package manager: `TODO`' "Package manager: \`Not specified\`" literal || true
replace_in_file "AGENTS.md" 'Formatting: `TODO`' "Formatting: \`Follow surrounding code\`" literal || true
replace_in_file "AGENTS.md" 'Test framework: `TODO`' "Test framework: \`Not specified\`" literal || true

case "$personas_tier" in
    minimal)
        demote=(
            "aegis-defensive-security.md"
            "code-reviewer-maintainability.md"
            "data-analytics-lead.md"
            "delivery-lead.md"
            "design-director-vibe-coding.md"
            "growth-launch-strategist.md"
            "ops-deployment-engineer.md"
            "research-scout.md"
        )
        ;;
    standard)
        demote=(
            "aegis-defensive-security.md"
            "data-analytics-lead.md"
            "growth-launch-strategist.md"
            "ops-deployment-engineer.md"
            "research-scout.md"
        )
        ;;
    *)
        demote=()
        ;;
esac

if [[ ${#demote[@]} -gt 0 ]]; then
    mkdir -p "$root/personas/optional"
    for p in "${demote[@]}"; do
        src="$root/personas/$p"
        dst="$root/personas/optional/$p"
        if [[ -f "$src" ]]; then
            mv "$src" "$dst"
            echo "  moved personas/$p -> personas/optional/$p"
        fi
    done
fi

[[ -n "$primary_agent" ]] && echo "  primary agent recorded as '$primary_agent'"

# Stamp the template version this fork was initialized from. Future CLI tooling
# uses this marker to detect upgradable forks.
if [[ -f "$root/VERSION" ]]; then
    stamp_version="$(tr -d '\r\n[:space:]' < "$root/VERSION")"
    printf '%s' "$stamp_version" > "$root/.vibe-template-version"
    echo "  recorded template version $stamp_version in .vibe-template-version"
fi

echo
echo "Running drift check..."
bash "$script_dir/check-agent-docs.sh"
drift_exit=$?

echo
if [[ "$drift_exit" -eq 0 ]]; then
    echo "Setup complete."
else
    echo "Setup ran but drift check failed -- see errors above."
fi
echo
echo "Next steps:"
echo "  1. Refine docs/PROJECT_BRIEF.md after the first working slice."
echo "  2. Replace TODO/ROADMAP starter items with real work."
echo "  3. Run strict mode before the first real handoff:"
echo "       ./scripts/check-agent-docs.sh --strict"
echo "  4. Make the first commit."
exit "$drift_exit"
