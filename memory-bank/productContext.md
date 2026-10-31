# Product Context

## Problem the app solves
Let users calculate their Body Mass Index (BMI) quickly on any device, without installing anything or depending on a running backend API.

## Target users
Anyone needing a quick BMI check: mobile-first users, people on slow/spotty connections (offline support), users who prefer metric or imperial units.

## Key features
- Metric and imperial (feet+inches+pounds) input.
- Real-time client-side BMI calculation with WHO category and color-coded badge.
- Circular gauge visualization of BMI result.
- Healthy weight range shown for the entered height.
- Result card scrolls into view; ARIA live region announces result.
- Units and last result persisted to localStorage.
- Dark mode via `prefers-color-scheme`; reduced motion respected.
- Installable PWA (manifest + service worker) for offline use on mobile.

## Constraints
- HTML/CSS/JS only; no framework or build step.
- Must work on desktop and mobile browsers.
- No hardcoded secrets or credentials (none needed — pure static).
- Deployable to GitHub Pages from `frontend/`.
