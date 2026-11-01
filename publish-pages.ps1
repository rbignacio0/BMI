#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Publish the BMI Calculator frontend to GitHub Pages.

.DESCRIPTION
    Copies the static frontend files (index.html, style.css, app.js,
    manifest.json, sw.js) from ./frontend/ into ./docs/ so GitHub Pages
    can serve them. Optionally commits and pushes the change to the
    configured branch.

    This is a purely client-side static app — no backend API, no API
    URL injection required.

    Prerequisites:
      - Git is installed and configured.
      - The repository remote (origin) is set.
      - GitHub Pages is enabled in repo settings, source = "Deploy from a
        branch" pointing at docs/ (or use the actions/deploy-pages
        workflow which deploys frontend/ directly).

.PARAMETER Branch
    The branch to commit/push to. Default: main.

.PARAMETER Commit
    When set, creates a commit and pushes to origin.

.PARAMETER Message
    Commit message. Default: "chore: publish BMI frontend to GitHub Pages".
#>
[CmdletBinding()]
param(
    [Parameter()]
    [string]$Branch = 'main',

    [Parameter()]
    [switch]$Commit,

    [Parameter()]
    [string]$Message = 'chore: publish BMI frontend to GitHub Pages'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$scriptDir = $PSScriptRoot
$frontendDir = Join-Path $scriptDir 'frontend'
$docsDir     = Join-Path $scriptDir 'docs'

Write-Host "=== BMI Calculator — GitHub Pages Publisher ===" -ForegroundColor Cyan

# ------------------------------------------------------------------
# 1. Validate prerequisites
# ------------------------------------------------------------------
if (-not (Test-Path $frontendDir)) {
    Write-Error "Frontend directory not found: $frontendDir"
    exit 1
}

$requiredFiles = @('index.html', 'style.css', 'app.js', 'manifest.json', 'sw.js')
foreach ($f in $requiredFiles) {
    $path = Join-Path $frontendDir $f
    if (-not (Test-Path $path)) {
        Write-Error "Required frontend file missing: $path"
        exit 1
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not on PATH."
    exit 1
}

# ------------------------------------------------------------------
# 2. Sync frontend files into docs/
# ------------------------------------------------------------------
Write-Host "Copying frontend files to docs/ ..."
if (-not (Test-Path $docsDir)) {
    New-Item -ItemType Directory -Path $docsDir | Out-Null
}

# Clear existing docs contents (except .gitkeep if present)
Get-ChildItem -Path $docsDir -Exclude '.gitkeep' -Recurse -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Get-ChildItem -Path $frontendDir | Copy-Item -Destination $docsDir -Recurse -Force

# Ensure .nojekyll exists so Pages serves the files as-is
$noJekyll = Join-Path $docsDir '.nojekyll'
if (-not (Test-Path $noJekyll)) {
    Set-Content -Path $noJekyll -Value '' -Encoding UTF8
}

Write-Host "Frontend staged in docs/." -ForegroundColor Green

# ------------------------------------------------------------------
# 4. Show diff summary
# ------------------------------------------------------------------
Write-Host "`nChanged files:" -ForegroundColor Cyan
git -C $scriptDir status --short -- docs/ | ForEach-Object { Write-Host "  $_" }

# ------------------------------------------------------------------
# 5. Optional commit + push
# ------------------------------------------------------------------
if ($Commit) {
    Write-Host "`nCommitting and pushing to $Branch ..." -ForegroundColor Cyan
    git -C $scriptDir add docs/
    git -C $scriptDir commit -m "$Message"
    git -C $scriptDir push origin $Branch
    Write-Host "Published successfully to $Branch." -ForegroundColor Green
    Write-Host "Enable GitHub Pages in repo settings and point it at the docs/ folder." -ForegroundColor Gray
}
else {
    Write-Host "`nFiles are staged in docs/ but not committed." -ForegroundColor Yellow
    Write-Host "Re-run with -Commit to push, e.g.:" -ForegroundColor Gray
    Write-Host "  .\publish-pages.ps1 -Commit" -ForegroundColor Gray
}

Write-Host "`nDone." -ForegroundColor Cyan