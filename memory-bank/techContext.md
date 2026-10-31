# Tech Context

## Stack
- HTML5 (semantic, viewport meta, theme-color, manifest link).
- CSS3 (custom properties/variables, media queries, `prefers-color-scheme`, `prefers-reduced-motion`).
- Vanilla JavaScript (ES6+, IIFE, no build step, no npm dependencies).
- PWA: Web App Manifest + Service Worker (Cache API).

## Tooling
- None required locally (open `index.html` directly or serve with any static server).
- GitHub Actions `pages.yml` deploys `frontend/` to GitHub Pages.
- VS Code for editing; ESLint/Prettier optional (no node_modules in repo).

## Dependencies
- None (no frameworks, no libraries, no CDN fonts required — system font stack).

## Browser support
- Evergreen desktop/mobile browsers (Chrome, Safari, Firefox, Edge).
- Service Worker supported on modern mobile browsers; graceful fallback if unsupported.
