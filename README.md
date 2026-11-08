# Atharva Joshi Engineering Portfolio

Static GitHub Pages portfolio built with semantic HTML, CSS, and small JavaScript modules.

## Structure

- `index.html` - homepage and selected work
- `data/projects.js` - shared public project-card data
- `work/index.html` - filterable project library
- `work/*/index.html` - engineering case studies
- `styles.css` - global design system and responsive layout
- `hero-portrait.js` - accessible portrait/project flip with desktop collage and single-project phone views
- `assets/hero/` - optimized derivatives of real project images for the hero panel
- `work/case-study.css` - shared case-study layout

## Local preview

Serve the repository over HTTP so JavaScript modules load correctly. Any simple static server is sufficient.

The homepage panel begins on the portrait. After the gear introduction, it alternates every two seconds with project evidence. Hover or keyboard focus pauses it; the panel also provides manual flipping and Pause/Play. Reduced-motion preferences keep it manual. The caption and image tiles are defined in `index.html`; original project images remain unchanged.

## Editorial source of truth

Audit, evidence, content-strategy, and decision-log documents are maintained outside the deployed repository in the `portfolio-audit` workspace folder.
