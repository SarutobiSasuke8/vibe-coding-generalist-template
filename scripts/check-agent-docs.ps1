param(
    [switch]$Strict,
    [switch]$Json
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$errors = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Error {
    param([string]$Message)
    $errors.Add($Message)
}

function Add-Warning {
    param([string]$Message)
    $warnings.Add($Message)
}

function Get-RepoPath {
    param([string]$RelativePath)
    return Join-Path $root $RelativePath
}

function Get-RepoContent {
    param([string]$RelativePath)
    $path = Get-RepoPath $RelativePath
    if (-not (Test-Path -LiteralPath $path)) {
        return $null
    }
    return Get-Content -Raw -LiteralPath $path
}

function Test-RepoFile {
    param([string]$RelativePath)
    return Test-Path -LiteralPath (Get-RepoPath $RelativePath) -PathType Leaf
}

function Test-RepoDirectory {
    param([string]$RelativePath)
    return Test-Path -LiteralPath (Get-RepoPath $RelativePath) -PathType Container
}

$requiredFiles = @(
    "AGENTS.md",
    "DESIGN.md",
    "CLAUDE.md",
    "CODEX.md",
    "GEMINI.md",
    ".github/copilot-instructions.md",
    ".github/workflows/agent-docs.yml",
    ".cursor/rules/vibe-coding-core.mdc",
    "agentops.config.yml",
    "VERSION",
    "docs/ADAPTERS.md",
    "docs/AGENT_ALIGNMENT.md",
    "docs/AGENT_OPERATING_PRINCIPLES.md",
    "docs/AGENT_EXECUTION_LOOP.md",
    "docs/AGENT_TOOL_REGISTRY.md",
    "docs/AGENT_PERMISSION_GATES.md",
    "docs/COMMAND_REFERENCE.md",
    "docs/FAQ.md",
    "docs/PERSONA_COUNCIL.md",
    "docs/PROJECT_BRIEF.md",
    "docs/QUALITY_RATCHET.md",
    "docs/SETUP_CHECKLIST.md",
    "docs/SESSION_LOGGING.md",
    "docs/TEMPLATE_UPGRADE_STRATEGY.md",
    "docs/TEMPLATE_HEALTH.md",
    "docs/TEMPLATE_MODES.md",
    "docs/WHY.md",
    "examples/PROJECT_BRIEF.example.md",
    "examples/SESSION_LOG.example.md",
    "QA/AGENT_BEHAVIOR_CHECKS.md",
    "QA/QA_REPORT_TEMPLATE.md",
    "QA/REGRESSION_LOG.md",
    "QA/TEST_PLAN.md",
    "README.md",
    "TODO.md",
    "ROADMAP.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "LICENSE",
    ".env.example",
    "Session Logs/_Session Logs Index.md",
    "Templates/SESSION_LOG_TEMPLATE.md",
    "scripts/check-agent-behavior.ps1",
    "scripts/check-agent-docs.ps1",
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
    "personas/research-scout.md",
    "workflows/README.md",
    "workflows/first-vertical-slice.md",
    "workflows/handoff.md",
    "workflows/release-prep.md",
    "workflows/retro.md",
    "workflows/review.md",
    "workflows/security-review.md",
    "workflows/session-log.md",
    "workflows/todo-triage.md"
)

$requiredDirectories = @(
    "Agent State",
    "Memory",
    "QA",
    "Templates",
    "docs",
    "examples",
    "personas",
    "scripts",
    "Session Logs",
    "workflows"
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
    "## Agentic Runtime Layer",
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

$designMarkers = @(
    "colors:",
    "typography:",
    "components:",
    "## Overview",
    "## How Agents Should Use This File",
    "## Components",
    "## Responsive Behavior",
    "## Agent Prompt Guide",
    "personas/design-director-vibe-coding.md"
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

foreach ($directory in $requiredDirectories) {
    if (-not (Test-RepoDirectory $directory)) {
        Add-Error "Missing required directory: $directory"
    }
}

foreach ($file in $requiredFiles) {
    if (-not (Test-RepoFile $file)) {
        Add-Error "Missing required file: $file"
    }
}

$version = Get-RepoContent "VERSION"
$config = Get-RepoContent "agentops.config.yml"

if ($null -ne $version) {
    $cleanVersion = $version.Trim()
    if ($cleanVersion -notmatch "^\d+\.\d+\.\d+$") {
        Add-Error "VERSION must be semantic version format, found: $cleanVersion"
    }
}

if ($null -ne $config) {
    foreach ($marker in @("schemaVersion:", "templateVersion:", "project:", "agents:", "adapters:", "commands:", "checks:")) {
        if ($config -notmatch [regex]::Escape($marker)) {
            Add-Error "agentops.config.yml missing marker: $marker"
        }
    }

    if ($null -ne $version) {
        $cleanVersion = $version.Trim()
        if ($config -notmatch "templateVersion:\s*$([regex]::Escape($cleanVersion))") {
            Add-Error "agentops.config.yml templateVersion does not match VERSION"
        }
    }
}

$agentsContent = Get-RepoContent "AGENTS.md"
if ($null -ne $agentsContent) {
    foreach ($heading in $canonicalHeadings) {
        if ($agentsContent -notmatch [regex]::Escape($heading)) {
            Add-Error "AGENTS.md missing required heading: $heading"
        }
    }
    foreach ($marker in $requiredMarkers[1..($requiredMarkers.Count - 1)]) {
        if ($agentsContent -notmatch [regex]::Escape($marker)) {
            Add-Error "AGENTS.md missing principle marker: $marker"
        }
    }
}

$briefContent = Get-RepoContent "docs/PROJECT_BRIEF.md"
if ($null -ne $briefContent) {
    foreach ($heading in $projectBriefHeadings) {
        if ($briefContent -notmatch [regex]::Escape($heading)) {
            Add-Error "docs/PROJECT_BRIEF.md missing required heading: $heading"
        }
    }
}

$designContent = Get-RepoContent "DESIGN.md"
if ($null -ne $designContent) {
    foreach ($marker in $designMarkers) {
        if ($designContent -notmatch [regex]::Escape($marker)) {
            Add-Error "DESIGN.md missing marker: $marker"
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
            Add-Error "Missing marker '$marker' in $file"
        }
    }

    if ($content.Length -lt 900) {
        Add-Error "Adapter appears too thin to be self-contained: $file"
    }

    if ($content.Length -gt 8000) {
        Add-Warning "Adapter may be too large and should stay thin: $file"
    }

    foreach ($phrase in $forbiddenAdapterPhrases) {
        if ($content -match [regex]::Escape($phrase)) {
            Add-Error "Forbidden contradictory phrase '$phrase' in $file"
        }
    }
}

$workflowFiles = Get-ChildItem -LiteralPath (Get-RepoPath "workflows") -File -Filter "*.md" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "README.md" }
foreach ($file in $workflowFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    foreach ($marker in @("Metadata:", "trigger:", "inputs:", "expected output:", "verification:", "## Steps", "## Handoff")) {
        if ($content -notmatch [regex]::Escape($marker)) {
            $relative = Resolve-Path -LiteralPath $file.FullName -Relative
            Add-Error "Workflow file missing marker '$marker': $relative"
        }
    }
}

$personaFiles = Get-ChildItem -LiteralPath (Get-RepoPath "personas") -File -Filter "*.md" -ErrorAction SilentlyContinue
foreach ($file in $personaFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    if ($file.Name -ne "README.md" -and $content -notmatch "## Output Format") {
        $relative = Resolve-Path -LiteralPath $file.FullName -Relative
        Add-Warning "Persona should define an Output Format section: $relative"
    }
    foreach ($phrase in $forbiddenTemplatePhrases) {
        if ($content -match [regex]::Escape($phrase)) {
            $relative = Resolve-Path -LiteralPath $file.FullName -Relative
            Add-Error "Template persona contains non-portable phrase '$phrase': $relative"
        }
    }
}

$portableTemplateFiles = @(
    "README.md",
    "AGENTS.md",
    "docs",
    "examples",
    "personas",
    "Session Logs",
    "Templates",
    "workflows"
)

foreach ($item in $portableTemplateFiles) {
    $path = Get-RepoPath $item
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
                Add-Error "Template file contains non-portable phrase '$phrase': $relative"
            }
        }
    }
}

$markdownFiles = Get-ChildItem -LiteralPath $root -Recurse -File -Include "*.md","*.mdc" |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\dist\\" }

foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    $matches = [regex]::Matches($content, "\[[^\]]+\]\(([^)]+)\)")
    foreach ($match in $matches) {
        $target = $match.Groups[1].Value.Trim()
        if ($target -match "^(https?:|mailto:|#)" -or $target -eq "") {
            continue
        }
        $target = $target.Split("#")[0]
        if ($target -eq "") {
            continue
        }
        $decodedTarget = [uri]::UnescapeDataString($target)
        $candidate = Join-Path $file.DirectoryName $decodedTarget
        if (-not (Test-Path -LiteralPath $candidate)) {
            $relative = Resolve-Path -LiteralPath $file.FullName -Relative
            Add-Error "Broken Markdown link in $relative -> $target"
        }
    }
}

if ($Strict) {
    $strictFiles = @(
        "AGENTS.md",
        "docs/PROJECT_BRIEF.md",
        "README.md",
        "agentops.config.yml"
    )

    foreach ($file in $strictFiles) {
        $content = Get-RepoContent $file
        if ($null -eq $content) {
            continue
        }
        if ($content -match "(?m)^\s*(TODO:|TODO\s*$|-\s*TODO\b|\|\s*TODO\b)|\bTODO\b") {
            Add-Error "Strict mode: unresolved TODO placeholder in $file"
        }
    }
}

$result = [ordered]@{
    ok = ($errors.Count -eq 0)
    strict = [bool]$Strict
    errors = @($errors)
    warnings = @($warnings)
}

if ($Json) {
    $result | ConvertTo-Json -Depth 5
} else {
    if ($errors.Count -gt 0) {
        Write-Host "Agent doc alignment check failed:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host " - $error" -ForegroundColor Red
        }
    } else {
        if ($Strict) {
            Write-Host "Agent docs are aligned in strict mode." -ForegroundColor Green
        } else {
            Write-Host "Agent docs are aligned." -ForegroundColor Green
        }
    }

    if ($warnings.Count -gt 0) {
        Write-Host "Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host " - $warning" -ForegroundColor Yellow
        }
    }
}

if ($errors.Count -gt 0) {
    exit 1
}
