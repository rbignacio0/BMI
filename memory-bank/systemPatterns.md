# System Patterns

## Architecture
Single-page static web app. Three files drive the UI:
- `frontend/index.html` — semantic structure, form, result card, gauge SVG.
- `frontend/style.css` — mobile-first custom CSS, CSS variables, dark mode, reduced motion.
- `frontend/app.js` — vanilla JS (IIFE), BMI formulas, validation, rendering, localStorage.

Optional PWA layer:
- `frontend/manifest.json` — installable app metadata.
- `frontend/sw.js` — service worker for offline caching.

## Data flow
1. User picks unit system (metric/imperial) → labels/inputs update; choice saved to localStorage.
2. User enters height/weight → client-side validation (positive, imperial inches 0–11).
3. Submit → BMI computed (metric: kg/m²; imperial: 703 × lb / in²).
4. WHO category + color assigned; gauge SVG animated; result card revealed with aria-live announcement.
5. Result saved to localStorage; reload restores last result.

## Component structure
- Header: logo + unit toggle (radiogroup).
- Main form: two input groups (height, weight) + submit button.
- Result card (hidden by default): gauge, BMI number, category badge/desc, details grid, WHO legend.
- Error message (hidden by default): inline validation messages.
- Footer: attribution.
- API-status banner removed (no backend).

## Naming conventions
- IDs: camelCase, descriptive (`bmiValue`, `categoryBadge`, `gaugeProgress`).
- CSS classes: kebab-case, BEM-ish (`input-group`, `field-label`, `category-badge`).
- JS: camelCase variables/functions; constants UPPER_CASE in `CONFIG`.
