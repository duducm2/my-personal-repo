"""Read/write career cockpit collections as canonical CSV files."""

from __future__ import annotations

import csv
import tempfile
from pathlib import Path
from typing import Any

# Columns that do not get a parallel *_detail_* twin
STRUCTURAL_COLS = frozenset(
    {
        "id",
        "sort_order",
        "path",
        "csi",
        "nps",
        "endorsements",
        "linkedin_assessment",
        "credential_id",
        "credential_file",
        "associated_with",
        "priority",
        "status",
        "pinned",
        "geo_track",
        "rec_rank",
        "website",
        "careers_url",
        "ats_kind",
        "ats_name",
        "ats_url",
        "fit_data_analyst",
        "fit_product_owner",
        "fit_digital_solution_architect",
        "fit_ux_researcher",
        # Job openings (mono / tracking metadata)
        "company",
        "company_key",
        "role_title",
        "career_path",
        "job_url",
        "form_url",
        "work_mode",
        "location",
        "source",
        "found_on",
        "applied_on",
        "applied_date",
        "next_action",
        "next_action_date",
        "salary_range",
        "fit_interest",
        "skills_gap",
        "job_description",
        "notes",
        "contact_person",
        "contact_note",
        "is_new",
        "match_score",
        "match_reason",
        "recommended_resume",
        "label",
        "url",
        "name",
        # Job portals (mono)
        "scope",
        "job_search_url",
        "system_kind",
        "fit_paths",
        # Companies remote policy / growth
        "home_office",
        "growth",
    }
)

# Base (summary) column order per collection — detail twins inserted after each _en/_pt
_BASE: dict[str, tuple[str, list[str]]] = {
    "about": (
        "about_linkedin.csv",
        ["id", "sort_order", "text_en", "text_pt"],
    ),
    "targetTitles": (
        "target_titles.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "path",
            "path_label_en",
            "path_label_pt",
            "kind_en",
            "kind_pt",
            "title_en",
            "title_pt",
            "source_en",
            "source_pt",
        ],
    ),
    "projects": (
        "projects.csv",
        [
            "id",
            "pinned",
            "name_en",
            "name_pt",
            "summary_en",
            "summary_pt",
            "csi",
            "nps",
            "notes_en",
            "notes_pt",
        ],
    ),
    "education": (
        "education_linkedin.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "institution_en",
            "institution_pt",
            "location_en",
            "location_pt",
            "degree_en",
            "degree_pt",
            "field_en",
            "field_pt",
            "date_display_en",
            "date_display_pt",
            "activities_en",
            "activities_pt",
            "description_en",
            "description_pt",
            "skills_en",
            "skills_pt",
        ],
    ),
    "experience": (
        "experience_linkedin.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "company_en",
            "company_pt",
            "title_en",
            "title_pt",
            "employment_type_en",
            "employment_type_pt",
            "date_display_en",
            "date_display_pt",
            "location_en",
            "location_pt",
            "work_arrangement_en",
            "work_arrangement_pt",
            "description_en",
            "description_pt",
            "skills_en",
            "skills_pt",
            "media_en",
            "media_pt",
        ],
    ),
    "languages": (
        "languages.csv",
        ["id", "sort_order", "pinned", "name_en", "name_pt", "level_en", "level_pt"],
    ),
    "recognitions": (
        "recognitions.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "title_en",
            "title_pt",
            "issuer_en",
            "issuer_pt",
            "date_display_en",
            "date_display_pt",
            "associated_with",
            "description_en",
            "description_pt",
        ],
    ),
    "courses": (
        "courses.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "title_en",
            "title_pt",
            "associated_en",
            "associated_pt",
        ],
    ),
    "competences": (
        "competences.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "category_en",
            "category_pt",
            "name_en",
            "name_pt",
            "associated_en",
            "associated_pt",
            "endorsements",
            "linkedin_assessment",
        ],
    ),
    "volunteering": (
        "volunteering.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "title_en",
            "title_pt",
            "organization_en",
            "organization_pt",
            "date_display_en",
            "date_display_pt",
            "cause_en",
            "cause_pt",
            "description_en",
            "description_pt",
        ],
    ),
    "certifications": (
        "certifications.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "title_en",
            "title_pt",
            "issuer_en",
            "issuer_pt",
            "issued_en",
            "issued_pt",
            "expires_en",
            "expires_pt",
            "credential_id",
            "skills_en",
            "skills_pt",
            "credential_file",
        ],
    ),
    "companies": (
        "companies.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "geo_track",
            "rec_rank",
            "category_en",
            "category_pt",
            "name_en",
            "name_pt",
            "city_en",
            "city_pt",
            "region_en",
            "region_pt",
            "priority",
            "status",
            "home_office",
            "growth",
            "fit_data_analyst",
            "fit_product_owner",
            "fit_digital_solution_architect",
            "fit_ux_researcher",
            "da_openings",
            "website",
            "careers_url",
            "ats_kind",
            "ats_name",
            "ats_url",
            "skills_match_en",
            "skills_match_pt",
            "fit_why_en",
            "fit_why_pt",
            "notes_en",
            "notes_pt",
        ],
    ),
    "jobPortals": (
        "job_portals.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "scope",
            "name",
            "job_search_url",
            "system_kind",
            "ats_name",
            "ats_url",
            "fit_paths",
            "notes",
        ],
    ),
    "jobOpenings": (
        "job_openings.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "company",
            "company_key",
            "role_title",
            "career_path",
            "job_url",
            "form_url",
            "status",
            "priority",
            "work_mode",
            "location",
            "source",
            "found_on",
            "applied_on",
            "applied_date",
            "next_action",
            "next_action_date",
            "salary_range",
            "fit_interest",
            "skills_gap",
            "job_description",
            "notes",
            "contact_person",
            "contact_note",
            "is_new",
            "match_score",
            "match_reason",
            "recommended_resume",
            "result",
            "result_on",
            "application_answers",
            "application_form_raw",
            "cover_letter",
            "cover_letter_lang",
            "cover_letter_greeting",
            "cover_letter_closing",
        ],
    ),
    "jobPlatforms": (
        "job_platforms.csv",
        [
            "id",
            "sort_order",
            "company_key",
            "label",
            "url",
        ],
    ),
    "jobCommunities": (
        "job_communities.csv",
        [
            "id",
            "sort_order",
            "name",
            "url",
            "notes",
        ],
    ),
    "hiringPeople": (
        "hiring_people.csv",
        [
            "id",
            "sort_order",
            "pinned",
            "kind",
            "company_key",
            "company_name",
            "full_name",
            "headline",
            "linkedin_url",
            "hiring_for",
            "opening_ids",
            "location",
            "status",
            "notes",
            "found_on",
        ],
    ),
}


def expand_columns(cols: list[str]) -> list[str]:
    out: list[str] = []
    for c in cols:
        out.append(c)
        if c in STRUCTURAL_COLS:
            continue
        if c.endswith("_en"):
            out.append(c[: -len("_en")] + "_detail_en")
        elif c.endswith("_pt"):
            out.append(c[: -len("_pt")] + "_detail_pt")
    return out


def detail_twin(col: str) -> str | None:
    if col in STRUCTURAL_COLS:
        return None
    if col.endswith("_en"):
        return col[: -len("_en")] + "_detail_en"
    if col.endswith("_pt"):
        return col[: -len("_pt")] + "_detail_pt"
    return None


COLLECTIONS: dict[str, tuple[str, list[str]]] = {
    key: (filename, expand_columns(cols)) for key, (filename, cols) in _BASE.items()
}


class CanonicalStore:
    def __init__(self, canonical_dir: Path) -> None:
        self.canonical_dir = canonical_dir.resolve()

    def load_all(self) -> dict[str, list[dict[str, str]]]:
        out: dict[str, list[dict[str, str]]] = {}
        for key, (filename, columns) in COLLECTIONS.items():
            out[key] = self._read_csv(filename, columns)
        return out

    def load_deliverables_data(self) -> dict[str, Any]:
        """Load structured content for resumes & portfolios editing."""
        return {
            "profile": self._read_csv_raw("profile.csv"),
            "narratives": self._read_csv_raw("narratives.csv"),
            "experience": self._read_csv_raw("experience.csv"),
            "experienceBullets": self._read_csv_raw("experience_bullets.csv"),
            "skills": self._read_csv_raw("skills.csv"),
            "education": self._read_csv_raw("education.csv"),
            "publications": self._read_csv_raw("publications.csv"),
            "additional": self._read_csv_raw("additional.csv"),
            "resumeSettings": self._read_csv_raw("resume_settings.csv"),
            "portfolioImages": self._read_csv_raw("portfolio_images.csv"),
            "projects": self._read_csv_raw("projects.csv"),
        }

    def save_deliverables_data(self, data: dict[str, Any]) -> dict[str, Any]:
        """Save structured resume/portfolio data while preserving markdown formatting."""
        if not isinstance(data, dict):
            raise ValueError("data must be an object")

        file_mapping = {
            "profile": "profile.csv",
            "narratives": "narratives.csv",
            "experience": "experience.csv",
            "experienceBullets": "experience_bullets.csv",
            "skills": "skills.csv",
            "education": "education.csv",
            "publications": "publications.csv",
            "additional": "additional.csv",
            "resumeSettings": "resume_settings.csv",
            "portfolioImages": "portfolio_images.csv",
            "projects": "projects.csv",
        }

        saved_counts: dict[str, int] = {}
        for key, filename in file_mapping.items():
            if key in data and isinstance(data[key], list):
                rows = data[key]
                self._write_csv_raw(filename, rows)
                saved_counts[key] = len(rows)

        return {"ok": True, "counts": saved_counts}

    def _read_csv_raw(self, filename: str) -> list[dict[str, str]]:
        """Read CSV keeping formatting (e.g. markdown **bold**, newlines)."""
        path = self.canonical_dir / filename
        if not path.exists():
            return []
        with path.open(encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            fieldnames = list(reader.fieldnames or [])
            rows: list[dict[str, str]] = []
            for raw in reader:
                rows.append({col: (raw.get(col) or "").strip() for col in fieldnames})
            return rows

    def _write_csv_raw(self, filename: str, rows: list[dict[str, Any]]) -> None:
        """Write CSV preserving formatting without stripping markdown characters."""
        path = self.canonical_dir / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        if not rows and path.exists():
            # If empty list passed, do not overwrite completely unless explicit
            return
        fieldnames: list[str] = []
        if path.exists():
            with path.open(encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f)
                fieldnames = list(reader.fieldnames or [])
        for row in rows:
            for k in row.keys():
                if k not in fieldnames:
                    fieldnames.append(k)

        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="",
            dir=path.parent,
            delete=False,
            suffix=".tmp",
        ) as tmp:
            writer = csv.DictWriter(
                tmp,
                fieldnames=fieldnames,
                lineterminator="\n",
                quoting=csv.QUOTE_MINIMAL,
            )
            writer.writeheader()
            for r in rows:
                writer.writerow({k: str(r.get(k, "")).strip() for k in fieldnames})
            tmp_path = Path(tmp.name)
        tmp_path.replace(path)

    def load_prompt_context(self) -> dict[str, list[dict[str, str]]]:
        """Read-only CSV bundles used by the job openings prompt generator.

        These files sit beside the cockpit collections but are not part of
        PUT /api/state validation.
        """
        target_titles = self._read_csv(
            COLLECTIONS["targetTitles"][0], COLLECTIONS["targetTitles"][1]
        )
        experience = self._read_csv(
            COLLECTIONS["experience"][0], COLLECTIONS["experience"][1]
        )
        return {
            "profile": self._read_csv_loose("profile.csv"),
            "skills": self._read_csv_loose("skills.csv"),
            "narratives": self._read_csv_loose("narratives.csv"),
            "targetTitles": target_titles,
            "experience": experience,
            "experienceBullets": self._read_csv_loose("experience_bullets.csv"),
            "education": self._read_csv(
                COLLECTIONS["education"][0], COLLECTIONS["education"][1]
            ),
        }

    def save_all(self, collections: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(collections, dict):
            raise ValueError("collections must be an object")
        unknown = set(collections) - set(COLLECTIONS)
        if unknown:
            raise ValueError(f"unknown collections: {sorted(unknown)}")

        missing = set(COLLECTIONS) - set(collections)
        if missing:
            raise ValueError(f"missing collections: {sorted(missing)}")

        normalized: dict[str, list[dict[str, str]]] = {}
        for key, (filename, columns) in COLLECTIONS.items():
            rows = collections[key]
            if not isinstance(rows, list):
                raise ValueError(f"{key} must be a list")
            cleaned: list[dict[str, str]] = []
            for i, row in enumerate(rows):
                if not isinstance(row, dict):
                    raise ValueError(f"{key}[{i}] must be an object")
                rid = str(row.get("id", "")).strip()
                if not rid:
                    raise ValueError(f"{key}[{i}] missing id")
                item = {col: _cell(row.get(col)) for col in columns}
                for field, value in row.items():
                    if field not in item:
                        item[field] = _cell(value)
                item["id"] = rid
                if "sort_order" in columns and not item["sort_order"]:
                    item["sort_order"] = str(i + 1)
                cleaned.append(item)
            if key == "jobOpenings":
                cleaned = [
                    row
                    for row in cleaned
                    if str(row.get("status") or "").strip().lower() != "excluded"
                ]
            if key == "hiringPeople":
                for row in cleaned:
                    kind = str(row.get("kind") or "").strip().lower()
                    row["kind"] = kind if kind in ("hiring", "network") else "hiring"
            normalized[key] = cleaned

        for key, (filename, columns) in COLLECTIONS.items():
            self._write_csv(filename, columns, normalized[key])

        return {"ok": True, "counts": {k: len(v) for k, v in normalized.items()}}

    def _read_csv(self, filename: str, columns: list[str]) -> list[dict[str, str]]:
        path = self.canonical_dir / filename
        if not path.exists():
            return []
        with path.open(encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            cols = list(columns)
            for name in reader.fieldnames or []:
                if name not in cols:
                    cols.append(name)
            rows: list[dict[str, str]] = []
            for raw in reader:
                rows.append({col: _cell(raw.get(col)) for col in cols})
            return rows

    def _read_csv_loose(self, filename: str) -> list[dict[str, str]]:
        """Read a CSV using whatever headers are on disk (prompt-context files)."""
        path = self.canonical_dir / filename
        if not path.exists():
            return []
        with path.open(encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            fieldnames = list(reader.fieldnames or [])
            rows: list[dict[str, str]] = []
            for raw in reader:
                rows.append({col: _cell(raw.get(col)) for col in fieldnames})
            return rows

    def _write_csv(
        self, filename: str, columns: list[str], rows: list[dict[str, str]]
    ) -> None:
        path = self.canonical_dir / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        existing_rows: dict[str, dict[str, str]] = {}
        existing_cols: list[str] = []
        if path.exists():
            with path.open(encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f)
                existing_cols = list(reader.fieldnames or [])
                for raw in reader:
                    existing_rows[str(raw.get("id") or "")] = {
                        col: raw.get(col) or "" for col in existing_cols
                    }
        fieldnames = list(columns)
        for name in existing_cols:
            if name not in fieldnames:
                fieldnames.append(name)
        for row in rows:
            for key in row:
                if key not in fieldnames:
                    fieldnames.append(key)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="",
            dir=path.parent,
            delete=False,
            suffix=".tmp",
        ) as tmp:
            writer = csv.DictWriter(
                tmp,
                fieldnames=fieldnames,
                lineterminator="\n",
                quoting=csv.QUOTE_MINIMAL,
            )
            writer.writeheader()
            for row in rows:
                previous = existing_rows.get(str(row.get("id") or ""), {})
                writer.writerow(
                    {col: row.get(col, previous.get(col, "")) for col in fieldnames}
                )
            tmp_path = Path(tmp.name)
        tmp_path.replace(path)


def _cell(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else ""
    return _plain(str(value).strip())


def _plain(text: str) -> str:
    """Strip markdown/styling so cockpit copy-paste stays plain."""
    t = text.replace("**", "")
    t = t.replace("→", "->").replace("←", "<-")
    t = t.replace("—", "-").replace("–", "-").replace("−", "-")
    t = t.replace("·", " - ")
    t = t.replace("…", "...")
    t = (
        t.replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )
    while "  " in t:
        t = t.replace("  ", " ")
    return t
