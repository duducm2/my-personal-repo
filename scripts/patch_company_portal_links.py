"""Patch companies.csv with direct careers + ATS board URLs (Sep 2026 audit).

Replaces vendor homepages (gupy.io / greenhouse.com / workday.com) with
company-specific boards where verified. Keeps proprietary careers search URLs
as the primary apply destination.
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

# id -> (careers_url | None, ats_kind, ats_name, ats_url)
# careers_url None = leave existing
PATCH: dict[str, tuple[str | None, str, str, str]] = {
    # BR Gupy boards (careers already is the board for several)
    "scala-svcpcp01": (
        "https://www.scaladatacenters.com/carreiras/",
        "third_party",
        "Gupy",
        "https://scaladatacenters.gupy.io/",
    ),
    "leega-brasil": (
        "https://leega.gupy.io/",
        "third_party",
        "Gupy",
        "https://leega.gupy.io/",
    ),
    "porto-seguro": (
        "https://porto.gupy.io/",
        "third_party",
        "Gupy",
        "https://porto.gupy.io/",
    ),
    "ambev-tech-campinas": (
        "https://ambevtech.gupy.io/",
        "third_party",
        "Gupy",
        "https://ambevtech.gupy.io/",
    ),
    "byd-brasil-campinas": (
        "https://bydbrasil.gupy.io/",
        "third_party",
        "Gupy",
        "https://bydbrasil.gupy.io/",
    ),
    "sidi-campinas": (
        "https://sidi.gupy.io/",
        "third_party",
        "Gupy",
        "https://sidi.gupy.io/",
    ),
    "padtec-campinas": (
        "https://padtec.gupy.io/",
        "third_party",
        "Gupy",
        "https://padtec.gupy.io/",
    ),
    "venturus-campinas": (
        "https://venturus.gupy.io/",
        "third_party",
        "Gupy",
        "https://venturus.gupy.io/",
    ),
    "grupo-boticario": (
        "https://grupoboticario.gupy.io/",
        "third_party",
        "Gupy",
        "https://grupoboticario.gupy.io/",
    ),
    "natura-co": (
        "https://natura.gupy.io/",
        "third_party",
        "Gupy",
        "https://natura.gupy.io/",
    ),
    "sicredi": (
        "https://sicredi.gupy.io/",
        "third_party",
        "Gupy",
        "https://sicredi.gupy.io/",
    ),
    "itau-unibanco": (
        "https://carreiras.itau.com.br/",
        "third_party",
        "Gupy",
        "https://vemproitau.gupy.io/",
    ),
    "cpfl-campinas": (
        "https://vagas.cpfl.com.br/",
        "proprietary",
        "",
        "",
    ),
    "agibank-campinas": (
        "https://carreiras.agibank.com.br/vagas",
        "proprietary",
        "",
        "",
    ),
    # Ascenty / ODATA: careers page is the portal; no public *.gupy.io slug verified
    "ascenty-sumare": (
        "https://www.ascenty.com/carreira/",
        "third_party",
        "Gupy",
        "https://portal.gupy.io/job-search?jobName=Ascenty",
    ),
    "ascenty-campinas": (
        "https://www.ascenty.com/carreira/",
        "third_party",
        "Gupy",
        "https://portal.gupy.io/job-search?jobName=Ascenty",
    ),
    "ascenty-paulinia": (
        "https://www.ascenty.com/carreira/",
        "third_party",
        "Gupy",
        "https://portal.gupy.io/job-search?jobName=Ascenty",
    ),
    "odata-sp02": (
        "https://odatacolocation.com/carreiras/",
        "third_party",
        "Gupy",
        "https://portal.gupy.io/job-search?jobName=ODATA",
    ),
    # Lever / Greenhouse / Ashby / WTTJ
    "ciandt-campinas": (
        "https://ciandt.com/br/pt-br/carreiras",
        "third_party",
        "Lever",
        "https://jobs.lever.co/ciandt",
    ),
    "stripe-global": (
        "https://stripe.com/jobs",
        "third_party",
        "Greenhouse",
        "https://job-boards.greenhouse.io/stripe",
    ),
    "databricks-global": (
        "https://www.databricks.com/company/careers",
        "third_party",
        "Greenhouse",
        "https://job-boards.greenhouse.io/databricks",
    ),
    "gitlab-global": (
        "https://about.gitlab.com/jobs/",
        "third_party",
        "Greenhouse",
        "https://job-boards.greenhouse.io/gitlab",
    ),
    "spotify-global": (
        "https://www.lifeatspotify.com/jobs",
        "third_party",
        "Lever",
        "https://jobs.lever.co/spotify",
    ),
    "ifood-brasil": (
        "https://carreiras.ifood.com.br/",
        "third_party",
        "Greenhouse",
        "https://job-boards.greenhouse.io/ifoodcarreiras",
    ),
    "hotmart": (
        "https://job-boards.eu.greenhouse.io/hotmartcareersbr",
        "third_party",
        "Greenhouse",
        "https://job-boards.eu.greenhouse.io/hotmartcareersbr",
    ),
    "nubank-brasil": (
        "https://international.nubank.com.br/careers/brazil/",
        "third_party",
        "Ashby",
        "https://jobs.ashbyhq.com/nubank",
    ),
    "pennylane-europe": (
        "https://www.welcometothejungle.com/en/companies/pennylane/jobs",
        "third_party",
        "Welcome to the Jungle",
        "https://www.welcometothejungle.com/en/companies/pennylane/jobs",
    ),
    "trouw-nutrition-campinas": (
        "https://nutreco.wd3.myworkdayjobs.com/en-US/Nutreco_External",
        "third_party",
        "Workday",
        "https://nutreco.wd3.myworkdayjobs.com/en-US/Nutreco_External",
    ),
    # Proprietary careers with direct search (clear apply destination)
    "bosch-brasil": (
        "https://jobs.bosch.com/en",
        "proprietary",
        "Bosch Jobs",
        "https://jobs.bosch.com/en",
    ),
    "microsoft-global": (
        "https://careers.microsoft.com/v2/global/en/search",
        "proprietary",
        "",
        "",
    ),
    "google-global": (
        "https://careers.google.com/jobs/results/",
        "proprietary",
        "",
        "",
    ),
    "amazon-global": (
        "https://www.amazon.jobs/en/search?base_query=data+analyst",
        "proprietary",
        "",
        "",
    ),
    "meta-global": (
        "https://www.metacareers.com/jobs",
        "proprietary",
        "",
        "",
    ),
    "snowflake-global": (
        "https://careers.snowflake.com/us/en",
        "third_party",
        "Workday",
        "https://careers.snowflake.com/us/en",
    ),
    "atlassian-global": (
        "https://www.atlassian.com/company/careers/all-jobs",
        "third_party",
        "Workday",
        "https://www.atlassian.com/company/careers/all-jobs",
    ),
    "sap-global": (
        "https://jobs.sap.com/search/",
        "third_party",
        "Workday",
        "https://jobs.sap.com/search/",
    ),
    "siemens-global": (
        "https://jobs.siemens.com/",
        "third_party",
        "Workday",
        "https://jobs.siemens.com/",
    ),
    "zalando-global": (
        "https://jobs.zalando.com/en/jobs/",
        "proprietary",
        "",
        "",
    ),
    "booking-global": (
        "https://careers.booking.com/search/",
        "proprietary",
        "",
        "",
    ),
    "alibaba-global": (
        "https://careers.alibaba.com/positionList.htm",
        "proprietary",
        "",
        "",
    ),
    "bytedance-global": (
        "https://jobs.bytedance.com/en/position",
        "proprietary",
        "",
        "",
    ),
    "tencent-global": (
        "https://careers.tencent.com/en-us/position.html",
        "proprietary",
        "",
        "",
    ),
    "mercado-livre": (
        "https://careers-meli.mercadolibre.com/en/positions?country=Brazil",
        "proprietary",
        "",
        "",
    ),
    "magazine-luiza": (
        "https://carreiras.magazineluiza.com.br/",
        "proprietary",
        "",
        "",
    ),
    "capital-one-us": (
        "https://www.capitalonecareers.com/search-jobs",
        "proprietary",
        "",
        "",
    ),
    "jpmorgan-us": (
        "https://careers.jpmorgan.com/us/en/search-results",
        "proprietary",
        "",
        "",
    ),
    "deloitte-us": (
        "https://www.deloitte.com/us/en/careers/careers.html",
        "proprietary",
        "",
        "",
    ),
    "accenture-us": (
        "https://www.accenture.com/us-en/careers/jobsearch",
        "proprietary",
        "",
        "",
    ),
    "walmart-us": (
        "https://careers.walmart.com/results",
        "proprietary",
        "",
        "",
    ),
    "citigroup-us": (
        "https://jobs.citi.com/search-jobs",
        "proprietary",
        "",
        "",
    ),
    "meituan-china": ("https://zhaopin.meituan.com/", "proprietary", "", ""),
    "xiaohongshu-china": ("https://job.xiaohongshu.com/", "proprietary", "", ""),
    "ant-group-china": ("https://talent.antgroup.com/", "proprietary", "", ""),
    "pinduoduo-china": ("https://careers.pinduoduo.com/", "proprietary", "", ""),
    "jd-china": ("https://zhaopin.jd.com/", "proprietary", "", ""),
    "baidu-china": ("https://talent.baidu.com/", "proprietary", "", ""),
}


def main() -> None:
    with PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    updated = 0
    for row in rows:
        cid = row.get("id", "")
        if cid not in PATCH:
            # If careers_url is already a company Gupy/Greenhouse board, mirror to ats_url
            cu = (row.get("careers_url") or "").strip()
            if ".gupy.io" in cu and (row.get("ats_url") or "").rstrip("/") in {
                "https://www.gupy.io",
                "https://gupy.io",
                "",
            }:
                row["ats_kind"] = "third_party"
                row["ats_name"] = "Gupy"
                row["ats_url"] = cu
                updated += 1
            continue

        careers, kind, name, ats = PATCH[cid]
        if careers:
            row["careers_url"] = careers
        row["ats_kind"] = kind
        row["ats_name"] = name
        row["ats_url"] = ats
        updated += 1

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"patched {updated} rows")

    # Report remaining generic vendor ATS URLs
    generic = {
        "https://www.gupy.io/",
        "https://www.greenhouse.com/",
        "https://www.workday.com/",
        "https://www.lever.co/",
    }
    print("still-generic-or-empty:")
    for r in rows:
        au = (r.get("ats_url") or "").strip()
        cu = (r.get("careers_url") or "").strip()
        if not cu:
            print(f"  NO_CAREERS {r['id']}")
        elif au in generic:
            print(f"  GENERIC_ATS {r['id']} {au}")


if __name__ == "__main__":
    main()
