"""One-shot: add form_url column to job_openings.csv and clean markdown URLs."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "my-data" / "canonical" / "job_openings.csv"


def clean_url(u: str) -> str:
    u = (u or "").strip()
    if not u:
        return ""
    m = re.match(r"\[([^\]]+)\]\(([^)]+)\)", u)
    if m:
        a, b = m.group(1).strip(), m.group(2).strip()
        if a.startswith("http"):
            return a
        if b.startswith("http") and "google.com/search" not in b:
            return b
        if a.startswith("http"):
            return a
    m2 = re.search(r"https?://[^\s\]\)\"'<>]+", u)
    if not m2:
        return u
    return m2.group(0).rstrip(".,);]'\"")


def main() -> None:
    with CSV_PATH.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        print("no rows")
        return

    fieldnames = list(rows[0].keys())
    if "form_url" not in fieldnames:
        i = fieldnames.index("job_url") + 1
        fieldnames.insert(i, "form_url")

    filled = 0
    for row in rows:
        form = ""
        ans = (row.get("application_answers") or "").strip()
        if ans.startswith("{"):
            try:
                data = json.loads(ans)
                form = clean_url(str(data.get("form_url") or ""))
                if form:
                    data["form_url"] = form
                src = clean_url(str(data.get("source_url") or ""))
                if src:
                    data["source_url"] = src
                for fld in data.get("fields") or []:
                    if isinstance(fld, dict) and isinstance(fld.get("value"), str):
                        if "](" in fld["value"]:
                            fld["value"] = clean_url(fld["value"]) or fld["value"]
                row["application_answers"] = json.dumps(
                    data, ensure_ascii=False, separators=(",", ":")
                )
            except json.JSONDecodeError as exc:
                print("parse fail", row.get("id"), exc)

        existing = clean_url(row.get("form_url") or "")
        row["form_url"] = existing or form or ""
        if row.get("id") == "gitlab-ai-transformation-owner-po" and not row["form_url"]:
            row["form_url"] = (
                "https://job-boards.greenhouse.io/gitlab/jobs/8716179002#app"
            )
        if row["form_url"]:
            filled += 1

    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=fieldnames, extrasaction="ignore", lineterminator="\n"
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"rows={len(rows)} form_url_filled={filled}")
    gitlab = next(r for r in rows if r["id"] == "gitlab-ai-transformation-owner-po")
    print("gitlab form_url:", gitlab.get("form_url"))
    print("gitlab job_url:", gitlab.get("job_url"))


if __name__ == "__main__":
    main()
