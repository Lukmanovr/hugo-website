# rustam-lukmanov.com

Personal site and blog of Rustam Lukmanov. Built with [Hugo](https://gohugo.io) and the
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (git submodule), with a
custom animated homepage (self-hosted p5.js + Vanta "trunk").

## Prerequisites

- Hugo **extended**, v0.164+ (`brew install hugo`)
- Git with submodules

## Local development

```bash
git clone --recurse-submodules <repo-url>
cd hugo-website
hugo server          # http://localhost:1313
```

If `themes/PaperMod` is empty: `git submodule update --init`.

## Deployment

Pushing to `main` triggers `.github/workflows/hugo.yml`, which builds the site and
deploys it to GitHub Pages. Never commit `public/` — it is build output and gitignored.

## Authoring

- Posts live in `content/posts/`, kebab-case filenames. New posts: `hugo new posts/my-post.md`.
- If you rename a published post, add `aliases: ["/posts/old-slug/"]` to its front matter.
- Images: prefer WebP, keep files under ~200 KB.
- Interactive demos are standalone HTML files in `static/` embedded via
  `<iframe loading="lazy" …>`; pin any CDN scripts they use to exact versions.

## Customization map

All customization lives outside the theme submodule:

- `hugo.yaml` — single site config (theme params, menu, analytics ID)
- `layouts/_partials/home_info.html` — homepage hero + lazy Vanta background loader
- `layouts/_partials/extend_head.html` — GA4 (production only) + Speculation Rules
- `assets/js/vanta-init.js` — Vanta trunk effect settings (color, chaos, spacing)
- `assets/js/vendor/` — pinned, self-hosted p5.js and vanta.trunk
- `assets/css/extended/custom.css` — every style delta on top of PaperMod: design
  tokens (accent, fluid type), sticky glass header, glass hero card, post-card hover,
  scroll-driven progress bar / blur, view transitions, theme-aware logo swap

The theme itself is untouched; update it with
`git submodule update --remote themes/PaperMod` and rebuild.
