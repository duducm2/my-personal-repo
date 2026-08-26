# Canonical personal data (CSV)

**Source of truth** for profile facts and role-variant wording. Edit these files; do **not** hand-edit generated resume `content.typ` or portfolio decks.

[`../my-data.json`](../my-data.json) is an **archive** (LinkedIn dump). Prefer updating CSVs here for new facts.

## Bilingual labels (EN / PT)

All data files use **paired columns** `_en` and `_pt` for human-facing strings. Structural keys (`id`, `variant`, `field`, URLs) stay language-neutral.

| Registry file                          | Purpose                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`schema.csv`](schema.csv)             | Bilingual **column labels** for every field in every data file                            |
| [`field_labels.csv`](field_labels.csv) | Bilingual **key labels** (variants, narrative fields, skill categories, resume UI chrome) |

Generator default: both languages — `python scripts/generate_from_canonical.py` (same as `--lang all`).  
Single language: `--lang en` or `--lang pt`.

Generated artifacts per language:

- `resume/typst/content.{en,pt}.typ` (+ PO variant paths)
- `portfolio/portfolio-deck.{en,pt}.md` (+ PO variant paths)
- Legacy EN copies: `content.typ`, `portfolio-deck.md` (for editor convenience)

After changing column structure, run: `python scripts/migrate_bilingual_labels.py` (only if migrating from legacy single-language columns).

## Data files

| File                     | Contents                                                      |
| ------------------------ | ------------------------------------------------------------- |
| `profile.csv`            | Name, contact, location_en/pt, languages_en/pt                |
| `experience.csv`         | Jobs — titles and date display in EN/PT                       |
| `experience_bullets.csv` | Bullets per role × variant (`text_en`, `text_pt`)             |
| `skills.csv`             | Skills with `category_label_en/pt`, `label_en/pt`             |
| `education.csv`          | Degrees (`degree_en/pt`, `institution_en/pt`, `detail_en/pt`) |
| `publications.csv`       | Papers (`venue_en/pt`, `citation_en/pt`)                      |
| `additional.csv`         | Awards / misc (`text_en/pt`)                                  |
| `projects.csv`           | Case evidence (`name_en/pt`, `summary_en/pt`, `notes_en/pt`)  |
| `narratives.csv`         | Resume + portfolio copy (`label_en/pt`, `text_en/pt`)         |

**Variants:** `general` | `product-owner` | `data-scientist` (see `field_labels.csv` for bilingual variant names)

Use `**bold**` in text fields. The generator maps that to Typst `#strong[]` for resumes and leaves Markdown bold for portfolio.

## Workflow

```bash
python scripts/build_outputs.py
```

This generates EN+PT sources, audits CSVs, and compiles all 12 PDFs into [`../../output/`](../../output/). See [`../../output/README.md`](../../output/README.md).

Generate sources only (no PDF compile):

```bash
python scripts/generate_from_canonical.py --lang all
python scripts/audit_canonical_data.py
```

## Portfolio template

Layout/CSS live in [`../../portfolio/templates/portfolio-deck.template.md`](../../portfolio/templates/portfolio-deck.template.md) with `{{canonical:…}}` slots.

Generated narrative cache: [`../generated/portfolio/`](../generated/portfolio/).
