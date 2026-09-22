"""Mark high-growth employers from Sep 2026 research.

Criteria (high): recent public evidence of strong revenue/hiring/capex expansion
(State of Data preferred employers + hyperscalers / AI infra).
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

# Explicit high-growth set from research notes (see notes_en updates below)
HIGH = {
    "nubank-brasil": "R$45B BR plan 2026; ~45% revenue growth; continued hiring",
    "ifood-brasil": "R$17B invest +1,100 hires (~+19% headcount) through Mar 2026",
    "mercado-livre": "R$57B BR invest 2026; LatAm net revenue +50% in 2Q26",
    "databricks-global": ">80% YoY; >$7B revenue run-rate; $190B valuation (2026)",
    "stripe-global": "Valuation ~$159B (+70% YoY); payment volume +34% in 2025",
    "snowflake-global": "Product revenue +37% YoY with accelerating FY27 guidance",
    "byd-brasil-campinas": "BR auto sales +110% H1'26; Camaçari scale-up / nationalization",
    "ascenty-sumare": "US$1.2B / 150MW AI DC expansion announced (Digital Realty)",
    "ascenty-campinas": "US$1.2B / 150MW AI DC expansion announced (Digital Realty)",
    "ascenty-paulinia": "US$1.2B / 150MW AI DC expansion announced (Digital Realty)",
    "scala-svcpcp01": "Hyperscale DC peer riding LatAm AI capacity boom",
    "pennylane-europe": "High-growth EU fintech; recent large funding round",
    "hotmart": "Cumulative GMV R$50B; AI-related GMV +354% YoY in platform",
    "pinduoduo-china": "Temu + China marketplace expansion; continuous DA/BA hiring pressure",
}

MODERATE = {
    "microsoft-global",
    "google-global",
    "amazon-global",
    "meta-global",
    "sap-global",
    "siemens-global",
    "spotify-global",
    "booking-global",
    "atlassian-global",
    "gitlab-global",
    "alibaba-global",
    "bytedance-global",
    "tencent-global",
    "meituan-china",
    "xiaohongshu-china",
    "ant-group-china",
    "jd-china",
    "baidu-china",
    "zalando-global",
    "ambev-tech-campinas",
    "itau-unibanco",
    "grupo-boticario",
    "magazine-luiza",
    "agibank-campinas",
    "leega-brasil",
    "cloud-hq-paulinia",
    "odata-sp02",
}


def main() -> None:
    with PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    if "growth" not in fieldnames:
        # insert after home_office if present, else after status
        if "home_office" in fieldnames:
            i = fieldnames.index("home_office") + 1
            fieldnames.insert(i, "growth")
        elif "status" in fieldnames:
            i = fieldnames.index("status") + 1
            fieldnames.insert(i, "growth")
        else:
            fieldnames.append("growth")

    for row in rows:
        cid = row.get("id", "")
        if cid in HIGH:
            row["growth"] = "high"
            note = HIGH[cid]
            existing = (row.get("notes_en") or "").strip()
            marker = "Growth tag (Sep 2026):"
            if marker not in existing:
                row["notes_en"] = (
                    f"{existing} {marker} {note}".strip()
                    if existing
                    else f"{marker} {note}"
                )
                row.setdefault("notes_detail_en", row["notes_en"])
        elif cid in MODERATE:
            row["growth"] = "moderate"
        else:
            row.setdefault("growth", "unknown")
            if not row.get("growth"):
                row["growth"] = "unknown"

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    from collections import Counter

    c = Counter(r.get("growth") for r in rows)
    print(dict(c))
    print("high:", [r["id"] for r in rows if r.get("growth") == "high"])


if __name__ == "__main__":
    main()
