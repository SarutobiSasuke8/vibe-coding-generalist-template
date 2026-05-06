# scripts/init.ps1 -- interactive bootstrap for projects forked from this template.
#
# Replaces placeholders in AGENTS.md, docs/PROJECT_BRIEF.md, and README.md;
# optionally demotes 8 personas to personas/optional/; runs the drift check.
#
# Idempotent: safe to re-run. If a placeholder is already replaced, the script
# leaves it alone unless -Force is passed.
#
# Usage:
#   ./scripts/init.ps1
#   ./scripts/init.ps1 -Force          # overwrite already-customized fields
#   ./scripts/init.ps1 -NonInteractive # skip prompts; use defaults / env vars

param(
    [switch]$Force,
    [switch]$NonInteractive,
    [string]$ProjectName,
    [string]$ProjectType,
    [string]$Vibe,
    [string]$PrimaryUser,
    [string]$InstallCmd,
    [string]$RunCmd,
    [string]$TestCmd,
    [string]$LintCmd,
    [string]$BuildCmd,
    [ValidateSet("claude","codex","cursor","gemini","copilot","")][string]$PrimaryAgent = "",
    [ValidateSet("prototype","active build","maintenance","archived","")][string]$CurrentStage = "",
    [ValidateSet("minimal","full","")][string]$PersonasTier = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function Read-WithDefault {
    param([string]$Prompt, [string]$Default = "")
    if ($NonInteractive) { return $Default }
    $suffix = if ($Default) { " [$Default]" } else { "" }
    $value = Read-Host "$Prompt$suffix"
    if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
    return $value
}

function Confirm-Choice {
    param([string]$Prompt, [string[]]$Options, [string]$Default)
    if ($NonInteractive) { return $Default }
    $list = ($Options | ForEach-Object { if ($_ -eq $Default) { "[$_]" } else { $_ } }) -join " / "
    $value = Read-Host "$Prompt ($list)"
    if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
    if ($Options -notcontains $value) {
        Write-Host "  (not a valid choice; using default '$Default')" -ForegroundColor Yellow
        return $Default
    }
    return $value
}

function Replace-InFile {
    param([string]$RelPath, [string]$Pattern, [string]$Replacement, [switch]$Literal)
    $path = Join-Path $root $RelPath
    if (-not (Test-Path -LiteralPath $path)) { return $false }
    $content = Get-Content -Raw -LiteralPath $path
    if ($Literal) {
        if (-not $content.Contains($Pattern)) { return $false }
        $new = $content.Replace($Pattern, $Replacement)
    } else {
        if ($content -notmatch $Pattern) { return $false }
        $new = [regex]::Replace($content, $Pattern, $Replacement)
    }
    if ($new -ne $content) {
        Set-Content -LiteralPath $path -Value $new -NoNewline
        Write-Host "  updated $RelPath" -ForegroundColor DarkGray
        return $true
    }
    return $false
}

function Write-ProjectBrief {
    param(
        [string]$Name,
        [string]$Type,
        [string]$Feeling,
        [string]$User,
        [string]$Stage
    )

    $safeName = if ($Name) { $Name } else { "This project" }
    $safeType = if ($Type) { $Type } else { "Not specified yet" }
    $safeFeeling = if ($Feeling) { $Feeling } else { "Not specified yet" }
    $safeUser = if ($User) { $User } else { "Not specified yet" }
    $safeStage = if ($Stage) { $Stage } else { "prototype" }

    $brief = @"
# Project Brief

This is the project context agents should read before product, architecture, UI, or roadmap work.

## Summary

$safeName is a $safeType project.

$safeFeeling

## Vibe

- Desired feeling: $safeFeeling
- Reference products / experiences: To be refined.
- Anti-vibe: To be refined.
- First impression target: To be refined.

## User

- Primary user: $safeUser
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
- Project commands in `AGENTS.md` are accurate.
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

- `AGENTS.md`
- `ROADMAP.md`
- `TODO.md`

"@

    Set-Content -LiteralPath (Join-Path $root "docs/PROJECT_BRIEF.md") -Value $brief -NoNewline
    Write-Host "  generated docs/PROJECT_BRIEF.md" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Vibe Coding Template -- interactive setup" -ForegroundColor Cyan
Write-Host "----------------------------------------"

# Detect prior runs by checking AGENTS.md for the literal placeholder.
$agentsContent = Get-Content -Raw -LiteralPath (Join-Path $root "AGENTS.md")
$alreadyCustomized = -not ($agentsContent -match 'Project name: `TODO`')
if ($alreadyCustomized -and -not $Force) {
    Write-Host "AGENTS.md project identity is already customized." -ForegroundColor Yellow
    Write-Host "Re-run with -Force to overwrite, or skip prompts with -NonInteractive." -ForegroundColor Yellow
    Write-Host ""
}

if (-not $ProjectName) { $ProjectName = Read-WithDefault "Project name" "" }
if (-not $ProjectType) { $ProjectType = Read-WithDefault "Project type" "" }
if (-not $Vibe)        { $Vibe        = Read-WithDefault "One-line vibe (the feeling/goal)" "" }
if (-not $PrimaryUser) { $PrimaryUser = Read-WithDefault "Primary user" "" }
if (-not $InstallCmd)  { $InstallCmd  = Read-WithDefault "Install command" "" }
if (-not $RunCmd)      { $RunCmd      = Read-WithDefault "Run/dev command" "" }
if (-not $TestCmd)     { $TestCmd     = Read-WithDefault "Test command" "" }
if (-not $LintCmd)     { $LintCmd     = Read-WithDefault "Lint/type-check command" "" }
if (-not $BuildCmd)    { $BuildCmd    = Read-WithDefault "Build command" "" }
if (-not $PrimaryAgent) {
    $PrimaryAgent = Confirm-Choice "Primary agent" @("claude","codex","cursor","gemini","copilot") "claude"
}
if (-not $CurrentStage) {
    $CurrentStage = Confirm-Choice "Current stage" @("prototype","active build","maintenance","archived") "prototype"
}
if (-not $PersonasTier) {
    $tierPrompt = "Personas tier - minimal keeps Product/CTO/QA, full keeps all 11"
    $PersonasTier = Confirm-Choice $tierPrompt @("minimal","full") "minimal"
}

Write-Host ""
Write-Host "Applying changes..." -ForegroundColor Cyan

if ($ProjectName -and ($alreadyCustomized -eq $false -or $Force)) {
    Replace-InFile "AGENTS.md" 'Project name: `TODO`' "Project name: ``$ProjectName``" -Literal | Out-Null
    Replace-InFile "README.md" "# Vibe Coding Generalist Template" "# $ProjectName" -Literal | Out-Null
}

if ($ProjectType) {
    Replace-InFile "AGENTS.md" 'Project type: `TODO`' "Project type: ``$ProjectType``" -Literal | Out-Null
}

if ($PrimaryAgent) {
    Replace-InFile "AGENTS.md" 'Primary agent: `TODO`' "Primary agent: ``$PrimaryAgent``" -Literal | Out-Null
}

if ($PrimaryUser) {
    Replace-InFile "AGENTS.md" 'Primary user: `TODO`' "Primary user: ``$PrimaryUser``" -Literal | Out-Null
}

if ($CurrentStage) {
    Replace-InFile "AGENTS.md" 'Current stage: `prototype | active build | maintenance | archived`' "Current stage: ``$CurrentStage``" -Literal | Out-Null
}

if ($Vibe) {
    Replace-InFile "AGENTS.md" '(?ms)```text\r?\nTODO: one or two paragraphs.*?\r?\n```' "``````text`n$Vibe`n``````" | Out-Null
}

Write-ProjectBrief -Name $ProjectName -Type $ProjectType -Feeling $Vibe -User $PrimaryUser -Stage $CurrentStage

if ($InstallCmd) {
    Replace-InFile "AGENTS.md" '(?m)^# Install dependencies\r?\nTODO\b' "# Install dependencies`n$InstallCmd" | Out-Null
}
if ($RunCmd) {
    Replace-InFile "AGENTS.md" '(?m)^# Run development server\r?\nTODO\b' "# Run development server`n$RunCmd" | Out-Null
}
if ($TestCmd) {
    Replace-InFile "AGENTS.md" '(?m)^# Run tests\r?\nTODO\b' "# Run tests`n$TestCmd" | Out-Null
}
if ($LintCmd) {
    Replace-InFile "AGENTS.md" '(?m)^# Run lint/type checks\r?\nTODO\b' "# Run lint/type checks`n$LintCmd" | Out-Null
}
if ($BuildCmd) {
    Replace-InFile "AGENTS.md" '(?m)^# Build\r?\nTODO\b' "# Build`n$BuildCmd" | Out-Null
}

Replace-InFile "AGENTS.md" 'Language/framework: `TODO`' "Language/framework: ``$ProjectType``" -Literal | Out-Null
Replace-InFile "AGENTS.md" 'Package manager: `TODO`' "Package manager: ``Not specified``" -Literal | Out-Null
Replace-InFile "AGENTS.md" 'Formatting: `TODO`' "Formatting: ``Follow surrounding code``" -Literal | Out-Null
Replace-InFile "AGENTS.md" 'Test framework: `TODO`' "Test framework: ``Not specified``" -Literal | Out-Null

# Persona tiering
if ($PersonasTier -eq "minimal") {
    $optionalDir = Join-Path $root "personas/optional"
    if (-not (Test-Path -LiteralPath $optionalDir)) {
        New-Item -ItemType Directory -Path $optionalDir | Out-Null
    }
    $optional = @(
        "aegis-defensive-security.md",
        "code-reviewer-maintainability.md",
        "data-analytics-lead.md",
        "delivery-lead.md",
        "design-director-vibe-coding.md",
        "growth-launch-strategist.md",
        "ops-deployment-engineer.md",
        "research-scout.md"
    )
    foreach ($p in $optional) {
        $src = Join-Path $root "personas/$p"
        $dst = Join-Path $optionalDir $p
        if (Test-Path -LiteralPath $src) {
            Move-Item -LiteralPath $src -Destination $dst -Force
            Write-Host "  moved personas/$p -> personas/optional/$p" -ForegroundColor DarkGray
        }
    }
}

if ($PrimaryAgent) {
    Write-Host "  primary agent recorded as '$PrimaryAgent'" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Running drift check..." -ForegroundColor Cyan
& (Join-Path $PSScriptRoot "check-agent-docs.ps1")
$driftExit = $LASTEXITCODE

Write-Host ""
if ($driftExit -eq 0) {
    Write-Host "Setup complete." -ForegroundColor Green
} else {
    Write-Host "Setup ran but drift check failed -- see errors above." -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Refine docs/PROJECT_BRIEF.md after the first working slice."
Write-Host "  2. Replace TODO/ROADMAP starter items with real work."
Write-Host "  3. Run strict mode before the first real handoff:"
Write-Host "       ./scripts/check-agent-docs.ps1 -Strict"
Write-Host "  4. Make the first commit."
exit $driftExit
