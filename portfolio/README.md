## Portfolio slide deck (MARP)

This folder contains a **code-based portfolio slide deck** built with **MARP** (Markdown → slides) and designed for live presentations and PDF export.

- **Deck file**: `portfolio-deck.md`
- **Technology**: [MARP](https://marp.app/) via Markdown (works well with VS Code + the Marp / Markdown Preview Enhanced extensions)
- **Assets**: artwork and charts under `../arts/`
- **Extra styling**: global PDF/preview tweaks under `.mume/style.less`

The deck is intentionally **more detailed than a resume**. It is structured into chapters (cover & stats, profile & strengths, professional experience & impact, CIP + UX quality gates, academic research & trust in AI/UI, tools & dashboards, innovation & awards, professional goals, personal interests, AI + agile proposal, and closing).

---

### How the MARP styling works

The top of `portfolio-deck.md` contains a MARP frontmatter block:

```markdown
---
marp: true
theme: default
paginate: true
title: "Eduardo Figueiredo – Portfolio"
author: "Eduardo Figueiredo"
style: |
  /* ChampionLeads-inspired slide layouts */
  section.lead { ... }
  section.art-top-right { ... }
  section.art-bottom-right-overflow { ... }
  section.compact-list ul { ... }
  section.quick-recall img { ... }
  section.flow-diagram-fit { ... }
  section.relevance-summary-with-doodle { ... }
---
```

These CSS rules are adapted from `references/ChampionLeads.md` and point to local images in `../arts/`. Slides opt into layouts using MARP’s `_class` comment:

```markdown
<!-- _class: lead -->
<!-- _class: compact-list -->
<!-- _class: quick-recall -->
<!-- _class: art-top-right compact-list -->
```

You can copy existing slides and change the text while keeping the same visual layout.

---

### Editing the deck

1. Open `portfolio-deck.md` in VS Code.
2. Make sure you have either:
   - The **Marp for VS Code** extension, or
   - **Markdown Preview Enhanced** configured to use Marp.
3. Start the slide preview (e.g. `Marp: Open Preview to the Side` from the Command Palette).
4. Edit content as normal Markdown; use `_class` comments to switch layouts or add new ones by reusing existing CSS classes.

Because this is MARP, regular Markdown tables, lists, and headings become slide content. Horizontal rules (`---` on their own line) separate slides.

---

### Exporting to PDF

With the Marp extension installed in VS Code:

1. Open `portfolio-deck.md`.
2. Run the command **“Marp: Export slide deck”** and choose **PDF**.
3. Ensure “include background images” / “print backgrounds” is enabled so art from `../arts/` appears.

If you use Markdown Preview Enhanced + Puppeteer instead, `.mume/style.less` provides footer and heading tweaks for consistent print layout; keep that file as-is unless you deliberately change the PDF styling.

---

### Adding or changing visuals

- Put new images in `../arts/` (or a subfolder).
- Reference them from slides using relative paths such as:

```markdown
<p><img src="../arts/art-5.png" alt="Hero art" /></p>
```

- If you need a new layout, either:
  - Reuse a class from `ChampionLeads.md` by copying its CSS into the `style:` block, or
  - Create a new CSS rule in the same `style:` block and then use it via `<!-- _class: your-class-name -->` on a slide.

This keeps the portfolio deck **code-based, reproducible, and easy to version-control** while staying visually aligned with the ChampionLeads aesthetic.

---

### Role variants & output PDFs

- **Canonical data:** [`../my-data/canonical/`](../my-data/canonical/) — edit CSVs, then `python scripts/generate_from_canonical.py`.
- **Template (layout/CSS):** [`templates/portfolio-deck.template.md`](templates/portfolio-deck.template.md) with `{{canonical:…}}` slots.
- **Generated decks:** [`portfolio-deck.md`](portfolio-deck.md) (general) and [`variants/product-owner/portfolio-deck.md`](variants/product-owner/portfolio-deck.md).
- **Ready-to-send PDFs:** [`../output/`](../output/) only — see [`../output/README.md`](../output/README.md). Do not export decks to `portfolio/portfolio-deck.pdf`.
