param()

$ErrorActionPreference = "Stop"

$sourceRoot = Split-Path -Parent $PSScriptRoot
$tempParent = Join-Path ([System.IO.Path]::GetTempPath()) ("vibe-template-init-test-" + [System.Guid]::NewGuid().ToString("N"))
$tempRoot = Join-Path $tempParent "repo"

function Assert-Contains {
    param(
        [string]$Content,
        [string]$Expected,
        [string]$Label
    )
    if (-not $Content.Contains($Expected)) {
        throw "Missing expected $Label`: $Expected"
    }
}

try {
    New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
    Get-ChildItem -LiteralPath $sourceRoot -Force |
        Where-Object { $_.Name -ne ".git" } |
        Copy-Item -Destination $tempRoot -Recurse -Force

    & (Join-Path $tempRoot "scripts/init.ps1") `
        -NonInteractive `
        -ProjectName "Bootstrap Smoke Project" `
        -ProjectType "Node app" `
        -Vibe "A small verified fork that feels ready to build from." `
        -PrimaryUser "Solo builder" `
        -InstallCmd "npm install" `
        -RunCmd "npm run dev" `
        -TestCmd "npm test" `
        -LintCmd "npm run lint" `
        -BuildCmd "npm run build" `
        -PrimaryAgent "codex" `
        -CurrentStage "prototype" `
        -PersonasTier "full"

    if ($LASTEXITCODE -ne 0) {
        throw "init.ps1 failed with exit code $LASTEXITCODE"
    }

    $agents = Get-Content -Raw -LiteralPath (Join-Path $tempRoot "AGENTS.md")
    Assert-Contains $agents 'Project name: `Bootstrap Smoke Project`' "project name"
    Assert-Contains $agents 'Project type: `Node app`' "project type"
    Assert-Contains $agents 'Primary agent: `codex`' "primary agent"
    Assert-Contains $agents 'Primary user: `Solo builder`' "primary user"
    Assert-Contains $agents 'Current stage: `prototype`' "current stage"
    Assert-Contains $agents "A small verified fork that feels ready to build from." "product goal"
    Assert-Contains $agents "npm install" "install command"
    Assert-Contains $agents "npm run dev" "run command"
    Assert-Contains $agents "npm test" "test command"
    Assert-Contains $agents "npm run lint" "lint command"
    Assert-Contains $agents "npm run build" "build command"

    $brief = Get-Content -Raw -LiteralPath (Join-Path $tempRoot "docs/PROJECT_BRIEF.md")
    Assert-Contains $brief "Bootstrap Smoke Project is a Node app project." "generated project brief summary"
    Assert-Contains $brief "Primary user: Solo builder" "generated project brief user"

    $stampPath = Join-Path $tempRoot ".vibe-template-version"
    $expectedVersion = (Get-Content -Raw -LiteralPath (Join-Path $sourceRoot "VERSION")).Trim()
    if (-not (Test-Path -LiteralPath $stampPath)) {
        throw "Missing .vibe-template-version stamp"
    }
    $actualVersion = (Get-Content -Raw -LiteralPath $stampPath).Trim()
    if ($actualVersion -ne $expectedVersion) {
        throw "Version stamp mismatch: expected $expectedVersion, got $actualVersion"
    }

    & (Join-Path $tempRoot "scripts/check-agent-docs.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "check-agent-docs.ps1 failed in temp copy with exit code $LASTEXITCODE"
    }

    & (Join-Path $tempRoot "scripts/check-agent-docs.ps1") -Strict
    if ($LASTEXITCODE -ne 0) {
        throw "check-agent-docs.ps1 -Strict failed in temp copy with exit code $LASTEXITCODE"
    }

    # Standard-tier verification: demoted set should land under personas/optional/.
    $standardRoot = Join-Path $tempParent "repo-standard"
    New-Item -ItemType Directory -Path $standardRoot -Force | Out-Null
    Get-ChildItem -LiteralPath $sourceRoot -Force |
        Where-Object { $_.Name -ne ".git" } |
        Copy-Item -Destination $standardRoot -Recurse -Force

    & (Join-Path $standardRoot "scripts/init.ps1") `
        -NonInteractive `
        -ProjectName "Standard Tier Smoke" `
        -ProjectType "Web app" `
        -Vibe "A standard-tier fork with the ship-it personas." `
        -PrimaryUser "Solo builder" `
        -InstallCmd "npm install" `
        -RunCmd "npm run dev" `
        -TestCmd "npm test" `
        -LintCmd "npm run lint" `
        -BuildCmd "npm run build" `
        -PrimaryAgent "claude" `
        -CurrentStage "prototype" `
        -PersonasTier "standard" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "init.ps1 (standard tier) failed with exit code $LASTEXITCODE"
    }

    $kept = @(
        "head-of-product-vibe-coding.md",
        "cto-vibe-coding.md",
        "qa-acceptance-tester.md",
        "code-reviewer-maintainability.md",
        "design-director-vibe-coding.md",
        "delivery-lead.md"
    )
    foreach ($p in $kept) {
        $path = Join-Path $standardRoot "personas/$p"
        if (-not (Test-Path -LiteralPath $path)) {
            throw "Standard tier missing kept persona: $p"
        }
    }

    $demoted = @(
        "aegis-defensive-security.md",
        "data-analytics-lead.md",
        "growth-launch-strategist.md",
        "ops-deployment-engineer.md",
        "research-scout.md"
    )
    foreach ($p in $demoted) {
        $optional = Join-Path $standardRoot "personas/optional/$p"
        $core = Join-Path $standardRoot "personas/$p"
        if (-not (Test-Path -LiteralPath $optional)) {
            throw "Standard tier did not demote persona: $p"
        }
        if (Test-Path -LiteralPath $core) {
            throw "Standard tier left persona in personas/ when it should have moved: $p"
        }
    }

    Write-Host "PowerShell init smoke test passed." -ForegroundColor Green
}
finally {
    if (Test-Path -LiteralPath $tempParent) {
        Remove-Item -LiteralPath $tempParent -Recurse -Force
    }
}
