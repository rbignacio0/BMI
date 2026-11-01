# Active Context

## What I'm working on
BMI calculator rewrite complete as a standalone HTML/CSS/JS static web app. Documentation (ProgramSpecification, Architecture, FeaturesAndLimitations) added to docs/. GitHub Pages deployment configured via pages.yml targeting frontend/.

## Current state
- Memory bank files complete for the new stack.
- `.clinerules` rewritten to HTML/CSS/JS conventions.
- Frontend (`frontend/`) fully rewritten: index.html, style.css, app.js, manifest.json, sw.js. Metric height = centimeters (cm); Imperial height = feet (ft).
- New features: auto-convert values when switching unit systems; auto-clear stale results when user edits any input; manifest + service worker only load on http/https (avoids CORS on file://).
- .NET backend fully removed.
- `publish-pages.ps1` updated: removed `-ApiBase` parameter and API injection block; now copies frontend/ (including manifest.json, sw.js) into docs/ for GitHub Pages branch-based deployment.
- `docs/` populated with frontend files and pushed to main (commit 593b15f). `.gitignore` no longer ignores `docs/`.
- Fixed bug: added missing `heightLabelImperial`, `weightLabelLb`, and `weightHintLb` to `els` object in app.js (TypeError when clicking metric vs imperial). Republished to main (commit 121556c).
- Added cache-busting `?v=3` to app.js script tag in index.html; republished to main (commit 4b6c492) to prevent stale cached script loading.
- docs/ created with ProgramSpecification.md, Architecture.md, FeaturesAndLimitations.md.
- README.md rewritten with deployment + docs references.
- .github/workflows/pages.yml targets frontend/ (correct, no change needed).

## Next immediate steps
None — all milestones complete. On next session: review progress.md, consider future considerations from FeaturesAndLimitations (export history, stones/pounds, accessibility audit).

## Key decisions
- Client-side BMI calculation (no API). Works offline; localStorage persists units/last result.
- No build step → deploy `frontend/` directly to GitHub Pages.
- WHO categories: Underweight <18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese ≥30.

## Open questions
- None.
