"""Backfill companies.csv home_office (empty cells only).

Tier A: seed-script intents (campinas RMC, large employers, State of Data).
Tier B: Oct 2026 careers / Gupy research (see research/brazil-home-office-classification.md).
Tier INTL: international rows with BR-eligibility lens
  (see research/intl-remote-home-office-classification.md).

Never overwrites a non-empty home_office value.
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

VALID = frozenset({"yes", "hybrid", "no", "unknown"})

# (value, short evidence note appended to notes_en when applied)
TIER_A: dict[str, tuple[str, str]] = {
    # seed_campinas_rmc_companies.py
    "trouw-nutrition-campinas": (
        "hybrid",
        "seed campinas_rmc: hybrid signals on Campinas roles",
    ),
    "ambev-tech-campinas": (
        "hybrid",
        "seed campinas_rmc: national Ambev Tech hybrid/remote; Global Tech often onsite",
    ),
    "byd-brasil-campinas": ("no", "seed campinas_rmc: Campinas HQ / plant ops"),
    "sidi-campinas": ("no", "seed campinas_rmc: campus / office-leaning"),
    "padtec-campinas": (
        "hybrid",
        "seed campinas_rmc: hybrid on several Campinas postings",
    ),
    "venturus-campinas": ("hybrid", "seed campinas_rmc: hybrid common"),
    "3m-sumare": ("hybrid", "seed campinas_rmc: hybrid for office roles"),
    "oba-hortifruti-sumare": ("no", "seed campinas_rmc: typically onsite CD Sumaré"),
    "hospital-vera-cruz-campinas": (
        "unknown",
        "seed campinas_rmc: insufficient HO evidence",
    ),
    "grupo-mandic-campinas": ("no", "seed campinas_rmc: onsite Campinas DA observed"),
    # seed_rmc_large_employers.py
    "unimed-campinas": ("hybrid", "seed rmc_large: hybrid for some admin/tech roles"),
    "honda-sumare": ("no", "seed rmc_large: many roles onsite Sumaré"),
    "toyota-indaiatuba": ("hybrid", "seed rmc_large: hybrid by role"),
    "sanofi-medley-campinas": ("no", "seed rmc_large: plant openings"),
    "ems-hortolandia": ("no", "seed rmc_large: industrial site"),
    "organon-campinas": ("no", "seed rmc_large: plant"),
    "solvay-rhodia-paulinia": ("no", "seed rmc_large: chemical complex"),
    "petrobras-replan-paulinia": ("no", "seed rmc_large: refinery / public selection"),
    "eaton-valinhos": ("hybrid", "seed rmc_large: hybrid by role"),
    "john-deere-indaiatuba": ("hybrid", "seed rmc_large: hybrid by role"),
    "azul-viracopos": ("hybrid", "seed rmc_large: hybrid by role"),
    "sotreq-valinhos": ("hybrid", "seed rmc_large: hybrid by role"),
    "unicamp": ("hybrid", "seed rmc_large: hybrid/remote by unit"),
    "puc-campinas": ("hybrid", "seed rmc_large: hybrid by role"),
    # seed_rmc_large_employers_gap_audit.py
    "sanasa-campinas": ("no", "seed gap_audit: municipal / concurso onsite"),
    "marelli-hortolandia": ("no", "seed gap_audit: plant"),
    "lenovo-motorola-jaguariuna": (
        "hybrid",
        "seed gap_audit: campus + fretado; hybrid by role",
    ),
    "neoenergia-elektro": ("hybrid", "seed gap_audit: hybrid by role"),
    "dpaschoal-campinas": ("hybrid", "seed gap_audit: hybrid by role"),
    "valeo-itatiba": ("no", "seed gap_audit: plant"),
    "villares-metals-sumare": ("no", "seed gap_audit: mill"),
    "basf-rmc": ("hybrid", "seed gap_audit: hybrid by role"),
    # seed_state_of_data_preferred_companies.py
    "nubank-brasil": (
        "hybrid",
        "seed state_of_data: hybrid; Campinas among BR offices",
    ),
    "ifood-brasil": ("hybrid", "seed state_of_data: hybrid/remote by role"),
    "mercado-livre": ("hybrid", "seed state_of_data: hybrid trend; SP office strong"),
    "itau-unibanco": ("hybrid", "seed state_of_data: hybrid by role"),
    "grupo-boticario": (
        "yes",
        "seed state_of_data + Gupy Oct 2026: multiple Remote Work listings",
    ),
    "hotmart": ("hybrid", "seed state_of_data: hybrid by role"),
    "natura-co": ("hybrid", "seed state_of_data: hybrid/remote by role"),
    "sicredi": ("hybrid", "seed state_of_data: hybrid/onsite by cooperative"),
    "magazine-luiza": (
        "hybrid",
        "seed state_of_data: MagaluTech hybrid/remote by role",
    ),
}

# Populated / refined from research/brazil-home-office-classification.md (Oct 2026)
TIER_B: dict[str, tuple[str, str]] = {
    "leega-brasil": (
        "yes",
        "HO (Oct 2026): remote-friendly BR consulting; Gupy + seed notes prefer remote Brazil JDs",
    ),
    "kryptus-campinas": (
        "yes",
        "HO (Oct 2026): Gupy + notes — hybrid/remote common; Brazil remote postings",
    ),
    "matera-campinas": (
        "hybrid",
        "HO (Oct 2026): Campinas tech; hybrid common on InHire board",
    ),
    "daitan-campinas": (
        "hybrid",
        "HO (Oct 2026): Encora/Daitan Campinas — hybrid/remote by client engagement",
    ),
    "isystems-campinas": (
        "hybrid",
        "HO (Oct 2026): Campinas software house — hybrid by role",
    ),
    "bosch-brasil": (
        "hybrid",
        "HO (Oct 2026): openings often hybrid ~3x/week Campinas; SmartRecruiters BR",
    ),
    "bosch-brasil-internal": (
        "hybrid",
        "HO (Oct 2026): same BR Bosch policy as public board (hybrid common)",
    ),
    "eldorado-campinas": (
        "hybrid",
        "HO (Oct 2026): Instituto Eldorado Gupy — Híbrido common on tech roles",
    ),
    "ciandt-campinas": (
        "hybrid",
        "HO (Oct 2026): CI&T careers — hybrid; metro residents often office-required",
    ),
    "msx-campinas": (
        "hybrid",
        "HO (Oct 2026): region_en marks hybrid Campinas",
    ),
    "porto-seguro": (
        "hybrid",
        "HO (Oct 2026): Porto Gupy — hybrid/onsite by team; SP-centric",
    ),
    "indecx-campinas": (
        "hybrid",
        "HO (Oct 2026): Campinas HQ SaaS; hybrid/remote by role on careers",
    ),
    "agibank-campinas": (
        "no",
        "HO (Oct 2026): careers lean presencial Campinas for many roles",
    ),
    "cpfl-campinas": (
        "no",
        "HO (Oct 2026): utility ops — often on-site Campinas",
    ),
    "cpqd-campinas": (
        "hybrid",
        "HO (Oct 2026): CPqD Campinas R&D — hybrid by project",
    ),
    "samsung-srbr-campinas": (
        "hybrid",
        "HO (Oct 2026): SRBR lab Campinas — hybrid/onsite mix",
    ),
    "ascenty-sumare": ("no", "HO (Oct 2026): hyperscale DC ops — site/onsite"),
    "ascenty-campinas": ("no", "HO (Oct 2026): hyperscale DC ops — site/onsite"),
    "ascenty-paulinia": ("no", "HO (Oct 2026): hyperscale DC ops — site/onsite"),
    "scala-svcpcp01": ("no", "HO (Oct 2026): hyperscale DC ops — site/onsite"),
    "odata-sp02": ("no", "HO (Oct 2026): DC SP02 Hortolândia — site/onsite"),
    "cloud-hq-paulinia": ("no", "HO (Oct 2026): DC campus Paulínia — site/onsite"),
    "consultimer-dc": ("no", "HO (Oct 2026): DC services — client/site leaning"),
    "cnpem-campinas": (
        "no",
        "HO (Oct 2026): national lab / Sirius campus — predominantly onsite",
    ),
    "cti-renato-archer-campinas": (
        "no",
        "HO (Oct 2026): federal research campus — editais/onsite",
    ),
    "huawei-campinas": (
        "hybrid",
        "HO (Oct 2026): Techno Park + national ops — hybrid by role",
    ),
    "tetra-pak-campinas": (
        "hybrid",
        "HO (Oct 2026): Campinas / Monte Mor — hybrid by role",
    ),
    "nxp-campinas": (
        "hybrid",
        "HO (Oct 2026): semiconductor talent pool — hybrid/onsite by role",
    ),
    "syngenta-rmc": (
        "hybrid",
        "HO (Oct 2026): agri corridor sites — hybrid for office; field onsite",
    ),
    "corteva-brasil": (
        "hybrid",
        "HO (Oct 2026): agri national — hybrid by role; confirm site",
    ),
    "schneider-electric-brasil": (
        "hybrid",
        "HO (Oct 2026): industrial + national — hybrid by role",
    ),
    "cnh-brasil": (
        "hybrid",
        "HO (Oct 2026): plants/hubs — hybrid for knowledge-work; plant onsite",
    ),
    "agco-brasil": (
        "hybrid",
        "HO (Oct 2026): agri belt — hybrid by role; confirm site per JD",
    ),
    "jacto-rmc": (
        "no",
        "HO (Oct 2026): Pompéia industrial — typically onsite",
    ),
}

# International empty rows — BR hiring eligibility lens (Oct 2026)
TIER_INTL: dict[str, tuple[str, str]] = {
    "gitlab-global": (
        "yes",
        "HO (Oct 2026): Greenhouse Remote Brazil / LATAM sales+CS; all-remote country guidelines",
    ),
    "atlassian-global": (
        "yes",
        "HO (Oct 2026): Team Anywhere where entity exists; LatAm hiring on careers",
    ),
    "stripe-global": (
        "yes",
        "HO (Oct 2026): remote-friendly teams; country eligibility lists often include BR",
    ),
    "spotify-global": (
        "hybrid",
        "HO (Oct 2026): WFA heritage; confirm Brazil per JD (selective)",
    ),
    "microsoft-global": (
        "hybrid",
        "HO (Oct 2026): remote/intl by team; filter LatAm/Brazil",
    ),
    "google-global": (
        "hybrid",
        "HO (Oct 2026): selective remote; filter Remote + Brazil/LatAm",
    ),
    "amazon-global": (
        "hybrid",
        "HO (Oct 2026): remote/intl case-by-case for BI/analytics",
    ),
    "databricks-global": (
        "hybrid",
        "HO (Oct 2026): remote by role; verify country eligibility",
    ),
    "snowflake-global": (
        "hybrid",
        "HO (Oct 2026): remote by role; verify country eligibility",
    ),
    "sap-global": (
        "hybrid",
        "HO (Oct 2026): remote within hiring countries; BR entity possible",
    ),
    "siemens-global": (
        "hybrid",
        "HO (Oct 2026): remote/hybrid by unit; verify BR",
    ),
    "meta-global": (
        "no",
        "HO (Oct 2026): remote limited; BR rare on open boards",
    ),
    "zalando-global": (
        "no",
        "HO (Oct 2026): Europe-focused remote/hybrid",
    ),
    "booking-global": (
        "no",
        "HO (Oct 2026): Europe-centric; outside-EU remote limited",
    ),
    "pennylane-europe": (
        "no",
        "HO (Oct 2026): Europe residence / CET; BR usually NO",
    ),
    "capital-one-us": (
        "no",
        "HO (Oct 2026): US-person-centric remote",
    ),
    "jpmorgan-us": (
        "no",
        "HO (Oct 2026): US hubs; BR remote uncommon on US board",
    ),
    "walmart-us": (
        "no",
        "HO (Oct 2026): US retail tech; BR rare",
    ),
    "citigroup-us": (
        "no",
        "HO (Oct 2026): prefer Citi Brasil entity separately",
    ),
    "deloitte-us": (
        "hybrid",
        "HO (Oct 2026): use Deloitte BR entity for local/hybrid careers",
    ),
    "accenture-us": (
        "hybrid",
        "HO (Oct 2026): strong BR entity; remote/hybrid by project",
    ),
    "alibaba-global": (
        "no",
        "HO (Oct 2026): intl via hubs; LatAm remote rare",
    ),
    "bytedance-global": (
        "no",
        "HO (Oct 2026): country-specific; BR rare",
    ),
    "tencent-global": (
        "no",
        "HO (Oct 2026): via hubs; BR rare",
    ),
    "meituan-china": (
        "no",
        "HO (Oct 2026): China-local / Mandarin-centric board",
    ),
    "xiaohongshu-china": (
        "no",
        "HO (Oct 2026): China-local / Mandarin-centric board",
    ),
    "ant-group-china": (
        "no",
        "HO (Oct 2026): China-local / Mandarin-centric board",
    ),
    "pinduoduo-china": (
        "no",
        "HO (Oct 2026): China-local; Temu intl ops not BR-remote default",
    ),
    "jd-china": (
        "no",
        "HO (Oct 2026): China-local / Mandarin-centric board",
    ),
    "baidu-china": (
        "no",
        "HO (Oct 2026): China-local / Mandarin-centric board",
    ),
}


def apply_map(
    rows: list[dict[str, str]],
    mapping: dict[str, tuple[str, str]],
    *,
    tier: str,
) -> list[str]:
    applied: list[str] = []
    by_id = {r.get("id", ""): r for r in rows}
    for cid, (value, evidence) in mapping.items():
        if value not in VALID:
            raise ValueError(f"{tier} {cid}: invalid home_office {value!r}")
        row = by_id.get(cid)
        if not row:
            print(f"skip missing id ({tier}): {cid}")
            continue
        current = (row.get("home_office") or "").strip().lower()
        if current:
            print(f"skip non-empty ({tier}): {cid} already={current}")
            continue
        row["home_office"] = value
        note = (row.get("notes_en") or "").strip()
        marker = evidence.split(":")[0] if ":" in evidence else evidence[:40]
        if evidence and evidence not in note and marker not in note:
            row["notes_en"] = f"{note} {evidence}".strip() if note else evidence
            if not (row.get("notes_detail_en") or "").strip():
                row["notes_detail_en"] = row["notes_en"]
        applied.append(f"{cid}={value}")
    return applied


def main() -> None:
    with PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    if "home_office" not in fieldnames:
        raise SystemExit("companies.csv missing home_office column")

    a = apply_map(rows, TIER_A, tier="A")
    b = apply_map(rows, TIER_B, tier="B")
    intl = apply_map(rows, TIER_INTL, tier="INTL")

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    from collections import Counter

    c = Counter((r.get("home_office") or "").strip() or "(empty)" for r in rows)
    print("home_office counts:", dict(c))
    print(f"Tier A applied: {len(a)}")
    print(f"Tier B applied: {len(b)}")
    print(f"Tier INTL applied: {len(intl)}")
    print(
        "accepts (yes|hybrid):",
        [
            r["id"]
            for r in rows
            if (r.get("home_office") or "").strip().lower() in {"yes", "hybrid"}
        ],
    )


if __name__ == "__main__":
    main()
