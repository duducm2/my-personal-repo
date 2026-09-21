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
        "website",
        "careers_url",
        "ats_kind",
        "ats_name",
        "ats_url",
        "fit_data_analyst",
        "fit_product_owner",
        "fit_digital_solution_architect",
        # Job openings (mono / tracking metadata)
        "company",
        "company_key",
        "role_title",
        "career_path",
        "job_url",
        "work_mode",
        "location",
        "source",
        "found_on",
        "applied_on",
        "next_action",
        "next_action_date",
        "salary_range",
        "fit_interest",
        "skills_gap",
        "job_description",
        "notes",
        "contact_person",
        "contact_note",
        "label",
        "url",
        "name",
        # Job portals (mono)
        "scope",
        "job_search_url",
        "system_kind",
        "fit_paths",
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
            "institution_en",
            "institution_pt",
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
        ["id", "sort_order", "name_en", "name_pt", "level_en", "level_pt"],
    ),
    "recognitions": (
        "recognitions.csv",
        [
            "id",
            "sort_order",
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
            "fit_data_analyst",
            "fit_product_owner",
            "fit_digital_solution_architect",
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
            "company",
            "company_key",
            "role_title",
            "career_path",
            "job_url",
            "status",
            "priority",
            "work_mode",
            "location",
            "source",
            "found_on",
            "applied_on",
            "next_action",
            "next_action_date",
            "salary_range",
            "fit_interest",
            "skills_gap",
            "job_description",
            "notes",
            "contact_person",
            "contact_note",
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
                item["id"] = rid
                if "sort_order" in columns and not item["sort_order"]:
                    item["sort_order"] = str(i + 1)
                cleaned.append(item)
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
            rows: list[dict[str, str]] = []
            for raw in reader:
                rows.append({col: _cell(raw.get(col)) for col in columns})
            return rows

    def _write_csv(
        self, filename: str, columns: list[str], rows: list[dict[str, str]]
    ) -> None:
        path = self.canonical_dir / filename
        path.parent.mkdir(parents=True, exist_ok=True)
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
                fieldnames=columns,
                lineterminator="\n",
                quoting=csv.QUOTE_MINIMAL,
            )
            writer.writeheader()
            for row in rows:
                writer.writerow({col: row.get(col, "") for col in columns})
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
