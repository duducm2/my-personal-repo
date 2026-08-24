# Canonical personal data (CSV)

**Source of truth** for profile facts and role-variant wording. Edit these files; do **not** hand-edit generated resume `content.typ` or portfolio decks.

[`../my-data.json`](../my-data.json) is an **archive** (LinkedIn dump). Prefer updating CSVs here for new facts.

## Files

| File                     | Contents                                        |
| ------------------------ | ----------------------------------------------- |
| `profile.csv`            | Name, contact, location, languages              |
| `experience.csv`         | Jobs — official titles/dates only               |
| `experience_bullets.csv` | Bullets per `experience_id` × `variant`         |
| `skills.csv`             | Skills per `variant` × category                 |
| `education.csv`          | Degrees                                         |
| `publications.csv`       | Papers                                          |
| `additional.csv`         | Awards / misc                                   |
| `projects.csv`           | Case evidence (tooling, gates, metrics)         |
| `narratives.csv`         | Resume + portfolio copy per `variant` × `field` |

**Variants:** `general` | `product-owner`

Use `**bold**` in text fields. The generator maps that to Typst `#strong[]` for resumes and leaves Markdown bold for portfolio.

## Workflow

```bash
# Optional: re-seed CSVs from the built-in seed script (overwrites CSVs)
python scripts/seed_canonical_csv.py

# Generate resumes + portfolio content layer + decks from CSV
python scripts/generate_from_canonical.py

# Compile resumes
typst compile --root . --font-path resume/typst/fonts resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN.pdf
typst compile --root . --font-path resume/typst/fonts resume/variants/product-owner/main.typ output/product-owner/CV-Eduardo-Figueiredo-EN-product-owner.pdf
Copy-Item resume/CV-Eduardo-Figueiredo-EN.pdf output/general/ -Force

# Export portfolios
npx @marp-team/marp-cli@latest portfolio/portfolio-deck.md -o output/general/portfolio-deck.pdf --allow-local-files
npx @marp-team/marp-cli@latest portfolio/variants/product-owner/portfolio-deck.md -o output/product-owner/portfolio-deck-product-owner.pdf --allow-local-files
```

See also [`../../output/README.md`](../../output/README.md).

## Portfolio template

Layout/CSS live in [`../../portfolio/templates/portfolio-deck.template.md`](../../portfolio/templates/portfolio-deck.template.md) with `{{canonical:field}}` slots. Rebuild the template from the current general deck only if you change structure/CSS:

```bash
python scripts/build_portfolio_template.py
python scripts/generate_from_canonical.py
```

Generated narrative cache: [`../generated/portfolio/`](../generated/portfolio/).
