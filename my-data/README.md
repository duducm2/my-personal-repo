# Personal data

- **Canonical (edit here):** [`canonical/`](canonical/) — modular CSV source of truth with **EN/PT labels** (`schema.csv`, `field_labels.csv`, `*_en` / `*_pt` columns).
- **Archive:** [`my-data.json`](my-data.json) — LinkedIn-derived dump; do not use for new facts.
- **Generated cache:** [`generated/portfolio/`](generated/portfolio/) — narrative YAML from the generator.

Generate with language: `python scripts/generate_from_canonical.py --lang en` or `--lang pt`.
