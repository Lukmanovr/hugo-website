# Refactor & Modernization Plan — rustam-lukmanov.com

> **STATUS (2026-08-11): executed** on branch `main` (commit `5a8ea66`), except:
> owner-gated items D1 (git history rewrite — pack still 161 MB), the push +
> GitHub Pages settings switch (no `gh` auth on this machine — see 1.2), and the
> Phase 5 CI quality gates (htmltest/Lighthouse workflows not yet added).
> Deviations: footer shows upstream "Powered by Hugo & PaperMod" again (old fork
> had removed it — re-override if the owner objects); PaperMod master emits two
> `.Language.*` deprecation warnings (upstream issue, cosmetic); light theme is
> enabled + toggle works but was not visually verified in a real light-mode browser.

> **Audience:** autonomous agents working on this repo. Each task is self-contained with
> context, exact file references, steps, and acceptance criteria. Work phases in order —
> tasks inside a phase are parallelizable unless marked `depends:`.
>
> **Goal:** a fast, modern personal blog for Rustam Lukmanov built on Hugo — brought up to
> 2026 standards and **evolved forward into 2027** (Phase 7) — deployed automatically, with a
> Lighthouse score ≥ 95 on every category and a repo that clones in seconds instead of minutes.

---

## 0. Current state (audit findings, 2026-08-11)

**Stack:** Hugo + PaperMod theme (git submodule, currently **not initialized** — `themes/PaperMod` is empty locally). Heavy custom overrides in `layouts/` (whole PaperMod partial set copied and modified) and `assets/css`. Custom animated homepage background (Vanta.js / three.js / p5.js from CDNs).

**Critical problems found:**

| # | Problem | Evidence |
|---|---------|----------|
| 1 | Build output `public/` (199 MB) is **committed to git** (369 tracked files) | `git ls-files \| grep public` |
| 2 | Repo is 507 MB; git pack 161 MB. `static/` holds 130 MB: 71 MB PDFs (one 60 MB PDF), 33 MB images (one 17 MB PNG), 24 MB CorelDRAW `.cdr` source files | `static/PDF/Chemometrics_Lukmanov.pdf` (60 MB), `static/images/innopolis_university.png` (17 MB), `static/Logo/*.cdr` |
| 3 | **No CI/CD.** No `.github/` directory. Source lives on `gh-pages` branch; deploys are manual commits of `public/` | branch listing |
| 4 | Homepage loads **7 render-relevant third-party scripts**: three.js r134, p5.js 1.1.9, and 4 separate Vanta builds (topology, trunk, net, dots — only trunk is used), two of them from unpinned `vanta@latest` | `layouts/partials/home_info.html:5-11` |
| 5 | Broken script tag with Windows backslash path: `<script src="static\js\vanta_trunk.js">` | `layouts/partials/home_info.html:11` |
| 6 | **Three analytics stacks** hand-pasted as blocking scripts in `<head>`: Yandex Metrika (+webvisor), GA4 gtag, and Google Tag Manager | `layouts/_default/baseof.html:4-37` |
| 7 | Font Awesome 4.7 full CSS loaded from CDN **inside `<nav>`** (invalid placement, render-blocking) | `layouts/partials/header.html:44-45` |
| 8 | 11 of 14 posts carry the placeholder `canonicalURL: "https://canonical.url/to/page"` — actively harmful for SEO | `grep -l canonical.url content/posts/*.md` |
| 9 | `config.yml` is malformed: duplicated `params.params.fuseOpts`, `profileMode:` key commented out while its children remain (works by indentation accident), deprecated `paginate` key, dead `analytics.google.SiteVerificationTag: "XYZabc"` placeholder | `config.yml:63-72, 88-90, 3, 123-125` |
| 10 | Three config files at root: `config.yml`, `config-old.yml`, `config_from_github.yml` | root listing |
| 11 | Russian-language leftovers after ru removal: `content/сontact.ru.md` (filename starts with **Cyrillic “с”**), `search.ru.md`, `cv.ru.md`, `publications.ru.md`, `posts/yandex.ru.md` | `content/` |
| 12 | Content filenames with spaces & mixed case: `On Topological Analysis of fs-LIMS Data.md`, `Frontiers in space tech.md`, `Contact.eng.md`, `CV.eng.md` | `content/` |
| 13 | Junk tracked in git: `.DS_Store`, `.hugo_build.lock`, `.vscode/settings.json` | `git ls-files` |
| 14 | Posts embed self-contained iframes (`/vanta.html`, `/vanta_nebula.html`) that each pull their own p5/three from CDN with no lazy-loading | `content/posts/trunk_nebula.md`, `static/vanta*.html` |
| 15 | `.prettierrc` sets `printWidth: 10` (mangles any formatted file) | `.prettierrc` |
| 16 | `package.json` is a stale artifact ("particles", animate.css dep, points at old repo `Lukmanovr/hugo-demo`) | `package.json` |
| 17 | `markup.goldmark.renderer.unsafe: true` + raw HTML sprinkled in markdown (acceptable for a personal site, but see task 4.4) | `config.yml:17` |

**Custom domain:** `baseURL: https://rustam-lukmanov.com`. ⚠️ No `CNAME` file found in `static/` — verify how the domain is currently bound before changing deployment (Phase 1 task 1.2).

---

## Decisions already made (do NOT re-ask)

- Keep **Hugo + PaperMod** as the base. The customizations are the site's identity; we modernize, not replace.
- Keep the animated homepage background (it's the owner's signature feature) — but make it lazy, self-hosted, single-effect, and `prefers-reduced-motion`-aware.
- English-only site. Russian content files are removed, not restored.

## Decisions that need the OWNER (flag, don't block — do everything else first)

- **D1: Git history rewrite.** Removing `public/` + big binaries from history (git-filter-repo) would shrink the repo from ~500 MB to <20 MB but rewrites all SHAs. Prepare the commands; do not run without explicit approval.
- **D2: Analytics.** Plan assumes keeping **GA4 only** (drop Yandex Metrika + GTM). If the owner wants Yandex kept, load it deferred.
- **D3: The 60 MB Chemometrics PDF.** Recommend hosting via a GitHub Release asset or linking to the publisher/DOI instead of serving from the site. Needs owner OK before deleting.

---

## Phase 1 — Repo hygiene & modern deployment (do first; everything else builds on it)

### 1.1 Consolidate configuration
**Files:** `config.yml`, `config-old.yml`, `config_from_github.yml`
- Create a single `hugo.yaml` (modern name) from `config.yml`; delete the other two.
- Fixes while migrating:
  - `paginate: 10` → `pagination: { pagerSize: 10 }` (Hugo ≥ 0.128 syntax).
  - Delete the duplicated nested `params.params.fuseOpts` block (`config.yml:63-72`); keep the one at `params.fuseOpts`.
  - Restore a real `profileMode:` mapping (currently the key is commented at `config.yml:89` but children are live). Preserve the existing title/subtitle text and buttons exactly.
  - Remove the placeholder `analytics.google.SiteVerificationTag: "XYZabc"`.
  - Remove `params.paginate: 100` (invalid location).
  - Move the TODO comments at the bottom into `REFACTOR_PLAN.md` follow-ups or delete.
- **Accept:** `hugo build` succeeds with zero deprecation warnings; site renders identically (`hugo server` spot-check of home, a post, search, archive).

### 1.2 Branch strategy + GitHub Actions deploy
**Depends:** 1.1
- Current state: source lives on `gh-pages`; `origin/master` exists (old); deploys are manual `public/` commits.
- Create branch `main` from current `gh-pages` HEAD; make it the source-of-truth branch.
- Add `.github/workflows/hugo.yml` using the official Actions-based GitHub Pages flow (`actions/configure-pages`, `peaceiris` or official `actions/upload-pages-artifact` + `actions/deploy-pages`), pinned Hugo **extended** version (latest stable at time of work), submodule checkout enabled.
- ⚠️ Before switching Pages to "GitHub Actions" source: check repo settings / existing `CNAME` for the custom domain `rustam-lukmanov.com` and carry it over (add `static/CNAME` if the domain is bound via file). Verify DNS keeps working after cutover.
- **Accept:** push to `main` → site auto-deploys; custom domain + HTTPS still work; old `gh-pages` flow retired.

### 1.3 Purge build output & junk from tracking
**Depends:** 1.2 (deploy must not rely on committed `public/`)
- `git rm -r --cached public/ .DS_Store .hugo_build.lock .vscode/` (keep `.vscode/settings.json` only if it contains something meaningful — inspect first).
- Add `.gitignore`: `public/`, `resources/_gen/`, `.hugo_build.lock`, `.DS_Store`, `node_modules/`.
- Delete stale `package.json`, `package-lock.json` (the "particles" artifact — the site has no npm build) and fix or delete `.prettierrc` (`printWidth: 10` → `100`, or remove the file).
- **Accept:** `git status` clean after a local `hugo build`; fresh clone has no `public/`.

### 1.4 Theme dependency modernization
- `themes/PaperMod` submodule is empty on this machine — `git submodule update --init` first.
- Update PaperMod to latest release and **pin the submodule to a tag**, or (preferred, 2026 standard) convert to **Hugo Modules** (`hugo mod init github.com/Lukmanovr/hugo-website` + `module.imports`), which removes the submodule footgun entirely.
- Then diff every file in `layouts/` against the upstream version: many were copied wholesale years ago just to make small tweaks. For each override, either (a) delete it if upstream now covers the need, or (b) keep it and document the delta in a comment at the top of the file. Target: cut the override surface at least in half. Known must-keep customizations: sticky header + `.shader` div (`layouts/partials/header.html`), Vanta background (`home_info.html`), profile layout (`index_profile.html`).
- **Accept:** site builds with latest PaperMod; visual parity on home/post/list/search/404; override count reduced and each remaining override documented.

### 1.5 (D1 — owner-gated) History rewrite
- Prepare a `git filter-repo` script removing `public/`, `static/PDF/`, `static/Logo/*.cdr`, deleted large images from all history; document force-push + re-clone consequences. **Do not execute without owner approval.**
- **Accept (if approved):** pack size < 20 MB.

---

## Phase 2 — Asset diet

### 2.1 PDFs
**Files:** `static/PDF/` (71 MB)
- `Chemometrics_Lukmanov.pdf` (60 MB): owner decision D3. Default action: compress with ghostscript (`-dPDFSETTINGS=/ebook`, expect ~5–10× reduction) and keep only if < 10 MB; otherwise move to a GitHub Release and link.
- Remaining PDFs (2–4 MB each are published papers): compress the same way; where a paper has a public DOI/publisher open-access link, prefer linking out and drop the local copy.
- Update every content link that points at moved/renamed PDFs (`grep -rn "PDF/" content/ layouts/`).
- **Accept:** `static/PDF/` ≤ 15 MB total; no broken links (`htmltest` from Phase 5 verifies).

### 2.2 Images
**Files:** `static/images/`, `static/*.png|jpg|webp`, `static/Logo/`
- Delete `.cdr` CorelDRAW sources (`static/Logo/*.cdr`, 24 MB) — design sources don't belong in the site repo. Export any needed final asset first (check nothing references them: they're unreferenced by HTML).
- `innopolis_university.png` (17 MB) — a 1 MB webp twin already exists; delete the PNG and point content at the webp.
- Sweep the logo/circle graveyard: `logo_italic*.png/webp` (8 variants), `circle*.png/webp` (6 variants), `goose.png`, `box.png`, `line.png`. `grep -rn` each name across `content/ layouts/ hugo.yaml`; delete unreferenced ones, and for referenced PNGs that have webp twins, use the webp.
- Convert remaining large PNG/JPGs to WebP (or AVIF with WebP fallback); target ≤ 200 KB per content image.
- Migrate post images from `static/images/` into **page bundles** (`content/posts/<slug>/index.md` + colocated images) so Hugo's image processing pipeline (`.Resize`, `srcset`) applies. Add/extend `layouts/_default/_markup/render-image.html` (already exists — extend it) to emit responsive `srcset` + `loading="lazy"` + `decoding="async"` + width/height (CLS-proof).
- **Accept:** `static/` ≤ 20 MB; every content image served responsive+lazy; no broken image links.

---

## Phase 3 — Performance (the "super fast" part)

### 3.1 One analytics stack, deferred (D2)
**Files:** `layouts/_default/baseof.html:4-37`
- Delete Yandex Metrika (+ its `<noscript>` pixel) and the GTM snippet + GTM `<noscript>` iframe. Keep **GA4** (`G-3EMDQYRZC3`) only, moved into `layouts/partials/extend_head.html`, loaded `async` (gtag already is) and guarded by `{{ if hugo.IsProduction }}`.
- **Accept:** exactly one analytics request family in the network waterfall; nothing analytics-related blocks first paint.

### 3.2 Vanta background: self-host, single effect, lazy
**Files:** `layouts/partials/home_info.html`, `static/js/vanta_trunk.js`, `static/js/*`
- Only the **trunk** effect is used. Remove the topology/net/dots Vanta script tags and the p5 tag if trunk doesn't need it (trunk *does* need p5 — verify against `vanta_trunk.js`).
- Vendor exact pinned versions into `assets/js/vendor/`: `three.r134.min.js` (only if actually required by trunk — trunk is p5-based, so likely **droppable**; test), `p5.min.js` (current 1.x), `vanta.trunk.min.js`. No more CDN, no more `@latest`.
- Fix the broken `static\js\vanta_trunk.js` path; move that file to `assets/js/` and ship via Hugo Pipes (`js.Build` or `resources.Minify` + `fingerprint`).
- Load the whole background stack **lazily**: a tiny inline loader that waits for `requestIdleCallback`/first paint, skips entirely when `matchMedia('(prefers-reduced-motion: reduce)')` matches or on narrow viewports if perf demands, then injects the scripts. The `#vanta-background` div stays as a styled gradient fallback so the page is visually complete before JS arrives.
- Delete dead experiments in `static/js/`: `particles2-5.js`, `penrose.js`, `myFunction.js`, `_p5Base.js`, `helpers.js` — first `grep -rn` each across content/layouts; keep only what's referenced (the iframe demos reference nothing in `static/js/` — they inline their code).
- **Accept:** homepage LCP unaffected by animation scripts (they load after idle); zero unpinned CDN scripts; reduced-motion users get a static background; Lighthouse perf ≥ 95 on home.

### 3.3 Iframe demos (posts)
**Files:** `static/vanta.html`, `static/vanta_nebula.html`, `static/pyscript-environment.html`, posts listed in audit #14
- Add `loading="lazy"` + `title` to every embed iframe in posts; keep demos as separate HTML files (good isolation) but pin their CDN script versions and add `<meta name="robots" content="noindex">` inside them.
- `pyscript-environment.html`: check which post uses it (`grep -rn pyscript content/`); if unused, delete.
- **Accept:** post pages don't fetch demo assets until the iframe scrolls near the viewport.

### 3.4 Icons & fonts
**Files:** `layouts/partials/header.html:44-45`, `layouts/partials/svg.html`, `social_icons.html`
- Remove the Font Awesome 4.7 CDN `<link>` from inside `<nav>`. Find every FA class usage (`grep -rn "fa-\|font-awesome" layouts/ content/ assets/`) and replace with inline SVGs (PaperMod's `svg.html` already provides a set).
- Site uses system font stack via PaperMod — keep it (fastest option). If any Google Fonts crept in, self-host with `font-display: swap`.
- **Accept:** zero third-party CSS/font requests site-wide.

### 3.5 Head & caching polish
**Files:** `layouts/partials/head.html`, `layouts/_default/baseof.html`
- Ensure CSS is bundled+minified+fingerprinted via Hugo Pipes (PaperMod default does this — verify the local override didn't break it).
- Add `<link rel="preconnect">` for the single remaining analytics origin.
- Verify `minify.minifyOutput: true` covers HTML; enable `--gc --minify` in the CI build.
- **Accept:** single CSS file, fingerprinted; HTML minified in production.

---

## Phase 4 — Content & SEO cleanup

### 4.1 Kill placeholder canonicals (high priority, trivial)
- In all 11 posts: delete the line `canonicalURL: "https://canonical.url/to/page"`. Only real cross-posts keep a canonical.
- **Accept:** `grep -rn "canonical.url" content/` returns nothing.

### 4.2 Filename & language hygiene
- Delete Russian leftovers: `content/сontact.ru.md` (note the Cyrillic first letter), `search.ru.md`, `cv.ru.md`, `publications.ru.md`, `content/posts/yandex.ru.md` → **check first** whether `yandex.ru.md` is actually an English post about Yandex (read it; the `.ru.md` suffix marks language, but "removed ru" commit may have missed it — if it's real content, rename to `yandex.md`).
- Rename `*.eng.md` → plain `.md` (single-language site needs no suffix): `about.eng.md`, `Contact.eng.md`, `CV.eng.md`, `Publications.eng.md`.
- Kebab-case all post files: `On Topological Analysis of fs-LIMS Data.md` → `topological-analysis-fs-lims.md`, `Frontiers in space tech.md` → `frontiers-space-tech.md`, etc. ⚠️ Renames change URLs — add `aliases:` front matter with the old URL for every renamed page so existing inbound links survive.
- **Accept:** ASCII kebab-case filenames throughout `content/`; `hugo build` shows old URLs redirect via aliases.
- Also normalize duplicated front-matter noise across posts (duplicate `disableHLJS` keys, commented author arrays); update `archetypes/default.md` so future posts start clean.

### 4.3 Metadata & structured data
- Replace `params.description: "Personal website"` with a real 150-char description; fix `images: ["/Profile.jpg"]` → the webp.
- Verify OpenGraph/Twitter/schema partials (`layouts/partials/templates/*`) match current upstream PaperMod; ensure each post gets a real description (most have them — audit for empties).
- Add real content to the `favicon` set — currently every size points at one `circle4.webp`; generate proper 16/32/180/svg favicons from the logo.
- **Accept:** valid OG/schema on home + posts (test with a validator); proper favicon set.

### 4.4 Raw-HTML reduction (nice-to-have)
- Posts inline raw `<div>`/`<iframe>` markup. Move repeated patterns into shortcodes (an `embed-demo` shortcode wrapping the iframe pattern with lazy-loading baked in). Keep `unsafe: true` only if something still needs it after the sweep.
- **Accept:** iframe embeds go through one shortcode; one-off raw HTML minimized.

---

## Phase 5 — Quality gates & CI (lock in the wins)

### 5.1 Link & HTML checking
- Add `htmltest` (or `lychee` for links) as a CI job on PRs: internal links, images, anchors.
- **Accept:** CI fails on broken internal links; current site passes.

### 5.2 Lighthouse CI with budgets
- Add `lhci autorun` GitHub Action against the built site (home + one post + list page). Budgets: perf ≥ 95, a11y ≥ 95, SEO ≥ 95, total JS on non-home pages < 100 KB, home < 400 KB after lazy-load.
- **Accept:** CI publishes scores per PR; budgets enforced.

### 5.3 Documentation
- Rewrite `README.md`: prerequisites (Hugo extended version pinned), `hugo server` quickstart, deploy flow (push to `main` → Actions), content authoring guide (page bundles, shortcodes, front matter template), where the Vanta background lives and how to tweak it.
- Add `CLAUDE.md` with repo conventions for future agent sessions (build command, branch model, "never commit public/", image pipeline rules).
- **Accept:** a newcomer (or agent) can build and deploy from README alone.

---

## Phase 6 — Visual & UX modernization (2026 style)

> Context: styling lives in local overrides under `assets/css/` (~880 lines total).
> Tokens are in `assets/css/core/theme-vars.css` (plain `rgb()` grayscale, no accent color,
> fixed px sizes). `assets/css/extended/blank.css` is the PaperMod-sanctioned extension point.
> All motion work in this phase must respect `prefers-reduced-motion` (same rule as 3.2).

### 6.1 Design-token overhaul
**Files:** `assets/css/core/theme-vars.css`
- Rebuild the token set:
  - Colors in **`oklch()`** with an actual brand accent (derive from the Vanta trunk red — currently the site is pure grayscale with no accent token). Add `--accent`, `--accent-subtle`, `--surface`, `--surface-raised` tiers instead of the flat `--theme/--entry` pair.
  - Use the **`light-dark()`** CSS function + `color-scheme: light dark` so light/dark variants live on one line per token instead of the duplicated blocks at `theme-vars.css:9-17` vs `21-29`.
  - **Fluid type & space scales** with `clamp()`: `--step--1 … --step-4` for font sizes, `--space-xs … --space-xl` for gaps; replace the fixed `--gap: 21px` / `--content-gap: 20px`.
- **Accept:** all colors defined once via `light-dark()`; both themes pass WCAG AA contrast (check `--secondary` on `--theme` — the current dark-mode pairing is borderline); no hardcoded px font sizes left in `assets/css/`.

### 6.2 Typography
- Self-host one modern **variable font** for headings + UI (e.g. Inter var or similar neutral grotesk; woff2, latin subset, `font-display: swap`, preloaded) and keep the system stack for body text — one small font file, not a family of weights. This must not violate 3.4's "zero third-party font requests": self-hosted only.
- Prose polish in `assets/css/common/post-single.css`: reading measure `max-width: 65ch`, `line-height: 1.65`, `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `hanging-punctuation` where supported.
- **Accept:** one ≤ 50 KB woff2; headings visibly distinct; CLS from font swap ≈ 0 (size-adjusted fallback via `@font-face` metrics override).

### 6.3 Homepage hero polish
**Files:** `layouts/partials/index_profile.html`, `assets/css/common/profile-mode.css`
- Put the profile card on a **glass surface** over the Vanta background: `backdrop-filter: blur() saturate()`, 1px `--border` hairline, large radius, soft shadow — with a solid-color fallback via `@supports`.
- Modern buttons for the Blog/Publications/Resume/Contact row: accent-tinted, `:hover` lift + `:focus-visible` ring, consistent with 6.1 tokens.
- Subtle entrance: replace the animate.css class remnants (`home_info.html:2` uses `animate__animated`; the library is no longer loaded — dead classes) with a small CSS-only fade/rise keyframe.
- **Accept:** hero readable over the animation at all viewport sizes; no dead `animate__*` classes anywhere (`grep -rn "animate__" layouts/`).

### 6.4 Post cards & list pages
**Files:** `assets/css/common/post-entry.css`, `layouts/_default/list.html`
- Card treatment: raised `--surface-raised`, hover elevation (`transform: translateY(-2px)` + shadow transition), accent underline on the title, tag chips.
- Use **container queries** (`@container`) so cards adapt to their column, not the viewport — drop the corresponding `zmedia.css` breakpoints where they become redundant.
- Show cover thumbnails in list cards where a post has one (responsive, from the 2.2 pipeline).
- **Accept:** list pages feel like a 2026 blog index; no layout jank on hover; works down to 320px.

### 6.5 Cross-document View Transitions
**Files:** `layouts/partials/head.html`
- Add `@view-transition { navigation: auto; }` — cross-document View Transitions are baseline in 2026 evergreen browsers and free for an MPA like Hugo. Give the post title/cover a shared `view-transition-name` between list card and single page for a hero-morph effect.
- Pure progressive enhancement: zero JS, older browsers just navigate normally. Auto-disabled by the browser under `prefers-reduced-motion`.
- **Accept:** navigating list → post animates smoothly in Chromium/Safari; no behavior change in browsers without support.

### 6.6 Header & micro-interactions
**Files:** `layouts/partials/header.html`, `assets/css/common/header.css` (283 lines — the largest style file, review while in there)
- Modernize the sticky header: replace the `.shader` div hack with `backdrop-filter` glass + `border-bottom` hairline that appears on scroll (CSS **scroll-driven animation** `animation-timeline: scroll()`, with a no-op fallback).
- Nav link states: animated underline via `background-size` transition; visible `:focus-visible` rings everywhere (audit — currently none defined in `assets/css/`).
- Add `scroll-behavior: smooth` (guarded by reduced-motion) and `scroll-margin-top` on headings so ToC anchors don't hide under the sticky header.
- **Accept:** header glass effect in both themes; keyboard tab-through shows clear focus states on every interactive element.

### 6.7 Light/dark themes with an on/off toggle button (owner requirement)
**Config:** `hugo.yaml` (`defaultTheme: dark`, `disableThemeToggle: true`) · **Files:** `layouts/partials/header.html`, `assets/css/core/theme-vars.css`
- The site currently forces dark with the toggle disabled. Requirement: **both light and dark are first-class, switched by a single on/off button** in the header.
  - Set `defaultTheme: auto` (first visit follows `prefers-color-scheme`), `disableThemeToggle: false`.
  - The button is a **binary light⇄dark switch**: one press flips the theme, sun/moon icon swaps (inline SVG per 3.4, animated cross-fade honoring reduced-motion). No three-state dropdown.
  - Implement as an accessible switch: `<button role="switch" aria-checked>` + `aria-label="Toggle dark mode"`, visible `:focus-visible` ring (6.6), ≥ 44px touch target.
  - Persist the choice in `localStorage` (`pref-theme` — PaperMod's inline head script already reads this key; verify it still does after the 1.4 update) and mirror it to `color-scheme` so form controls/scrollbars follow. No FOUC: the inline pre-paint script stays first in `<head>`.
  - Both palettes come from the 6.1 `light-dark()` tokens — light mode is a designed theme, not an inverted afterthought. Vanta background stays dark-canvas in both (it's self-backgrounded) — verify hero glass-card contrast in light mode, and give `#vanta-background`'s gradient fallback a per-theme variant.
- **Accept:** toggle button visible in the header on all pages; one click flips theme instantly with no flash; choice survives reload and navigation; first visit matches OS preference; both themes pass the 6.1 contrast checks.

### 6.8 Code blocks: server-side highlighting
**Files:** `assets/js/highlight.min.js`, `assets/css/hljs/an-old-hope.min.css`, `hugo.yaml`
- Replace client-side highlight.js with Hugo's built-in **Chroma**: set `markup.highlight` (a 2026-appropriate theme, `lineNos` optional, `noClasses: false` + generated stylesheet wired into the token system so it themes with `light-dark()`). Delete `highlight.min.js` + hljs CSS and the `disableHLJS` front-matter noise (ties into 4.2).
- This is also a perf win: ~120 KB of JS gone from every post page (helps the 5.2 non-home JS budget).
- **Accept:** identical-or-better syntax coloring with zero highlighting JS shipped.

---

## Phase 7 — Evolution into 2027 standards

> Everything here is **progressive enhancement**: each feature must degrade to the Phase 3–6
> baseline in browsers that lack it. Nothing in this phase may add a render-blocking resource
> or violate the Phase 5 budgets. Where a feature is still behind Interop/partial support at
> build time, ship it guarded (`@supports`, feature-detect) — that's the point of this phase:
> the site adopts the platform as it lands, instead of needing another refactor next year.

### 7.1 Instant navigation: Speculation Rules
**Files:** `layouts/partials/head.html`
- Add a Speculation Rules `<script type="speculationrules">` block: `prerender` with `eagerness: moderate` for same-origin links (list → post, nav links). This is the successor to link-prefetch heuristics and makes navigation effectively instant on Chromium; other engines ignore the block harmlessly.
- Exclude heavy pages from prerender: any post embedding a demo iframe (the 3.3 set) gets `prefetch` only — don't burn bandwidth prerendering three.js demos.
- Pairs with 6.5: prerender + cross-document view transitions = SPA-feel with zero framework.
- **Accept:** hovering/near-tapping a post link prerenders it (verify in DevTools ▸ Application ▸ Speculative loads); demo-heavy posts are excluded; no budget regression.

### 7.2 AVIF-first image pipeline
**Depends:** 2.2
- Upgrade the 2.2 pipeline and `render-image.html` to emit `<picture>` with **AVIF → WebP → original** sources via Hugo's built-in AVIF encoding. Re-encode covers and content images; keep WebP as the universal fallback.
- **Accept:** modern browsers receive AVIF (verify content-type in the network panel); total image transfer on the posts list drops ≥ 25% vs the Phase 2 baseline.

### 7.3 Typography & layout: 2027 CSS
**Files:** `assets/css/` (builds on 6.1/6.2)
- `text-box-trim: trim-both` + `text-box-edge: cap alphabetic` on headings and buttons — true optical vertical centering, killing the magic-number paddings.
- **CSS anchor positioning** for the ToC "active section" indicator and any tooltip/popover (replaces absolute-position math in `assets/css/common/post-single.css`).
- **Popover API** (`popover` attribute + `::backdrop`) for the mobile nav / any overlay instead of checkbox/JS hacks — free focus management, light-dismiss, top-layer rendering. Audit the burger-menu implementation (see `origin/master` "burger_menu" commit) and rebuild it on popover + anchor.
- `@scope` blocks to fence card styles (6.4) and prose styles from leaking into each other, trimming selector specificity wars in the copied PaperMod CSS.
- **Accept:** each feature behind `@supports` with the 6.x styling as fallback; mobile nav works with zero custom JS; no visual regressions in non-supporting engines.

### 7.4 Scroll-driven storytelling (restrained)
**Files:** `assets/css/`, post templates
- Reading-progress bar on posts via `animation-timeline: scroll()` — CSS-only, replaces any JS scroll listeners.
- Gentle `animation-timeline: view()` reveal for list cards and post images (opacity/translate only, ≤ 200ms, automatically inert under `prefers-reduced-motion`).
- Hard rule: motion is seasoning, not structure — content must be fully readable with all animation removed.
- **Accept:** zero scroll-event JS on the site; progress bar + reveals work in supporting browsers and vanish cleanly elsewhere.

### 7.5 Offline & installability (PWA-lite)
**Files:** `static/manifest.webmanifest`, `assets/js/sw.js`, `layouts/partials/head.html`
- Web app manifest (name, theme colors per 6.7 palette — both `theme_color` variants via `media`, maskable icon from the 4.3 favicon work).
- Minimal service worker: precache the CSS/font/logo shell, stale-while-revalidate for HTML, cache-first for fingerprinted assets. **No** offline-everything ambition — a personal blog needs a reliable repeat-visit cache, not a 500-line workbox config.
- **Accept:** repeat visits render from cache (verify offline reload of a visited post); Lighthouse PWA installability passes; SW is < 60 lines and never serves stale HTML longer than one revisit.

### 7.6 Content freshness signals for the AI-search era
**Files:** `layouts/partials/templates/schema_json.html`, `static/`
- 2027 discovery is answer-engines as much as blue links: tighten `Person` + `BlogPosting`/`ScholarlyArticle` JSON-LD (link ORCID/Scholar/GitHub via `sameAs`), correct `dateModified` from git info (`enableGitInfo: true`).
- Add `llms.txt` at the site root (emerging convention): short machine-readable index of who Rustam is, key publications, canonical URLs.
- Full-content RSS (check `layouts/_default/rss.xml` currently truncates) + `<link rel="alternate">` everywhere — feeds are the API of the open web again.
- **Accept:** JSON-LD validates with linked identities; `llms.txt` served; RSS carries full post content.

### 7.7 Platform watchlist (re-evaluate at execution time, adopt if shipped)
- **Masonry layout** (`display: masonry` / grid-integrated syntax — whichever won) for the posts grid.
- **`text-wrap: pretty` for all prose** by default once perf-neutral in all engines (currently applied selectively in 6.2).
- **Cross-document view-transition types** for direction-aware morphs (list→post vs post→list).
- **`Sec-Purpose` aware analytics**: ensure GA4 ignores prerender phantom views (7.1) — gtag handles this natively; verify, don't assume.
- Agents: check Interop 2027 status for each before adopting; skip silently if not shipped, leave a dated note in this file.

---

## Suggested execution order & parallelism

```
Phase 1: 1.1 → 1.2 → 1.3   (serial; 1.4 parallel with 1.2/1.3; 1.5 owner-gated)
Phase 2: 2.1 ∥ 2.2          (after 1.3)
Phase 3: 3.1 ∥ 3.2 ∥ 3.3 ∥ 3.4 → 3.5
Phase 4: 4.1 ∥ 4.2 ∥ 4.3 → 4.4
Phase 6: 6.1 → (6.2 ∥ 6.3 ∥ 6.4 ∥ 6.6 ∥ 6.8) → 6.5 ∥ 6.7   (after 1.4 & 3.2; parallel with Phase 4)
Phase 7: 7.1 ∥ 7.3 ∥ 7.4 ∥ 7.6 → 7.2 (needs 2.2) → 7.5 → 7.7   (after Phase 6)
Phase 5: 5.1 ∥ 5.2 → 5.3   (always last — locks everything in; re-run after Phase 7)
```

**Verification baseline for every phase:** `hugo server` renders home, one post with iframe demo, posts list, search, archive, 404 without regressions; `hugo build --gc --minify` emits zero warnings.
