#!/usr/bin/env python3
"""One-time / refresh seed of my-data/canonical/*.csv from known resume+portfolio content.

Writes English-first CSVs, then runs migrate_bilingual_labels to add schema.csv,
field_labels.csv, and all _en / _pt columns.
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
CANON = ROOT / "my-data" / "canonical"


def write_csv(name: str, fieldnames: list[str], rows: list[dict]) -> None:
    path = CANON / name
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        for row in rows:
            w.writerow(row)
    print(f"wrote {path.relative_to(ROOT)} ({len(rows)} rows)")


def main() -> None:
    CANON.mkdir(parents=True, exist_ok=True)

    write_csv(
        "profile.csv",
        [
            "full_name",
            "display_name",
            "phone",
            "email",
            "linkedin_label",
            "linkedin_url",
            "lattes_label",
            "lattes_url",
            "orcid_label",
            "orcid_url",
            "location",
            "languages",
        ],
        [
            {
                "full_name": "Eduardo Matos de Assis Figueiredo",
                "display_name": "Eduardo M. de A. Figueiredo",
                "phone": "+55 (19) 98176-6583",
                "email": "edu.evangelista.figueiredo@gmail.com",
                "linkedin_label": "LinkedIn",
                "linkedin_url": "https://www.linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b",
                "lattes_label": "Lattes",
                "lattes_url": "https://lattes.cnpq.br/2708641049892967",
                "orcid_label": "ORCID",
                "orcid_url": "https://orcid.org/0009-0002-5178-6157",
                "location": "Nova Odessa, SP - Brazil",
                "languages": "Portuguese (Native)   English (Fluent)",
            }
        ],
    )

    write_csv(
        "experience.csv",
        [
            "id",
            "sort_order",
            "start_date",
            "end_date",
            "date_display",
            "company",
            "title",
        ],
        [
            {
                "id": "bosch-ar-2023",
                "sort_order": "1",
                "start_date": "2023-05",
                "end_date": "present",
                "date_display": "May 2023 – Present",
                "company": "Bosch Brasil",
                "title": "Applied Research & Design Analyst",
            },
            {
                "id": "bosch-web-2020",
                "sort_order": "2",
                "start_date": "2020-01",
                "end_date": "2023-11",
                "date_display": "Jan 2020 – Nov 2023",
                "company": "Bosch Brasil",
                "title": "Web Developer",
            },
            {
                "id": "bosch-hu-2019",
                "sort_order": "3",
                "start_date": "2019-01",
                "end_date": "2019-12",
                "date_display": "Jan 2019 – Dec 2019",
                "company": "Bosch Magyarország (Hungary)",
                "title": "Digitization Support Analyst",
            },
            {
                "id": "bosch-intern-2017",
                "sort_order": "4",
                "start_date": "2017-01",
                "end_date": "2018-11",
                "date_display": "Jan 2017 – Nov 2018",
                "company": "Bosch Brasil (Campinas)",
                "title": "Intern",
            },
        ],
    )

    bullets = [
        # general – current role
        (
            "bosch-ar-2023",
            "general",
            1,
            "Supported Americas to reach **UX Maturity Level 4 inside Global Services**: governance, templates, training. **CSI 4.86 / NPS 9.94** avg. in my projects (2024–2025).",
        ),
        (
            "bosch-ar-2023",
            "general",
            2,
            "CIP + Research integration into **ServiceNow**; added a Research gate in the workflow; **method-driven** quality gate.",
        ),
        (
            "bosch-ar-2023",
            "general",
            3,
            "**Tooling project (Power Tools):** supported technical delivery and project management from requirements through high-fidelity prototypes; regular customer check-ins.",
        ),
        (
            "bosch-ar-2023",
            "general",
            4,
            "Power BI dashboards for project/resource oversight and training tracking.",
        ),
        (
            "bosch-ar-2023",
            "general",
            5,
            "**Agentic AI:** use daily with **Cursor IDE** and context management for research, analysis, and problem-solving. Delivering Applied Research efficiently across pipeline and artifacts.",
        ),
        (
            "bosch-ar-2023",
            "general",
            6,
            "**International & Mentorship:** two trips to Germany (2024, 2025); tutor at SENAI Digital Talent Academy.",
        ),
        (
            "bosch-web-2020",
            "general",
            1,
            "Front-end development, React, Scrum, Kanban, Applied Research; web solutions and teamwork-driven delivery.",
        ),
        (
            "bosch-web-2020",
            "general",
            2,
            "Collaborated on customer-facing applications and internal tools.",
        ),
        (
            "bosch-hu-2019",
            "general",
            1,
            "Business Excellence digitization in **Kanban**; internal tools and workflows.",
        ),
        (
            "bosch-hu-2019",
            "general",
            2,
            "**Full-stack web development:** VS Code, SQL Server, Windows Server (IIS).",
        ),
        (
            "bosch-intern-2017",
            "general",
            1,
            "VBA (Excel) for Continuous Improvement and internal communication.",
        ),
        # product-owner
        (
            "bosch-ar-2023",
            "product-owner",
            1,
            "**Tooling project (Power Tools):** owned the path from requirements through high-fidelity prototypes; regular **customer check-ins** and delivery coordination with technical partners.",
        ),
        (
            "bosch-ar-2023",
            "product-owner",
            2,
            "Integrated Applied Research into **CIP / ServiceNow** as an intake and quality gate—method-driven triage so the right work advances.",
        ),
        (
            "bosch-ar-2023",
            "product-owner",
            3,
            "Supported Americas to reach **UX Maturity Level 4**: governance, templates, and training that productized UX practice for stakeholders.",
        ),
        (
            "bosch-ar-2023",
            "product-owner",
            4,
            "Outcome evidence: **CSI 4.86 / NPS 9.94** avg. across my projects (2024–2025); Power BI for project and resource oversight.",
        ),
        (
            "bosch-ar-2023",
            "product-owner",
            5,
            "**International & Mentorship:** two trips to Germany (2024, 2025); tutor at SENAI Digital Talent Academy.",
        ),
        (
            "bosch-web-2020",
            "product-owner",
            1,
            "Delivered customer-facing and internal web solutions in **Scrum and Kanban**; collaborated across design, research, and engineering.",
        ),
        (
            "bosch-web-2020",
            "product-owner",
            2,
            "Translated needs into shipped front-end (React) increments with teamwork-driven delivery.",
        ),
        (
            "bosch-hu-2019",
            "product-owner",
            1,
            "Digitized Business Excellence workflows in **Kanban**—clarifying process needs and shipping internal tools.",
        ),
        (
            "bosch-hu-2019",
            "product-owner",
            2,
            "**Full-stack web development:** VS Code, SQL Server, Windows Server (IIS).",
        ),
        (
            "bosch-intern-2017",
            "product-owner",
            1,
            "Built VBA tools supporting Continuous Improvement and internal communication processes.",
        ),
    ]
    write_csv(
        "experience_bullets.csv",
        ["experience_id", "variant", "sort_order", "text"],
        [
            {
                "experience_id": eid,
                "variant": var,
                "sort_order": str(ord_),
                "text": text,
            }
            for eid, var, ord_, text in bullets
        ],
    )

    skills = [
        ("general", "Core", 1, "Applied Research"),
        ("general", "Core", 2, "Project Management"),
        ("general", "Core", 3, "Continuous Improvement (CIP)"),
        ("general", "Core", 4, "AI Systems"),
        ("general", "Tech", 1, "Power BI"),
        ("general", "Tech", 2, "Python"),
        ("general", "Tech", 3, "React"),
        ("general", "Tech", 4, "Figma"),
        ("general", "Tech", 5, "SQL"),
        ("general", "Tech", 6, "Matplotlib"),
        ("general", "Tech", 7, "Seaborn"),
        ("general", "Tech", 8, "Git"),
        ("general", "Tech", 9, "GitHub"),
        ("general", "Tech", 10, "Cursor IDE"),
        ("general", "Tech", 11, "Azure"),
        ("general", "Tech", 12, "Bitbucket"),
        ("general", "Tech", 13, "HTML"),
        ("general", "Tech", 14, "CSS"),
        ("general", "Tech", 15, "Mermaid"),
        ("general", "Tech", 16, "VS Code"),
        ("general", "Tech", 17, "Excel"),
        ("general", "Tech", 18, "VBA"),
        ("general", "Tech", 19, "AutoHotkey"),
        ("product-owner", "Core", 1, "Product discovery"),
        ("product-owner", "Core", 2, "Stakeholder alignment"),
        ("product-owner", "Core", 3, "Prioritization & outcomes"),
        ("product-owner", "Core", 4, "Applied Research"),
        ("product-owner", "Core", 5, "Agile (Scrum / Kanban) / CIP"),
        ("product-owner", "Tech", 1, "Power BI"),
        ("product-owner", "Tech", 2, "Python"),
        ("product-owner", "Tech", 3, "React"),
        ("product-owner", "Tech", 4, "Figma"),
        ("product-owner", "Tech", 5, "SQL"),
        ("product-owner", "Tech", 6, "Matplotlib"),
        ("product-owner", "Tech", 7, "Seaborn"),
        ("product-owner", "Tech", 8, "Git"),
        ("product-owner", "Tech", 9, "GitHub"),
        ("product-owner", "Tech", 10, "Cursor IDE"),
        ("product-owner", "Tech", 11, "Azure"),
        ("product-owner", "Tech", 12, "ServiceNow"),
        ("product-owner", "Tech", 13, "Bitbucket"),
        ("product-owner", "Tech", 14, "HTML"),
        ("product-owner", "Tech", 15, "CSS"),
        ("product-owner", "Tech", 16, "Mermaid"),
        ("product-owner", "Tech", 17, "VS Code"),
        ("product-owner", "Tech", 18, "Excel"),
        ("product-owner", "Tech", 19, "VBA"),
        ("product-owner", "Tech", 20, "AutoHotkey"),
    ]
    write_csv(
        "skills.csv",
        ["variant", "category", "sort_order", "label"],
        [
            {"variant": v, "category": c, "sort_order": str(o), "label": lab}
            for v, c, o, lab in skills
        ],
    )

    write_csv(
        "education.csv",
        ["sort_order", "degree", "institution", "detail"],
        [
            {
                "sort_order": "1",
                "degree": "Master's in Technology:",
                "institution": "Info & Comm Systems. Unicamp (2023–2026, completing September 2026).",
                "detail": "Dissertation: Measuring **perceived trust** in e-commerce websites with a digital evaluation platform (ISO/IEC 25000), using experimentation, ML, and human vs **AI-agent** validation. Coursework (**Grade A in all courses**): Academic Writing, Scientific Research, Innovation & Technology Transfer, Information Visualization.",
            },
            {
                "sort_order": "2",
                "degree": "Systems Analysis and Development.",
                "institution": "Unicamp (2015–2020).",
                "detail": "",
            },
            {
                "sort_order": "3",
                "degree": "Technical Degree in Informatics.",
                "institution": "ETEC Bento Quirino (2012–2014).",
                "detail": "",
            },
        ],
    )

    write_csv(
        "publications.csv",
        ["sort_order", "venue", "citation"],
        [
            {
                "sort_order": "1",
                "venue": "IHC 2025:",
                "citation": '"Measuring User Trust in Websites: A Digital Support Tool" (SOL / SBC Open Lib).',
            },
            {
                "sort_order": "2",
                "venue": "ISSRE 2025 (HFSD Workshop):",
                "citation": '"Measuring Perceived Trust in Websites: A Digital Tool Providing a Score for Evaluation."',
            },
        ],
    )

    write_csv(
        "additional.csv",
        ["sort_order", "text"],
        [
            {"sort_order": "1", "text": "3rd Place – Bosch Talent Forum 2018."},
            {
                "sort_order": "2",
                "text": "InfoVis: PhraseNets web visualization for text co-occurrence analysis.",
            },
            {"sort_order": "3", "text": "Volunteer – NGO Hospitalhaços (Admin)."},
        ],
    )

    write_csv(
        "projects.csv",
        ["id", "name", "summary", "csi", "nps", "notes"],
        [
            {
                "id": "tooling-pt",
                "name": "EXT_M-PUR36 Tooling (Power Tools)",
                "summary": "Requirements through high-fidelity prototypes with regular customer check-ins.",
                "csi": "5",
                "nps": "10",
                "notes": "Primary discovery-to-delivery evidence for Product Owner framing.",
            },
            {
                "id": "cip-research-gate",
                "name": "CIP + Applied Research ServiceNow gate",
                "summary": "Research quality/intake gate in CIP workflow; relevance triage Low/Medium/High.",
                "csi": "",
                "nps": "",
                "notes": "Prioritization / intake evidence.",
            },
            {
                "id": "maturity-l4",
                "name": "Americas UX Maturity Level 4",
                "summary": "Governance, templates, and training that productized UX practice.",
                "csi": "",
                "nps": "",
                "notes": "Stakeholder enablement.",
            },
            {
                "id": "outcomes-2024-2025",
                "name": "Project CSI/NPS averages 2024–2025",
                "summary": "Average CSI 4.86 / NPS 9.94 across projects.",
                "csi": "4.86",
                "nps": "9.94",
                "notes": "Outcome ownership metric.",
            },
        ],
    )

    # Portfolio + resume narratives (markdown-ish; **bold** for both Typst and MD)
    narratives = [
        # resume
        ("general", "tagline", "Applied Research, Technology & Project Management"),
        (
            "general",
            "profile",
            "UX and software-quality researcher helping teams build **user-centered solutions** through **Applied Research, technology, and project management**. Full-stack background and **scientific mindset**. Daily use of data, CIP, and **Agentic AI**. **Self-directed and proactive** across design, front-end, Power BI, and Python. Master's in Technology (**completing September 2026**) with **Grade A across all coursework**. Aspiring **AI Scrum Master**.",
        ),
        ("product-owner", "tagline", "Discovery, Delivery & Stakeholder Outcomes"),
        (
            "product-owner",
            "profile",
            "Product-minded professional connecting **discovery to delivery**: clarifying needs, aligning stakeholders, and guiding solutions from requirements through validation. Background in **Applied Research, UX, and project delivery** with a full-stack foundation. Uses data, CIP, and **customer check-ins** to prioritize outcomes. Master's in Technology (**completing September 2026**) with **Grade A across all coursework**.",
        ),
        # portfolio deck
        ("general", "deck_title", "Eduardo Figueiredo – Portfolio"),
        ("product-owner", "deck_title", "Eduardo Figueiredo – Portfolio"),
        (
            "general",
            "why_h1",
            "Why I Work in Technology, Project Management & Applied Research",
        ),
        ("product-owner", "why_h1", "Why Discovery and Delivery Matter"),
        (
            "general",
            "why_h2",
            "Trustworthy, human-centered software for complex services",
        ),
        (
            "product-owner",
            "why_h2",
            "Discovery to delivery for trustworthy, human-centered products",
        ),
        (
            "general",
            "why_bullets",
            "- I believe software in service organizations should be **trustworthy, usable, and usefull**, especially when it affects real people and businesses.\n- My work centers **technology**, **project management**, and **Applied Research**: bringing evidence and user needs into how we build and deliver.\n- This portfolio walks through that story.",
        ),
        (
            "product-owner",
            "why_bullets",
            "- I believe products in service organizations should be **trustworthy, usable, and useful**, especially when they affect real people and businesses.\n- My work connects **stakeholder needs**, **prioritization**, and **Applied Research**: bringing evidence into what we build, why, and in what order.\n- This portfolio shows that discovery → delivery path through real projects.",
        ),
        ("general", "who_role", "Applied Research, Technology & Project Management"),
        ("product-owner", "who_role", "Discovery, Delivery & Stakeholder Outcomes"),
        (
            "general",
            "who_impact",
            "I help teams govern better and improve faster, using Applied Research to prioritize, decide, and deliver with clear data and accountability.",
        ),
        (
            "product-owner",
            "who_impact",
            "I help teams prioritize and ship with clarity: Applied Research to decide, stakeholder alignment to commit, and measurable outcomes to prove value.",
        ),
        (
            "general",
            "present_h2",
            "Present – Applied Research & Technology (Bosch Brasil)",
        ),
        (
            "product-owner",
            "present_h2",
            "Present – Product-Shaped Work at Bosch Brasil",
        ),
        (
            "general",
            "present_table",
            "| Area                               | Achievement                                                                                                                        |\n"
            "| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n"
            "| Role                               | Applied Research & Technology – Bosch Brasil (May 2023 – present); Applied Research Expert & Project Champion at GS/BDU            |\n"
            "| International                      | Two trips to Germany (2024, 2025) for role-related work                                                                            |\n"
            "| CO2 Tracking (GS/Applied Research) | Marketing scouting for CO2 telemetry; finding: lack of market demand                                                               |\n"
            "| Tooling project (PT)               | Led technical delivery and project management from requirements through high-fidelity prototypes, with regular customer check-ins. |\n"
            "| UX Maturity          | Led Americas to Level 4 – governance, templates, training                                                                          |\n"
            "| CIP + Applied Research             | Led integration into ServiceNow CIM; Applied Research gate in CIP workflow                                                         |\n"
            "| Collaboration                      | Tutor of Digital Talent Academy Students                                                                                           |",
        ),
        (
            "product-owner",
            "present_table",
            "| Area                               | Achievement                                                                                                                       |\n"
            "| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |\n"
            "| Role (official)                    | Applied Research & Design Analyst – Bosch Brasil (May 2023 – present); Applied Research Expert & Project Champion at GS/BDU       |\n"
            "| International                      | Two trips to Germany (2024, 2025) for role-related work                                                                           |\n"
            "| CO2 Tracking (GS/Applied Research) | Marketing scouting for CO2 telemetry; finding: lack of market demand — a discovery outcome that stopped low-value work            |\n"
            "| Tooling project (PT)               | Requirements → high-fidelity prototypes → regular **customer check-ins**; discovery-to-delivery ownership with technical partners |\n"
            "| UX Maturity          | Americas Level 4 – governance, templates, training that **productized** UX practice for stakeholders                        |\n"
            "| CIP + Applied Research             | ServiceNow CIM integration; Applied Research as an **intake / quality gate** so the right work advances                           |\n"
            "| Collaboration                      | Tutor of Digital Talent Academy Students                                                                                          |",
        ),
        (
            "general",
            "cip_pipeline_h2",
            "Present – CIP and Applied Research Integration: Methodology Pipeline",
        ),
        (
            "product-owner",
            "cip_pipeline_h2",
            "Present – CIP Intake Gate: Methodology Pipeline",
        ),
        (
            "general",
            "relevance_h2",
            "Present – Applied Research relevance evaluation model",
        ),
        (
            "product-owner",
            "relevance_h2",
            "Present – Prioritization Model (Low / Medium / High relevance)",
        ),
        ("general", "csi_h2", "Present – CSI & NPS Performance (2024–2025)"),
        (
            "product-owner",
            "csi_h2",
            "Present – Outcome Evidence: CSI & NPS (2024–2025)",
        ),
        ("general", "tooling_h2", "Technical Implementation – Tooling Project for PT"),
        (
            "product-owner",
            "tooling_h2",
            "Discovery → Delivery – Tooling Project for PT",
        ),
        (
            "general",
            "tooling_bullet",
            "- **Tooling project for PT:** Led **technical delivery and project management** from requirements through high-fidelity prototypes, with **regular customer check-ins**.",
        ),
        (
            "product-owner",
            "tooling_bullet",
            "- **Tooling project for PT:** Owned the path from **requirements** through **high-fidelity prototypes**, with **regular customer check-ins** — stakeholder validation baked into delivery.",
        ),
        ("general", "future_h2", "Future"),
        ("product-owner", "future_h2", "Future – Agile Delivery Context"),
        ("general", "future_intro", ""),
        (
            "product-owner",
            "future_intro",
            "**Discovery, prioritization, and delivery** meet in how I work with teams today. The diagram below is the agile/research operating context I work in.",
        ),
        (
            "general",
            "future_diagram_alt",
            "Diagram ai-agile-research: AI and Agile in Applied Research, AI Scrum Master role",
        ),
        (
            "product-owner",
            "future_diagram_alt",
            "Diagram ai-agile-research: AI and Agile in Applied Research",
        ),
        (
            "general",
            "future_career_body",
            "## Future – Career Aspirations, Vacancy Types & Prioritized Paths to Leadership\n\n"
            '<div class="future-career-wrap">\n'
            '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" alt="Diagram future-career-path: Prioritized paths to leadership, including AI Scrum Master" /></p>\n'
            "</div>",
        ),
        (
            "product-owner",
            "future_career_body",
            "## Future – How I Work\n\n"
            "- **What I bring:** discovery → prototypes → stakeholder check-ins; intake/quality gates; outcome metrics (CSI/NPS).\n\n"
            '<div class="future-career-wrap">\n'
            '<div class="future-po-bullets">\n\n'
            "| Competency              | Evidence from my work                                     |\n"
            "| ----------------------- | --------------------------------------------------------- |\n"
            "| Discovery & validation  | Tooling PT requirements → prototypes → customer check-ins |\n"
            "| Prioritization / intake | ServiceNow Applied Research gate in CIP                   |\n"
            "| Stakeholder enablement  | Americas UX Maturity Level 4 (templates, training)  |\n"
            "| Outcome ownership       | CSI 4.86 / NPS 9.94 avg. (2024–2025)                      |\n\n"
            "</div>\n"
            '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" alt="Diagram future-career-path: Prioritized career paths" /></p>\n'
            "</div>",
        ),
        (
            "general",
            "future_career_style",
            ".future-career-wrap {\n"
            "  display: flex !important; justify-content: center !important; align-items: center !important;\n"
            "  min-height: 62vh !important; width: 100% !important; margin-top: 0.75rem !important;\n"
            "}\n"
            ".future-career-wrap p { margin: 0 !important; text-align: center !important; }\n"
            ".future-career-wrap img {\n"
            "  width: 43% !important; max-width: 43% !important; height: auto !important;\n"
            "  display: block !important; margin: 20px auto 0 !important;\n"
            "  border: none !important; box-shadow: none !important;\n"
            "}",
        ),
        (
            "product-owner",
            "future_career_style",
            ".future-career-wrap {\n"
            "  display: flex !important; flex-direction: column !important;\n"
            "  justify-content: center !important; align-items: center !important;\n"
            "  min-height: 55vh !important; width: 100% !important; margin-top: 0.75rem !important;\n"
            "  gap: 1rem !important;\n"
            "}\n"
            ".future-career-wrap p { margin: 0 !important; text-align: center !important; }\n"
            ".future-career-wrap img {\n"
            "  width: 38% !important; max-width: 38% !important; height: auto !important;\n"
            "  display: block !important; margin: 10px auto 0 !important;\n"
            "  border: none !important; box-shadow: none !important;\n"
            "}\n"
            ".future-po-bullets {\n"
            "  max-width: 85% !important; text-align: left !important; font-size: 0.95em !important;\n"
            "}",
        ),
        (
            "general",
            "closing_summary",
            "I bring Applied Research-driven evidence, technology support, and project delivery to help teams build solutions. Solutions that are trustworthy, user-centered, with clear data, accountability, and measurable impact.",
        ),
        (
            "product-owner",
            "closing_summary",
            "I connect discovery to delivery: clarifying needs, aligning stakeholders, prioritizing with evidence, and validating outcomes — creating trustworthy, user-centered products with measurable impact.",
        ),
    ]
    write_csv(
        "narratives.csv",
        ["variant", "field", "text"],
        [{"variant": v, "field": f, "text": t} for v, f, t in narratives],
    )

    print("Canonical CSV seed complete (EN columns). Running bilingual migration…")
    from migrate_bilingual_labels import main as migrate_bilingual

    migrate_bilingual()


if __name__ == "__main__":
    main()
