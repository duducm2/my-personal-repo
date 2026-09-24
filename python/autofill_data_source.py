"""Assemble autofill values from canonical career data for a given job opening."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


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
        payload = parse_application_answers(_cell(row, "application_answers"))
        out.append(
            {
                "id": _cell(row, "id"),
                "company": _cell(row, "company"),
                "role_title": _cell(row, "role_title"),
                "status": _cell(row, "status"),
                "job_url": _cell(row, "job_url"),
                "form_url": _cell(row, "form_url")
                or (payload or {}).get("form_url")
                or "",
                "has_payload": "1" if payload and payload.get("fields") else "0",
                "field_count": str(len((payload or {}).get("fields") or [])),
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
        has = 0 if j.get("has_payload") == "1" else 1
        return (has, pri, score, j.get("company") or "", j.get("role_title") or "")

    out.sort(key=sort_key)
    return out


def default_mappings_path(root: Path) -> Path:
    return root / "my-data" / "autofill" / "mappings.json"


def url_key(url: str) -> str:
    """Normalize URL to origin + pathname (ignore query/hash, trailing slash)."""
    raw = (url or "").strip()
    if not raw:
        return ""
    try:
        p = urlparse(raw)
    except ValueError:
        return raw.lower().rstrip("/")
    if not p.scheme or not p.netloc:
        return raw.lower().rstrip("/")
    path = (p.path or "/").rstrip("/") or "/"
    return f"{p.scheme.lower()}://{p.netloc.lower()}{path}"


def parse_application_answers(raw: str) -> dict[str, Any] | None:
    text = (raw or "").strip()
    if not text:
        return None
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict) or not isinstance(data.get("fields"), list):
        return None
    fields = []
    for f in data["fields"]:
        if not isinstance(f, dict):
            continue
        fields.append(
            {
                "key": str(f.get("key") or "").strip(),
                "label": str(f.get("label") or f.get("key") or "").strip(),
                "value": "" if f.get("value") is None else str(f.get("value")),
                "source": str(f.get("source") or "").strip(),
                "note": str(f.get("note") or "").strip(),
            }
        )
    return {
        "opening_id": str(data.get("opening_id") or "").strip(),
        "recommended_resume": str(data.get("recommended_resume") or "").strip(),
        "form_url": str(data.get("form_url") or "").strip(),
        "source_url": str(data.get("source_url") or "").strip(),
        "imported_at": str(data.get("imported_at") or "").strip(),
        "fields": fields,
    }


def _job_openings(collections: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    openings = collections.get("jobOpenings") or []
    if openings:
        return openings
    for key, rows in collections.items():
        if "opening" in key.lower():
            return rows
    return []


def find_payload_by_url(
    collections: dict[str, list[dict[str, Any]]],
    *,
    url: str,
    job_id: str | None = None,
) -> dict[str, Any]:
    """Resolve imported application_answers for an active tab URL."""
    openings = _job_openings(collections)
    target = url_key(url)
    preferred = find_opening(openings, job_id) if job_id else {}

    def pack(row: dict[str, Any], payload: dict[str, Any], reason: str) -> dict[str, Any]:
        return {
            "ok": True,
            "match_reason": reason,
            "url": url,
            "url_key": target,
            "job": {
                "id": _cell(row, "id"),
                "company": _cell(row, "company"),
                "role_title": _cell(row, "role_title"),
                "job_url": _cell(row, "job_url"),
                "status": _cell(row, "status"),
                "recommended_resume": _cell(row, "recommended_resume")
                or payload.get("recommended_resume")
                or "",
            },
            "payload": payload,
            "field_count": len(payload.get("fields") or []),
            "form_url": payload.get("form_url") or _cell(row, "form_url") or "",
            "source_url": payload.get("source_url") or _cell(row, "job_url"),
            "url_matches_form": bool(
                url_key(payload.get("form_url") or _cell(row, "form_url") or "")
                == target
                and target
            ),
            "url_matches_job": bool(
                _cell(row, "job_url") and url_key(_cell(row, "job_url")) == target
            ),
        }

    candidates: list[tuple[int, str, dict[str, Any], dict[str, Any]]] = []
    # priority: form_url match (0), job_url match (1), preferred job_id with payload (2)
    for row in openings:
        payload = parse_application_answers(_cell(row, "application_answers"))
        if not payload or not payload.get("fields"):
            continue
        # Prefer first-class form_url column; fall back to payload metadata.
        form_candidate = _cell(row, "form_url") or (payload.get("form_url") or "")
        form_k = url_key(form_candidate)
        job_k = url_key(_cell(row, "job_url"))
        if target and form_k and form_k == target:
            # Ensure payload carries the authoritative form_url for the client.
            payload = {**payload, "form_url": form_candidate}
            candidates.append((0, "form_url", row, payload))
        elif target and job_k and job_k == target:
            payload = {**payload, "form_url": form_candidate or _cell(row, "job_url")}
            candidates.append((1, "job_url", row, payload))
        elif preferred and _cell(row, "id") == _cell(preferred, "id"):
            payload = {**payload, "form_url": form_candidate}
            candidates.append((2, "job_id", row, payload))

    if preferred and not candidates:
        payload = parse_application_answers(_cell(preferred, "application_answers"))
        if payload and payload.get("fields"):
            candidates.append((2, "job_id", preferred, payload))

    if candidates:
        candidates.sort(key=lambda t: t[0])
        _prio, reason, row, payload = candidates[0]
        return pack(row, payload, reason)

    suggestions = []
    for row in openings:
        payload = parse_application_answers(_cell(row, "application_answers"))
        status = _cell(row, "status").lower()
        if status in {"excluded", "closed", "rejected", "hired"}:
            continue
        suggestions.append(
            {
                "id": _cell(row, "id"),
                "company": _cell(row, "company"),
                "role_title": _cell(row, "role_title"),
                "job_url": _cell(row, "job_url"),
                "form_url": _cell(row, "form_url")
                or (payload or {}).get("form_url")
                or "",
                "has_payload": bool(payload and payload.get("fields")),
                "field_count": len((payload or {}).get("fields") or []),
            }
        )
    suggestions.sort(key=lambda s: (0 if s["has_payload"] else 1, s["company"], s["role_title"]))

    return {
        "ok": True,
        "match_reason": None,
        "url": url,
        "url_key": target,
        "job": None,
        "payload": None,
        "field_count": 0,
        "form_url": "",
        "source_url": "",
        "url_matches_form": False,
        "url_matches_job": False,
        "suggestions": suggestions[:20],
    }
