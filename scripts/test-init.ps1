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

    & (Join-Path $tempRoot "scripts/check-agent-docs.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "check-agent-docs.ps1 failed in temp copy with exit code $LASTEXITCODE"
    }

    & (Join-Path $tempRoot "scripts/check-agent-docs.ps1") -Strict
    if ($LASTEXITCODE -ne 0) {
        throw "check-agent-docs.ps1 -Strict failed in temp copy with exit code $LASTEXITCODE"
    }

    Write-Host "PowerShell init smoke test passed." -ForegroundColor Green
}
finally {
    if (Test-Path -LiteralPath $tempParent) {
        Remove-Item -LiteralPath $tempParent -Recurse -Force
    }
}
