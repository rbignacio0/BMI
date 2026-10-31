# BMI Calculator

A modern, mobile-friendly BMI calculator built with **HTML, CSS, and vanilla JavaScript**. It runs entirely in the browser — no backend, no API key, no build step — and works offline.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-docs%2F-2ea44f?style=flat-square)](https://BMI.github.io/)

## Features
- Metric (centimeters/kg) and imperial (feet / pounds) input
- WHO category classification with color-coded badge
- Circular gauge visualization of your result
- Healthy weight range for your entered height
- Dark mode (`prefers-color-scheme`) and reduced-motion support
- Works offline via a service worker (PWA)
- Installable on mobile via the web app manifest

## Usage
Open `frontend/index.html` in any browser, or deploy the `frontend/` folder to any static host (GitHub Pages, Netlify, Vercel, etc.).

### Local development
No install required. Just open the file:
```powershell
# From the repo root
Start-Process frontend/index.html
```
Or serve with any static server (e.g., Python, VS Code Live Server).

## Project structure
```
BMI/
├── frontend/
│   ├── index.html   # semantic HTML5 shell
│   ├── style.css    # mobile-first CSS, dark mode, reduced motion
│   ├── app.js       # vanilla JS: BMI formulas, validation, rendering
│   ├── manifest.json  # PWA install metadata
│   └── sw.js          # service worker for offline caching
├── docs/
│   ├── ProgramSpecification.md
│   ├── Architecture.md
│   └── FeaturesAndLimitations.md
├── memory-bank/           # project context
├── .clinerules            # project rules & memory-bank guidance
├── .github/workflows/pages.yml  # deploys frontend/ to GitHub Pages
├── publish-pages.ps1      # optional: publish frontend/ to docs/ for Pages
├── .gitignore
└── README.md
```

## Calculation
- **Metric:** BMI = weight (kg) ÷ height (m)²
- **Imperial:** BMI = 703 × weight (lb) ÷ height (in)² (height entered in feet, converted to inches internally)
- **WHO categories:** Underweight < 18.5 · Normal 18.5–24.9 · Overweight 25–29.9 · Obese ≥ 30

## GitHub Pages deployment
The `frontend/` folder is deployed to GitHub Pages automatically on every push to `main` via `.github/workflows/pages.yml`. No build step is required.

Manual staging (optional):
```powershell
.\publish-pages.ps1 -Commit
```
This copies `frontend/` into `docs/` and commits it, so you can use branch-based Pages deployment if preferred.

## Memory bank
The `memory-bank/` folder holds project context:
- `activeContext.md` — current work & next steps (updated after every session)
- `progress.md` — milestone checklist (reviewed when resuming work)
- `projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`

See `.clinerules` for the full memory-bank update cadence.

## Project documentation
Detailed docs are in the `docs/` folder:
- [Program specification](./docs/ProgramSpecification.md) — purpose, scope, calculation rules, validation, output, persistence, browser support, deployment
- [Architecture](./docs/Architecture.md) — folder structure, data flow, component structure, tech stack, testing, deployment pipeline
- [Features and limitations](./docs/FeaturesAndLimitations.md) — feature list, known limitations, future considerations

## License
MIT
