# Output — role-ready PDFs

**Single place for ready-to-send resume and portfolio PDFs.** When you need the latest CV or deck, look here — not under `resume/` or `portfolio/`.

**Canonical data:** [`../my-data/canonical/`](../my-data/canonical/) (CSV). Generate content first, then compile into this folder.

```
output/
  general/
  product-owner/
```

| Folder           | Resume PDF                                   | Portfolio PDF                      |
| ---------------- | -------------------------------------------- | ---------------------------------- |
| `general/`       | `CV-Eduardo-Figueiredo-EN.pdf`               | `portfolio-deck.pdf`               |
| `product-owner/` | `CV-Eduardo-Figueiredo-EN-product-owner.pdf` | `portfolio-deck-product-owner.pdf` |

## PDF policy (avoid duplicates)

| Location                         | Role                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **`output/`**                    | **Deliverables** — current general and product-owner resume + portfolio PDFs. Rebuild here after CSV or template changes.  |
| `resume/`                        | **Source only** — Typst `main.typ`, generated `content.typ`, layout refs. Do **not** keep compiled CV PDFs in this folder. |
| `portfolio/`                     | **Source only** — MARP markdown decks and templates. Do **not** keep compiled deck PDFs next to `portfolio-deck.md`.       |
| `portfolio/other-versions/`      | **Archived deck exports** (e.g. Bosch-internal, Guilherme layout) — historical variants, not current deliverables.         |
| `portfolio/mermaid/diagrams.pdf` | **Diagram export** from Mermaid sources — not a resume/portfolio deliverable.                                              |
| `lattes/my-articles/*.pdf`       | **Publication PDFs** — source papers for Lattes/CV citations.                                                              |
| `resume/refs/`                   | **Reference material** (e.g. legacy resume) — design/history only.                                                         |

Previously, general resume PDFs were also written to `resume/CV-Eduardo-Figueiredo-EN.pdf` and portfolio PDFs to `portfolio/portfolio-deck.pdf`. Those copies were redundant (or stale). **Compile straight into `output/`** using the commands below.

## Generate → compile → export

```bash
# 1) CSV → Typst content + portfolio decks
python scripts/generate_from_canonical.py

# 2) Resumes (write directly to output/)
typst compile --root . --font-path resume/typst/fonts resume/typst/main.typ output/general/CV-Eduardo-Figueiredo-EN.pdf
typst compile --root . --font-path resume/typst/fonts resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-EN-product-owner.pdf

# 3) Portfolios
npx @marp-team/marp-cli@latest portfolio/portfolio-deck.md -o output/general/portfolio-deck.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.md -o output/product-owner/portfolio-deck-product-owner.pdf --allow-local-files
```

For local Typst preview while editing layout, compile to a temp path (e.g. `/tmp/cv-preview.pdf`) — still treat `output/` as the canonical export location.

Full schema and edit rules: [`../my-data/canonical/README.md`](../my-data/canonical/README.md).

Do **not** edit generated `content.typ` or deck markdown for factual updates — change CSVs and re-run the generator.
