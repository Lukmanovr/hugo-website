# Design Plan — "Expensive, polished, crafted" pass

> Modeled on cursor.com/blog, from direct inspection (screenshots + their shipped CSS,
> 2026-08-11). Their actual tokens are quoted below — we adapt them, keeping Rustam's
> trunk-red identity. Execute phases in order; each ends with a screenshot check
> against the acceptance notes. Owner feedback that triggered this plan: "corners are
> weird, the trunk effect is out of place, should look professional/expensive."

---

## 0. What Cursor actually does (evidence, not vibes)

Extracted from `cursor.com` production CSS and page screenshots:

| Aspect | Cursor's real values |
|---|---|
| Background | `#14120b` — **warm** olive-brown near-black, not blue-gray |
| Cards | `#1b1913`, hover `#201e18`, variants `#1d1b15…#2b2923` — all warm |
| Foreground | `#edecec`; secondary `#d7d6d5`; muted = same hue at 40–60% alpha |
| Radii | `--radius-xs: 4px`, `md: 8px`, `xl: 12px` — **cards and images use 4–8px**; only pills/buttons are fully rounded |
| Type | Custom grotesk "CursorGothic" (system-ui fallback); `EB Garamond` serif in the stack for editorial accents; Berkeley Mono for code |
| Tracking | `-.025em` (tight, big headlines) → `.005em` (base); titles are **medium weight, not bold** |
| Blog list | Table-like rows: `date · tag | title | authors | read-time`, hairline separators, no thumbnails, no boxes |
| Featured posts | Large cards whose covers are **art-directed generative art contained in the card** (vector fields, patterns) — art never bleeds behind content |
| Article page | Stacked header: small muted date → 2-line large title → avatar + author · read time; contained cover art; bordered collapsible ToC card; **narrow ~60ch measure**; muted underlined links |
| Overall | No glassmorphism, no blur, no gradients-as-decoration. Flat warm surfaces + hairlines + typography do all the work. |

## Diagnosis of our current state

1. **Radius chaos**: hero 12px, buttons 8px, iframes 10px, top-link 8px — and glass blur on top. Reads "AI-generated dashboard", not "crafted editorial". (The owner's "corners are weird".)
2. **Trunk effect as wallpaper**: a full-viewport fixed background that content must fight (we already had to fade it out on scroll — a patch, and the patch proves the layout is wrong). Cursor contains art in cards.
3. **Cold palette**: zinc `#111113` feels default-Tailwind; Cursor's warmth is a large part of the "expensive print" feel.
4. **No typographic voice**: system font at bold weights; wide 760px measure; nothing distinguishes headline from UI.
5. **Glass hero card + centered emoji copy** reads personal-landing-page, not editorial publication.

---

## Phase A — Foundations: warm palette, radius discipline, real typeface

**File:** `assets/css/extended/custom.css` (rewrite), `assets/fonts/`

- **Palette (dark, default)**: bg `#14120e`; surface `#1b1814`; surface-hover `#211d18`;
  border `#2c2822`; fg `#ececea`; fg-2 `#d6d4d1`; muted `rgb(236 236 234 / 0.55)`.
  **Accent stays trunk-red**, refined for warm ground: `oklch(60% 0.19 29)` for links/hover,
  never as fills or borders-for-decoration.
- **Palette (light)**: warm paper mirror — bg `#faf9f6`; surface `#f2f0eb`; text `#26251e`
  (Cursor's own light text), muted `#26251e99`, same accent.
- **Radius scale**: `--r-xs: 4px` (tags, code, small controls), `--r-md: 8px` (cards, covers,
  iframes). Nothing else. Delete every 10/12px and the pill-ish 8px-on-tiny-elements.
- **Kill all glassmorphism**: no `backdrop-filter` anywhere; header and cards become flat
  surface colors with hairline borders.
- **Typeface**: self-host **Geist Sans** (variable, OFL) as the closest free relative of
  CursorGothic — one woff2, `font-display: swap`, metric-adjusted fallback to system-ui.
  Headings: weight 500–600, tracking `-0.02em`. Body: 16px, line-height 1.6, tracking `0.005em`.
  Optional accent (tasteful, sparse): `EB Garamond` *italic* for the hero tagline and pull
  quotes only — skip if it doesn't earn its 40 KB.
- **Accept:** one radius pair in the whole CSS; dark+light both warm; headline vs body vs
  meta clearly three distinct voices; zero `backdrop-filter`.

## Phase B — Contain the trunk: from wallpaper to art piece

**Files:** `layouts/_partials/home_info.html`, `assets/js/vanta-init.js`, `custom.css`

- Delete the fixed full-viewport `#vanta-background`, its scroll-fade hack, and the
  hero-pushed-down-30svh layout.
- New homepage top, in normal document flow:
  1. **Intro band** (no card, no box): "Rustam Lukmanov" small-caps-ish overline, one
     tight declarative line about the work, one muted line of affiliations, inline links
     (Scholar · GitHub · email). Left-aligned, max ~34rem.
  2. **Art panel**: a full-content-width card (`--r-md`, surface `#1b1814`, hairline
     border, ~340px tall) with the **trunk animation rendered inside it** — exactly like
     Cursor's vector-field cover cards. Vanta mounts into this div (it sizes to its
     element already); the CSS gradient stays as its pre-JS fill. On reduced-motion it's
     a static styled panel. Lazy-load logic unchanged.
- The trunk red on the warm card ground `#1b1814` will finally look intentional —
  same family as Cursor's olive vector-field card.
- **Accept:** homepage screenshot shows calm page background everywhere; the animation
  lives in one crisp rectangle; nothing scrolls "through" art.

## Phase C — Blog list: Cursor's table rows

**Files:** small override of the list entry markup (`layouts/list.html` or partial) + CSS

- Desktop row grid: `[date · tag] [title] [read time]` — 3 columns
  (~140px / 1fr / ~64px), vertically centered, hairline between rows, generous
  row padding (~20px). Title: fg, weight 500; everything else muted. Hover: row
  background → surface-hover (no transform, no shadow, no color-flip to red).
- Mobile: stack date over title, read time inline.
- Summaries: drop from rows (Cursor shows none in the table list) — the title must
  earn the click. Keep summaries only on the two **featured cards** (below).
- Optional featured treatment on `/` only: latest post as a large card — cover art
  (or the trunk panel doubling as its cover) + date · tag, title, one-line summary,
  read time. Mirrors Cursor's featured-then-table rhythm.
- **Accept:** list page screenshot side-by-side with cursor.com/blog list reads as the
  same species: quiet rows, scannable, no boxes.

## Phase D — Article page: editorial reading experience

**Files:** `custom.css`, possibly a small `single.html` override for header order

- Header block, stacked and left-aligned: muted small `date · tag` → title
  (clamp 1.9–2.4rem, tracking `-0.02em`, weight 550, `text-wrap: balance`) →
  muted `author · N min read`. Breadcrumbs gone or reduced to a single muted
  "Blog /" link (Cursor puts it in the far margin; we can simply drop it).
- **Measure: 640px** for post content (site container can stay wider for lists).
  Line-height 1.65; paragraph spacing over indentation.
- Covers/images/iframes: `--r-md`, hairline border, no shadows.
- ToC: bordered surface card, `--r-md`, collapsible, muted links (drop stickiness —
  Cursor doesn't float it; at 640px measure it reads better inline).
- Links in prose: muted underline (`text-underline-offset: 3px`,
  `text-decoration-color: muted`), full accent only on hover.
- Code: Berkeley-Mono-style stack (`ui-monospace, SFMono-Regular, Menlo…`), block
  background = surface, hairline border, `--r-xs`.
- **Accept:** a text-heavy post (`origin-paper`) screenshot has the narrow-column,
  quiet-link, stacked-header feel of the Cursor article.

## Phase E — Chrome: header & footer

- Header: flat `bg` color (not glass), hairline bottom border, height ~56px. Nav links
  muted → fg on hover, active = fg + medium weight. Logo image swap stays. Theme toggle
  unchanged (sun/moon).
- Footer: hairline top border only, one muted line. No red band (delete it — decoration
  the system no longer wants).
- Reading-progress bar: keep (it's functional), but 2px and only on posts
  (`.post-single` scoped), accent color.
- **Accept:** neither header nor footer draws attention in screenshots; they frame.

## Phase F — Verify like a reviewer

1. Screenshots: home, /posts/, one long post, one demo post — dark **and** light —
   desktop 1440 and mobile 390. Compare against the Cursor references in scratchpad.
2. Checklist: no element with radius other than 4/8px; no blur; no shadow except
   (optionally) featured-card hover at ≤ `0 1px 2px`; all grays warm; measure ≤ 680px
   in prose; animation only inside its panel.
3. `hugo build --gc --minify` clean; commit; fast-forward `gh-pages`.

---

## Explicitly rejected (so nobody re-adds them)

- Glassmorphism / backdrop blur — Cursor has none; it was our main "cheap" tell.
- Full-page animated backgrounds — contained art panels only.
- Bold-weight titles, >2 radii, hover lift-and-shadow on rows, red hover titles,
  emoji in headings (the wave stays out of the H1; it can live in the intro line).
- Card boxes for list items.
