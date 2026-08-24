# Resume Workflow: Code-Based CV (Typst)

This guide sets up a **code-driven resume** that replicates the visual design of `CV Ref.pdf` using **Typst**. Content lives in `typst/content.typ`; layout and grid are fixed in `typst/main.typ`.

---

## 1. Analysis Summary (Ref PDF vs Current MD)

- **Visual hierarchy:** See `RESUME-LAYOUT-ANALYSIS.md` for a full comparison. In short: ref uses an asymmetrical **32% / 68%** two-column grid, uppercase section titles, date-first experience entries, and nested skill lists.
- **Content source:** Use the data already migrated into `typst/content.typ` (from `CV-Eduardo-Figueiredo-EN.md`). Design reference is `CV Ref.pdf`.
- **AI safety:** Only `typst/content.typ` should be edited for resume _content_. Do not change `typst/main.typ` for copy or structure—that file defines the grid and typography.

---

## 2. Tools and Extensions

| Tool                                    | Purpose                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| **Typst**                               | CLI compiler; install from [typst.app](https://typst.app) or `cargo install typst-cli`. |
| **Tinymist (VS Code / Cursor)**         | LSP + real-time preview. Install from the marketplace: search "Typst" or "Tinymist".    |
| **Optional: Live Preview / Playwright** | Only if you add the HTML/Tailwind alternative later; not required for Typst.            |

---

## 3. Step-by-Step Setup

### 3.1 Install Typst

- **Windows (scoop):** `scoop install typst`
- **Or:** Download the latest release from [GitHub](https://github.com/typst/typst/releases) and add the binary to your PATH.

Verify:

```bash
typst --version
```

### 3.2 Install Tinymist in Cursor/VS Code

1. Open the Extensions view (`Ctrl+Shift+X`).
2. Search for **"Typst"** or **"Tinymist"**.
3. Install the Tinymist extension (LSP + preview).
4. Reload the editor if prompted.

### 3.3 Project Layout

```
resume/
├── CV Ref.pdf              # Visual reference (do not edit)
├── CV-Eduardo-Figueiredo-EN.md   # Legacy/source content
├── typst/
│   ├── main.typ            # LAYOUT ONLY — grid, typography, section order
│   └── content.typ         # CONTENT ONLY — edit this for resume updates
├── RESUME-LAYOUT-ANALYSIS.md
└── SETUP-RESUME-WORKFLOW.md (this file)
```

### 3.4 Compile the PDF

From the repo root or from `resume/`:

```bash
typst compile resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN-typst.pdf
```

**If using the Lato font:** Put Lato `.ttf` files in `resume/typst/fonts/` (see that folder’s README), then compile with:

```bash
typst compile --font-path resume/typst/fonts resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN-typst.pdf
```

Watch mode (recompile on save):

```bash
typst watch resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN-typst.pdf
```

### 3.5 Editing Content Only

- **Canonical source:** edit CSVs under [`../../my-data/canonical/`](../../my-data/canonical/), then run `python scripts/generate_from_canonical.py`.
- Generated files: `typst/content.typ` (general) and `variants/product-owner/content.typ` — do not hand-edit for routine updates.
- Do **not** change `main.typ` when updating copy—that file controls the 32/68 grid and typography.

### 3.5a Role variants (Product Owner)

- Variant wording lives in `narratives.csv`, `experience_bullets.csv`, and `skills.csv` (`variant=product-owner`).
- Compile / export to `output/` — see [`../../output/README.md`](../../output/README.md) and [`../../my-data/canonical/README.md`](../../my-data/canonical/README.md).

### 3.6 Fonts (Optional)

`main.typ` uses `Linux Libertine` by default. If it’s missing, Typst falls back. To match the ref more closely:

- Install [Linux Libertine](https://sourceforge.net/projects/linuxlibertine/) system-wide, or
- Change the font in `main.typ` to one you have (e.g. `"Liberation Serif"` or `"Times New Roman"`).

---

## 4. Alternative: HTML + Tailwind + Paged.js

If you prefer a web stack instead of Typst:

1. **Stack:** HTML5, Tailwind CSS v4 (with print utilities), Paged.js for pagination.
2. **Grid:** Use fixed column classes (e.g. `w-1/3` and `w-2/3` or explicit `32%` / `68%`). Do **not** use arbitrary widths that break the ratio.
3. **Print:** Use `@media print` and Paged.js to control page breaks and, if desired, sidebar background.
4. **AI constraint:** Add a `.cursorrules` entry (see below) that forbids changing grid classes or layout structure when editing content.

The Typst workflow is the **primary** recommendation for “delightful” typography and stable layout; the HTML path is a valid fallback for web-centric workflows.

---

## 5. Output Checklist

- [ ] Typst installed and on PATH.
- [ ] Tinymist extension installed; preview works for `main.typ`.
- [ ] `typst compile` produces a PDF from `typst/main.typ`.
- [ ] Content edits are made only in `content.typ`; `main.typ` is left unchanged for routine updates.
- [ ] `.cursorrules` (or project rules) configured so the AI only modifies resume content in `content.typ` and does not alter grid or layout in `main.typ`.
