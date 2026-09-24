"""Assemble autofill values from canonical career data for a given job opening."""

from __future__ import annotations

from pathlib import Path
from typing import Any


def _cell(row: dict[str, Any] | None, key: str, default: str = "") -> str:
    if not row:
        return default
    val = row.get(key)
    if val is None:
        return default
    return str(val).strip()


def _first(rows: list[dict[str, Any]] | None) -> dict[str, Any]:
    if not rows:
        return {}
    return rows[0]


def _split_name(full_name: str) -> tuple[str, str]:
    parts = [p for p in full_name.split() if p]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def _narrative_profile(narratives: list[dict[str, Any]], variant: str, lang: str = "en") -> str:
    field_key = "text_en" if lang == "en" else "text_pt"
    # Prefer exact variant profile, then general
    for want in (variant, "general"):
        for row in narratives or []:
            if _cell(row, "variant") == want and _cell(row, "field") == "profile":
                text = _cell(row, field_key)
                if text:
                    return text
    return ""


def _skills_list(skills: list[dict[str, Any]], variant: str, lang: str = "en", limit: int = 12) -> str:
    label_key = "label_en" if lang == "en" else "label_pt"
    picked: list[str] = []
    for want in (variant, "general"):
        for row in skills or []:
            if _cell(row, "variant") != want:
                continue
            lab = _cell(row, label_key)
            if lab and lab not in picked:
                picked.append(lab)
            if len(picked) >= limit:
                return ", ".join(picked)
    return ", ".join(picked)


def _latest_employer(experience: list[dict[str, Any]]) -> dict[str, str]:
    if not experience:
        return {}
    # sort_order ascending = most recent first in this repo
    row = experience[0]
    return {
        "company": _cell(row, "company_en") or _cell(row, "company"),
        "title_en": _cell(row, "title_en"),
        "title_pt": _cell(row, "title_pt"),
        "start_date": _cell(row, "start_date"),
        "end_date": _cell(row, "end_date"),
    }


def _experience_summary(experience: list[dict[str, Any]], lang: str = "en") -> str:
    title_key = "title_en" if lang == "en" else "title_pt"
    date_key = "date_display_en" if lang == "en" else "date_display_pt"
    company_key = "company_en" if lang == "en" else "company_pt"
    lines: list[str] = []
    for row in experience or []:
        company = _cell(row, company_key) or _cell(row, "company")
        title = _cell(row, title_key)
        dates = _cell(row, date_key)
        if company or title:
            lines.append(f"{title} @ {company} ({dates})".strip())
    return "\n".join(lines)


def _education_summary(education: list[dict[str, Any]], lang: str = "en") -> str:
    deg = "degree_en" if lang == "en" else "degree_pt"
    inst = "institution_en" if lang == "en" else "institution_pt"
    lines = []
    for row in education or []:
        lines.append(f"{_cell(row, deg)} {_cell(row, inst)}".strip())
    return "\n".join(lines)


def _highest_degree(education: list[dict[str, Any]], lang: str = "en") -> str:
    if not education:
        return ""
    deg = "degree_en" if lang == "en" else "degree_pt"
    return _cell(education[0], deg).rstrip(":")


def find_opening(openings: list[dict[str, Any]], job_id: str | None) -> dict[str, Any]:
    if not job_id:
        return {}
    for row in openings or []:
        if _cell(row, "id") == job_id:
            return row
    return {}


def build_autofill_bundle(
    collections: dict[str, list[dict[str, Any]]],
    job_id: str | None = None,
    lang: str = "en",
) -> dict[str, Any]:
    """Return values_by_key, available_keys, and job metadata for mapping."""
    profile = _first(collections.get("profile") or [])
    experience = collections.get("experience") or []
    education = collections.get("education") or []
    skills = collections.get("skills") or []
    narratives = collections.get("narratives") or []
    languages = collections.get("languages") or []
    openings = collections.get("jobOpenings") or collections.get("job_openings") or []

    # CanonicalStore uses camelCase keys — check both
    if not openings:
        for key in collections:
            if "opening" in key.lower():
                openings = collections[key]
                break

    opening = find_opening(openings, job_id)
    variant = _cell(opening, "recommended_resume") or "general"
    if variant not in {
        "general",
        "product-owner",
        "data-analyst",
        "digital-solution-architect",
        "data-scientist",
    }:
        variant = "general"

    full_name = _cell(profile, "full_name")
    first_name, last_name = _split_name(full_name)
    display_name = _cell(profile, "display_name") or full_name
    email = _cell(profile, "email")
    phone = _cell(profile, "phone")
    linkedin = _cell(profile, "linkedin_url")
    location = _cell(profile, "location_en" if lang == "en" else "location_pt")
    city = location.split(",")[0].strip() if location else ""
    country = "Brazil" if "brazil" in location.lower() or "brasil" in location.lower() else ""

    employer = _latest_employer(experience)
    about = _narrative_profile(narratives, variant, lang)
    skills_csv = _skills_list(skills, variant, lang)
    cover = _cell(opening, "cover_letter")
    if cover and _cell(opening, "cover_letter_greeting"):
        cover_full = (
            f"{_cell(opening, 'cover_letter_greeting')}\n\n{cover}\n\n"
            f"{_cell(opening, 'cover_letter_closing')}"
        ).strip()
    else:
        cover_full = cover

    lang_labels = []
    for row in languages:
        name = _cell(row, "name_en" if lang == "en" else "name_pt") or _cell(row, "language_en") or _cell(row, "label_en")
        level = _cell(row, "level_en" if lang == "en" else "level_pt") or _cell(row, "proficiency_en")
        if name:
            lang_labels.append(f"{name} ({level})" if level else name)
    if not lang_labels:
        lang_labels = [_cell(profile, "languages_en" if lang == "en" else "languages_pt")]

    # Application-answer helpers from job record
    app_answers_raw = _cell(opening, "application_answers")

    values: dict[str, str] = {
        "full_name": full_name,
        "first_name": first_name,
        "last_name": last_name,
        "display_name": display_name,
        "email": email,
        "phone": phone,
        "linkedin_url": linkedin,
        "lattes_url": _cell(profile, "lattes_url"),
        "orcid_url": _cell(profile, "orcid_url"),
        "location": location,
        "city": city,
        "country": country or "Brazil",
        "country_code": "BR",
        "about": about,
        "summary": about,
        "skills": skills_csv,
        "experience_summary": _experience_summary(experience, lang),
        "current_company": employer.get("company", ""),
        "current_title": employer.get("title_en" if lang == "en" else "title_pt", "")
        or employer.get("title_en", ""),
        "education_summary": _education_summary(education, lang),
        "highest_degree": _highest_degree(education, lang),
        "languages": "; ".join([x for x in lang_labels if x]),
        "cover_letter": cover_full,
        "website": linkedin,
        "github": "",
        "portfolio": linkedin,
        "salary_expectation": _cell(opening, "salary_range"),
        "work_authorization_note": "Brazilian citizen; open to remote roles (Canada, UK, US, etc.) as permitted by the employer.",
        "relocation": "Open to discussion for the right remote / hybrid role.",
        "hear_about": "Company careers page",
        "yes": "Yes",
        "no": "No",
        "true": "true",
        "false": "false",
    }

    # Common legal / EE0 defaults left empty on purpose (user must confirm)
    # But provide non-sensitive convenience defaults that are usually safe:
    values["pronouns"] = ""
    values["gender"] = ""
    values["ethnicity"] = ""
    values["veteran"] = ""
    values["disability"] = ""

    if app_answers_raw:
        values["application_answers_json"] = app_answers_raw

    labels = {
        "full_name": "Full name",
        "first_name": "First name",
        "last_name": "Last name / surname",
        "display_name": "Display name",
        "email": "Email",
        "phone": "Phone",
        "linkedin_url": "LinkedIn URL",
        "lattes_url": "Lattes URL",
        "orcid_url": "ORCID URL",
        "location": "Location / address",
        "city": "City",
        "country": "Country",
        "country_code": "Country code",
        "about": "About / profile summary",
        "summary": "Professional summary",
        "skills": "Skills",
        "experience_summary": "Work experience summary",
        "current_company": "Current / most recent company",
        "current_title": "Current / most recent title",
        "education_summary": "Education summary",
        "highest_degree": "Highest degree",
        "languages": "Languages",
        "cover_letter": "Cover letter",
        "website": "Website",
        "portfolio": "Portfolio URL",
        "salary_expectation": "Salary expectation",
        "work_authorization_note": "Work authorization note",
        "relocation": "Relocation preference",
        "hear_about": "How did you hear about this role",
        "yes": "Yes",
        "no": "No",
    }

    available_keys = [
        {"key": k, "label": labels.get(k, k), "preview": (values.get(k) or "")[:120]}
        for k in labels
        if values.get(k)
    ]

    return {
        "job_id": _cell(opening, "id") or job_id,
        "job": {
            "id": _cell(opening, "id"),
            "company": _cell(opening, "company"),
            "role_title": _cell(opening, "role_title"),
            "job_url": _cell(opening, "job_url"),
            "status": _cell(opening, "status"),
            "recommended_resume": variant,
            "match_score": _cell(opening, "match_score"),
        }
        if opening
        else None,
        "variant": variant,
        "lang": lang,
        "values_by_key": values,
        "available_keys": available_keys,
    }


def list_autofill_jobs(collections: dict[str, list[dict[str, Any]]]) -> list[dict[str, str]]:
    openings = collections.get("jobOpenings") or []
    if not openings:
        for key, rows in collections.items():
            if "opening" in key.lower():
                openings = rows
                break
    out: list[dict[str, str]] = []
    skip_status = {"excluded", "closed", "rejected", "hired"}
    for row in openings:
        status = _cell(row, "status").lower()
        if status in skip_status:
            continue
        out.append(
            {
                "id": _cell(row, "id"),
                "company": _cell(row, "company"),
                "role_title": _cell(row, "role_title"),
                "status": _cell(row, "status"),
                "job_url": _cell(row, "job_url"),
                "recommended_resume": _cell(row, "recommended_resume"),
                "priority": _cell(row, "priority"),
                "match_score": _cell(row, "match_score"),
            }
        )
    # Prefer high match / high priority first
    def sort_key(j: dict[str, str]) -> tuple:
        try:
            score = -int(j.get("match_score") or 0)
        except ValueError:
            score = 0
        pri = {"high": 0, "medium": 1, "low": 2}.get((j.get("priority") or "").lower(), 3)
        return (pri, score, j.get("company") or "", j.get("role_title") or "")

    out.sort(key=sort_key)
    return out


def default_mappings_path(root: Path) -> Path:
    return root / "my-data" / "autofill" / "mappings.json"
