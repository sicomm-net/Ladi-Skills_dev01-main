param(
    [string]$TranscriptPath,
    [string]$OutputRoot = "docs/a28_teams-mgt/a12_Notes"
)

$ErrorActionPreference = "Stop"

function Resolve-RepoRoot {
    $scriptDir = Split-Path -Parent $PSCommandPath
    return [System.IO.Path]::GetFullPath((Join-Path $scriptDir "..\..\..\.."))
}

function Find-LatestTranscript {
    $base = Join-Path $env:APPDATA "Code\User\workspaceStorage"
    if (-not (Test-Path $base)) {
        throw "VS Code workspaceStorage not found at $base"
    }

    $files = Get-ChildItem -Path $base -Recurse -Filter "*.jsonl" -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -like "*GitHub.copilot-chat*transcripts*" } |
        Sort-Object LastWriteTime -Descending

    if (-not $files -or $files.Count -eq 0) {
        throw "No Copilot transcript JSONL files found under $base"
    }

    return $files[0].FullName
}

function Resolve-TranscriptFromCurrentSession {
    $sessionLogDir = $env:VSCODE_TARGET_SESSION_LOG
    if ([string]::IsNullOrWhiteSpace($sessionLogDir)) {
        return $null
    }

    if (-not (Test-Path $sessionLogDir)) {
        return $null
    }

    $sid = Split-Path -Path $sessionLogDir -Leaf
    if ([string]::IsNullOrWhiteSpace($sid)) {
        return $null
    }

    $workspaceStorage = Split-Path -Path (Split-Path -Path $sessionLogDir -Parent) -Parent
    $transcriptPath = Join-Path $workspaceStorage ("transcripts\{0}.jsonl" -f $sid)

    if (Test-Path $transcriptPath) {
        return $transcriptPath
    }

    return $null
}

$repoRoot = Resolve-RepoRoot
$resolvedOutputRoot = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $OutputRoot))
if (-not (Test-Path $resolvedOutputRoot)) {
    New-Item -ItemType Directory -Path $resolvedOutputRoot -Force | Out-Null
}

if ([string]::IsNullOrWhiteSpace($TranscriptPath)) {
    $TranscriptPath = Resolve-TranscriptFromCurrentSession
}

if ([string]::IsNullOrWhiteSpace($TranscriptPath)) {
    $TranscriptPath = Find-LatestTranscript
}

if (-not (Test-Path $TranscriptPath)) {
    throw "Transcript not found: $TranscriptPath"
}

$stamp = Get-Date -Format "yyMMdd-HHmm"
$outFile = Join-Path $resolvedOutputRoot ("a28-01_AI-Session_byCoPilot_v{0}.md" -f $stamp)

$lines = Get-Content -Path $TranscriptPath -Encoding utf8
$out = New-Object System.Collections.Generic.List[string]

$out.Add("# AI Session Transcript")
$out.Add("")
$out.Add(("Source: {0}" -f $TranscriptPath))
$out.Add("")

$started = $false
$turn = 0

foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) {
        continue
    }

    try {
        $row = $line | ConvertFrom-Json
    }
    catch {
        continue
    }

    if ($row.type -eq "user.message") {
        $started = $true
        $turn += 1
        $out.Add(("## {0}. User" -f $turn))
        $out.Add("")
        $out.Add([string]$row.data.content)
        $out.Add("")
        continue
    }

    if ($started -and $row.type -eq "assistant.message") {
        $content = [string]$row.data.content
        if (-not [string]::IsNullOrWhiteSpace($content)) {
            $out.Add("### Assistant")
            $out.Add("")
            $out.Add($content)
            $out.Add("")
        }
    }
}

$out | Set-Content -Path $outFile -Encoding utf8
Write-Host "Saved: $outFile"
Write-Host "Transcript: $TranscriptPath"

if ($turn -eq 0) {
    Write-Warning "No user.message records found in transcript."
}
