# Output — role-ready PDFs (EN + PT)

**Single place for ready-to-send resume and portfolio PDFs** in English and Portuguese. When you need the latest CV or deck, look here — not under `resume/` or `portfolio/`.

**Canonical data:** [`../my-data/canonical/`](../my-data/canonical/) (CSV). Generate content first, then compile into this folder.

```
output/
  general/
  product-owner/
```

## Deliverables (8 PDFs)

| Folder           | Language | Resume                                       | Portfolio                             |
| ---------------- | -------- | -------------------------------------------- | ------------------------------------- |
| `general/`       | EN       | `CV-Eduardo-Figueiredo-EN.pdf`               | `portfolio-deck-EN.pdf`               |
| `general/`       | PT       | `CV-Eduardo-Figueiredo-PT.pdf`               | `portfolio-deck-PT.pdf`               |
| `product-owner/` | EN       | `CV-Eduardo-Figueiredo-EN-product-owner.pdf` | `portfolio-deck-product-owner-EN.pdf` |
| `product-owner/` | PT       | `CV-Eduardo-Figueiredo-PT-product-owner.pdf` | `portfolio-deck-product-owner-PT.pdf` |

## Build (recommended)

From the repo root:

```bash
python scripts/build_outputs.py
```

This runs: CSV → `content.{en,pt}.typ` + `portfolio-deck.{en,pt}.md` → audit → compile all 8 PDFs.

Options:

```bash
python scripts/build_outputs.py --lang en    # English PDFs only
python scripts/build_outputs.py --lang pt    # Portuguese PDFs only
python scripts/build_outputs.py --skip-generate   # compile existing sources only
```

## PDF policy (avoid duplicates)

| Location                         | Role                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **`output/`**                    | **Deliverables** — current general and product-owner resume + portfolio PDFs (EN and PT). Rebuild here after CSV or template changes.       |
| `resume/`                        | **Source only** — Typst layout (`main.typ`), generated `content.{en,pt}.typ`. Do **not** keep compiled CV PDFs here.                        |
| `portfolio/`                     | **Source only** — MARP markdown `portfolio-deck.{en,pt}.md` and templates. Do **not** keep compiled deck PDFs next to the markdown sources. |
| `portfolio/other-versions/`      | **Archived deck exports** — historical variants, not current deliverables.                                                                  |
| `portfolio/mermaid/diagrams.pdf` | **Diagram export** — not a resume/portfolio deliverable.                                                                                    |
| `lattes/my-articles/*.pdf`       | **Publication PDFs** — source papers for Lattes/CV citations.                                                                               |
| `resume/refs/`                   | **Reference material** — design/history only.                                                                                               |

## Manual steps (if not using `build_outputs.py`)

```bash
# 1) CSV → Typst + portfolio decks (both languages)
python scripts/generate_from_canonical.py --lang all

# 2) Resumes
typst compile --root . --font-path resume/typst/fonts --input content=content.en.typ resume/typst/main.typ output/general/CV-Eduardo-Figueiredo-EN.pdf
typst compile --root . --font-path resume/typst/fonts --input content=content.pt.typ resume/typst/main.typ output/general/CV-Eduardo-Figueiredo-PT.pdf
typst compile --root . --font-path resume/typst/fonts --input content=content.en.typ resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-EN-product-owner.pdf
typst compile --root . --font-path resume/typst/fonts --input content=content.pt.typ resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-PT-product-owner.pdf

# 3) Portfolios
npx @marp-team/marp-cli@latest portfolio/portfolio-deck.en.md -o output/general/portfolio-deck-EN.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/portfolio-deck.pt.md -o output/general/portfolio-deck-PT.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.en.md -o output/product-owner/portfolio-deck-product-owner-EN.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.pt.md -o output/product-owner/portfolio-deck-product-owner-PT.pdf --allow-local-files
```

Full schema and edit rules: [`../my-data/canonical/README.md`](../my-data/canonical/README.md).

Do **not** edit generated `content.*.typ` or deck markdown for factual updates — change CSVs and re-run the generator.
