#!/usr/bin/env python3
"""Generate resume content.typ and portfolio decks from my-data/canonical/*.csv."""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
GENERATED = ROOT / "my-data" / "generated" / "portfolio"
TEMPLATE = ROOT / "portfolio" / "templates" / "portfolio-deck.template.md"

VARIANTS = (
    "ux-researcher",
    "general",
    "product-owner",
    "data-analyst",
    "digital-solution-architect",
)
RESUME_DIR = {
    "ux-researcher": ROOT / "resume" / "variants" / "ux-researcher",
    "general": ROOT / "resume" / "typst",
    "product-owner": ROOT / "resume" / "variants" / "product-owner",
    "data-analyst": ROOT / "resume" / "variants" / "data-analyst",
    "digital-solution-architect": ROOT
    / "resume"
    / "variants"
    / "digital-solution-architect",
}
DECK_DIR = {
    "ux-researcher": ROOT / "portfolio" / "variants" / "ux-researcher",
    "general": ROOT / "portfolio",
    "product-owner": ROOT / "portfolio" / "variants" / "product-owner",
    "data-analyst": ROOT / "portfolio" / "variants" / "data-analyst",
    "digital-solution-architect": ROOT
    / "portfolio"
    / "variants"
    / "digital-solution-architect",
}
ASSET_PREFIX = {
    "ux-researcher": "../../../",
    "general": "../",
    "product-owner": "../../../",
    "data-analyst": "../../../",
    "digital-solution-architect": "../../../",
}
# Shared pictures/diagrams stem for the Future method slide (lang suffix added in template).
FUTURE_METHOD_DIAGRAM = {
    "ux-researcher": "ai-agile-research-ux-researcher",
    "general": "ai-agile-research",
    "data-analyst": "ai-agile-research",
    "product-owner": "ai-agile-research-product-owner",
    "digital-solution-architect": "ai-agile-research-digital-solution-architect",
}

SLOT_RE = re.compile(r"\{\{canonical:([a-z0-9_]+)\}\}")
LANGS = ("en", "pt")
DEFAULT_LANG = "en"


def load_csv(name: str) -> list[dict[str, str]]:
    path = CANON / name
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def lang_col(row: dict[str, str], base: str, lang: str = DEFAULT_LANG) -> str:
    """Read bilingual column: prefers {base}_{lang}, falls back to legacy {base}."""
    return row.get(f"{base}_{lang}", "") or row.get(base, "")


def load_resume_ui(lang: str) -> dict[str, str]:
    rows = [r for r in load_csv("field_labels.csv") if r["domain"] == "resume_ui"]
    return {r["key"]: lang_col(r, "label", lang) for r in rows}


def md_bold_to_typst(text: str) -> str:
    """Convert **bold** markdown to Typst #strong[bold]."""
    return re.sub(r"\*\*(.+?)\*\*", r"#strong[\1]", text)


def typst_profile_blocks(text: str, lang: str = DEFAULT_LANG) -> str:
    """Split profile into two Typst blocks with vertical gap (not line leading)."""
    gap = "0.35em" if lang == "pt" else "0.5em"
    for sep, lead in ((". Uses ", "Uses "), (". **Uso** ", "**Uso** ")):
        if sep in text:
            first, second = text.split(sep, 1)
            return (
                f"{md_bold_to_typst(first.strip())}. #v({gap}) "
                f"{md_bold_to_typst(lead + second.strip())}"
            )
    return md_bold_to_typst(text)


def typst_dense_lines(
    text: str, separator: str = "; ", lang: str = DEFAULT_LANG
) -> str:
    """Break long prose into stacked blocks separated by vertical margin."""
    gap = "0.28em" if lang == "pt" else "0.42em"
    converted = md_bold_to_typst(text)
    if separator not in converted:
        return converted
    parts = [p.strip() for p in converted.split(separator) if p.strip()]
    return f" #v({gap}) ".join(parts)


def typst_inline(s: str) -> str:
    """Typst tuple string: commas inside quotes still split tuples — use content for those."""
    if "," in s:
        return f"[{s}]"
    escaped = s.replace("\\", "\\\\").replace('"', '\\"')
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


def resume_out_path(variant: str, lang: str) -> Path:
    return RESUME_DIR[variant] / f"content.{lang}.typ"


def deck_out_path(variant: str, lang: str) -> Path:
    base = "portfolio-deck" if variant == "general" else "portfolio-deck"
    return DECK_DIR[variant] / f"{base}.{lang}.md"


PRIORITY_DIR = ROOT / "my-data" / "generated" / "resume-priority"


def typst_string_tuple(labels: list[str]) -> str:
    """Typst array literal body. A one-item array needs a trailing comma."""
    if not labels:
        return ""
    quoted = []
    for label in labels:
        safe = label.replace("\\", "\\\\").replace('"', '\\"')
        quoted.append(f'"{safe}"')
    body = ", ".join(quoted)
    if len(labels) == 1:
        body += ","
    return body


def topic_id_bullet(row: dict[str, str]) -> str:
    return f"bullet:{row['experience_id']}:{row['variant']}:{row['sort_order']}"


def topic_id_skill(row: dict[str, str]) -> str:
    return f"skill:{row['variant']}:{row['category']}:{row['sort_order']}"


def topic_id_extra(row: dict[str, str]) -> str:
    return f"extra:{row['sort_order']}"


def load_omitted(variant: str) -> set[str]:
    path = PRIORITY_DIR / f"{variant}.json"
    if not path.is_file():
        return set()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return set()
    return {item["id"] for item in data.get("deprioritized", []) if item.get("id")}


def render_resume(
    variant: str,
    nars: dict[str, dict[str, str]],
    warnings: list[str],
    lang: str = DEFAULT_LANG,
    omit: set[str] | None = None,
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
    ui = load_resume_ui(lang)
    if omit is None:
        omit = load_omitted(variant)

    exp_ids = {r["id"] for r in experience}
    for b in bullets_all:
        if b["experience_id"] not in exp_ids:
            warnings.append(f"Unknown experience_id in bullets: {b['experience_id']}")

    header_note = (
        "GENERATED from my-data/canonical — do not edit by hand.\n"
        f"// Variant: {variant}, lang: {lang}. Re-run: python scripts/generate_from_canonical.py"
    )

    tagline = narrative(nars, variant, "tagline")
    profile_text = typst_profile_blocks(narrative(nars, variant, "profile"), lang)
    compact_layout = True  # Hard rule: all resumes target a single A4 page.

    core = sorted(
        [
            r
            for r in skills_all
            if r["category"] == "Core" and topic_id_skill(r) not in omit
        ],
        key=lambda r: int(r["sort_order"]),
    )
    tech = sorted(
        [
            r
            for r in skills_all
            if r["category"] == "Tech" and topic_id_skill(r) not in omit
        ],
        key=lambda r: int(r["sort_order"]),
    )
    if not core:
        warnings.append(f"No Core skills for variant={variant}")
    core_label = lang_col(core[0], "category_label", lang) + ":" if core else "Core:"
    tech_label = lang_col(tech[0], "category_label", lang) + ":" if tech else "Tech:"
    core_tuple = typst_string_tuple([lang_col(s, "label", lang) for s in core])
    tech_tuple = typst_string_tuple([lang_col(s, "label", lang) for s in tech])

    exp_blocks: list[str] = []
    for exp in experience:
        raw_bs = sorted(
            [
                r
                for r in bullets_all
                if r["experience_id"] == exp["id"] and r["variant"] == variant
            ],
            key=lambda r: int(r["sort_order"]),
        )
        bs = [row for row in raw_bs if topic_id_bullet(row) not in omit]
        if not raw_bs:
            warnings.append(f"No bullets for {exp['id']} variant={variant}")
        if not bs:
            continue
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
            detail_typst = f"[{typst_dense_lines(detail, lang=lang)}]"
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

    add_lines = ",\n".join(
        f"  [{lang_col(a, 'text', lang)}]"
        for a in additional
        if topic_id_extra(a) not in omit
    )

    ui_fields = "\n".join(
        f'  {key.replace("-", "_")}: "{val.replace(chr(92), chr(92)*2).replace(chr(34), chr(92)+chr(34))}",'
        for key, val in ui.items()
    )

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
#let compact-layout = {str(compact_layout).lower()}

#let ui = (
{ui_fields}
)

#let profile = [
  {profile_text}
]

#let languages = "{lang_col(profile, 'languages', lang)}"

#let skills = (
  ("Core", "{core_label}", ({core_tuple})),
  ("Tech", "{tech_label}", ({tech_tuple})),
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


def load_portfolio_images() -> list[dict[str, str]]:
    path = CANON / "portfolio_images.csv"
    if not path.is_file():
        return []
    with path.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_portfolio_image_tags(
    images: list[dict[str, str]],
    project_id: str,
    category: str | None,
    prefix: str,
    lang: str,
) -> list[str]:
    selected = [
        img
        for img in images
        if (img.get("project_id") or "").strip() == project_id
        and (category is None or (img.get("category") or "").strip() == category)
        and (img.get("selected") or "").strip().lower() in ("true", "1", "yes")
    ]
    selected.sort(key=lambda x: int(x.get("sort_order") or 999))
    tags = []
    caption_key = f"caption_{lang}"
    for img in selected:
        caption = img.get(caption_key) or img.get("caption_en") or ""
        p = f"{prefix}{img.get('path')}"
        tags.append(f'<p><img src="{p}" alt="{caption}" /></p>')
    return tags


def build_slot_map(
    variant: str, nars: dict[str, dict[str, str]], lang: str = DEFAULT_LANG
) -> dict[str, str]:
    profile = load_csv("profile.csv")[0]
    prefix = ASSET_PREFIX[variant]
    location = lang_col(profile, "location", lang)
    images = load_portfolio_images()

    tooling_proto_tags = build_portfolio_image_tags(
        images, "tooling-pt", "prototype", prefix, lang
    )
    if not tooling_proto_tags:
        tooling_proto_tags = [
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-1.png" alt="Tooling project for PT – wireframe or early concept" /></p>',
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-2.png" alt="Tooling project for PT – low-fidelity prototype" /></p>',
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-3.png" alt="Tooling project for PT – high-fidelity prototype" /></p>',
        ]

    tooling_ws_tags = build_portfolio_image_tags(
        images, "tooling-pt", "workshop", prefix, lang
    )
    if not tooling_ws_tags:
        tooling_ws_tags = [
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-4.jpg" alt="Tooling customer check-in" /></p>',
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-5.jpg" alt="Tooling co-design" /></p>',
            f'<p><img src="{prefix}pictures/work/tooling-project/tooling-6.jpg" alt="Tooling prototype review" /></p>',
        ]

    astra_tags = build_portfolio_image_tags(
        images, "agritech-iot-cattle", None, prefix, lang
    )
    if not astra_tags:
        astra_tags = [
            f'<p><img src="{prefix}pictures/work/astra-project/IMG-20260414-WA0003.jpg" alt="Fazenda Sindi da Porangaba" /></p>',
            f'<p><img src="{prefix}pictures/work/astra-project/IMG_20260415_182229.jpg" alt="Bosch Astra IoT Telemetry" /></p>',
        ]

    cip_tags = build_portfolio_image_tags(
        images, "cip-research-gate", "artifact", prefix, lang
    )
    if not cip_tags:
        # Default fallback if unconfigured
        cip_tags = [
            f'<p><img src="{prefix}pictures/work/cip-ux/cip-ux-1.png" alt="CIP-Applied Research 1 – Report cover" /></p>',
            f'<p><img src="{prefix}pictures/work/cip-ux/cip-ux-2.png" alt="CIP-Applied Research 2 – Summary and executive findings" /></p>',
            f'<p><img src="{prefix}pictures/work/cip-ux/cip-ux-3.png" alt="CIP-Applied Research 3 – Context and methodology" /></p>',
            f'<p><img src="{prefix}pictures/work/cip-ux/cip-ux-4.png" alt="CIP-Applied Research 4 – Literature review and benchmark" /></p>',
            f'<p class="cip-artifacts-large"><img src="{prefix}pictures/work/cip-ux/cip-ux-5.png" alt="CIP-Applied Research 5 – Findings and Criticality Index" /></p>',
            f'<p class="cip-artifacts-large"><img src="{prefix}pictures/work/cip-ux/cip-ux-6.png" alt="CIP-Applied Research 6 – Pipeline and data processing" /></p>',
            f'<p class="cip-artifacts-large"><img src="{prefix}pictures/work/cip-ux/cip-ux-7.png" alt="CIP-Applied Research 7 – Conclusions and strategic opportunities" /></p>',
            f'<p><img src="{prefix}pictures/work/cip-ux/cip-ux-8.png" alt="CIP-Applied Research 8 – Additional Applied Research visuals" /></p>',
        ]

    def escape_table_pipes(val: str) -> str:
        """Escape unescaped pipes so Markdown table cells don't fracture."""
        return re.sub(r"(?<!\\)\|", r"\|", val)

    who_role_val = escape_table_pipes(narrative(nars, variant, "who_role"))
    who_impact_val = escape_table_pipes(narrative(nars, variant, "who_impact"))

    slots = {
        "asset_prefix": prefix,
        "lang": lang,
        "deck_title": narrative(nars, variant, "deck_title"),
        "why_h1": narrative(nars, variant, "why_h1"),
        "why_h2": narrative(nars, variant, "why_h2"),
        "why_bullets": narrative(nars, variant, "why_bullets"),
        "who_name": profile["display_name"],
        "who_role": who_role_val,
        "who_impact": who_impact_val,
        "present_h2": narrative(nars, variant, "present_h2"),
        "present_table": narrative(nars, variant, "present_table"),
        "cip_pipeline_h2": narrative(nars, variant, "cip_pipeline_h2"),
        "relevance_h2": narrative(nars, variant, "relevance_h2"),
        "csi_h2": narrative(nars, variant, "csi_h2"),
        "cip_ux_images": "\n".join(cip_tags),
        "tooling_h2": narrative(nars, variant, "tooling_h2"),
        "tooling_bullet": narrative(nars, variant, "tooling_bullet"),
        "tooling_prototype_images": "\n".join(tooling_proto_tags),
        "tooling_workshop_images": "\n".join(tooling_ws_tags),
        "astra_h2": narrative(nars, variant, "astra_h2"),
        "astra_bullet": narrative(nars, variant, "astra_bullet"),
        "astra_images": "\n".join(astra_tags),
        "infovis_pnad_h2": narrative(nars, variant, "infovis_pnad_h2"),
        "infovis_pnad_bullets": narrative(nars, variant, "infovis_pnad_bullets"),
        "infovis_phrasenet_h2": narrative(nars, variant, "infovis_phrasenet_h2"),
        "infovis_phrasenet_bullets": narrative(
            nars, variant, "infovis_phrasenet_bullets"
        ),
        "dissertation_pbi_intro": narrative(nars, variant, "dissertation_pbi_intro"),
        "dissertation_pbi_bullets": narrative(
            nars, variant, "dissertation_pbi_bullets"
        ),
        "future_h2": narrative(nars, variant, "future_h2"),
        "future_intro": narrative(nars, variant, "future_intro"),
        "future_diagram_alt": narrative(nars, variant, "future_diagram_alt"),
        "future_method_diagram": FUTURE_METHOD_DIAGRAM[variant],
        "future_career_style": narrative(nars, variant, "future_career_style"),
        "future_career_body": narrative(nars, variant, "future_career_body").replace(
            "{{canonical:asset_prefix}}", prefix
        ),
        "closing_summary": narrative(nars, variant, "closing_summary"),
        "h_who": narrative(nars, variant, "h_who"),
        "h_who_attr": narrative(nars, variant, "h_who_attr"),
        "h_who_value": narrative(nars, variant, "h_who_value"),
        "h_who_name": narrative(nars, variant, "h_who_name"),
        "h_who_role": narrative(nars, variant, "h_who_role"),
        "h_who_impact": narrative(nars, variant, "h_who_impact"),
        "h_who_contact": narrative(nars, variant, "h_who_contact"),
        "h_past_academic": narrative(nars, variant, "h_past_academic"),
        "h_past_feeling": narrative(nars, variant, "h_past_feeling"),
        "h_past_grade": narrative(nars, variant, "h_past_grade"),
        "h_past_grade_note": narrative(nars, variant, "h_past_grade_note"),
        "h_past_experience": narrative(nars, variant, "h_past_experience"),
        "h_past_trajectory": narrative(nars, variant, "h_past_trajectory"),
        "h_cip_artifacts": narrative(nars, variant, "h_cip_artifacts"),
        "h_academic_research": narrative(nars, variant, "h_academic_research"),
        "h_publications": narrative(nars, variant, "h_publications"),
        "h_publications_intro": narrative(nars, variant, "h_publications_intro"),
        "h_pbi_work": narrative(nars, variant, "h_pbi_work"),
        "h_pbi_work_bullet": narrative(nars, variant, "h_pbi_work_bullet"),
        "h_dissertation_pbi": narrative(nars, variant, "h_dissertation_pbi"),
        "h_diss_tech": narrative(nars, variant, "h_diss_tech"),
        "h_diss_tech_bullet": narrative(nars, variant, "h_diss_tech_bullet"),
        "h_tech_impl": narrative(nars, variant, "h_tech_impl"),
        "h_proposal": narrative(nars, variant, "h_proposal"),
        "h_interests": narrative(nars, variant, "h_interests"),
        "h_interests_bullet": narrative(nars, variant, "h_interests_bullet"),
        "h_interests_col": narrative(nars, variant, "h_interests_col"),
        "h_interests_rows": narrative(nars, variant, "h_interests_rows"),
        "h_closing": narrative(nars, variant, "h_closing"),
        "h_closing_connect": narrative(nars, variant, "h_closing_connect"),
        "h_closing_request": narrative(nars, variant, "h_closing_request"),
        "h_infovis_diagram_alt": narrative(nars, variant, "h_infovis_diagram_alt"),
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


def write_narrative_yaml(variant: str, slots: dict[str, str], lang: str) -> None:
    out_dir = GENERATED / variant
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"narrative.{lang}.yaml"
    lines = [
        "# GENERATED — portfolio content layer",
        f"variant: {variant}",
        f"lang: {lang}",
        "fields:",
    ]
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


def generate_lang(
    lang: str, warnings: list[str], variants: tuple[str, ...] = VARIANTS
) -> None:
    nars = load_narratives(lang)
    for variant in variants:
        resume_path = resume_out_path(variant, lang)
        resume_path.parent.mkdir(parents=True, exist_ok=True)
        content = render_resume(variant, nars, warnings, lang)
        resume_path.write_text(content, encoding="utf-8")
        print(f"wrote {resume_path.relative_to(ROOT)}")

        if lang == DEFAULT_LANG:
            legacy = RESUME_DIR[variant] / "content.typ"
            legacy.write_text(content, encoding="utf-8")
            print(f"wrote {legacy.relative_to(ROOT)} (EN legacy copy)")

        slots = build_slot_map(variant, nars, lang)
        write_narrative_yaml(variant, slots, lang)
        print(f"wrote {GENERATED.relative_to(ROOT)}/{variant}/narrative.{lang}.yaml")

        if TEMPLATE.exists():
            deck = merge_template(variant, slots, warnings)
            out = deck_out_path(variant, lang)
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(deck, encoding="utf-8")
            print(f"wrote {out.relative_to(ROOT)}")
            if lang == DEFAULT_LANG:
                legacy_deck = DECK_DIR[variant] / (
                    "portfolio-deck.md" if variant == "general" else "portfolio-deck.md"
                )
                legacy_deck.write_text(deck, encoding="utf-8")
                print(f"wrote {legacy_deck.relative_to(ROOT)} (EN legacy copy)")
        else:
            warnings.append(f"Skip deck merge — template missing: {TEMPLATE}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate resume and portfolio from canonical CSV"
    )
    parser.add_argument(
        "--lang",
        choices=("en", "pt", "all"),
        default="all",
        help="Language to generate (default: all)",
    )
    parser.add_argument(
        "--variant",
        choices=VARIANTS,
        help="Single variant to generate (default: all)",
    )
    args = parser.parse_args()
    langs = LANGS if args.lang == "all" else (args.lang,)
    target_variants = (args.variant,) if args.variant else VARIANTS

    if not (CANON / "profile.csv").exists():
        print(
            "Canonical CSVs missing. Run: python scripts/seed_canonical_csv.py",
            file=sys.stderr,
        )
        return 1

    warnings: list[str] = []
    for lang in langs:
        generate_lang(lang, warnings, variants=target_variants)

    if warnings:
        print("\nConsistency report:")
        for w in warnings:
            print(f"  - {w}")
    else:
        print("\nConsistency report: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
