"""HTTP audit for company/platform job links in canonical CSVs."""

from __future__ import annotations

import csv
import json
import ssl
import sys
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "my-data" / "canonical"

USER_AGENT = "Mozilla/5.0 (compatible; career-cockpit-audit/1.0)"
TIMEOUT = 20

GENERIC_ATS = {
    "https://www.gupy.io/",
    "https://gupy.io/",
    "https://www.greenhouse.com/",
    "https://www.workday.com/",
    "https://www.lever.co/",
    "https://www.ashbyhq.com/",
    "https://www.smartrecruiters.com/",
    "https://solides.com.br/",
}


def load_csv(name: str) -> list[dict[str, str]]:
    path = CANONICAL / name
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def collect_urls() -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []

    for row in load_csv("companies.csv"):
        cid = row["id"]
        for field in ("website", "careers_url", "ats_url"):
            url = (row.get(field) or "").strip()
            if url:
                entries.append(
                    {
                        "source": "companies.csv",
                        "entity_id": cid,
                        "field": field,
                        "url": url,
                    }
                )

    for row in load_csv("job_portals.csv"):
        pid = row["id"]
        for field in ("job_search_url", "ats_url"):
            url = (row.get(field) or "").strip()
            if url:
                entries.append(
                    {
                        "source": "job_portals.csv",
                        "entity_id": pid,
                        "field": field,
                        "url": url,
                    }
                )

    for row in load_csv("job_platforms.csv"):
        url = (row.get("url") or "").strip()
        if url:
            entries.append(
                {
                    "source": "job_platforms.csv",
                    "entity_id": row["id"],
                    "field": "url",
                    "url": url,
                }
            )

    return entries


def check_url(url: str) -> dict[str, object]:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            code = resp.status
            final = resp.geturl()
            if code >= 400:
                return {"status": "fail", "code": code, "final_url": final, "error": None}
            return {"status": "ok", "code": code, "final_url": final, "error": None}
    except urllib.error.HTTPError as e:
        # Some sites block HEAD; retry GET.
        if e.code in {403, 405, 501}:
            return check_url_get(url)
        return {"status": "fail", "code": e.code, "final_url": url, "error": str(e)}
    except Exception as e:  # noqa: BLE001
        return check_url_get(url, str(e))


def check_url_get(url: str, head_error: str | None = None) -> dict[str, object]:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": USER_AGENT, "Range": "bytes=0-0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            code = resp.status
            final = resp.geturl()
            if code >= 400:
                return {
                    "status": "fail",
                    "code": code,
                    "final_url": final,
                    "error": head_error,
                }
            return {"status": "ok", "code": code, "final_url": final, "error": head_error}
    except urllib.error.HTTPError as e:
        # Treat common anti-bot / auth walls as reachable if not 404/410.
        if e.code in {401, 403, 999}:
            return {
                "status": "warn",
                "code": e.code,
                "final_url": url,
                "error": "blocked but reachable",
            }
        return {"status": "fail", "code": e.code, "final_url": url, "error": str(e)}
    except Exception as e:  # noqa: BLE001
        return {"status": "fail", "code": None, "final_url": url, "error": str(e)}


def main() -> int:
    entries = collect_urls()
    unique_urls = sorted({e["url"] for e in entries})
    print(f"Checking {len(unique_urls)} unique URLs from {len(entries)} field entries...")

    url_results: dict[str, dict[str, object]] = {}
    for url in unique_urls:
        url_results[url] = check_url(url)
        r = url_results[url]
        mark = {"ok": "OK", "warn": "WARN", "fail": "FAIL"}[str(r["status"])]
        code = r.get("code")
        print(f"  [{mark}] {code or '---'} {url}")

    issues: list[dict[str, object]] = []
    generic: list[dict[str, str]] = []
    missing_careers: list[str] = []

    for row in load_csv("companies.csv"):
        cu = (row.get("careers_url") or "").strip()
        au = (row.get("ats_url") or "").strip()
        if not cu:
            missing_careers.append(row["id"])
        if au.rstrip("/") + "/" in GENERIC_ATS or au in GENERIC_ATS:
            generic.append({"id": row["id"], "field": "ats_url", "url": au})

    for entry in entries:
        url = entry["url"]
        result = url_results[url]
        if result["status"] == "fail":
            issues.append({**entry, **result})
        elif entry["field"] == "ats_url" and url.rstrip("/") + "/" in GENERIC_ATS:
            generic.append(
                {"id": entry["entity_id"], "field": entry["field"], "url": url}
            )

    print("\n=== SUMMARY ===")
    ok = sum(1 for r in url_results.values() if r["status"] == "ok")
    warn = sum(1 for r in url_results.values() if r["status"] == "warn")
    fail = sum(1 for r in url_results.values() if r["status"] == "fail")
    print(f"OK={ok} WARN={warn} FAIL={fail}")

    if missing_careers:
        print(f"\nNO_CAREERS ({len(missing_careers)}):")
        for cid in missing_careers:
            print(f"  {cid}")

    if generic:
        print(f"\nGENERIC_ATS ({len(generic)}):")
        for g in generic:
            print(f"  {g['id']} {g['url']}")

    if issues:
        print(f"\nFAILED_URLS ({len(issues)}):")
        for i in issues:
            print(
                f"  {i['source']} {i['entity_id']} {i['field']} "
                f"{i['code']} {i['url']} {i.get('error') or ''}"
            )

    report = {
        "summary": {"ok": ok, "warn": warn, "fail": fail},
        "missing_careers": missing_careers,
        "generic_ats": generic,
        "issues": issues,
        "url_results": url_results,
    }
    out = ROOT / "output" / "platform_links_audit.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\nReport written to {out}")

    return 1 if issues or missing_careers or generic else 0


if __name__ == "__main__":
    sys.exit(main())
