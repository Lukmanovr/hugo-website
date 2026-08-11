# CLAUDE.md — repo conventions

## Build & verify

- Build: `hugo build --gc --minify` (must finish with zero ERRORs; two `.Language.*`
  deprecation WARNs come from the PaperMod submodule itself and are expected until
  upstream fixes them).
- Dev server: `hugo server`.
- Source of truth branch: `main`. Deploys run via `.github/workflows/hugo.yml`
  (GitHub Actions → GitHub Pages). Never commit `public/` — it is gitignored build output.

## Hard rules

- **Never copy theme files wholesale.** PaperMod is a git submodule at `themes/PaperMod`.
  Style changes go in `assets/css/extended/custom.css`; template changes only as minimal
  overrides in `layouts/_partials/` (new-style Hugo layout paths, not `layouts/partials/`).
- **No CDN scripts in site templates.** Third-party JS is vendored, pinned, into
  `assets/js/vendor/`. (Exception: standalone iframe demo pages in `static/*.html`
  may use CDNs but must pin exact versions and carry `<meta name="robots" content="noindex">`.)
- **One analytics stack**: GA4 via `layouts/_partials/extend_head.html`, production only.
- **Assets stay small**: images ≤ ~200 KB (WebP), PDFs compressed with
  `gs -dPDFSETTINGS=/ebook`. Don't add design sources (.cdr, .psd) to the repo.
- Content filenames are kebab-case ASCII. Renaming a published page requires
  `aliases:` front matter with the old URL.
- Motion features must respect `prefers-reduced-motion` (see the guard at the bottom of
  `custom.css`; the Vanta loader in `home_info.html` checks it before loading anything).

## Homepage architecture

`layouts/_partials/home_info.html` renders a glass hero card over a fixed
`#vanta-background` div. p5 + vanta.trunk + `assets/js/vanta-init.js` are injected
after `requestIdleCallback`; the div's CSS gradient is the no-JS/reduced-motion fallback.
Effect tuning (color `0xff3000`, chaos, spacing) lives in `vanta-init.js`.
