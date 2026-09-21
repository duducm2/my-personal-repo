"""Append high-priority hidden-gem companies to companies.csv."""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "indecx-campinas",
        "sort_order": "80",
        "category_en": "Regional CX / VoC analytics",
        "category_pt": "CX / VoC analytics regional",
        "name_en": "IndeCX",
        "name_pt": "IndeCX",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (HQ)",
        "region_pt": "RMC (sede)",
        "priority": "high",
        "status": "interested",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "no",
        "website": "https://indecx.com.br/",
        "careers_url": "https://indecx.com.br/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "Power BI / dashboards; SQL; CX metrics; NPS/CSI-style outcomes; Stakeholder storytelling; AI-assisted insight reports",
        "skills_match_pt": "Power BI / dashboards; SQL; Metricas de CX; Outcomes tipo NPS/CSI; Storytelling com stakeholders; Relatorios de insight com IA",
        "fit_why_en": "Campinas HQ CX/VoC/NPS platform. Closest local mirror of CSI/NPS + dashboard storytelling for DA (and product-analytics adjacent PO).",
        "fit_why_pt": "Plataforma de CX/VoC/NPS com sede em Campinas. Espelho local mais proximo de CSI/NPS + storytelling com dashboards para DA (e adjacencia PO).",
        "notes_en": "Hidden gem from Sep 2026 research. Watch careers / LinkedIn for BI and CX analytics roles. Offices also in SP and Vitoria.",
        "notes_pt": "Hidden gem da pesquisa Set/2026. Acompanhar carreiras / LinkedIn para BI e analytics de CX. Filiais em SP e Vitoria.",
    },
    {
        "id": "leega-brasil",
        "sort_order": "81",
        "category_en": "Brazil data / analytics consulting",
        "category_pt": "Consultoria de dados / analytics Brasil",
        "name_en": "Leega",
        "name_pt": "Leega",
        "city_en": "Brazil (remote / client sites)",
        "city_pt": "Brasil (remoto / clientes)",
        "region_en": "Brazil remote-friendly consulting",
        "region_pt": "Consultoria Brasil com perfil remoto",
        "priority": "high",
        "status": "interested",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.leega.com.br/",
        "careers_url": "https://leega.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "Power BI (DAX/Power Query); SQL; Python; ETL; Cloud (AWS/GCP/Azure); Databricks / Fabric (plus)",
        "skills_match_pt": "Power BI (DAX/Power Query); SQL; Python; ETL; Cloud (AWS/GCP/Azure); Databricks / Fabric (plus)",
        "fit_why_en": "LatAm data consultancy with recurring remote Power BI / Python / SQL BI openings. Strong DA delivery path; DSA-adjacent on cloud/analytics architecture projects.",
        "fit_why_pt": "Consultoria LatAm de dados com vagas remotas recorrentes de BI Power BI / Python / SQL. Trilha forte de DA; adjacencia DSA em projetos cloud/analytics.",
        "notes_en": "Hidden gem from Sep 2026 research. Prefer postings labeled remote Brazil. Confirm client-site travel expectations.",
        "notes_pt": "Hidden gem da pesquisa Set/2026. Preferir vagas remotas Brasil. Confirmar expectativa de presencial em cliente.",
    },
    {
        "id": "porto-seguro",
        "sort_order": "82",
        "category_en": "Brazil insurance / financial services",
        "category_pt": "Seguros / servicos financeiros Brasil",
        "name_en": "Porto Seguro",
        "name_pt": "Porto Seguro",
        "city_en": "Sao Paulo",
        "city_pt": "Sao Paulo",
        "region_en": "Brazil (SP metro; hybrid/onsite by team)",
        "region_pt": "Brasil (RMSP; hibrido/presencial por time)",
        "priority": "high",
        "status": "researching",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.portoseguro.com.br/",
        "careers_url": "https://porto.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Power BI / analytics reporting; Python (plus); Insurance/ops KPIs; Stakeholder dashboards",
        "skills_match_pt": "SQL; Power BI / reporting analitico; Python (plus); KPIs de seguros/ops; Dashboards para stakeholders",
        "fit_why_en": "Large BR insurer with active Data Analyst hiring. r/brdev alumni cite strong data mentorship beyond pure dashboards — good regulated-domain DA path.",
        "fit_why_pt": "Grande seguradora BR com contratacao ativa de Analista de Dados. Alumni no r/brdev citam mentoria forte em dados alem de dashboards — boa trilha DA em dominio regulado.",
        "notes_en": "Hidden gem from Sep 2026 research (r/brdev). Verify hybrid policy per JD; SP-centric.",
        "notes_pt": "Hidden gem da pesquisa Set/2026 (r/brdev). Verificar politica hibrida por JD; foco SP.",
    },
    {
        "id": "pennylane-europe",
        "sort_order": "83",
        "category_en": "European fintech (France) - remote track",
        "category_pt": "Fintech europeia (Franca) - trilha remota",
        "name_en": "Pennylane",
        "name_pt": "Pennylane",
        "city_en": "Paris (remote Europe)",
        "city_pt": "Paris (remoto Europa)",
        "region_en": "Europe remote (CET +/- 2h typical)",
        "region_pt": "Europa remota (tipicamente CET +/- 2h)",
        "priority": "high",
        "status": "interested",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.pennylane.com/",
        "careers_url": "https://www.welcometothejungle.com/en/companies/pennylane",
        "ats_kind": "third_party",
        "ats_name": "Welcome to the Jungle",
        "ats_url": "https://www.welcometothejungle.com/",
        "skills_match_en": "SQL; Python; dbt; Product/ops analytics; Data warehouse literacy; English (French plus)",
        "skills_match_pt": "SQL; Python; dbt; Analytics de produto/ops; Literacia em warehouse; Ingles (frances plus)",
        "fit_why_en": "Fast-growing EU accounting fintech with frequent Senior DA openings. SQL/dbt/Python stack; remote Europe if timezone allows — strong non-FAANG EU DA path.",
        "fit_why_pt": "Fintech europeia de contabilide em alto crescimento com vagas frequentes de Senior DA. Stack SQL/dbt/Python; remoto Europa se o fuso permitir — forte trilha DA EU fora das mega-caps.",
        "notes_en": "Hidden gem from Sep 2026 research. Confirm Brazil eligibility is usually NO — Europe residence / CET window required. Stretch international target.",
        "notes_pt": "Hidden gem da pesquisa Set/2026. Elegibilidade Brasil geralmente NAO — residencia Europa / janela CET. Alvo internacional stretch.",
    },
]


def twin(row: dict[str, str]) -> dict[str, str]:
    out = dict(row)
    for key in list(row):
        if key.endswith("_en") and not key.endswith("_detail_en"):
            base = key[: -len("_en")]
            detail = f"{base}_detail_en"
            if detail not in out:
                out[detail] = row[key]
        if key.endswith("_pt") and not key.endswith("_detail_pt"):
            base = key[: -len("_pt")]
            detail = f"{base}_detail_pt"
            if detail not in out:
                out[detail] = row[key]
    return out


def main() -> None:
    with PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    existing = {r["id"] for r in rows}
    added = 0
    for raw in NEW:
        if raw["id"] in existing:
            print("skip existing", raw["id"])
            continue
        rows.append(twin(raw))
        added += 1
        print("add", raw["id"])

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    print(f"done: +{added}; total {len(rows)}")


if __name__ == "__main__":
    main()
