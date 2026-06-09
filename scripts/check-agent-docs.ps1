param(
    [switch]$Strict,
    [int]$AdapterMaxLines = 80
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
    "docs/CLI_ROADMAP.md",
    "docs/AGENT_OPERATING_PRINCIPLES.md",
    "docs/FAQ.md",
    "docs/PERSONA_COUNCIL.md",
    "docs/PROJECT_BRIEF.md",
    "docs/RELEASE_CHECKLIST.md",
    "docs/SETUP_CHECKLIST.md",
    "docs/SESSION_LOGGING.md",
    "docs/SUBAGENTS.md",
    "docs/WHY.md",
    "TODO.md",
    "ROADMAP.md",
    "README.md",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "LICENSE",
    "VERSION",
    ".env.example",
    "Session Logs/_Session Logs Index.md",
    "Templates/SESSION_LOG_TEMPLATE.md",
    "personas/README.md",
    "personas/agent-council-protocol.md",
    "personas/head-of-product-vibe-coding.md",
    "personas/cto-vibe-coding.md",
    "personas/qa-acceptance-tester.md",
    ".claude/agents/head-of-product.md",
    ".claude/agents/cto.md",
    ".claude/agents/qa-acceptance-tester.md"
)

# Personas that init.ps1 can demote to personas/optional/ when the user picks
# the minimal tier. The drift-check accepts either location.
$optionalPersonas = @(
    "aegis-defensive-security.md",
    "code-reviewer-maintainability.md",
    "data-analytics-lead.md",
    "delivery-lead.md",
    "design-director-vibe-coding.md",
    "growth-launch-strategist.md",
    "ops-deployment-engineer.md",
    "research-scout.md"
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

# Files exempt from the strict placeholder scan: example files and templates
# are SUPPOSED to contain placeholders/TODOs.
$strictExemptPatterns = @(
    "docs/examples/",
    "Templates/",
    "personas/optional/"
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

function Test-StrictExempt {
    param([string]$RelativePath)
    $normalized = $RelativePath -replace '\\','/'
    foreach ($pat in $strictExemptPatterns) {
        if ($normalized -like "*$pat*") { return $true }
    }
    return $false
}

foreach ($file in $requiredFiles) {
    $path = Join-Path $root $file
    if (-not (Test-Path -LiteralPath $path)) {
        $errors.Add("Missing required file: $file")
    }
}

foreach ($persona in $optionalPersonas) {
    $core = Join-Path $root "personas/$persona"
    $optional = Join-Path $root "personas/optional/$persona"
    if (-not ((Test-Path -LiteralPath $core) -or (Test-Path -LiteralPath $optional))) {
        $errors.Add("Missing optional persona (must live in personas/ or personas/optional/): $persona")
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

$versionContent = Get-RepoContent "VERSION"
if ($null -ne $versionContent) {
    $trimmedVersion = $versionContent.Trim()
    if ($trimmedVersion -notmatch '^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$') {
        $errors.Add("VERSION must contain a semantic version like 0.1.0")
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

    if ($content.Length -lt 600) {
        $errors.Add("Adapter appears too thin to be self-contained: $file")
    }

    # Adapters should stay slim - tool-specific guidance only, not a full
    # restatement of AGENTS.md. Cap configurable via -AdapterMaxLines.
    $lineCount = ($content -split "`n").Count
    if ($lineCount -gt $AdapterMaxLines) {
        $errors.Add("Adapter exceeds line cap ($lineCount > $AdapterMaxLines): $file. Trim to tool-specific guidance; canonical principles live in AGENTS.md.")
    }

    foreach ($phrase in $forbiddenAdapterPhrases) {
        if ($content -match [regex]::Escape($phrase)) {
            $errors.Add("Forbidden contradictory phrase '$phrase' in $file")
        }
    }
}

$personaFiles = Get-ChildItem -LiteralPath (Join-Path $root "personas") -File -Filter "*.md" -Recurse -ErrorAction SilentlyContinue
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
    "Session Logs/_Session Logs Index.md",
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

# Slash commands in .claude/commands/ must be listed in AGENTS.md so the
# canonical contract never drifts from the actual command set.
$commandsDir = Join-Path $root ".claude/commands"
if ((Test-Path -LiteralPath $commandsDir) -and ($null -ne $agentsContent)) {
    $commandFiles = Get-ChildItem -LiteralPath $commandsDir -File -Filter "*.md"
    foreach ($cmdFile in $commandFiles) {
        $cmdName = "/" + [System.IO.Path]::GetFileNameWithoutExtension($cmdFile.Name)
        if (-not $agentsContent.Contains("``$cmdName``")) {
            $errors.Add("Slash command $cmdName exists in .claude/commands/ but is not listed in AGENTS.md")
        }
    }
}

# Subagents: frontmatter must declare a description and a name matching the
# filename, or Claude Code delegation breaks silently.
$agentsDir = Join-Path $root ".claude/agents"
if (Test-Path -LiteralPath $agentsDir) {
    $agentFiles = Get-ChildItem -LiteralPath $agentsDir -File -Filter "*.md"
    foreach ($agentFile in $agentFiles) {
        $base = [System.IO.Path]::GetFileNameWithoutExtension($agentFile.Name)
        $content = Get-Content -Raw -LiteralPath $agentFile.FullName
        if ($content -notmatch "(?m)^name:\s*$([regex]::Escape($base))\s*$") {
            $errors.Add("Subagent frontmatter 'name' must match filename: .claude/agents/$base.md")
        }
        if ($content -notmatch "(?m)^description:\s*\S") {
            $errors.Add("Subagent missing 'description' frontmatter: .claude/agents/$base.md")
        }
    }
}

# Session log index references must resolve to actual files in Session Logs/.
$indexPath = Join-Path $root "Session Logs/_Session Logs Index.md"
if (Test-Path -LiteralPath $indexPath) {
    $indexContent = Get-Content -Raw -LiteralPath $indexPath
    $linkMatches = [regex]::Matches($indexContent, '\]\(([^)]+\.md)\)')
    foreach ($m in $linkMatches) {
        $target = $m.Groups[1].Value
        if ($target -match '^https?://') { continue }
        $resolved = Join-Path (Split-Path -Parent $indexPath) $target
        if (-not (Test-Path -LiteralPath $resolved)) {
            $errors.Add("Session log index references missing file: $target")
        }
    }
}

if ($Strict) {
    # Strict mode: any file forkers are expected to fill in must have its
    # placeholders replaced before shipping.
    $strictFiles = @(
        "AGENTS.md",
        "docs/PROJECT_BRIEF.md",
        "README.md",
        "CLAUDE.md",
        "CODEX.md",
        "GEMINI.md",
        "ROADMAP.md",
        "TODO.md"
    )

    # Plus every file under docs/ except exempt subtrees.
    $docFiles = Get-ChildItem -LiteralPath (Join-Path $root "docs") -Recurse -File -Filter "*.md" -ErrorAction SilentlyContinue
    foreach ($f in $docFiles) {
        $rel = $f.FullName.Substring($root.Length).TrimStart('\','/').Replace('\','/')
        if (Test-StrictExempt $rel) { continue }
        if ($strictFiles -notcontains $rel) { $strictFiles += $rel }
    }

    foreach ($file in $strictFiles) {
        $content = Get-RepoContent $file
        if ($null -eq $content) { continue }
        if (Test-StrictExempt $file) { continue }
        $todoPlaceholderPattern = "(?m)(^\s*(TODO:|TODO\s*$|[-*]\s*TODO(?=[:\s]|$)|\d+\.\s*TODO(?=[:\s]|$))|^\s*(?:[-*]\s*)?[^:\r\n]+:\s*(`TODO`|TODO)\s*$|\|\s*TODO\s*(?=\|))"
        if ($content -match $todoPlaceholderPattern) {
            $errors.Add("Strict mode: unresolved TODO placeholder in $file")
        }
        if ($content -match "\{\{[^}]+\}\}") {
            $errors.Add("Strict mode: unresolved {{...}} placeholder in $file")
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
exit 0
