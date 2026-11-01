#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploys the BMI Calculator frontend to GitHub Pages.

.DESCRIPTION
This script publishes the contents of the ./frontend/ directory to GitHub Pages.
It can be run locally or in CI/CD. It supports two deployment modes:
  1. 'subtree' - uses git subtree to push frontend/ to the gh-branch
  2. 'github-api' - uses GitHub CLI (gh) to trigger a Pages deployment

By default, it uses the 'subtree' method which works with the existing
GitHub Actions workflow (.github/workflows/pages.yml).

.PARAMETER Mode
Deployment mode: 'subtree' (default) or 'github-api'.

.PARAMETER Branch
Target branch for deployment (default: 'main'). The script pushes the
frontend/ subtree to this branch, which GitHub Pages then serves.

.PARAMETER DryRun
If set, only shows what would be done without actually pushing.

.EXAMPLE
.\publish-pages.ps1 -Mode subtree -Branch main
# Deploy frontend/ to the main branch using git subtree

.EXAMPLE
.\publish-pages.ps1 -Mode github-api
# Trigger GitHub Pages deployment via GitHub CLI
#

[Params]$Mode = $PSBoundParameters.ContainsKey('Mode') ? $PSBoundParameters['Mode'] : 'subtree'
[Params]$Branch = $PSBoundParameters.ContainsKey('Branch') ? $PSBoundParameters['Branch'] : 'main'
[Params]$DryRun = $PSBoundParameters.ContainsKey('DryRun') && $PSBoundParameters['DryRun']

# Validate frontend directory exists
$frontendPath = Join-Path -Path (Get-Location -PSProvider FileSystem) -ChildPath 'frontend'
if (-not (Test-Path -Path $frontendPath)) {
    Write-Error "Frontend directory not found at: $frontendPath"
    exit 1
}

# Validate git repository
$gitDir = Join-Path -Path (Get-Location) -ChildPath '.git'
if (-not (Test-Path -Path $gitDir -PathType Container)) {
    Write-Error "Not inside a git repository."
    exit 1
}

# Validate git remote origin is set
$remote = git remote get-url origin 2>$null
if (-not $?) {
    Write-Error "No git remote 'origin' configured."
    exit 1
}

Write-Host "=== BMI Calculator GitHub Pages Deployment ===" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow
Write-Host "Branch: $Branch" -ForegroundColor Yellow
Write-Host "Frontend: $frontendPath" -ForegroundColor Yellow
if ($DryRun) { Write-Host "Dry Run: Enabled" -ForegroundColor DarkYellow }

# -------------------------------------------------------
# Method 1: Git Subtree Push
# -------------------------------------------------------
if ($Mode -eq 'subtree' -or $Mode -eq 'auto') {
    Write-Host "`n[INFO] Deploying using git subtree method..." -ForegroundColor Green

    # Check if gh-pages branch exists locally; if not, we'll create a light-weight approach
    $branches = git branch -a --format='%(refname:short)' 2>$null
    $hasGhPages = $branches -contains 'gh-pages'

    if ($DryRun) {
        Write-Host "[DRY RUN] Would execute: git subtree push --prefix frontend origin $Branch"
    } else {
        try {
            # Use git subtree push to deploy the frontend directory
            $result = git subtree push --prefix frontend origin $Branch -m "Deploy BMI Calculator frontend [ci skip]"

            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n✅ Successfully deployed frontend/ to origin/$Branch" -ForegroundColor Green
                Write-Host "🌐 GitHub Pages URL: https://${env:GITHUB_REPOSITORY_OWNER:-owner}.github.io/${env:GITHUB_REPOSITORY_NAME:-bmi}/" -ForegroundColor Green
            } else {
                Write-Error "❌ Git subtree push failed with exit code $LASTEXITCODE"
                Write-Error "   This may happen if the branch doesn't have GitHub Pages configured."
                exit 1
            }
        } catch {
            Write-Error "❌ Deployment failed: $_"
            exit 1
        }
    }

    exit 0
}

# -------------------------------------------------------
# Method 2: GitHub CLI (gh) API
# -------------------------------------------------------
if ($Mode -eq 'github-api') {
    Write-Host "[INFO] Deploying using GitHub CLI method..." -ForegroundColor Green

    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-Error "GitHub CLI (gh) not found. Install from https://cli.github.com/"
        exit 1
    }

    # Check if user is authenticated
    $auth = gh auth status 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Not authenticated with GitHub CLI. Run 'gh auth login' first."
        exit 1
    }

    if ($DryRun) {
        Write-Host "[DRY RUN] Would trigger: gh repo set-default-page ... or gh api ..."
    } else {
        try {
            # Set the source branch for GitHub Pages
            $result = gh repo set-primary-branch --source $Branch 2>$null

            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n✅ Set primary branch to $Branch" -ForegroundColor Green
            } else {
                Write-Warning "Could not set primary branch (may already be configured): $result"
            }

            # Note: The actual Pages deployment is handled by the GitHub Actions workflow
            # triggered by pushes to the main/master branch
            Write-Host "`n✅ Deployment configuration complete." -ForegroundColor Green
            Write-Host "   Push to $Branch to trigger GitHub Pages deployment." -ForegroundColor Yellow
        } catch {
            Write-Error "❌ GitHub CLI deployment failed: $_"
            exit 1
        }
    }

    exit 0
}

# -------------------------------------------------------
# Unknown mode - show help
# -------------------------------------------------------
Write-Error "Unknown mode: $Mode. Use 'subtree' or 'github-api'."
Write-Host "Run: .\publish-pages.ps1 --help for more information." -ForegroundColor DarkYellow
exit 1

