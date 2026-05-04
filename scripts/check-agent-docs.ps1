param(
    [switch]$Strict
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

$requiredFiles = @(
    "AGENTS.md",
    "CLAUDE.md",
    "CODEX.md",
    "GEMINI.md",
    ".github/copilot-instructions.md",
    ".cursor/rules/vibe-coding-core.mdc",
    "docs/AGENT_ALIGNMENT.md",
    "docs/AGENT_OPERATING_PRINCIPLES.md",
    "docs/PERSONA_COUNCIL.md",
    "docs/PROJECT_BRIEF.md",
    "docs/SETUP_CHECKLIST.md",
    "docs/SESSION_LOGGING.md",
    "TODO.md",
    "ROADMAP.md",
    "README.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "LICENSE",
    ".env.example",
    "Session Logs/_Session Logs Index.md",
    "Templates/SESSION_LOG_TEMPLATE.md",
    "personas/README.md",
    "personas/agent-council-protocol.md",
    "personas/aegis-defensive-security.md",
    "personas/code-reviewer-maintainability.md",
    "personas/head-of-product-vibe-coding.md",
    "personas/cto-vibe-coding.md",
    "personas/data-analytics-lead.md",
    "personas/delivery-lead.md",
    "personas/design-director-vibe-coding.md",
    "personas/growth-launch-strategist.md",
    "personas/ops-deployment-engineer.md",
    "personas/qa-acceptance-tester.md",
    "personas/research-scout.md"
)

$adapterFiles = @(
    "CLAUDE.md",
    "CODEX.md",
    "GEMINI.md",
    ".github/copilot-instructions.md",
    ".cursor/rules/vibe-coding-core.mdc"
)

$requiredMarkers = @(
    "Canonical source:",
    "Think Before Coding",
    "Simplicity First",
    "Surgical Changes",
    "Goal-Driven Execution",
    "Vibe Coding Quality Bar"
)

$canonicalHeadings = @(
    "## Project Identity",
    "## Product Goal",
    "## Non-Negotiable Standard",
    "## Operating Loop",
    "## Core Principles",
    "## Commands",
    "## Verification Policy",
    "## Agent Coordination",
    "## Handoff Standard"
)

$projectBriefHeadings = @(
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
)

$forbiddenAdapterPhrases = @(
    "ignore AGENTS.md",
    "override AGENTS.md",
    "do not follow AGENTS.md",
    "AGENTS.md is optional"
)

$forbiddenTemplatePhrases = @(
    "Astraeus",
    "ChatGPT Pro",
    "[[Alexei Udall]]",
    "Obsidian Vault",
    "C:\Dev",
    "C:\Users"
)

$errors = New-Object System.Collections.Generic.List[string]

function Get-RepoContent {
    param([string]$RelativePath)
    $path = Join-Path $root $RelativePath
    if (-not (Test-Path -LiteralPath $path)) {
        return $null
    }
    return Get-Content -Raw -LiteralPath $path
}

foreach ($file in $requiredFiles) {
    $path = Join-Path $root $file
    if (-not (Test-Path -LiteralPath $path)) {
        $errors.Add("Missing required file: $file")
    }
}

$agentsContent = Get-RepoContent "AGENTS.md"
if ($null -ne $agentsContent) {
    foreach ($heading in $canonicalHeadings) {
        if ($agentsContent -notmatch [regex]::Escape($heading)) {
            $errors.Add("AGENTS.md missing required heading: $heading")
        }
    }
    foreach ($marker in $requiredMarkers[1..($requiredMarkers.Count - 1)]) {
        if ($agentsContent -notmatch [regex]::Escape($marker)) {
            $errors.Add("AGENTS.md missing principle marker: $marker")
        }
    }
}

$briefContent = Get-RepoContent "docs/PROJECT_BRIEF.md"
if ($null -ne $briefContent) {
    foreach ($heading in $projectBriefHeadings) {
        if ($briefContent -notmatch [regex]::Escape($heading)) {
            $errors.Add("docs/PROJECT_BRIEF.md missing required heading: $heading")
        }
    }
}

foreach ($file in $adapterFiles) {
    $content = Get-RepoContent $file
    if ($null -eq $content) {
        continue
    }

    foreach ($marker in $requiredMarkers) {
        if ($content -notmatch [regex]::Escape($marker)) {
            $errors.Add("Missing marker '$marker' in $file")
        }
    }

    if ($content.Length -lt 900) {
        $errors.Add("Adapter appears too thin to be self-contained: $file")
    }

    foreach ($phrase in $forbiddenAdapterPhrases) {
        if ($content -match [regex]::Escape($phrase)) {
            $errors.Add("Forbidden contradictory phrase '$phrase' in $file")
        }
    }
}

$personaFiles = Get-ChildItem -LiteralPath (Join-Path $root "personas") -File -Filter "*.md" -ErrorAction SilentlyContinue
foreach ($file in $personaFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    foreach ($phrase in $forbiddenTemplatePhrases) {
        if ($content -match [regex]::Escape($phrase)) {
            $relative = Resolve-Path -LiteralPath $file.FullName -Relative
            $errors.Add("Template persona contains non-portable phrase '$phrase': $relative")
        }
    }
}

$portableTemplateFiles = @(
    "README.md",
    "AGENTS.md",
    "docs",
    "personas",
    "Session Logs",
    "Templates"
)

foreach ($item in $portableTemplateFiles) {
    $path = Join-Path $root $item
    if (-not (Test-Path -LiteralPath $path)) {
        continue
    }
    $filesToScan = @()
    if (Test-Path -LiteralPath $path -PathType Container) {
        $filesToScan = Get-ChildItem -LiteralPath $path -Recurse -File -Include "*.md","*.mdc","*.txt","*.yml","*.yaml"
    } else {
        $filesToScan = @(Get-Item -LiteralPath $path)
    }
    foreach ($file in $filesToScan) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        foreach ($phrase in $forbiddenTemplatePhrases) {
            if ($content -match [regex]::Escape($phrase)) {
                $relative = Resolve-Path -LiteralPath $file.FullName -Relative
                $errors.Add("Template file contains non-portable phrase '$phrase': $relative")
            }
        }
    }
}

if ($Strict) {
    $strictFiles = @(
        "AGENTS.md",
        "docs/PROJECT_BRIEF.md",
        "README.md"
    )

    foreach ($file in $strictFiles) {
        $content = Get-RepoContent $file
        if ($null -eq $content) {
            continue
        }
        if ($content -match "(?m)^\s*(TODO:|TODO\s*$|-\s*TODO\b|\|\s*TODO\b)") {
            $errors.Add("Strict mode: unresolved TODO placeholder in $file")
        }
    }
}

if ($errors.Count -gt 0) {
    Write-Host "Agent doc alignment check failed:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host " - $error" -ForegroundColor Red
    }
    exit 1
}

if ($Strict) {
    Write-Host "Agent docs are aligned in strict mode." -ForegroundColor Green
} else {
    Write-Host "Agent docs are aligned." -ForegroundColor Green
}
