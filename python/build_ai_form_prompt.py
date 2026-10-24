"""Build the AI-companion prompt for one job-application form.

The page structure comes from a UIA DumpAll tree (copied in UIA Tree Inspector),
not from pasted ATS page text. Career facts come from the local canonical CSVs.
"""

from __future__ import annotations

from typing import Any

RESUME_OPTIONS = (
    "general",
    "data-analyst",
    "product-owner",
    "digital-solution-architect",
)
PATH_LABELS = {
    "da": "Data Analyst",
    "po": "Product Owner",
    "dsa": "Digital Solution Architect",
    "other": "Other",
}
PATH_TO_VARIANT = {
    "da": "data-analyst",
    "po": "product-owner",
    "dsa": "digital-solution-architect",
    "other": "general",
}
UI_TREE_LIMIT = 80000


def _cell(row: dict[str, Any] | None, key: str) -> str:
    if not row:
        return ""
    value = row.get(key)
    if value is None:
        return ""
    return str(value).strip()


def _instructions(opening_id: str, career_paths: list[str]) -> str:
    paths = " | ".join(career_paths) if career_paths else "da | po | dsa | other"
    resumes = " | ".join(RESUME_OPTIONS)
    return "\n".join(
        [
            "=== AIB FORM-FILL INSTRUCTIONS (mandatory) ===",
            "1. Read UIA TREE and list every distinct application form field",
            "   (required and optional). A field is a control whose Type is Edit,",
            "   Document, ComboBox, CheckBox, RadioButton, List, or Spinner.",
            "   Use its Name as the label. When Name is empty, use the nearest",
            "   preceding Text control's Name.",
            "   Ignore the browser itself: tabs, address bar, Back, Reload,",
            "   Minimize, Maximize, Close, and anything that is not the form.",
            "2. Resolve each field from PROFILE / EDUCATION / EXPERIENCE /",
            "   EXPERIENCE BULLETS / NARRATIVES.",
            "   Prefer exact stored values. Never invent email, phone, or URLs.",
            "   Put URLs as the bare https link only. Do not wrap a URL as markdown",
            "   [url](url) when both sides are the same address.",
            "3. Split full_name into first_name / last_name when the form asks for them.",
            "4. For email confirmation fields, repeat the same email value.",
            "5. For phone country / dial code, derive from profile phone when present",
            "   (e.g. +55). Leave empty when unknown.",
            "   For RG and CPF, copy the profile values exactly.",
            "6. For education / experience multi-entry blocks, use paste-ready facts",
            "   from the context (institution, degree, dates, title, company).",
            "   Keep those rows factual. Do not replace a description with a vague line.",
            "7. Free-text fields that address people are a sales note, not a courtesy",
            "   line. This includes message to the hiring team, cover note, motivation,",
            "   why this role, why this company, additional information, and comments.",
            "   - Write them dense. Name several concrete overlaps with THIS opening:",
            "     tools, methods, and outcomes taken from EDUCATION descriptions,",
            "     EXPERIENCE descriptions, EXPERIENCE BULLETS, and NARRATIVES.",
            "   - Lead with the fit. Do not open with excitement, passion, or alignment.",
            "   - Plain and specific. No adjective stacks. Never invent employers,",
            "     dates, degrees, or metrics.",
            "   - If the form shows a character limit, spend most of it on the strongest",
            "     matches. If it does not, write about 120-180 words.",
            "   - Use the page language, and the EN or PT description that matches it.",
            f"8. Prefer narratives/skills for career paths: {paths}.",
            "9. Choose exactly one résumé variant to upload for this opening.",
            f"   Set top-level recommended_resume to one of: {resumes}.",
            "   Pick the best match for the role title, career path, and form fields",
            "   (not only the current opening.recommended_resume if a better fit exists).",
            "10. For résumé / file upload fields, set value to empty string and put a",
            "   note naming the chosen variant, e.g.:",
            '   "Upload manually — use digital-solution-architect resume".',
            "11. Match label language to the page (PT or EN). Keep key as snake_case English.",
            "12. Return ONLY one JSON object (no markdown fences, no prose):",
            '    { "opening_id": "'
            + opening_id
            + '", "recommended_resume": "<one of the variants>",',
            '      "form_url": "<application form URL from SELECTED OPENING>",',
            '      "source_url": "<job posting URL when it differs>",',
            '      "fields": [ { "key", "label", "value", "source", "note?" } ] }',
            "13. Include every visible form field. Use empty value when unknown.",
            "14. opening_id must equal the selected opening id provided above.",
            "15. form_url and source_url must be copied from SELECTED OPENING.",
            "    Do not invent URLs. The UIA tree does not contain the page URL.",
        ]
    )


def build_form_fill_prompt(
    opening: dict[str, Any],
    context: dict[str, list[dict[str, Any]]],
    ui_tree: str,
    window_name: str,
) -> str:
    """Return the full prompt to paste into the AI companion."""
    opening_id = _cell(opening, "id")
    if not opening_id:
        raise ValueError("opening id is required")
    path = _cell(opening, "career_path").lower() or "other"
    paths = [path]
    variants = {PATH_TO_VARIANT.get(path, "general"), "general"}

    skills = [
        row
        for row in (context.get("skills") or [])
        if (_cell(row, "variant") or "general") in variants
    ]
    narratives = [
        row
        for row in (context.get("narratives") or [])
        if (_cell(row, "variant") or "general") in variants
    ]
    experience = (context.get("experience") or [])[:8]
    education = (context.get("education") or [])[:8]
    profile_rows = context.get("profile") or []
    profile = profile_rows[0] if profile_rows else {}

    focus = "; ".join(
        f"{PATH_LABELS.get(item, item)} ({PATH_TO_VARIANT.get(item, 'general')})"
        for item in paths
    )
    tree = (ui_tree or "").strip()
    if len(tree) > UI_TREE_LIMIT:
        tree = tree[:UI_TREE_LIMIT] + "\n\n[…UIA tree truncated]"

    lines: list[str] = [
        "You are my AI companion (AIB) for ATS application form field extraction.",
        "The form structure is a UI Automation tree copied from the application window.",
        "",
        "=== SELECTED OPENING ===",
        f"opening_id: {opening_id}",
        f"company: {_cell(opening, 'company')}",
        f"company_key: {_cell(opening, 'company_key')}",
        f"role_title: {_cell(opening, 'role_title')}",
        f"career_path: {_cell(opening, 'career_path')}",
        f"location: {_cell(opening, 'location')}",
        f"job_url: {_cell(opening, 'job_url')}",
        f"form_url: {_cell(opening, 'form_url')}",
        f"window_name: {window_name}",
        f"recommended_resume (current): {_cell(opening, 'recommended_resume') or '(none)'}",
        f"Available résumé variants to choose from: {', '.join(RESUME_OPTIONS)}",
        "",
        "=== PROFILE CONTEXT ===",
        f"Name: {_cell(profile, 'display_name') or _cell(profile, 'full_name')}",
        f"Full name: {_cell(profile, 'full_name')}",
        f"Location: {_cell(profile, 'location_en') or _cell(profile, 'location_pt')}",
        f"Languages: {_cell(profile, 'languages_en') or _cell(profile, 'languages_pt')}",
        f"Email: {_cell(profile, 'email')}",
        f"Phone: {_cell(profile, 'phone')}",
        f"RG: {_cell(profile, 'rg')}",
        f"CPF: {_cell(profile, 'cpf')}",
        f"LinkedIn: {_cell(profile, 'linkedin_url')}",
        f"Lattes: {_cell(profile, 'lattes_url')}",
        f"ORCID: {_cell(profile, 'orcid_url')}",
        f"Career path focus: {focus}",
        "",
    ]

    tagline = next(
        (row for row in narratives if _cell(row, "field") == "tagline"), None
    )
    summary = next(
        (row for row in narratives if _cell(row, "field") == "profile"), None
    )
    if tagline or summary:
        lines.append("=== NARRATIVES (for hiring message / motivation) ===")
        if tagline:
            lines.append(f"Tagline: {_cell(tagline, 'text_en')}")
        if summary:
            lines.append(f"Summary: {_cell(summary, 'text_en')}")
        lines.append("")

    if education:
        lines.append("=== EDUCATION ===")
        for row in education:
            lines.append(
                " - "
                + " | ".join(
                    [
                        _cell(row, "institution_en") or _cell(row, "institution_pt"),
                        _cell(row, "location_en") or _cell(row, "location_pt"),
                        _cell(row, "degree_en") or _cell(row, "degree_pt"),
                        _cell(row, "field_en") or _cell(row, "field_pt"),
                        _cell(row, "date_display_en") or _cell(row, "date_display_pt"),
                    ]
                )
            )
            edu_en = _cell(row, "description_detail_en") or _cell(row, "description_en")
            edu_pt = _cell(row, "description_detail_pt") or _cell(row, "description_pt")
            if edu_en:
                lines.append(f"  EN: {edu_en}")
            if edu_pt and edu_pt != edu_en:
                lines.append(f"  PT: {edu_pt}")
        lines.append("")

    if experience:
        lines.append("=== EXPERIENCE (recent) ===")
        for row in experience:
            lines.append(
                " - "
                + " | ".join(
                    [
                        f"{_cell(row, 'title_en') or _cell(row, 'title_pt')} @ {_cell(row, 'company_en') or _cell(row, 'company_pt')}",
                        _cell(row, "date_display_en") or _cell(row, "date_display_pt"),
                        _cell(row, "location_en") or _cell(row, "location_pt"),
                    ]
                )
            )
            exp_en = _cell(row, "description_detail_en") or _cell(row, "description_en")
            exp_pt = _cell(row, "description_detail_pt") or _cell(row, "description_pt")
            if exp_en:
                lines.append(f"  EN: {exp_en}")
            if exp_pt and exp_pt != exp_en:
                lines.append(f"  PT: {exp_pt}")
        lines.append("")

    bullets = [
        row
        for row in (context.get("experienceBullets") or [])
        if (_cell(row, "variant") or "general") in variants
    ]

    def sort_num(row: dict[str, Any]) -> int:
        raw = _cell(row, "sort_order")
        try:
            return int(raw)
        except ValueError:
            return 0

    bullets.sort(key=lambda row: (_cell(row, "experience_id"), sort_num(row)))
    if bullets:
        lines.append("=== EXPERIENCE BULLETS (evidence for hiring messages) ===")
        for row in bullets:
            bullet_en = _cell(row, "text_en")
            bullet_pt = _cell(row, "text_pt")
            if bullet_en:
                lines.append(f"- {bullet_en}")
            if bullet_pt and bullet_pt != bullet_en:
                lines.append(f"  PT: {bullet_pt}")
        lines.append("")

    if skills:
        labels = [
            _cell(row, "label_en") or _cell(row, "label_pt") for row in skills[:40]
        ]
        labels = [label for label in labels if label]
        if labels:
            lines.append("=== SKILLS (path-filtered) ===")
            lines.append(", ".join(labels))
            lines.append("")

    lines.append("=== WINDOW NAME ===")
    lines.append(window_name or "(empty)")
    lines.append("")
    lines.append("=== UIA TREE (application window) ===")
    lines.append(tree or "(empty)")
    lines.append("")
    lines.append(_instructions(opening_id, paths))
    return "\n".join(lines)
