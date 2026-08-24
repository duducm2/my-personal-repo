#!/usr/bin/env python3
"""Build portfolio/templates/portfolio-deck.template.md from the general deck."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    src = (ROOT / "portfolio" / "portfolio-deck.md").read_text(encoding="utf-8")

    text = src.replace("../arts/", "{{canonical:asset_prefix}}arts/")
    text = text.replace("../pictures/", "{{canonical:asset_prefix}}pictures/")

    text = re.sub(
        r'title: "Eduardo Figueiredo – Portfolio"',
        'title: "{{canonical:deck_title}}"',
        text,
        count=1,
    )

    old_why = """# Why I Work in Technology, Project Management & Applied Research

## Trustworthy, human-centered software for complex services

- I believe software in service organizations should be **trustworthy, usable, and usefull**, especially when it affects real people and businesses.
- My work centers **technology**, **project management**, and **Applied Research**: bringing evidence and user needs into how we build and deliver.
- This portfolio walks through that story."""

    new_why = """# {{canonical:why_h1}}

## {{canonical:why_h2}}

{{canonical:why_bullets}}"""

    if old_why not in text:
        raise SystemExit("why block not found")
    text = text.replace(old_why, new_why, 1)

    text = text.replace(
        "| Name      | Eduardo M. de A. Figueiredo                                                                                                                                                                                                                                                   |",
        "| Name      | {{canonical:who_name}}                                                                                                                                                                                                                                                   |",
        1,
    )
    text = text.replace(
        "| Role      | Applied Research, Technology & Project Management                                                                                                                                                                                                                             |",
        "| Role      | {{canonical:who_role}}                                                                                                                                                                                                                             |",
        1,
    )

    impact_re = re.compile(r"\| Impact    \|[^\n]+\|")
    contact_re = re.compile(r"\| Contact   \|[^\n]+\|")
    if not impact_re.search(text):
        raise SystemExit("impact not found")
    text = impact_re.sub(
        "| Impact    | {{canonical:who_impact}}                                                                                                                                  |",
        text,
        count=1,
    )
    if not contact_re.search(text):
        raise SystemExit("contact not found")
    text = contact_re.sub("| Contact   | {{canonical:who_contact}} |", text, count=1)

    old_present_h2 = "## Present – Applied Research & Technology (Bosch Brasil)"
    if old_present_h2 not in text:
        raise SystemExit("present h2 not found")
    text = text.replace(old_present_h2, "## {{canonical:present_h2}}", 1)

    present_table_re = re.compile(
        r"\| Area\s+\| Achievement[^\n]*\n\| -+\s+\| -+\s+\|\n(?:\|[^\n]+\n)+",
        re.MULTILINE,
    )
    if not present_table_re.search(text):
        raise SystemExit("present table not found")
    text = present_table_re.sub("{{canonical:present_table}}\n\n", text, count=1)

    text = text.replace(
        "## Present – CIP and Applied Research Integration: Methodology Pipeline",
        "## {{canonical:cip_pipeline_h2}}",
        1,
    )
    text = text.replace(
        "## Present – Applied Research relevance evaluation model",
        "## {{canonical:relevance_h2}}",
        1,
    )
    text = text.replace(
        "## Present – CSI & NPS Performance (2024–2025)",
        "## {{canonical:csi_h2}}",
        1,
    )
    text = text.replace(
        "## Technical Implementation – Tooling Project for PT",
        "## {{canonical:tooling_h2}}",
        1,
    )
    old_tool = (
        "- **Tooling project for PT:** Led **technical delivery and project management** "
        "from requirements through high-fidelity prototypes, with **regular customer check-ins**."
    )
    if old_tool not in text:
        raise SystemExit("tooling bullet not found")
    text = text.replace(old_tool, "{{canonical:tooling_bullet}}", 1)

    future_start = text.find("## Future\n")
    if future_start < 0:
        raise SystemExit("future start not found")
    personal = text.find(
        "<!-- Slide 23 – Future (Personal Interests as Career Enablers) -->"
    )
    if personal < 0:
        raise SystemExit("personal interests marker not found")

    future_block_new = """## {{canonical:future_h2}}

{{canonical:future_intro}}

<div class="ai-agile-wrap">
<p><img src="{{canonical:asset_prefix}}pictures/diagrams/ai-agile-research.png" alt="{{canonical:future_diagram_alt}}" /></p>
</div>

---

<!-- Slide 21 – Future (Career) -->

<style scoped>
{{canonical:future_career_style}}
</style>

{{canonical:future_career_body}}

<!-- Diagram: future-career-path (mermaid/diagrams.md). Export to future-career-path.png -->

---

"""
    text = text[:future_start] + future_block_new + text[personal:]

    closing_re = re.compile(
        r'<div class="closing-summary">\s*<p>.*?</p>\s*</div>',
        re.DOTALL,
    )
    if not closing_re.search(text):
        raise SystemExit("closing not found")
    text = closing_re.sub(
        '<div class="closing-summary">\n<p>{{canonical:closing_summary}}</p>\n</div>',
        text,
        count=1,
    )

    text = text.replace(
        "<p>edu.evangelista.figueiredo@gmail.com</p>",
        "<p>{{canonical:email}}</p>",
        1,
    )
    text = text.replace(
        '<p><a href="https://www.linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b">linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b</a></p>',
        '<p><a href="{{canonical:linkedin_url}}">{{canonical:linkedin_display}}</a></p>',
        1,
    )
    text = text.replace(
        '<p><a href="https://lattes.cnpq.br/2708641049892967">Lattes</a> · <a href="https://orcid.org/0009-0002-5178-6157">ORCID</a></p>',
        '<p><a href="{{canonical:lattes_url}}">Lattes</a> · <a href="{{canonical:orcid_url}}">ORCID</a></p>',
        1,
    )
    text = text.replace("<p>+55 19 98176-6583</p>", "<p>{{canonical:phone}}</p>", 1)

    out = ROOT / "portfolio" / "templates" / "portfolio-deck.template.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text, encoding="utf-8")
    slots = sorted(set(re.findall(r"\{\{canonical:([a-z0-9_]+)\}\}", text)))
    print(f"wrote {out.relative_to(ROOT)} ({len(text)} chars)")
    print("slots:", ", ".join(slots))


if __name__ == "__main__":
    main()
