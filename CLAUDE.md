# CLAUDE.md — repo conventions

## Build & verify

- Build: `hugo build --gc --minify` (must finish with zero ERRORs; two `.Language.*`
  deprecation WARNs come from the PaperMod submodule itself and are expected until
  upstream fixes them).
- Dev server: `hugo server`.
- Deploys run via **Netlify** (`netlify.toml`), which builds the pushed branch with Hugo.
  Keep `main` and `gh-pages` in sync (Netlify currently watches `gh-pages`).
  Never commit `public/` — it is gitignored build output.

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

## Design system (see DESIGN_PLAN.md for rationale)

- Radii: only `--r-xs` (4px) and `--r-md` (8px). No other corner values, ever.
- No glassmorphism, no backdrop-filter, no decorative gradients or shadows.
- Warm palette: dark `#14120e`/`#1b1814`, light `#faf9f6`/`#f2f0eb`; accent (trunk red)
  is for links/focus/progress only, never fills.
- Typeface: Geist (static/fonts/GeistVF.woff2, self-hosted). Headings weight 500-600,
  tracking -0.02em — never bold-heavy.
- The trunk animation lives INSIDE the homepage art panel (contained card), never
  behind content.
- Copy voice: declarative, no emoji, no greetings/exclamations, sentence case,
  links are nouns. Post lists show date + title only.
