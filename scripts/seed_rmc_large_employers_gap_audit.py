"""Add RMC large employers missed in prior pass (browser + Wikipedia audit)."""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "sanasa-campinas",
        "sort_order": "114",
        "category_en": "Regional water utility (RMC large employer)",
        "category_pt": "Saneamento / agua regional (grande empregador RMC)",
        "name_en": "SANASA Campinas",
        "name_pt": "SANASA Campinas",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "high",
        "status": "researching",
        "home_office": "no",
        "growth": "unknown",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.sanasa.com.br/",
        "careers_url": "https://www.sanasa.com.br/trabalhe-com-a-gente/",
        "ats_kind": "proprietary",
        "ats_name": "Concurso / CIEE",
        "ats_url": "https://www.sanasa.com.br/trabalhe-com-a-gente/",
        "skills_match_en": "SQL; Excel / Power BI; Utility ops / water-loss KPIs; Public-sector reporting",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de ops / perdas de agua; Reporting setor publico",
        "fit_why_en": "Campinas municipal water/sanitation company — major local public employer. Hiring via concurso + internship programs.",
        "fit_why_pt": "Companhia municipal de agua/saneamento de Campinas — grande empregador publico local. Contratacao via concurso + estagios.",
        "notes_en": "Sep 2026 gap audit. Watch concurso edital + CIEE stages on sanasa.com.br/trabalhe-com-a-gente.",
        "notes_pt": "Auditoria de lacunas set/2026. Acompanhar edital de concurso + estagios CIEE.",
    },
    {
        "id": "marelli-hortolandia",
        "sort_order": "115",
        "category_en": "Regional automotive supplier (RMC large employer)",
        "category_pt": "Autopecas / supplier regional (grande empregador RMC)",
        "name_en": "Marelli (Hortolandia)",
        "name_pt": "Marelli (Hortolandia)",
        "city_en": "Hortolandia",
        "city_pt": "Hortolandia",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "high",
        "status": "researching",
        "home_office": "no",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.marelli.com/",
        "careers_url": "https://trabalheconosco.vagas.com.br/marelli",
        "ats_kind": "third_party",
        "ats_name": "Vagas.com",
        "ats_url": "https://trabalheconosco.vagas.com.br/marelli/oportunidades",
        "skills_match_en": "SQL; Excel / Power BI; Manufacturing / quality / metrology KPIs; Ops reporting",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de manufatura / qualidade / metrologia; Reporting de ops",
        "fit_why_en": "Large auto supplier plant in Hortolandia (ex-Magneti Marelli). Live Vagas.com board with Hortolandia openings.",
        "fit_why_pt": "Grande planta de autopecas em Hortolandia (ex-Magneti Marelli). Board Vagas.com com vagas Hortolandia.",
        "notes_en": "Sep 2026 gap audit. Filter Hortolandia on trabalheconosco.vagas.com.br/marelli.",
        "notes_pt": "Auditoria de lacunas set/2026. Filtrar Hortolandia no board Marelli.",
    },
    {
        "id": "lenovo-motorola-jaguariuna",
        "sort_order": "116",
        "category_en": "Regional electronics / R&D (RMC large employer)",
        "category_pt": "Eletronica / P&D regional (grande empregador RMC)",
        "name_en": "Lenovo / Motorola (Jaguariuna)",
        "name_pt": "Lenovo / Motorola (Jaguariuna)",
        "city_en": "Jaguariuna (fretado from Campinas metro)",
        "city_pt": "Jaguariuna (fretado da RMC)",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.lenovo.com/",
        "careers_url": "https://jobs.lenovo.com/pt_BR/careers/SearchJobs/Jaguariuna",
        "ats_kind": "proprietary",
        "ats_name": "Lenovo Jobs",
        "ats_url": "https://jobs.lenovo.com/pt_BR/careers/SearchJobs/Jaguariuna",
        "skills_match_en": "SQL; Python; Product / ops analytics; R&D metrics; BI storytelling",
        "skills_match_pt": "SQL; Python; Analytics de produto / ops; Metricas de P&D; Storytelling BI",
        "fit_why_en": "Historic Motorola campus in Jaguariuna (now Lenovo) — major RMC electronics/R&D employer with shuttle links to Campinas metro.",
        "fit_why_pt": "Historico campus Motorola em Jaguariuna (agora Lenovo) — grande empregador de eletronica/P&D da RMC com fretado para a metro.",
        "notes_en": "Sep 2026 gap audit. jobs.lenovo.com SearchJobs/Jaguariuna; Motorola R&D roles often posted via CIEE too.",
        "notes_pt": "Auditoria de lacunas set/2026. jobs.lenovo.com SearchJobs/Jaguariuna; roles Motorola R&D tambem via CIEE.",
    },
    {
        "id": "neoenergia-elektro",
        "sort_order": "117",
        "category_en": "Regional electricity distributor (RMC large employer)",
        "category_pt": "Distribuidora de energia regional (grande empregador RMC)",
        "name_en": "Neoenergia Elektro",
        "name_pt": "Neoenergia Elektro",
        "city_en": "Campinas (coverage across interior SP)",
        "city_pt": "Campinas (cobertura interior SP)",
        "region_en": "Campinas metro / interior SP",
        "region_pt": "RMC / interior SP",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.neoenergia.com/",
        "careers_url": "https://www.neoenergia.com/pt-br/pessoas-e-talentos",
        "ats_kind": "third_party",
        "ats_name": "Vagas.com / Iberdrola",
        "ats_url": "https://www.careers.iberdrola.com/?locale=pt_BR",
        "skills_match_en": "SQL; Excel / Power BI; Grid / works / commercial KPIs; Utility ops analytics",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de rede / obras / comercial; Analytics de ops de utility",
        "fit_why_en": "Major SP distributor (ex-Elektro) with frequent Campinas openings — peer to CPFL for regional utility hiring.",
        "fit_why_pt": "Grande distribuidora SP (ex-Elektro) com vagas frequentes em Campinas — peer da CPFL para contratacao regional de utility.",
        "notes_en": "Sep 2026 gap audit. Neoenergia people page + Iberdrola careers board; filter Campinas.",
        "notes_pt": "Auditoria de lacunas set/2026. Pagina Pessoas Neoenergia + board Iberdrola; filtrar Campinas.",
    },
    {
        "id": "dpaschoal-campinas",
        "sort_order": "118",
        "category_en": "Regional auto retail / tires (RMC large employer)",
        "category_pt": "Varejo automotivo / pneus regional (grande empregador RMC)",
        "name_en": "DPaschoal",
        "name_pt": "DPaschoal",
        "city_en": "Campinas (HQ / network)",
        "city_pt": "Campinas (sede / rede)",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.dpaschoal.com.br/",
        "careers_url": "https://www.dpaschoal.com.br/trabalhe-conosco",
        "ats_kind": "third_party",
        "ats_name": "Vagas.com",
        "ats_url": "https://trabalheconosco.vagas.com.br/dpaschoal",
        "skills_match_en": "SQL; Excel / Power BI; Retail / franchise / aftersales KPIs; Commercial reporting",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de varejo / franquia / pos-venda; Reporting comercial",
        "fit_why_en": "Campinas-rooted national auto retail chain — long on classic RMC largest-employer lists.",
        "fit_why_pt": "Rede nacional de varejo automotivo com raizes em Campinas — recorrente nas listas de maiores empregadores da RMC.",
        "notes_en": "Sep 2026 gap audit. dpaschoal.com.br/trabalhe-conosco + Vagas.com board.",
        "notes_pt": "Auditoria de lacunas set/2026. Trabalhe conosco + board Vagas.com.",
    },
    {
        "id": "valeo-itatiba",
        "sort_order": "119",
        "category_en": "Regional automotive supplier (RMC large employer)",
        "category_pt": "Autopecas / supplier regional (grande empregador RMC)",
        "name_en": "Valeo (Itatiba)",
        "name_pt": "Valeo (Itatiba)",
        "city_en": "Itatiba (RMC commute)",
        "city_pt": "Itatiba (deslocamento RMC)",
        "region_en": "Campinas metro / nearby",
        "region_pt": "RMC / entorno",
        "priority": "medium",
        "status": "researching",
        "home_office": "no",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.valeo.com/",
        "careers_url": "https://valeo.wd3.myworkdayjobs.com/valeo_jobs",
        "ats_kind": "third_party",
        "ats_name": "Workday",
        "ats_url": "https://valeo.wd3.myworkdayjobs.com/valeo_jobs",
        "skills_match_en": "SQL; Excel / Power BI; Manufacturing / quality / supply KPIs; Automotive ops analytics",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de manufatura / qualidade / supply; Analytics de ops automotiva",
        "fit_why_en": "Large auto supplier with Itatiba plant — appears on classic Campinas-region largest-company rankings.",
        "fit_why_pt": "Grande fornecedor auto com planta Itatiba — aparece em rankings classicos de maiores empresas da regiao.",
        "notes_en": "Sep 2026 gap audit. Filter Brazil / Itatiba on Valeo Workday.",
        "notes_pt": "Auditoria de lacunas set/2026. Filtrar Brasil / Itatiba no Workday Valeo.",
    },
    {
        "id": "villares-metals-sumare",
        "sort_order": "120",
        "category_en": "Regional specialty steel (RMC large employer)",
        "category_pt": "Acos especiais regional (grande empregador RMC)",
        "name_en": "Villares Metals (Sumare)",
        "name_pt": "Villares Metals (Sumare)",
        "city_en": "Sumare",
        "city_pt": "Sumare",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "home_office": "no",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.villaresmetals.com.br/",
        "careers_url": "https://villaresmetals.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://villaresmetals.gupy.io/",
        "skills_match_en": "SQL; Excel / Power BI; Production / PCP / quality KPIs; Industrial ops reporting",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de producao / PCP / qualidade; Reporting de ops industrial",
        "fit_why_en": "Specialty steel mill in Sumare — long-standing RMC industrial employer with active Gupy board.",
        "fit_why_pt": "Siderurgica de acos especiais em Sumare — empregador industrial historico da RMC com board Gupy ativo.",
        "notes_en": "Sep 2026 gap audit. villaresmetals.gupy.io.",
        "notes_pt": "Auditoria de lacunas set/2026. villaresmetals.gupy.io.",
    },
    {
        "id": "basf-rmc",
        "sort_order": "121",
        "category_en": "Regional chemical industry (RMC large employer)",
        "category_pt": "Industria quimica regional (grande empregador RMC)",
        "name_en": "BASF Brasil (RMC footprint)",
        "name_pt": "BASF Brasil (presenca RMC)",
        "city_en": "Campinas region / SP chemical corridor",
        "city_pt": "Regiao de Campinas / corredor quimico SP",
        "region_en": "Campinas metro / interior SP",
        "region_pt": "RMC / interior SP",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.basf.com/br",
        "careers_url": "https://basf.jobs/south_america",
        "ats_kind": "proprietary",
        "ats_name": "BASF Jobs",
        "ats_url": "https://basf.jobs/south_america",
        "skills_match_en": "SQL; Excel / Power BI; Chemical ops / commercial KPIs; Industrial analytics",
        "skills_match_pt": "SQL; Excel / Power BI; KPIs de ops quimica / comercial; Analytics industrial",
        "fit_why_en": "Named among Campinas-region largest multinationals; chemical peer to Solvay/Rhodia for regional industrial hiring.",
        "fit_why_pt": "Citada entre as maiores multinacionais da regiao de Campinas; peer quimico da Solvay/Rhodia para contratacao industrial regional.",
        "notes_en": "Sep 2026 gap audit. Filter Brazil locations on basf.jobs/south_america.",
        "notes_pt": "Auditoria de lacunas set/2026. Filtrar locais Brasil em basf.jobs/south_america.",
    },
]


def twin(row: dict[str, str]) -> dict[str, str]:
    out = dict(row)
    for key in list(row):
        if key.endswith("_en") and not key.endswith("_detail_en"):
            base = key[: -len("_en")]
            out.setdefault(f"{base}_detail_en", row[key])
        if key.endswith("_pt") and not key.endswith("_detail_pt"):
            base = key[: -len("_pt")]
            out.setdefault(f"{base}_detail_pt", row[key])
    return out


def main() -> None:
    with PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    existing = {r.get("id") for r in rows}
    added = 0
    for raw in NEW:
        if raw["id"] in existing:
            print(f"skip existing {raw['id']}")
            continue
        rows.append(twin(raw))
        existing.add(raw["id"])
        added += 1
        print(f"add {raw['id']}")

    for r in rows:
        for k in r:
            if k not in fieldnames:
                fieldnames.append(k)

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"done: +{added} (total {len(rows)})")


if __name__ == "__main__":
    main()
