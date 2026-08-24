#!/usr/bin/env python3
"""Generate resume content.typ and portfolio decks from my-data/canonical/*.csv."""
from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
GENERATED = ROOT / "my-data" / "generated" / "portfolio"
TEMPLATE = ROOT / "portfolio" / "templates" / "portfolio-deck.template.md"

VARIANTS = ("general", "product-owner")
RESUME_OUT = {
    "general": ROOT / "resume" / "typst" / "content.typ",
    "product-owner": ROOT / "resume" / "variants" / "product-owner" / "content.typ",
}
DECK_OUT = {
    "general": ROOT / "portfolio" / "portfolio-deck.md",
    "product-owner": ROOT
    / "portfolio"
    / "variants"
    / "product-owner"
    / "portfolio-deck.md",
}
ASSET_PREFIX = {
    "general": "../",
    "product-owner": "../../../",
}

SLOT_RE = re.compile(r"\{\{canonical:([a-z0-9_]+)\}\}")
DEFAULT_LANG = "en"


def load_csv(name: str) -> list[dict[str, str]]:
    path = CANON / name
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def lang_col(row: dict[str, str], base: str, lang: str = DEFAULT_LANG) -> str:
    """Read bilingual column: prefers {base}_{lang}, falls back to legacy {base}."""
    return row.get(f"{base}_{lang}", "") or row.get(base, "")


def md_bold_to_typst(text: str) -> str:
    """Convert **bold** markdown to Typst #strong[bold]."""
    return re.sub(r"\*\*(.+?)\*\*", r"#strong[\1]", text)


def typst_inline(s: str) -> str:
    """Typst tuple string: commas inside quotes still split tuples — use content for those."""
    escaped = s.replace("\\", "\\\\").replace('"', '\\"')
    if "," in s:
        return f"[{s}]"
    return f'"{escaped}"'


def load_narratives(lang: str = DEFAULT_LANG) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = defaultdict(dict)
    for row in load_csv("narratives.csv"):
        out[row["variant"]][row["field"]] = lang_col(row, "text", lang)
    return out


def narrative(nars: dict[str, dict[str, str]], variant: str, field: str) -> str:
    if field not in nars.get(variant, {}):
        raise KeyError(f"Missing narratives.csv field: variant={variant} field={field}")
    return nars[variant][field]


def render_resume(
    variant: str, nars: dict[str, dict[str, str]], warnings: list[str], lang: str = DEFAULT_LANG
) -> str:
    profile = load_csv("profile.csv")[0]
    experience = sorted(load_csv("experience.csv"), key=lambda r: int(r["sort_order"]))
    bullets_all = load_csv("experience_bullets.csv")
    skills_all = [r for r in load_csv("skills.csv") if r["variant"] == variant]
    education = sorted(load_csv("education.csv"), key=lambda r: int(r["sort_order"]))
    publications = sorted(
        load_csv("publications.csv"), key=lambda r: int(r["sort_order"])
    )
    additional = sorted(load_csv("additional.csv"), key=lambda r: int(r["sort_order"]))

    exp_ids = {r["id"] for r in experience}
    for b in bullets_all:
        if b["experience_id"] not in exp_ids:
            warnings.append(f"Unknown experience_id in bullets: {b['experience_id']}")

    header_note = (
        "GENERATED from my-data/canonical — do not edit by hand.\n"
        f"// Variant: {variant}, lang: {lang}. Re-run: python scripts/generate_from_canonical.py"
    )

    tagline = narrative(nars, variant, "tagline")
    profile_text = md_bold_to_typst(narrative(nars, variant, "profile"))

    core = sorted(
        [r for r in skills_all if r["category"] == "Core"],
        key=lambda r: int(r["sort_order"]),
    )
    tech = sorted(
        [r for r in skills_all if r["category"] == "Tech"],
        key=lambda r: int(r["sort_order"]),
    )
    if not core:
        warnings.append(f"No Core skills for variant={variant}")
    core_label = lang_col(core[0], "category_label", lang) + ":" if core else "Core:"
    tech_label = lang_col(tech[0], "category_label", lang) + ":" if tech else "Tech:"
    core_tuple = ", ".join(f'"{lang_col(s, "label", lang)}"' for s in core)
    tech_tuple = ", ".join(f'"{lang_col(s, "label", lang)}"' for s in tech)

    exp_blocks: list[str] = []
    for exp in experience:
        bs = sorted(
            [
                r
                for r in bullets_all
                if r["experience_id"] == exp["id"] and r["variant"] == variant
            ],
            key=lambda r: int(r["sort_order"]),
        )
        if not bs:
            warnings.append(f"No bullets for {exp['id']} variant={variant}")
        bullet_lines = ",\n    ".join(
            f"[{md_bold_to_typst(lang_col(b, 'text', lang))}]" for b in bs
        )
        exp_blocks.append(
            f'  ("{lang_col(exp, "date_display", lang)}", "{exp["company"]}", "{lang_col(exp, "title", lang)}", (\n'
            f"    {bullet_lines},\n"
            f"  ))"
        )
    experience_typst = ",\n".join(exp_blocks)

    edu_blocks: list[str] = []
    for edu in education:
        detail = lang_col(edu, "detail", lang).strip()
        if detail:
            detail_typst = f"[{md_bold_to_typst(detail)}]"
        else:
            detail_typst = "none"
        edu_blocks.append(
            f'  ({typst_inline(lang_col(edu, "degree", lang))}, {typst_inline(lang_col(edu, "institution", lang))}, {detail_typst})'
        )
    education_typst = ",\n".join(edu_blocks)

    pub_lines = []
    for p in publications:
        cite = lang_col(p, "citation", lang).replace("\\", "\\\\").replace('"', '\\"')
        pub_lines.append(f'  ("{lang_col(p, "venue", lang)}", "{cite}")')
    publications_typst = ",\n".join(pub_lines)

    add_lines = ",\n".join(f"  [{lang_col(a, 'text', lang)}]" for a in additional)

    return f"""// =============================================================================
// {header_note}
// Layout: main.typ (do not change layout here).
// =============================================================================

#let name = "{profile['display_name']}"
#let tagline = "{tagline}"
#let phone = "{profile['phone']}"
#let email = "{profile['email']}"
#let linkedin = "{lang_col(profile, 'linkedin_label', lang)}"
#let linkedin-url = "{profile['linkedin_url']}"
#let lattes = "{lang_col(profile, 'lattes_label', lang)}"
#let lattes-url = "{profile['lattes_url']}"
#let orcid = "{lang_col(profile, 'orcid_label', lang)}"
#let orcid-url = "{profile['orcid_url']}"
#let location = "{lang_col(profile, 'location', lang)}"

#let profile = [
  {profile_text}
]

#let languages = "{lang_col(profile, 'languages', lang)}"

#let skills = (
  ("{core_label}", ({core_tuple})),
  ("{tech_label}", ({tech_tuple})),
)

#let experience = (
{experience_typst},
)

#let education = (
{education_typst},
)

#let publications = (
{publications_typst},
)

#let additional = (
{add_lines},
)
"""


def build_slot_map(
    variant: str, nars: dict[str, dict[str, str]], lang: str = DEFAULT_LANG
) -> dict[str, str]:
    profile = load_csv("profile.csv")[0]
    prefix = ASSET_PREFIX[variant]
    location = lang_col(profile, "location", lang)
    slots = {
        "asset_prefix": prefix,
        "deck_title": narrative(nars, variant, "deck_title"),
        "why_h1": narrative(nars, variant, "why_h1"),
        "why_h2": narrative(nars, variant, "why_h2"),
        "why_bullets": narrative(nars, variant, "why_bullets"),
        "who_name": profile["display_name"],
        "who_role": narrative(nars, variant, "who_role"),
        "who_impact": narrative(nars, variant, "who_impact"),
        "present_h2": narrative(nars, variant, "present_h2"),
        "present_table": narrative(nars, variant, "present_table"),
        "cip_pipeline_h2": narrative(nars, variant, "cip_pipeline_h2"),
        "relevance_h2": narrative(nars, variant, "relevance_h2"),
        "csi_h2": narrative(nars, variant, "csi_h2"),
        "tooling_h2": narrative(nars, variant, "tooling_h2"),
        "tooling_bullet": narrative(nars, variant, "tooling_bullet"),
        "future_h2": narrative(nars, variant, "future_h2"),
        "future_intro": narrative(nars, variant, "future_intro"),
        "future_diagram_alt": narrative(nars, variant, "future_diagram_alt"),
        "future_career_style": narrative(nars, variant, "future_career_style"),
        "future_career_body": narrative(nars, variant, "future_career_body").replace(
            "{{canonical:asset_prefix}}", prefix
        ),
        "closing_summary": narrative(nars, variant, "closing_summary"),
        "email": profile["email"],
        "linkedin_url": profile["linkedin_url"],
        "linkedin_display": profile["linkedin_url"].replace("https://www.", ""),
        "lattes_url": profile["lattes_url"],
        "orcid_url": profile["orcid_url"],
        "phone": profile["phone"],
    }
    loc_display = location.replace(" - ", " – ")
    slots["who_contact"] = (
        f"{loc_display} · {profile['email']} · "
        f"[LinkedIn]({profile['linkedin_url']}) · "
        f"[Lattes]({profile['lattes_url']}) · "
        f"[ORCID]({profile['orcid_url']}) · +55 19 98176-6583"
    )
    return slots


def write_narrative_yaml(variant: str, slots: dict[str, str]) -> None:
    out_dir = GENERATED / variant
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "narrative.yaml"
    # Minimal YAML without PyYAML dependency
    lines = ["# GENERATED — portfolio content layer", f"variant: {variant}", "fields:"]
    for key, val in sorted(slots.items()):
        escaped = val.replace("\\", "\\\\").replace('"', '\\"')
        if "\n" in val:
            lines.append(f"  {key}: |")
            for ln in val.splitlines():
                lines.append(f"    {ln}")
        else:
            lines.append(f'  {key}: "{escaped}"')
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def merge_template(variant: str, slots: dict[str, str], warnings: list[str]) -> str:
    if not TEMPLATE.exists():
        raise FileNotFoundError(f"Missing template: {TEMPLATE}")
    text = TEMPLATE.read_text(encoding="utf-8")

    def repl(m: re.Match[str]) -> str:
        key = m.group(1)
        if key not in slots:
            warnings.append(f"Template slot missing in data: {key} (variant={variant})")
            return m.group(0)
        return slots[key]

    result = SLOT_RE.sub(repl, text)
    leftover = SLOT_RE.findall(result)
    for key in leftover:
        warnings.append(f"Unresolved slot after merge: {key} (variant={variant})")
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate resume and portfolio from canonical CSV")
    parser.add_argument(
        "--lang",
        choices=("en", "pt"),
        default=DEFAULT_LANG,
        help="Language column suffix to use (default: en)",
    )
    args = parser.parse_args()
    lang = args.lang

    if not (CANON / "profile.csv").exists():
        print(
            "Canonical CSVs missing. Run: python scripts/seed_canonical_csv.py",
            file=sys.stderr,
        )
        return 1

    warnings: list[str] = []
    nars = load_narratives(lang)

    for variant in VARIANTS:
        resume_path = RESUME_OUT[variant]
        resume_path.parent.mkdir(parents=True, exist_ok=True)
        resume_path.write_text(
            render_resume(variant, nars, warnings, lang), encoding="utf-8"
        )
        print(f"wrote {resume_path.relative_to(ROOT)}")

        slots = build_slot_map(variant, nars, lang)
        write_narrative_yaml(variant, slots)
        print(f"wrote {GENERATED.relative_to(ROOT)}/{variant}/narrative.yaml")

        if TEMPLATE.exists():
            deck = merge_template(variant, slots, warnings)
            out = DECK_OUT[variant]
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(deck, encoding="utf-8")
            print(f"wrote {out.relative_to(ROOT)}")
        else:
            warnings.append(f"Skip deck merge — template missing: {TEMPLATE}")

    if warnings:
        print("\nConsistency report:")
        for w in warnings:
            print(f"  - {w}")
    else:
        print("\nConsistency report: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
