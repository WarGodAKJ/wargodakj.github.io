# Atharva Joshi Engineering Portfolio

Static GitHub Pages portfolio built with semantic HTML, CSS, and small JavaScript modules.

## Structure

- `index.html` - homepage and selected work
- `data/projects.js` - shared public project-card data
- `work/index.html` - filterable project library
- `work/*/index.html` - engineering case studies
- `styles.css` - global design system and responsive layout
- `hero-portrait.js` - accessible portrait/project flip with desktop collage and single-project phone views
- `hero-scroll.js` - full-height intro sizing, three scroll-driven cue gears with copper sparks, and teal transition progress
- `assets/hero/` - optimized derivatives of real project images for the hero panel
- `work/case-study.css` - shared case-study layout

## Local preview

Serve the repository over HTTP so JavaScript modules load correctly. Any simple static server is sufficient.

The homepage panel begins on the portrait, centered inside a brushed copper frame with a large gear and matching small gears at the upper and lower right. After the gear introduction, it alternates every two seconds with project evidence. Hover or keyboard focus pauses it; clicking or tapping flips it manually. Reduced-motion preferences keep it manual. There is no caption or separate playback control. The image tiles are defined in `index.html`; original project images remain unchanged.

The intro fills at least the viewport beneath the header. Its Scroll link and three small gears lead to the SpotMicro introduction using normal anchor navigation. The gears combine a 15-second idle turn with scroll movement. Bright copper/gold sparks fall from alternating contacts only while scrolling down; faster scrolling makes the trails fall farther and quicker. The following navy-to-teal-to-light band reveals according to scroll position. Offscreen cue motion pauses, and reduced-motion preferences leave static gears and gradient without sparks. Short screens can scroll through the intro without clipping its content; disabled JavaScript retains the layout, gear artwork, gradient, and link.

## Editorial source of truth

Audit, evidence, content-strategy, and decision-log documents are maintained outside the deployed repository in the `portfolio-audit` workspace folder.
