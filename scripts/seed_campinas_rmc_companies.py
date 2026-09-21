"""Append Campinas / RMC employers with DA/BI hiring footprint."""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "trouw-nutrition-campinas",
        "sort_order": "90",
        "category_en": "Animal nutrition / agribusiness (Nutreco)",
        "category_pt": "Nutricao animal / agronegocio (Nutreco)",
        "name_en": "Trouw Nutrition (Nutreco)",
        "name_pt": "Trouw Nutrition (Nutreco)",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (HQ BR / LatAm BI)",
        "region_pt": "RMC (sede BR / BI LatAm)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.trouwnutrition.com.br/",
        "careers_url": "https://nutreco.wd3.myworkdayjobs.com/en-US/Nutreco_External",
        "ats_kind": "third_party",
        "ats_name": "Workday",
        "ats_url": "https://www.workday.com/",
        "skills_match_en": "Microsoft Fabric; Power BI; SQL; Python/PySpark; Commercial / market-intel dashboards; LatAm stakeholder English",
        "skills_match_pt": "Microsoft Fabric; Power BI; SQL; Python/PySpark; Dashboards comerciais / inteligencia de mercado; Ingles com stakeholders LatAm",
        "fit_why_en": "Active BI Analyst III hiring in Campinas (Fabric + Power BI + SQL + PySpark) for Brazil/LatAm commercial analytics — strong non-tech DA path in agribusiness.",
        "fit_why_pt": "Contratacao ativa de BI Analyst III em Campinas (Fabric + Power BI + SQL + PySpark) para analytics comercial Brasil/LatAm — forte trilha DA fora de pure-tech no agronegocio.",
        "notes_en": "Sep 2026 research. Careers via Nutreco Workday; also trouwnutrition.com.br/trabalhe-conosco. Hybrid signals on other Campinas roles.",
        "notes_pt": "Pesquisa set/2026. Carreiras no Workday Nutreco; tambem trouwnutrition.com.br/trabalhe-conosco. Sinais de hibrido em outras vagas Campinas.",
    },
    {
        "id": "ambev-tech-campinas",
        "sort_order": "91",
        "category_en": "Beverage tech hub (AB InBev)",
        "category_pt": "Hub de tecnologia de bebidas (AB InBev)",
        "name_en": "Ambev Tech / Ambev Global Tech",
        "name_pt": "Ambev Tech / Ambev Global Tech",
        "city_en": "Campinas / Jaguariuna",
        "city_pt": "Campinas / Jaguariuna",
        "region_en": "Campinas metro (Global Tech onsite Campinas; national hub Jaguariuna)",
        "region_pt": "RMC (Global Tech presencial Campinas; hub nacional Jaguariuna)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.ambevtech.com.br/",
        "careers_url": "https://ambevtech.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Python; Databricks / Data Factory; Power BI / Tableau; Self-service BI; Product analytics adjacent",
        "skills_match_pt": "SQL; Python; Databricks / Data Factory; Power BI / Tableau; Self-service BI; Adjacencia a product analytics",
        "fit_why_en": "Live BI Senior + data science openings; national Ambev Tech allows hybrid/remote, Global Tech sits onsite in Campinas — top local DA/BI brand in RMC.",
        "fit_why_pt": "Vagas vivas de BI Senior + ciencia de dados; Ambev Tech nacional permite hibrido/remoto, Global Tech e presencial em Campinas — marca DA/BI forte na RMC.",
        "notes_en": "Sep 2026 browser check of ambevtech.gupy.io: BUSINESS INTELLIGENCE SENIOR (remote) + Global Tech Campinas roles. Prefer BI/analytics JDs over pure SAP.",
        "notes_pt": "Checagem set/2026 em ambevtech.gupy.io: BUSINESS INTELLIGENCE SENIOR (remoto) + roles Global Tech Campinas. Preferir JDs de BI/analytics vs SAP puro.",
    },
    {
        "id": "byd-brasil-campinas",
        "sort_order": "92",
        "category_en": "EV / clean energy manufacturing",
        "category_pt": "Fabricacao EV / energia limpa",
        "name_en": "BYD Brasil",
        "name_pt": "BYD Brasil",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (BR HQ; bus + PV plants)",
        "region_pt": "RMC (sede BR; fabricas onibus + FV)",
        "priority": "high",
        "status": "researching",
        "home_office": "no",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://bydbrasil.com.br/",
        "careers_url": "https://bydbrasil.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "Power BI dashboards; KPI reporting; Excel; SAP SD (plus); Ops / backoffice metrics",
        "skills_match_pt": "Dashboards Power BI; Reporting de KPIs; Excel; SAP SD (plus); Metricas de ops / backoffice",
        "fit_why_en": "Campinas HQ with recurring Power BI / KPI analyst-style openings (ops & backoffice). Industrial DA path outside software houses.",
        "fit_why_pt": "Sede em Campinas com vagas recorrentes estilo analista Power BI / KPIs (ops e backoffice). Trilha DA industrial fora de software houses.",
        "notes_en": "Sep 2026 research. Many postings now Camaçari — still filter Campinas HQ roles. Watch bydbrasil.gupy.io for Power BI.",
        "notes_pt": "Pesquisa set/2026. Muitas vagas agora em Camacari — ainda filtrar roles da sede Campinas. Acompanhar bydbrasil.gupy.io por Power BI.",
    },
    {
        "id": "sidi-campinas",
        "sort_order": "93",
        "category_en": "Science & technology institute",
        "category_pt": "Instituto de ciencia e tecnologia",
        "name_en": "SiDi",
        "name_pt": "SiDi",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (tech park campus)",
        "region_pt": "RMC (campus parque tecnologico)",
        "priority": "medium",
        "status": "researching",
        "home_office": "no",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.sidi.org.br/",
        "careers_url": "https://sidi.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "Python; Data analytics / NLP adjacent; SQL; Cloud data ops; Dashboard literacy (controller BI support)",
        "skills_match_pt": "Python; Data analytics / adjacencia NLP; SQL; Data ops cloud; Literacia em dashboards (suporte BI de controladoria)",
        "fit_why_en": "Large Campinas ICT institute with data-ops / analytics-adjacent openings and controller BI support roles — local applied-research flavor similar to Eldorado.",
        "fit_why_pt": "Grande instituto de ICT em Campinas com vagas adjacentes a data-ops/analytics e suporte BI de controladoria — sabor de pesquisa aplicada local semelhante ao Eldorado.",
        "notes_en": "Sep 2026 research. Prefer openings mentioning Data Analytics / BI / data ops over pure mobile/cloud coding.",
        "notes_pt": "Pesquisa set/2026. Preferir vagas com Data Analytics / BI / data ops vs coding puro mobile/cloud.",
    },
    {
        "id": "padtec-campinas",
        "sort_order": "94",
        "category_en": "Optical telecom / networking",
        "category_pt": "Telecom optica / redes",
        "name_en": "Padtec",
        "name_pt": "Padtec",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (HQ)",
        "region_pt": "RMC (sede)",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.padtec.com.br/",
        "careers_url": "https://padtec.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Ops / network KPIs; Power BI (plus); Telecom domain metrics; Python (plus)",
        "skills_match_pt": "SQL; KPIs de ops / rede; Power BI (plus); Metricas de telecom; Python (plus)",
        "fit_why_en": "Campinas-rooted optical telecom OEM — watch for BI/ops-analytics and DSA-adjacent digital roles in a non-software industrial brand.",
        "fit_why_pt": "OEM de telecom optica com raizes em Campinas — observar BI/ops-analytics e roles digitais adjacentes a DSA em marca industrial nao-software.",
        "notes_en": "Sep 2026 research. Careers on padtec.gupy.io; hybrid listed on several Campinas postings.",
        "notes_pt": "Pesquisa set/2026. Carreiras em padtec.gupy.io; hibrido listado em varias vagas Campinas.",
    },
    {
        "id": "venturus-campinas",
        "sort_order": "95",
        "category_en": "Innovation / applied R&D institute",
        "category_pt": "Instituto de inovacao / P&D aplicada",
        "name_en": "Venturus",
        "name_pt": "Venturus",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.venturus.org.br/",
        "careers_url": "https://venturus.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "Python; Data / AI project delivery; Product analytics adjacent; Stakeholder storytelling; Cloud literacy",
        "skills_match_pt": "Python; Entrega de projetos de dados / IA; Adjacencia a product analytics; Storytelling com stakeholders; Literacia cloud",
        "fit_why_en": "Campinas innovation institute — multi-path fit (DA/PO/DSA) via client digital & data projects.",
        "fit_why_pt": "Instituto de inovacao em Campinas — fit multi-trilha (DA/PO/DSA) via projetos digitais e de dados para clientes.",
        "notes_en": "Sep 2026 research. Filter venturus.gupy.io for data/analytics/product roles.",
        "notes_pt": "Pesquisa set/2026. Filtrar venturus.gupy.io por roles de dados/analytics/produto.",
    },
    {
        "id": "3m-sumare",
        "sort_order": "96",
        "category_en": "Diversified industrial manufacturing",
        "category_pt": "Manufatura industrial diversificada",
        "name_en": "3M Brasil (Sumare)",
        "name_pt": "3M Brasil (Sumare)",
        "city_en": "Sumare",
        "city_pt": "Sumare",
        "region_en": "Campinas metro (Sumare plant / offices)",
        "region_pt": "RMC (planta / escritorios Sumare)",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.3m.com.br/",
        "careers_url": "https://www.3m.com.br/3M/pt_BR/trabalhe-conosco-br/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Azure / ETL (plus); Power BI; Manufacturing / supply KPIs; Excel advanced",
        "skills_match_pt": "SQL; Azure / ETL (plus); Power BI; KPIs de manufatura / supply; Excel avancado",
        "fit_why_en": "Major Sumaré industrial site in the RMC with periodic platform/integration and analytics-flavored roles — classic manufacturing DA path near home.",
        "fit_why_pt": "Grande site industrial em Sumare na RMC com roles periodicos de plataforma/integracao e sabor analytics — trilha DA de manufatura perto de casa.",
        "notes_en": "Sep 2026 research. Watch 3M careers for Sumaré/Campinas; some roles lean integration engineering with data platform exposure.",
        "notes_pt": "Pesquisa set/2026. Acompanhar carreiras 3M para Sumare/Campinas; algumas vagas puxam engenharia de integracao com exposicao a plataforma de dados.",
    },
    {
        "id": "oba-hortifruti-sumare",
        "sort_order": "97",
        "category_en": "Retail / fresh grocery logistics",
        "category_pt": "Varejo / logistica hortifruti",
        "name_en": "Oba Hortifruti (CD Sumare)",
        "name_pt": "Oba Hortifruti (CD Sumare)",
        "city_en": "Sumare",
        "city_pt": "Sumare",
        "region_en": "Campinas metro (distribution center)",
        "region_pt": "RMC (centro de distribuicao)",
        "priority": "medium",
        "status": "researching",
        "home_office": "no",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.obahortifruti.com.br/",
        "careers_url": "https://www.obahortifruti.com.br/trabalhe-conosco",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "Power BI (advanced); Logistics KPIs; Excel; SQL (plus); Python (plus); Warehouse / campaign reporting",
        "skills_match_pt": "Power BI (avancado); KPIs de logistica; Excel; SQL (plus); Python (plus); Reporting de CD / campanhas",
        "fit_why_en": "Active logistics / intelligence DA postings at the Sumaré DC — retail ops analytics with mandatory Power BI near home.",
        "fit_why_pt": "Vagas ativas de DA logistico / inteligencia no CD de Sumare — analytics de ops de varejo com Power BI obrigatorio perto de casa.",
        "notes_en": "Sep 2026 research. Postings for Analista de Dados Logísticos / Inteligência de Dados SR at CD Sumaré — typically 100% onsite.",
        "notes_pt": "Pesquisa set/2026. Vagas de Analista de Dados Logisticos / Inteligencia de Dados SR no CD Sumare — tipicamente 100% presencial.",
    },
    {
        "id": "hospital-vera-cruz-campinas",
        "sort_order": "98",
        "category_en": "Private hospital / healthcare",
        "category_pt": "Hospital privado / saude",
        "name_en": "Hospital Vera Cruz",
        "name_pt": "Hospital Vera Cruz",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "home_office": "unknown",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.hospitalveracruz.com.br/",
        "careers_url": "https://www.hospitalveracruz.com.br/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Power BI / reporting; Healthcare ops KPIs; Excel; Stakeholder clinical/admin storytelling",
        "skills_match_pt": "SQL; Power BI / reporting; KPIs de ops de saude; Excel; Storytelling clinico/admin",
        "fit_why_en": "Campinas hospital with published pleno Data Analyst openings — regulated-domain DA path in local healthcare.",
        "fit_why_pt": "Hospital de Campinas com vagas publicadas de Analista de Dados pleno — trilha DA em dominio regulado de saude local.",
        "notes_en": "Sep 2026 research. Watch LinkedIn/Gupy aggregators for Vera Cruz DA pleno; careers page may route via RH partners.",
        "notes_pt": "Pesquisa set/2026. Acompanhar LinkedIn/agregadores Gupy para DA pleno Vera Cruz; carreiras podem ir via parceiros de RH.",
    },
    {
        "id": "grupo-mandic-campinas",
        "sort_order": "99",
        "category_en": "Higher education / health schools",
        "category_pt": "Ensino superior / escolas de saude",
        "name_en": "Grupo Mandic",
        "name_pt": "Grupo Mandic",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "low",
        "status": "researching",
        "home_office": "no",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.slmandic.edu.br/",
        "careers_url": "https://www.slmandic.edu.br/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Power BI / institutional dashboards; Excel; Education ops KPIs; Reporting for academic leadership",
        "skills_match_pt": "SQL; Power BI / dashboards institucionais; Excel; KPIs de ops de educacao; Reporting para lideranca academica",
        "fit_why_en": "Local education group with pleno Data Analyst hiring in Campinas — academic/ops analytics, not product tech.",
        "fit_why_pt": "Grupo educacional local com contratacao de Analista de Dados pleno em Campinas — analytics academico/ops, nao product tech.",
        "notes_en": "Sep 2026 research. Onsite Campinas DA PL postings observed on job boards; confirm via Mandic RH.",
        "notes_pt": "Pesquisa set/2026. Vagas presenciais DA PL Campinas observadas em boards; confirmar via RH Mandic.",
    },
]


def twin(row: dict[str, str]) -> dict[str, str]:
    out = dict(row)
    for key in list(row):
        if key.endswith("_en") and not key.endswith("_detail_en"):
            base = key[: -len("_en")]
            detail = f"{base}_detail_en"
            out.setdefault(detail, row[key])
        if key.endswith("_pt") and not key.endswith("_detail_pt"):
            base = key[: -len("_pt")]
            detail = f"{base}_detail_pt"
            out.setdefault(detail, row[key])
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

    # Keep field order; append any new keys
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
