# Output — role-ready PDFs

Ready-to-send **resume** and **portfolio** PDFs, grouped by vacancy type. Editable sources stay under `resume/` and `portfolio/`; this folder is delivery only.

```
output/
  general/           # Current baseline (unchanged narrative)
  product-owner/     # Honest PO-focused wording; official titles kept
```

| Folder           | Resume PDF                                   | Portfolio PDF                      | Sources                                                                                                                                            |
| ---------------- | -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `general/`       | `CV-Eduardo-Figueiredo-EN.pdf`               | `portfolio-deck.pdf`               | [`resume/typst/`](../resume/typst/), [`portfolio/portfolio-deck.md`](../portfolio/portfolio-deck.md)                                               |
| `product-owner/` | `CV-Eduardo-Figueiredo-EN-product-owner.pdf` | `portfolio-deck-product-owner.pdf` | [`resume/variants/product-owner/`](../resume/variants/product-owner/), [`portfolio/variants/product-owner/`](../portfolio/variants/product-owner/) |

## Compile Product Owner resume

From repo root (Typst needs `--root` so the shared photo under `resume/typst/pictures/` resolves):

```bash
typst compile --root . --font-path resume/typst/fonts resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-EN-product-owner.pdf
```

## Export Product Owner portfolio

```bash
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.md -o output/product-owner/portfolio-deck-product-owner.pdf --allow-local-files
```

Or use **Marp: Export slide deck** in the editor on `portfolio/variants/product-owner/portfolio-deck.md`, then save/copy the PDF into `output/product-owner/`.

## Refresh general PDFs

Copy after regenerating from the general sources:

```bash
# PowerShell
Copy-Item resume/CV-Eduardo-Figueiredo-EN.pdf output/general/ -Force
Copy-Item portfolio/portfolio-deck.pdf output/general/ -Force
```

Do **not** edit general sources when preparing a role variant — add or edit under `variants/` instead.
