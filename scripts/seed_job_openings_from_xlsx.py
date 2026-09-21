"""Seed job_openings / platforms / communities CSVs from the Excel tracker."""
from __future__ import annotations

import csv
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
XLSX = Path(
    r"C:\Users\eduev\Meu Drive\17 - Projects\notes\work\job-openings\job-opportunities.xlsx"
)
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def col_to_idx(col: str) -> int:
    n = 0
    for c in col:
        n = n * 26 + (ord(c) - 64)
    return n - 1


def load_sheets(path: Path) -> dict[str, list[list[str]]]:
    with zipfile.ZipFile(path) as z:
        wb = ET.fromstring(z.read("xl/workbook.xml"))
        sheets_meta = []
        for sh in wb.findall("m:sheets/m:sheet", NS):
            sheets_meta.append(
                (
                    sh.attrib.get("name"),
                    sh.attrib.get(
                        "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
                    ),
                )
            )
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rid_to_target = {r.attrib["Id"]: r.attrib["Target"] for r in rels}

        shared: list[str] = []
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall("m:si", NS):
            shared.append(
                "".join(
                    n.text or ""
                    for n in si.iter(
                        "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"
                    )
                )
            )

        out: dict[str, list[list[str]]] = {}
        for name, rid in sheets_meta:
            target = rid_to_target[rid].lstrip("/")
            if not target.startswith("xl/"):
                target = "xl/" + target
            ws = ET.fromstring(z.read(target))
            rows: dict[int, dict[int, str]] = {}
            max_c = 0
            for c in ws.findall(".//m:c", NS):
                ref = c.attrib.get("r", "")
                col = "".join(ch for ch in ref if ch.isalpha())
                row = int("".join(ch for ch in ref if ch.isdigit()) or "0")
                ci = col_to_idx(col)
                max_c = max(max_c, ci)
                t = c.attrib.get("t")
                v = c.find("m:v", NS)
                if v is None or v.text is None:
                    val = ""
                elif t == "s":
                    val = shared[int(v.text)]
                else:
                    val = v.text
                rows.setdefault(row, {})[ci] = val.replace("_x000D_", "\n")
            grid = []
            for ri in sorted(rows):
                grid.append([rows[ri].get(ci, "") for ci in range(max_c + 1)])
            out[name] = grid
        return out


def slug(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "item"


def guess_path(title: str) -> str:
    t = (title or "").lower()
    if "product owner" in t or "product-owner" in t:
        return "po"
    if "data analyst" in t or "bi analyst" in t or "analytics" in t:
        return "da"
    if "data engineer" in t or "databricks" in t:
        return "da"
    if "solution architect" in t or "digital solution" in t:
        return "dsa"
    return "other"


def guess_source(url: str) -> str:
    u = (url or "").lower()
    if "linkedin.com" in u:
        return "linkedin"
    if "smartrecruiters.com" in u:
        return "company_site"
    if "unicamp" in u or "alumni" in u:
        return "community"
    if u:
        return "company_site"
    return "other"


def write_csv(path: Path, columns: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            w.writerow({c: row.get(c, "") for c in columns})


def main() -> None:
    sheets = load_sheets(XLSX)

    # --- companies map from excel companies sheet ---
    company_id_to_key: dict[str, str] = {}
    companies_grid = sheets.get("companies", [])
    if companies_grid:
        for row in companies_grid[1:]:
            if len(row) < 2 or not str(row[0]).strip():
                continue
            cid, name = str(row[0]).strip(), str(row[1]).strip()
            company_id_to_key[cid] = slug(name)

    # --- openings ---
    open_cols = [
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
    ]
    openings: list[dict[str, str]] = []
    opp = sheets.get("opportunities", [])
    if opp:
        headers = [h.strip() for h in opp[0]]
        for i, raw in enumerate(opp[1:], start=1):
            row = {headers[j]: (raw[j] if j < len(raw) else "") for j in range(len(headers))}
            company = (row.get("company") or "").strip()
            company_id = str(row.get("company_id") or "").strip()
            company_key = company_id_to_key.get(company_id) or slug(company)
            role = (row.get("role_title") or "").strip()
            url = (row.get("job_url") or "").strip()
            status = (row.get("status") or "watching").strip().lower() or "watching"
            notes = (row.get("notes") or "").strip()
            desc = (row.get("job_description") or "").strip()
            rid = f"job-{slug(company_key)}-{i:03d}"
            openings.append(
                {
                    "id": rid,
                    "sort_order": str(i),
                    "company": company,
                    "company_key": company_key,
                    "role_title": role or "(untitled role)",
                    "career_path": guess_path(role),
                    "job_url": url,
                    "status": status,
                    "priority": "medium" if status != "closed" else "low",
                    "work_mode": "unknown",
                    "location": "",
                    "source": guess_source(url),
                    "found_on": "",
                    "applied_on": "",
                    "next_action": "" if status == "closed" else "Review JD & decide",
                    "next_action_date": "",
                    "salary_range": "",
                    "fit_interest": "3" if status != "closed" else "1",
                    "skills_gap": notes if notes else "",
                    "job_description": desc,
                    "notes": notes,
                    "contact_person": "",
                    "contact_note": "",
                }
            )

    # --- platforms ---
    plat_cols = ["id", "sort_order", "company_key", "label", "url"]
    platforms: list[dict[str, str]] = []
    plat = sheets.get("platforms", [])
    if plat:
        for i, raw in enumerate(plat[1:], start=1):
            if len(raw) < 2:
                continue
            company, url = str(raw[0]).strip(), str(raw[1]).strip()
            if not company or not url:
                continue
            platforms.append(
                {
                    "id": f"plat-{i:03d}",
                    "sort_order": str(i),
                    "company_key": slug(company),
                    "label": url.split("/")[2] if "://" in url else url[:40],
                    "url": url,
                }
            )

    # --- communities ---
    comm_cols = ["id", "sort_order", "name", "url", "notes"]
    communities: list[dict[str, str]] = []
    comm = sheets.get("communities", [])
    if comm:
        for i, raw in enumerate(comm[1:], start=1):
            if len(raw) < 2:
                continue
            name, url = str(raw[0]).strip(), str(raw[1]).strip()
            if not name:
                continue
            communities.append(
                {
                    "id": f"comm-{i:03d}",
                    "sort_order": str(i),
                    "name": name,
                    "url": url,
                    "notes": "",
                }
            )

    write_csv(CANON / "job_openings.csv", open_cols, openings)
    write_csv(CANON / "job_platforms.csv", plat_cols, platforms)
    write_csv(CANON / "job_communities.csv", comm_cols, communities)
    print(
        f"Wrote {len(openings)} openings, {len(platforms)} platforms, "
        f"{len(communities)} communities -> {CANON}"
    )


if __name__ == "__main__":
    main()
