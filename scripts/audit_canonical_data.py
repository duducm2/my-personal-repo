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

    about = load("about_linkedin.csv")
    if len(about) != 1:
        issues.append(f"about_linkedin want 1 got {len(about)}")
    elif "analista de dados" not in about[0].get("text_pt", "").lower():
        issues.append("about_linkedin PT missing analista de dados")
    else:
        ok.append("about_linkedin.csv: LinkedIn Sobre summary")

    langs = load("languages.csv")
    if len(langs) < 2:
        issues.append(f"languages want >=2 got {len(langs)}")
    else:
        ids = {r.get("id") for r in langs}
        if "pt" not in ids or "en" not in ids:
            issues.append("languages.csv missing pt/en")
        else:
            ok.append("languages.csv: Portuguese + English")

    titles = load("target_titles.csv")
    if len(titles) != 24:
        issues.append(f"target_titles want 24 got {len(titles)}")
    for tid in (
        "da-title-data-analyst",
        "po-headline",
        "po-title-product-owner",
        "general-headline",
        "dsa-headline",
        "dsa-title-mid-dsa",
        "uxr-headline",
        "uxr-title-ux-researcher",
    ):
        if not any(t.get("id") == tid for t in titles):
            issues.append(f"target_titles missing {tid}")
    for tid in (
        "da-headline",
        "da-title-data-scientist-pl",
        "da-title-applied-ds",
        "da-title-ml-analyst",
    ):
        if any(t.get("id") == tid for t in titles):
            issues.append(f"target_titles should not retain DS-path id {tid}")
    ok.append("target_titles.csv: DA / PO / general / DSA CV titles (no DS path)")

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
        "resume/canonical keep Jan 2020 – Dec 2022 (resume-accurate priority)"
    )

    bullets = load("experience_bullets.csv")
    for b in bullets:
        if b["experience_id"] not in exp_ids:
            issues.append(f"orphan bullet experience_id={b['experience_id']}")
    for eid in exp_ids:
        for var in (
            "general",
            "product-owner",
            "data-analyst",
            "digital-solution-architect",
            "ux-researcher",
        ):
            n = sum(
                1 for b in bullets if b["experience_id"] == eid and b["variant"] == var
            )
            if n == 0:
                issues.append(f"no bullets for {eid} / {var}")
    # Count expectations from original resumes
    expected_counts = {
        ("bosch-ar-2023", "general"): 6,
        ("bosch-ar-2023", "product-owner"): 5,
        ("bosch-ar-2023", "data-analyst"): 7,
        ("bosch-ar-2023", "digital-solution-architect"): 5,
        ("bosch-ar-2023", "ux-researcher"): 5,
        ("bosch-web-2020", "general"): 2,
        ("bosch-web-2020", "product-owner"): 2,
        ("bosch-web-2020", "data-analyst"): 2,
        ("bosch-web-2020", "digital-solution-architect"): 2,
        ("bosch-web-2020", "ux-researcher"): 2,
        ("bosch-hu-2019", "general"): 2,
        ("bosch-hu-2019", "product-owner"): 2,
        ("bosch-hu-2019", "data-analyst"): 2,
        ("bosch-hu-2019", "digital-solution-architect"): 2,
        ("bosch-hu-2019", "ux-researcher"): 2,
        ("bosch-intern-2017", "general"): 1,
        ("bosch-intern-2017", "product-owner"): 1,
        ("bosch-intern-2017", "data-analyst"): 1,
        ("bosch-intern-2017", "digital-solution-architect"): 1,
        ("bosch-intern-2017", "ux-researcher"): 1,
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
        ("general", "UX Maturity Level 4"),
        ("general", "CSI 4.86"),
        ("general", "NPS 9.94"),
        ("general", "ServiceNow"),
        ("general", "Tooling project"),
        ("general", "SENAI"),
        ("product-owner", "customer check-ins"),
        ("product-owner", "UX relevance intake"),
        ("product-owner", "Discovery, Delivery"),
        ("data-analyst", "Power BI"),
        ("data-analyst", "CSI 4.86"),
        ("data-analyst", "Excel"),
        ("data-analyst", "CSV"),
        ("digital-solution-architect", "ServiceNow"),
        ("digital-solution-architect", "Azure"),
        ("digital-solution-architect", "Digitization"),
        ("ux-researcher", "UX Maturity Level 4"),
        ("ux-researcher", "Grounded Theory"),
        ("ux-researcher", "prototyping"),
    ]
    all_bullet_text = {
        "general": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "general"
        ),
        "product-owner": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "product-owner"
        ),
        "data-analyst": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "data-analyst"
        ),
        "digital-solution-architect": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "digital-solution-architect"
        ),
        "ux-researcher": " ".join(
            b.get("text_en", b.get("text", ""))
            for b in bullets
            if b["variant"] == "ux-researcher"
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

    forbidden_da_labels = (
        "Data Analyst Focus",
        "Seeking Data Analyst",
        "Data Analyst Portfolio",
        "Targeting Data Analyst",
        "Data Scientist Focus",
        "Seeking Data Scientist",
        "Data Scientist Portfolio",
        "Targeting Data Scientist",
    )
    da_text = " ".join(
        row.get("text_en", row.get("text", ""))
        for row in load("narratives.csv")
        if row["variant"] == "data-analyst"
    )
    for bad in forbidden_da_labels:
        if bad in da_text:
            issues.append(f"data-analyst narrative still contains meta-label: {bad!r}")
    ok.append("data-analyst narratives: no DA meta-labels")

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
    ds_core = [
        s for s in skills if s["variant"] == "data-analyst" and s["category"] == "Core"
    ]
    ds_tech = [
        s for s in skills if s["variant"] == "data-analyst" and s["category"] == "Tech"
    ]
    if len(g_core) != 4:
        issues.append(f"general Core skills want 4 got {len(g_core)}")
    if len(g_tech) != 18:
        issues.append(f"general Tech skills want 18 got {len(g_tech)}")
    if len(po_core) != 5:
        issues.append(f"PO Core skills want 5 got {len(po_core)}")
    if len(po_tech) != 19:
        issues.append(f"PO Tech skills want 19 got {len(po_tech)}")
    if len(ds_core) != 6:
        issues.append(f"DA Core skills want 6 got {len(ds_core)}")
    if len(ds_tech) != 20:
        issues.append(f"DA Tech skills want 20 got {len(ds_tech)}")
    dsa_core = [
        s
        for s in skills
        if s["variant"] == "digital-solution-architect" and s["category"] == "Core"
    ]
    dsa_tech = [
        s
        for s in skills
        if s["variant"] == "digital-solution-architect" and s["category"] == "Tech"
    ]
    if len(dsa_core) != 7:
        issues.append(f"DSA Core skills want 7 got {len(dsa_core)}")
    if len(dsa_tech) != 18:
        issues.append(f"DSA Tech skills want 18 got {len(dsa_tech)}")
    uxr_core = [
        s
        for s in skills
        if s["variant"] == "ux-researcher" and s["category"] == "Core"
    ]
    uxr_tech = [
        s
        for s in skills
        if s["variant"] == "ux-researcher" and s["category"] == "Tech"
    ]
    if len(uxr_core) != 7:
        issues.append(f"UXR Core skills want 7 got {len(uxr_core)}")
    if len(uxr_tech) != 18:
        issues.append(f"UXR Tech skills want 18 got {len(uxr_tech)}")
    if any(s["variant"] == "data-scientist" for s in skills):
        issues.append("skills.csv still has data-scientist rows")
    ok.append("skills.csv counts match resume baselines")

    edu = load("education.csv")
    if len(edu) != 3:
        issues.append(f"education want 3 got {len(edu)}")
    if "perceived trust" not in edu[0].get("detail_en", edu[0].get("detail", "")):
        issues.append("master's dissertation detail missing perceived trust")
    inst = edu[0].get("institution_en", edu[0].get("institution", ""))
    if "2023–2026" not in inst and "2023–2026" not in edu[0].get("institution_pt", ""):
        issues.append("master's institution missing 2023–2026 dates")
    ok.append("education.csv: 3 degrees + dissertation detail + 2023–2026 dates")

    edu_li = load("education_linkedin.csv")
    if len(edu_li) != 4:
        issues.append(f"education_linkedin want 4 got {len(edu_li)}")
    for eid in (
        "unicamp-msc-2023",
        "unicamp-ads-2015",
        "etec-informatics-2012",
        "emesf-fundamental-2008",
    ):
        if not any(e.get("id") == eid for e in edu_li):
            issues.append(f"education_linkedin missing {eid}")
    ok.append("education_linkedin.csv: Unicamp MSc/ADS, ETEC, EMESF")

    exp_li = load("experience_linkedin.csv")
    if len(exp_li) != 6:
        issues.append(f"experience_linkedin want 6 got {len(exp_li)}")
    for eid in (
        "bosch-br-researcher-designer-2023",
        "bosch-br-web-developer-2021",
        "bosch-br-cip-analyst-2020",
        "bosch-hu-digitization-2019",
        "bosch-intern-2017",
        "unicamp-scholarship-2015",
    ):
        if not any(e.get("id") == eid for e in exp_li):
            issues.append(f"experience_linkedin missing {eid}")
    ok.append("experience_linkedin.csv: Bosch BR/HU + Unicamp scholarship")

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
        ui_labels = [r for r in fl if r["domain"] == "resume_ui"]
        if len(ui_labels) < 13:
            issues.append(f"field_labels resume_ui want >=13 got {len(ui_labels)}")
        ok.append(f"field_labels.csv: {len(fl)} key labels (EN/PT)")

    # PT translation completeness
    PT_IDENTICAL_OK = {
        ("general", "future_career_style"),
        ("product-owner", "future_career_style"),
        ("data-analyst", "future_career_style"),
        ("digital-solution-architect", "future_career_style"),
        ("ux-researcher", "future_career_style"),
        ("general", "future_intro"),  # intentionally empty in EN and PT
    }
    narratives_rows = load("narratives.csv")
    pt_gaps: list[str] = []
    for row in narratives_rows:
        key = (row["variant"], row["field"])
        pt = row.get("text_pt", "").strip()
        en = row.get("text_en", row.get("text", "")).strip()
        if key in PT_IDENTICAL_OK:
            continue
        if not pt:
            pt_gaps.append(f"{row['variant']}/{row['field']}: text_pt empty")
        elif pt == en:
            pt_gaps.append(f"{row['variant']}/{row['field']}: text_pt identical to EN")
    if pt_gaps:
        for gap in pt_gaps:
            issues.append(f"PT narrative gap: {gap}")
    else:
        ok.append("narratives.csv: PT translations complete (required fields)")

    bullet_pt_gaps: list[str] = []
    for row in load("experience_bullets.csv"):
        pt = row.get("text_pt", "").strip()
        en = row.get("text_en", row.get("text", "")).strip()
        if not pt or pt == en:
            bullet_pt_gaps.append(
                f"{row['experience_id']}/{row['variant']}/{row['sort_order']}"
            )
    if bullet_pt_gaps:
        for gap in bullet_pt_gaps:
            issues.append(f"PT bullet gap: {gap}")
    else:
        ok.append("experience_bullets.csv: PT text present")

    # PT voice warnings (3rd person / impersonal patterns in profile + bullets)
    PT_VOICE_PATTERNS = [
        (
            re.compile(r"\bque (ajuda|conecta|usa|esclarece|alinha|guia)\b", re.I),
            "3rd-person relative clause",
        ),
        (re.compile(r"\bAspira a\b"), "Aspira a (use Aspiro)"),
        (re.compile(r"\bLiderança (na|das)\b"), "nominal Liderança (prefer Liderei)"),
        (re.compile(r"^Integração ", re.M), "nominal Integração (prefer Integrei)"),
        (
            re.compile(r"^Colaboração em", re.M),
            "nominal Colaboração (prefer Colaborei)",
        ),
    ]
    voice_warn: list[str] = []
    for row in narratives_rows:
        if row["field"] not in ("profile", "present_table", "tooling_bullet"):
            continue
        text = row.get("text_pt", "")
        for pat, label in PT_VOICE_PATTERNS:
            if pat.search(text):
                voice_warn.append(f"{row['variant']}/{row['field']}: {label}")
    for row in load("experience_bullets.csv"):
        text = row.get("text_pt", "")
        for pat, label in PT_VOICE_PATTERNS:
            if pat.search(text):
                voice_warn.append(
                    f"bullet {row['experience_id']}/{row['variant']}/{row['sort_order']}: {label}"
                )
    if voice_warn:
        for w in voice_warn:
            notes.append(f"PT voice check: {w}")
    else:
        ok.append("PT voice: no common 3rd-person patterns in profile/bullets")

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
    if len(add) != 5:
        issues.append(f"additional want 5 got {len(add)}")
    ok.append(
        "additional.csv: TAR 2026, Talent Forum, X-Games, Sharing Successes, Hospitalhaços"
    )

    rec = load("recognitions.csv")
    if len(rec) != 4:
        issues.append(f"recognitions want 4 got {len(rec)}")
    for rid in (
        "bosch-tar-2026",
        "bosch-talent-forum-2018",
        "x-games-brazil-2018",
        "sharing-successes-2017",
    ):
        if not any(r.get("id") == rid for r in rec):
            issues.append(f"recognitions missing {rid}")
    ok.append("recognitions.csv: TAR 2026, Talent Forum, X-Games, Sharing Successes")

    courses = load("courses.csv")
    if len(courses) != 7:
        issues.append(f"courses want 7 got {len(courses)}")
    for cid in (
        "academic-writing",
        "innovation-creativity-bosch",
        "innovation-tech-transfer",
        "scientific-research",
        "storytelling",
        "storytelling-valeria-aguiar",
        "im-ux1-experience-design-thinking",
    ):
        if not any(c.get("id") == cid for c in courses):
            issues.append(f"courses missing {cid}")
    ok.append("courses.csv: Unicamp + Bosch courses")

    competences = load("competences.csv")
    if len(competences) != 43:
        issues.append(f"competences want 43 got {len(competences)}")
    for cid in (
        "ai-systems",
        "power-bi",
        "project-management",
        "figma",
        "english",
        "autohotkey",
        "python",
        "mnemonics",
    ):
        if not any(c.get("id") == cid for c in competences):
            issues.append(f"competences missing {cid}")
    ok.append("competences.csv: LinkedIn skills snapshot")

    volunteering = load("volunteering.csv")
    if len(volunteering) != 1:
        issues.append(f"volunteering want 1 got {len(volunteering)}")
    if not any(v.get("id") == "hospitalhacos-it-assistant" for v in volunteering):
        issues.append("volunteering missing hospitalhacos-it-assistant")
    ok.append("volunteering.csv: Hospitalhaços IT Assistant")

    certifications = load("certifications.csv")
    if len(certifications) != 7:
        issues.append(f"certifications want 7 got {len(certifications)}")
    for cid in (
        "ieee-hfsd-trustmate-2025",
        "sbc-ihc-2025",
        "unicamp-scientific-writing-ai-2023",
        "udemy-react-complete-guide-2021",
        "unicamp-ads-technologist-2020",
        "etec-informatics-technician-2012",
        "aecomp-basic-electrical",
    ):
        if not any(c.get("id") == cid for c in certifications):
            issues.append(f"certifications missing {cid}")
    ok.append("certifications.csv: IEEE, SBC, Unicamp, Udemy, ETEC, Ae Comp")

    projects = load("projects.csv")
    for pid in (
        "tooling-pt",
        "data-insights-pt",
        "cip-research-gate",
        "maturity-l4",
        "outcomes-2024-2025",
        "infovis-msc",
        "dissertation-trustmate-stats",
        "ai-tools-training",
        "agritech-iot-cattle",
    ):
        if not any(r["id"] == pid for r in projects):
            issues.append(f"projects.csv missing {pid}")
    for need in ("summary_en", "summary_detail_en", "summary_pt", "summary_detail_pt"):
        if need not in (projects[0] if projects else {}):
            issues.append(f"projects.csv missing column {need}")
    di = next((r for r in projects if r["id"] == "data-insights-pt"), None)
    if di and not (di.get("summary_detail_en") or "").strip():
        issues.append("data-insights-pt summary_detail_en empty")
    ok.append("projects.csv: tooling/CIP/maturity/outcomes/AI training/AgriTech")

    companies_path = CANON / "companies.csv"
    if not companies_path.exists():
        issues.append("companies.csv missing")
    else:
        companies = load("companies.csv")
        if len(companies) < 7:
            issues.append(
                f"companies.csv expected >= 7 seed rows, got {len(companies)}"
            )
        for cid in (
            "ascenty-sumare",
            "ascenty-campinas",
            "scala-svcpcp01",
            "ascenty-paulinia",
            "cloud-hq-paulinia",
            "consultimer-dc",
            "odata-sp02",
        ):
            if not any(c.get("id") == cid for c in companies):
                issues.append(f"companies.csv missing {cid}")
        for need in (
            "category_en",
            "name_en",
            "city_en",
            "region_en",
            "priority",
            "status",
            "fit_data_analyst",
            "fit_product_owner",
            "fit_digital_solution_architect",
            "fit_ux_researcher",
            "skills_match_en",
            "fit_why_en",
            "notes_en",
            "notes_detail_en",
        ):
            if need not in (companies[0] if companies else {}):
                issues.append(f"companies.csv missing column {need}")
        multi = [
            c
            for c in companies
            if sum(
                1
                for k in (
                    "fit_data_analyst",
                    "fit_product_owner",
                    "fit_digital_solution_architect",
                    "fit_ux_researcher",
                )
                if (c.get(k) or "").strip().lower() in ("yes", "y", "1", "true")
            )
            >= 2
        ]
        if not multi:
            issues.append("companies.csv: expected at least one multi-role company")
        bosch = next((c for c in companies if c.get("id") == "bosch-brasil"), None)
        if bosch:
            for k in (
                "fit_data_analyst",
                "fit_product_owner",
                "fit_digital_solution_architect",
                "fit_ux_researcher",
            ):
                if (bosch.get(k) or "").strip().lower() not in (
                    "yes",
                    "y",
                    "1",
                    "true",
                ):
                    issues.append(f"bosch-brasil should fit all roles ({k})")
        for cid in (
            "eldorado-campinas",
            "ciandt-campinas",
            "cpqd-campinas",
            "cpfl-campinas",
            "agibank-campinas",
            "msx-campinas",
        ):
            row = next((c for c in companies if c.get("id") == cid), None)
            if not row:
                issues.append(f"companies.csv missing regional DA employer {cid}")
            elif (row.get("fit_data_analyst") or "").strip().lower() not in (
                "yes",
                "y",
                "1",
                "true",
            ):
                issues.append(f"{cid} should have fit_data_analyst=yes")
            elif not (row.get("skills_match_en") or "").strip():
                issues.append(f"{cid} missing skills_match_en")
            elif not (row.get("fit_why_en") or "").strip():
                issues.append(f"{cid} missing fit_why_en")
        for cid in (
            "microsoft-global",
            "google-global",
            "gitlab-global",
            "sap-global",
            "siemens-global",
            "bytedance-global",
            "alibaba-global",
            "spotify-global",
        ):
            row = next((c for c in companies if c.get("id") == cid), None)
            if not row:
                issues.append(f"companies.csv missing global enterprise {cid}")
            elif (row.get("fit_data_analyst") or "").strip().lower() not in (
                "yes",
                "y",
                "1",
                "true",
            ):
                issues.append(f"{cid} should have fit_data_analyst=yes")
            elif "global enterprise" not in (row.get("category_en") or "").lower():
                issues.append(f"{cid} should be categorized as Global enterprise")
        ok.append(
            "companies.csv: Campinas DC + regional DA + global remote-track enterprises"
        )

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
        "infovis_pnad_h2",
        "infovis_pnad_bullets",
        "infovis_phrasenet_h2",
        "infovis_phrasenet_bullets",
        "dissertation_pbi_intro",
        "dissertation_pbi_bullets",
        "future_h2",
        "future_intro",
        "future_diagram_alt",
        "future_career_style",
        "future_career_body",
        "closing_summary",
        "h_who",
        "h_who_attr",
        "h_who_value",
        "h_who_name",
        "h_who_role",
        "h_who_impact",
        "h_who_contact",
        "h_past_academic",
        "h_past_feeling",
        "h_past_grade",
        "h_past_grade_note",
        "h_past_experience",
        "h_past_trajectory",
        "h_cip_artifacts",
        "h_academic_research",
        "h_publications",
        "h_publications_intro",
        "h_pbi_work",
        "h_pbi_work_bullet",
        "h_dissertation_pbi",
        "h_diss_tech",
        "h_diss_tech_bullet",
        "h_tech_impl",
        "h_proposal",
        "h_interests",
        "h_interests_bullet",
        "h_interests_col",
        "h_interests_rows",
        "h_closing",
        "h_closing_connect",
        "h_closing_request",
        "h_infovis_diagram_alt",
    ]
    for var in (
        "general",
        "product-owner",
        "data-analyst",
        "digital-solution-architect",
        "ux-researcher",
    ):
        for field in required_fields:
            if (var, field) not in nars:
                issues.append(f"narratives missing {var}/{field}")
    ok.append(f"narratives.csv: {len(nars)} fields covering all variants")

    # Future block must not reuse senior-DA copy on non-DA career paths
    future_fields = (
        "future_h2",
        "future_intro",
        "future_diagram_alt",
        "future_career_body",
    )
    da_future_needles = (
        "senior data analyst",
        "analista de dados sênior",
        "analista de dados senior",
    )
    path_variants = (
        "product-owner",
        "digital-solution-architect",
        "ux-researcher",
    )
    for row in load("narratives.csv"):
        if row["variant"] == "data-scientist":
            issues.append(
                f"narratives still has data-scientist field {row.get('field')}"
            )
            continue
        if row["variant"] not in path_variants:
            continue
        if row["field"] not in future_fields:
            continue
        blob = f"{row.get('text_en', '')} {row.get('text_pt', '')}".lower()
        for needle in da_future_needles:
            if needle in blob:
                issues.append(
                    f"narratives {row['variant']}/{row['field']} still has "
                    f"data-analyst future copy ({needle!r})"
                )
    ok.append("narratives.csv: PO / DSA future_* free of senior-DA career copy")

    # Generated files (EN lang-suffixed + legacy content.typ)
    gen_resume_g = (ROOT / "resume" / "typst" / "content.en.typ").read_text(
        encoding="utf-8"
    )
    gen_resume_po = (
        ROOT / "resume" / "variants" / "product-owner" / "content.en.typ"
    ).read_text(encoding="utf-8")
    gen_resume_ds = (
        ROOT / "resume" / "variants" / "data-analyst" / "content.en.typ"
    ).read_text(encoding="utf-8")
    gen_resume_dsa = (
        ROOT / "resume" / "variants" / "digital-solution-architect" / "content.en.typ"
    ).read_text(encoding="utf-8")
    gen_resume_uxr = (
        ROOT / "resume" / "variants" / "ux-researcher" / "content.en.typ"
    ).read_text(encoding="utf-8") if (ROOT / "resume" / "variants" / "ux-researcher" / "content.en.typ").is_file() else ""
    gen_resume_g_pt = (ROOT / "resume" / "typst" / "content.pt.typ").read_text(
        encoding="utf-8"
    )
    for label, text, needles in (
        (
            "general content.typ",
            gen_resume_g,
            [
                "GENERATED",
                "Applied Research, Technology & Project Management",
                "UX Maturity Level 4",
                "AI Scrum Master",
                "AutoHotkey",
                "2023–2026",
            ],
        ),
        (
            "PO content.typ",
            gen_resume_po,
            [
                "GENERATED",
                "2023–2026",
                "Discovery, Delivery & Stakeholder Outcomes",
                "discovery to delivery",
                "customer check-ins",
                "ServiceNow",
            ],
        ),
        (
            "DA content.typ",
            gen_resume_ds,
            [
                "GENERATED",
                "2023–2026",
                "Data Analyst | AI for Data Manipulation, Validation & Applied Insights",
                "Power BI",
                "measurable insight",
                "CSI 4.86",
                "Excel",
                "CSV",
            ],
        ),
        (
            "DSA content.typ",
            gen_resume_dsa,
            [
                "GENERATED",
                "2023–2026",
                "Digital Solution Architect",
                "Azure",
                "ServiceNow",
                "digitization",
            ],
        ),
        (
            "UXR content.typ",
            gen_resume_uxr,
            [
                "GENERATED",
                "2023–2026",
                "UX Researcher & Design Technologist",
                "Grounded Theory",
                "UX Maturity Level 4",
                "Figma",
            ],
        ),
    ):
        for n in needles:
            if n not in text:
                issues.append(f"{label} missing {n!r}")
        ok.append(f"{label}: key strings present")

    if "#let ui = (" not in gen_resume_g_pt:
        issues.append("PT content.pt.typ missing ui labels dict")
    if "EXPERIÊNCIA" not in gen_resume_g_pt:
        issues.append("PT content.pt.typ missing Portuguese section labels")
    ok.append("content.pt.typ: UI labels and PT section headings present")

    # Publication quotes in generated Typst
    if '""Measuring' in gen_resume_g:
        issues.append("general content.typ has doubled quotes in publications")
    if "Measuring User Trust" not in gen_resume_g:
        issues.append("general content.typ lost IHC publication title")
    tagline_line = next(
        (l for l in gen_resume_po.splitlines() if "#let tagline" in l), ""
    )
    if "Product Owner" in tagline_line:
        issues.append("PO content.typ tagline still mentions Product Owner")
    ds_tagline = next(
        (l for l in gen_resume_ds.splitlines() if "#let tagline" in l), ""
    )
    if "Data Scientist" in ds_tagline:
        issues.append("DA content.typ tagline still mentions Data Scientist as a title")

    deck_g = (ROOT / "portfolio" / "portfolio-deck.en.md").read_text(encoding="utf-8")
    deck_po = (
        ROOT / "portfolio" / "variants" / "product-owner" / "portfolio-deck.en.md"
    ).read_text(encoding="utf-8")
    deck_ds = (
        ROOT / "portfolio" / "variants" / "data-analyst" / "portfolio-deck.en.md"
    ).read_text(encoding="utf-8")
    deck_dsa = (
        ROOT
        / "portfolio"
        / "variants"
        / "digital-solution-architect"
        / "portfolio-deck.en.md"
    ).read_text(encoding="utf-8")
    deck_uxr_file = (
        ROOT
        / "portfolio"
        / "variants"
        / "ux-researcher"
        / "portfolio-deck.en.md"
    )
    deck_uxr = deck_uxr_file.read_text(encoding="utf-8") if deck_uxr_file.is_file() else ""
    deck_g_pt = (ROOT / "portfolio" / "portfolio-deck.pt.md").read_text(
        encoding="utf-8"
    )
    if (
        "{{canonical:" in deck_g
        or "{{canonical:" in deck_po
        or "{{canonical:" in deck_ds
        or "{{canonical:" in deck_dsa
        or (deck_uxr and "{{canonical:" in deck_uxr)
    ):
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
        (
            "DA deck",
            deck_ds,
            [
                "Why I Work with Data",
                "Data Analyst | AI for Data Manipulation, Validation & Applied Insights",
                "Data, Metrics & Applied Research",
                "Excel & CSV",
                "Outcome Metrics",
                "How I Work with Data",
                "../../../pictures/",
            ],
        ),
        (
            "DSA deck",
            deck_dsa,
            [
                "Why I Design Digital Solutions",
                "Digital Solution Architect",
                "Digitization, Architecture Gates",
                "Cloud Architecture",
                "../../../pictures/",
            ],
        ),
        (
            "UXR deck",
            deck_uxr,
            [
                "Why I Practice UX Research and Design",
                "UX Researcher & Design Technologist",
                "UX Research, Design Technologist & Governance",
                "UX Research & Design for Emerging Technologies",
                "../../../pictures/",
            ],
        ),
    ):
        for n in needles:
            if n not in deck:
                issues.append(f"{label} missing {n!r}")
        ok.append(f"{label}: key narrative + asset paths OK")

    if "Por que trabalho" not in deck_g_pt:
        issues.append("PT general deck missing Portuguese why slide")
    ok.append("portfolio-deck.pt.md: Portuguese narrative present")

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
        if n not in deck_ds:
            issues.append(f"DA deck CSI table missing {n!r}")
        if n not in deck_dsa:
            issues.append(f"DSA deck CSI table missing {n!r}")
    ok.append("CSI/NPS project table preserved in all decks")

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
