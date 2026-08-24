# Output — role-ready PDFs

Ready-to-send **resume** and **portfolio** PDFs, grouped by vacancy type.

**Canonical data:** [`../my-data/canonical/`](../my-data/canonical/) (CSV). Generate content first, then compile here.

```
output/
  general/
  product-owner/
```

| Folder           | Resume PDF                                   | Portfolio PDF                      |
| ---------------- | -------------------------------------------- | ---------------------------------- |
| `general/`       | `CV-Eduardo-Figueiredo-EN.pdf`               | `portfolio-deck.pdf`               |
| `product-owner/` | `CV-Eduardo-Figueiredo-EN-product-owner.pdf` | `portfolio-deck-product-owner.pdf` |

## Generate → compile → export

```bash
# 1) CSV → Typst content + portfolio decks
python scripts/generate_from_canonical.py

# 2) Resumes
typst compile --root . --font-path resume/typst/fonts resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN.pdf
typst compile --root . --font-path resume/typst/fonts resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-EN-product-owner.pdf
Copy-Item resume/CV-Eduardo-Figueiredo-EN.pdf output/general/ -Force

# 3) Portfolios
npx @marp-team/marp-cli@latest portfolio/portfolio-deck.md -o output/general/portfolio-deck.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.md -o output/product-owner/portfolio-deck-product-owner.pdf --allow-local-files
```

Full schema and edit rules: [`../my-data/canonical/README.md`](../my-data/canonical/README.md).

Do **not** edit generated `content.typ` or deck markdown for factual updates — change CSVs and re-run the generator.
