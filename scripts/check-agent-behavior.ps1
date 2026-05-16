$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$errors = New-Object System.Collections.Generic.List[string]

$requiredFiles = @(
    "Agent State/agent-state.md",
    "Agent State/task-queue.md",
    "Memory/project-facts.md",
    "Memory/decisions.md",
    "Memory/failures.md",
    "Memory/open-questions.md",
    "docs/AGENT_EXECUTION_LOOP.md",
    "docs/AGENT_TOOL_REGISTRY.md",
    "docs/AGENT_PERMISSION_GATES.md",
    "QA/AGENT_BEHAVIOR_CHECKS.md"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $root $file
    if (-not (Test-Path -LiteralPath $path)) {
        $errors.Add("Missing agentic runtime file: $file")
    }
}

function Assert-Contains {
    param(
        [string]$RelativePath,
        [string[]]$Markers
    )

    $path = Join-Path $root $RelativePath
    if (-not (Test-Path -LiteralPath $path)) {
        return
    }

    $content = Get-Content -Raw -LiteralPath $path
    foreach ($marker in $Markers) {
        if ($content -notmatch [regex]::Escape($marker)) {
            $errors.Add("$RelativePath missing marker: $marker")
        }
    }
}

Assert-Contains "docs/AGENT_EXECUTION_LOOP.md" @(
    "plan",
    "act",
    "observe",
    "Verify",
    "Stop Conditions"
)

Assert-Contains "docs/AGENT_TOOL_REGISTRY.md" @(
    "safe",
    "approval-needed",
    "forbidden",
    "Commit changes",
    "deploy"
)

Assert-Contains "docs/AGENT_PERMISSION_GATES.md" @(
    "deleting files",
    "deploying",
    "spending money",
    "sending external messages"
)

Assert-Contains "AGENTS.md" @(
    "Agentic Runtime Layer",
    "Agent State/agent-state.md",
    "docs/AGENT_TOOL_REGISTRY.md",
    "docs/AGENT_PERMISSION_GATES.md"
)

if ($errors.Count -gt 0) {
    Write-Host "Agent behavior check failed:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host " - $error" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Agent behavior scaffold is present." -ForegroundColor Green
