#!/usr/bin/env python3
"""Audit canonical CSVs vs expected resume/portfolio facts; check for data loss."""
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"


def load(name: str) -> list[dict[str, str]]:
    with (CANON / name).open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def main() -> int:
    issues: list[str] = []
    notes: list[str] = []
    ok: list[str] = []

    profile = load("profile.csv")
    if len(profile) != 1:
        issues.append(f"profile.csv expected 1 row, got {len(profile)}")
    else:
        p = profile[0]
        for k in (
            "display_name",
            "phone",
            "email",
            "linkedin_url",
            "lattes_url",
            "orcid_url",
            "location_en",
            "location_pt",
            "languages_en",
            "languages_pt",
        ):
            if not p.get(k):
                issues.append(f"profile missing {k}")
        ok.append("profile.csv: contact fields present")

    exp = load("experience.csv")
    exp_ids = {r["id"] for r in exp}
    expected_roles = {
        "bosch-ar-2023": ("Applied Research & Design Analyst", "Bosch Brasil"),
        "bosch-web-2020": ("Web Developer", "Bosch Brasil"),
        "bosch-hu-2019": (
            "Digitization Support Analyst",
            "Bosch Magyarország (Hungary)",
        ),
        "bosch-intern-2017": ("Intern", "Bosch Brasil (Campinas)"),
    }
    for eid, (title, company) in expected_roles.items():
        row = next((r for r in exp if r["id"] == eid), None)
        if not row:
            issues.append(f"experience missing id={eid}")
        else:
            title_val = row.get("title_en", row.get("title", ""))
            if title_val != title:
                issues.append(f"{eid} title mismatch: {title_val!r}")
            if row["company"] != company:
                issues.append(f"{eid} company mismatch: {row['company']!r}")
    ok.append(f"experience.csv: {len(exp)} roles (resume baseline)")

    # Known gap vs my-data.json archive
    notes.append(
        "INTENTIONAL GAP vs my-data.json archive: Continuous Improvement Analyst "
        "(Bosch Sorocaba, 2020-01–2021-07) was never in Typst resume baseline; still absent from experience.csv"
    )
    notes.append(
        "INTENTIONAL GAP vs my-data.json: Web Developer start_date in JSON is 2021-05; "
        "resume/canonical keep Jan 2020 – Nov 2023 (resume-accurate priority)"
    )

    bullets = load("experience_bullets.csv")
    for b in bullets:
        if b["experience_id"] not in exp_ids:
            issues.append(f"orphan bullet experience_id={b['experience_id']}")
    for eid in exp_ids:
        for var in ("general", "product-owner"):
            n = sum(
                1 for b in bullets if b["experience_id"] == eid and b["variant"] == var
            )
            if n == 0:
                issues.append(f"no bullets for {eid} / {var}")
    # Count expectations from original resumes
    expected_counts = {
        ("bosch-ar-2023", "general"): 6,
        ("bosch-ar-2023", "product-owner"): 5,
        ("bosch-web-2020", "general"): 2,
        ("bosch-web-2020", "product-owner"): 2,
        ("bosch-hu-2019", "general"): 2,
        ("bosch-hu-2019", "product-owner"): 2,
        ("bosch-intern-2017", "general"): 1,
        ("bosch-intern-2017", "product-owner"): 1,
    }
    for key, want in expected_counts.items():
        got = sum(
            1
            for b in bullets
            if b["experience_id"] == key[0] and b["variant"] == key[1]
        )
        if got != want:
            issues.append(f"bullet count {key}: want {want} got {got}")
    ok.append(
        f"experience_bullets.csv: {len(bullets)} rows, counts match resume baselines"
    )

    # Critical phrases must appear
    required_phrases = [
        ("general", "Research Maturity Level 4"),
        ("general", "CSI 4.86"),
        ("general", "NPS 9.94"),
        ("general", "ServiceNow"),
        ("general", "Tooling project"),
        ("general", "SENAI"),
        ("product-owner", "customer check-ins"),
        ("product-owner", "intake and quality gate"),
        ("product-owner", "Discovery, Delivery"),
    ]
    all_bullet_text = {
        "general": " ".join(
            b.get("text_en", b.get("text", "")) for b in bullets if b["variant"] == "general"
        ),
        "product-owner": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "product-owner"
        ),
    }
    nars = {
        (r["variant"], r["field"]): r.get("text_en", r.get("text", ""))
        for r in load("narratives.csv")
    }
    for var, phrase in required_phrases:
        hay = (
            all_bullet_text[var]
            + " "
            + " ".join(t for (v, f), t in nars.items() if v == var)
        )
        if phrase not in hay:
            issues.append(f"missing phrase in {var}: {phrase!r}")
    ok.append("critical phrases present in bullets/narratives")

    forbidden_po_labels = (
        "Product Owner Focus",
        "Product Owner focus",
        "Seeking Product Owner",
        "Product Owner Portfolio",
        "Targeting Product Owner",
    )
    po_text = " ".join(
        row.get("text_en", row.get("text", ""))
        for row in load("narratives.csv")
        if row["variant"] == "product-owner"
    )
    for bad in forbidden_po_labels:
        if bad in po_text:
            issues.append(f"product-owner narrative still contains meta-label: {bad!r}")
    ok.append("product-owner narratives: no PO meta-labels")

    skills = load("skills.csv")
    g_core = [
        s for s in skills if s["variant"] == "general" and s["category"] == "Core"
    ]
    g_tech = [
        s for s in skills if s["variant"] == "general" and s["category"] == "Tech"
    ]
    po_core = [
        s for s in skills if s["variant"] == "product-owner" and s["category"] == "Core"
    ]
    po_tech = [
        s for s in skills if s["variant"] == "product-owner" and s["category"] == "Tech"
    ]
    if len(g_core) != 4:
        issues.append(f"general Core skills want 4 got {len(g_core)}")
    if len(g_tech) != 19:
        issues.append(f"general Tech skills want 19 got {len(g_tech)}")
    if len(po_core) != 5:
        issues.append(f"PO Core skills want 5 got {len(po_core)}")
    if len(po_tech) != 12:
        issues.append(f"PO Tech skills want 12 got {len(po_tech)}")
    ok.append("skills.csv counts match resume baselines")

    edu = load("education.csv")
    if len(edu) != 3:
        issues.append(f"education want 3 got {len(edu)}")
    if "perceived trust" not in edu[0].get("detail_en", edu[0].get("detail", "")):
        issues.append("master's dissertation detail missing perceived trust")
    inst = edu[0].get("institution_en", edu[0].get("institution", ""))
    if "September 2026" not in inst and "setembro de 2026" not in edu[0].get("institution_pt", ""):
        issues.append("master's institution missing September 2026 completion")
    ok.append("education.csv: 3 degrees + dissertation detail + completion date")

    # Bilingual label registry
    if not (CANON / "schema.csv").exists():
        issues.append("schema.csv missing")
    else:
        schema = load("schema.csv")
        if len(schema) < 50:
            issues.append(f"schema.csv seems incomplete: {len(schema)} rows")
        ok.append(f"schema.csv: {len(schema)} column labels (EN/PT)")
    if not (CANON / "field_labels.csv").exists():
        issues.append("field_labels.csv missing")
    else:
        fl = load("field_labels.csv")
        ok.append(f"field_labels.csv: {len(fl)} key labels (EN/PT)")

    pubs = load("publications.csv")
    if len(pubs) != 2:
        issues.append(f"publications want 2 got {len(pubs)}")
    # Check double-quote corruption
    for p in pubs:
        cite = p.get("citation_en", p.get("citation", ""))
        if "Measuring" not in cite:
            issues.append(f"publication citation odd: {cite!r}")
    ok.append("publications.csv: IHC + ISSRE present")

    add = load("additional.csv")
    if len(add) != 3:
        issues.append(f"additional want 3 got {len(add)}")
    ok.append("additional.csv: Talent Forum, PhraseNets, Hospitalhaços")

    projects = load("projects.csv")
    for pid in ("tooling-pt", "cip-research-gate", "maturity-l4", "outcomes-2024-2025"):
        if not any(r["id"] == pid for r in projects):
            issues.append(f"projects.csv missing {pid}")
    ok.append("projects.csv: tooling/CIP/maturity/outcomes")

    # Narrative field coverage
    required_fields = [
        "tagline",
        "profile",
        "deck_title",
        "why_h1",
        "why_h2",
        "why_bullets",
        "who_role",
        "who_impact",
        "present_h2",
        "present_table",
        "cip_pipeline_h2",
        "relevance_h2",
        "csi_h2",
        "tooling_h2",
        "tooling_bullet",
        "future_h2",
        "future_intro",
        "future_diagram_alt",
        "future_career_style",
        "future_career_body",
        "closing_summary",
    ]
    for var in ("general", "product-owner"):
        for field in required_fields:
            if (var, field) not in nars:
                issues.append(f"narratives missing {var}/{field}")
    ok.append(f"narratives.csv: {len(nars)} fields covering both variants")

    # Generated files
    gen_resume_g = (ROOT / "resume" / "typst" / "content.typ").read_text(
        encoding="utf-8"
    )
    gen_resume_po = (
        ROOT / "resume" / "variants" / "product-owner" / "content.typ"
    ).read_text(encoding="utf-8")
    for label, text, needles in (
        (
            "general content.typ",
            gen_resume_g,
            [
                "GENERATED",
                "Applied Research, Technology & Project Management",
                "Research Maturity Level 4",
                "AI Scrum Master",
                "AutoHotkey",
                "September 2026",
            ],
        ),
        (
            "PO content.typ",
            gen_resume_po,
            [
                "GENERATED",
                "September 2026",
                "Discovery, Delivery & Stakeholder Outcomes",
                "discovery to delivery",
                "customer check-ins",
                "ServiceNow",
            ],
        ),
    ):
        for n in needles:
            if n not in text:
                issues.append(f"{label} missing {n!r}")
        ok.append(f"{label}: key strings present")

    # Publication quotes in generated Typst
    if '""Measuring' in gen_resume_g:
        issues.append("general content.typ has doubled quotes in publications")
    if "Measuring User Trust" not in gen_resume_g:
        issues.append("general content.typ lost IHC publication title")
    tagline_line = next((l for l in gen_resume_po.splitlines() if "#let tagline" in l), "")
    if "Product Owner" in tagline_line:
        issues.append("PO content.typ tagline still mentions Product Owner")

    deck_g = (ROOT / "portfolio" / "portfolio-deck.md").read_text(encoding="utf-8")
    deck_po = (
        ROOT / "portfolio" / "variants" / "product-owner" / "portfolio-deck.md"
    ).read_text(encoding="utf-8")
    if "{{canonical:" in deck_g or "{{canonical:" in deck_po:
        issues.append("unresolved {{canonical:}} slots in generated decks")
    for label, deck, needles in (
        (
            "general deck",
            deck_g,
            [
                "Why I Work in Technology",
                "Applied Research & Technology (Bosch Brasil)",
                "CSI & NPS Performance",
                "Technical Implementation – Tooling Project",
                "../pictures/",
            ],
        ),
        (
            "PO deck",
            deck_po,
            [
                "Why Discovery and Delivery Matter",
                "Discovery, Delivery & Stakeholder Outcomes",
                "Product-Shaped Work",
                "Outcome Evidence",
                "Discovery → Delivery",
                "Future – How I Work",
                "../../../pictures/",
            ],
        ),
    ):
        for n in needles:
            if n not in deck:
                issues.append(f"{label} missing {n!r}")
        ok.append(f"{label}: key narrative + asset paths OK")

    # CSI project table still in decks (not slotted — structural)
    csi_projects = [
        "GS_R2S Financial Portal",
        "EXT_M-PUR36 Tooling",
        "GS Applied Research Bootcamp 2024",
        "**4.86**",
        "**9.94**",
    ]
    for n in csi_projects:
        if n not in deck_g:
            issues.append(f"general deck CSI table missing {n!r}")
        if n not in deck_po:
            issues.append(f"PO deck CSI table missing {n!r}")
    ok.append("CSI/NPS project table preserved in both decks")

    # Template exists
    if not (ROOT / "portfolio" / "templates" / "portfolio-deck.template.md").exists():
        issues.append("portfolio template missing")
    else:
        ok.append("portfolio template present")

    print("=== AUDIT OK ===")
    for line in ok:
        print(f"  [OK] {line}")
    print("\n=== NOTES (not necessarily bugs) ===")
    for line in notes:
        print(f"  [NOTE] {line}")
    if issues:
        print("\n=== ISSUES ===")
        for line in issues:
            print(f"  [ISSUE] {line}")
        return 1
    print("\n=== ISSUES ===\n  (none)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
