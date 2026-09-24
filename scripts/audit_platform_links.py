"""HTTP audit for company/platform job links in canonical CSVs."""

from __future__ import annotations

import argparse
import csv
import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "my-data" / "canonical"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
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

SOFT_404_URL_RE = re.compile(
    r"(errorpages|/404(?:\.html)?(?:$|\?)|page-not-found|not[_-]?found)",
    re.I,
)


def load_csv(name: str) -> list[dict[str, str]]:
    path = CANONICAL / name
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def primary_careers_url(row: dict[str, str]) -> str:
    return (
        (row.get("careers_url") or "").strip()
        or (row.get("ats_url") or "").strip()
        or (row.get("website") or "").strip()
    )


def collect_urls(*, primary_only: bool = False) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []

    for row in load_csv("companies.csv"):
        cid = row["id"]
        if primary_only:
            url = primary_careers_url(row)
            if url:
                entries.append(
                    {
                        "source": "companies.csv",
                        "entity_id": cid,
                        "field": "primary",
                        "url": url,
                    }
                )
            continue
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

    if primary_only:
        return entries

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


def is_soft_404(final_url: str, body_snippet: str = "") -> bool:
    if SOFT_404_URL_RE.search(final_url or ""):
        return True
    snippet = (body_snippet or "")[:4000].lower()
    if "errorpages" in (final_url or "").lower():
        return True
    # Narrow body heuristics — avoid false positives on search pages.
    markers = (
        "page not found",
        "we can't find that page",
        "we couldn’t find that page",
        "this page doesn't exist",
        "404 - file or directory not found",
    )
    return any(m in snippet for m in markers)


def check_url(url: str) -> dict[str, object]:
    return check_url_get(url)


def check_url_get(url: str, head_error: str | None = None) -> dict[str, object]:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"},
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            code = resp.status
            final = resp.geturl()
            body = resp.read(12000).decode("utf-8", "replace")
            if code >= 400:
                return {
                    "status": "fail",
                    "code": code,
                    "final_url": final,
                    "error": head_error,
                    "soft_404": False,
                }
            if is_soft_404(final, body):
                return {
                    "status": "fail",
                    "code": code,
                    "final_url": final,
                    "error": "soft-404",
                    "soft_404": True,
                }
            return {
                "status": "ok",
                "code": code,
                "final_url": final,
                "error": head_error,
                "soft_404": False,
            }
    except urllib.error.HTTPError as e:
        # Treat common anti-bot / auth walls as reachable if not 404/410.
        if e.code in {401, 403, 999}:
            return {
                "status": "warn",
                "code": e.code,
                "final_url": url,
                "error": "blocked but reachable",
                "soft_404": False,
            }
        return {
            "status": "fail",
            "code": e.code,
            "final_url": url,
            "error": str(e),
            "soft_404": False,
        }
    except Exception as e:  # noqa: BLE001
        return {
            "status": "fail",
            "code": None,
            "final_url": url,
            "error": str(e),
            "soft_404": False,
        }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--primary",
        action="store_true",
        help="Only audit company primary careers URLs (Ctrl-Enter targets)",
    )
    args = parser.parse_args()

    entries = collect_urls(primary_only=args.primary)
    unique_urls = sorted({e["url"] for e in entries})
    label = "primary company" if args.primary else "all"
    print(f"Checking {len(unique_urls)} unique {label} URLs from {len(entries)} entries...")

    url_results: dict[str, dict[str, object]] = {}
    for url in unique_urls:
        url_results[url] = check_url(url)
        r = url_results[url]
        mark = {"ok": "OK", "warn": "WARN", "fail": "FAIL"}[str(r["status"])]
        code = r.get("code")
        soft = " soft-404" if r.get("soft_404") else ""
        print(f"  [{mark}] {code or '---'}{soft} {url}")

    issues: list[dict[str, object]] = []
    warns: list[dict[str, object]] = []
    generic: list[dict[str, str]] = []
    missing_careers: list[str] = []

    for row in load_csv("companies.csv"):
        cu = (row.get("careers_url") or "").strip()
        au = (row.get("ats_url") or "").strip()
        if not cu and not args.primary:
            missing_careers.append(row["id"])
        if args.primary and not primary_careers_url(row):
            missing_careers.append(row["id"])
        if au.rstrip("/") + "/" in GENERIC_ATS or au in GENERIC_ATS:
            generic.append({"id": row["id"], "field": "ats_url", "url": au})

    for entry in entries:
        url = entry["url"]
        result = url_results[url]
        if result["status"] == "fail":
            issues.append({**entry, **result})
        elif result["status"] == "warn":
            warns.append({**entry, **result})

    print("\n=== SUMMARY ===")
    ok = sum(1 for r in url_results.values() if r["status"] == "ok")
    warn = sum(1 for r in url_results.values() if r["status"] == "warn")
    fail = sum(1 for r in url_results.values() if r["status"] == "fail")
    soft = sum(1 for r in url_results.values() if r.get("soft_404"))
    print(f"OK={ok} WARN={warn} FAIL={fail} SOFT_404={soft}")

    if missing_careers:
        print(f"\nNO_CAREERS ({len(missing_careers)}):")
        for cid in missing_careers:
            print(f"  {cid}")

    if not args.primary and generic:
        print(f"\nGENERIC_ATS ({len(generic)}):")
        for g in generic:
            print(f"  {g['id']} {g['url']}")

    if warns:
        print(f"\nWARN_URLS ({len(warns)}):")
        for i in warns:
            print(
                f"  {i['source']} {i['entity_id']} {i['field']} "
                f"{i['code']} {i['url']}"
            )

    if issues:
        print(f"\nFAILED_URLS ({len(issues)}):")
        for i in issues:
            soft_tag = " soft-404" if i.get("soft_404") else ""
            print(
                f"  {i['source']} {i['entity_id']} {i['field']} "
                f"{i['code']}{soft_tag} {i['url']} {i.get('error') or ''}"
            )

    report = {
        "mode": "primary" if args.primary else "all",
        "summary": {"ok": ok, "warn": warn, "fail": fail, "soft_404": soft},
        "missing_careers": missing_careers,
        "generic_ats": generic if not args.primary else [],
        "warns": warns,
        "issues": issues,
        "url_results": url_results,
    }
    out = ROOT / "output" / (
        "platform_links_primary_audit.json"
        if args.primary
        else "platform_links_audit.json"
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\nReport written to {out}")

    bad = issues or missing_careers or (generic if not args.primary else [])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
