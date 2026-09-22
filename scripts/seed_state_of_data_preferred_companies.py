"""Add State of Data Brazil admired employers missing from companies.csv.

Source: Data Hackers + Bain State of Data Brazil 2025-2026 (LatAm admired list
circulated May 2026) + r/brdev consensus. Google/Ambev/Porto already tracked.
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "nubank-brasil",
        "sort_order": "20",
        "category_en": "Digital bank / fintech (BR preferred DA employer)",
        "category_pt": "Banco digital / fintech (empregador DA preferido BR)",
        "name_en": "Nubank",
        "name_pt": "Nubank",
        "city_en": "Sao Paulo (also Campinas, RJ, BH)",
        "city_pt": "Sao Paulo (tambem Campinas, RJ, BH)",
        "region_en": "Brazil (SP HQ; Campinas office listed on careers)",
        "region_pt": "Brasil (sede SP; escritorio Campinas nas carreiras)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "no",
        "website": "https://nubank.com.br/",
        "careers_url": "https://international.nubank.com.br/careers/brazil/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Experimentation / BA; Analytics engineering; Product & credit metrics; Strong English (plus)",
        "skills_match_pt": "SQL; Python; Experimentacao / BA; Analytics engineering; Metricas de produto e credito; Ingles forte (plus)",
        "fit_why_en": "Top preferred Brazilian data employer (State of Data / community). Active Finance DA, Analytics Engineer, BA roles; Campinas among BR office locations.",
        "fit_why_pt": "Empregador de dados mais desejado no BR (State of Data / comunidade). Vagas ativas de Finance DA, Analytics Engineer, BA; Campinas entre escritórios BR.",
        "notes_en": "State of Data Brazil 2025-26 LatAm admired list. Intense culture by team (credit/collections heavier). Watch international.nubank.com.br/careers/brazil.",
        "notes_pt": "Lista LatAm State of Data Brazil 2025-26. Cultura intensa por time (credito/collections mais pesado). Acompanhar carreiras BR do Nu.",
    },
    {
        "id": "ifood-brasil",
        "sort_order": "21",
        "category_en": "Foodtech / marketplace (BR preferred DA employer)",
        "category_pt": "Foodtech / marketplace (empregador DA preferido BR)",
        "name_en": "iFood",
        "name_pt": "iFood",
        "city_en": "Osasco / Sao Paulo metro",
        "city_pt": "Osasco / RMSP",
        "region_en": "Brazil (SP metro; hybrid/remote by role)",
        "region_pt": "Brasil (RMSP; hibrido/remoto por vaga)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.ifood.com.br/",
        "careers_url": "https://carreiras.ifood.com.br/",
        "ats_kind": "third_party",
        "ats_name": "Greenhouse",
        "ats_url": "https://job-boards.greenhouse.io/ifoodcarreiras",
        "skills_match_en": "SQL; Python; Spark/Databricks; Product / ops analytics; Experimentation; AWS (plus)",
        "skills_match_pt": "SQL; Python; Spark/Databricks; Analytics de produto / ops; Experimentacao; AWS (plus)",
        "fit_why_en": "Consistently in State of Data admired LatAm list and r/brdev praise for pay, challenges, and WLB vs big-tech grind.",
        "fit_why_pt": "Consistente na lista LatAm State of Data e elogios no r/brdev por salario, desafios e WLB vs grind de big tech.",
        "notes_en": "Sep 2026 research. Live data eng / DS / analytics-adjacent openings on carreiras.ifood.com.br.",
        "notes_pt": "Pesquisa set/2026. Vagas vivas de data eng / DS / adjacentes a analytics em carreiras.ifood.com.br.",
    },
    {
        "id": "mercado-livre",
        "sort_order": "22",
        "category_en": "LatAm ecommerce / fintech (MeLi)",
        "category_pt": "Ecommerce / fintech LatAm (MeLi)",
        "name_en": "Mercado Livre",
        "name_pt": "Mercado Livre",
        "city_en": "Sao Paulo / Brazil hubs",
        "city_pt": "Sao Paulo / hubs Brasil",
        "region_en": "Brazil + LatAm (hybrid trend; SP office strong)",
        "region_pt": "Brasil + LatAm (tendencia hibrida; escritorio SP forte)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.mercadolivre.com.br/",
        "careers_url": "https://careers-meli.mercadolibre.com/en/positions?country=Brazil",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Large-scale marketplace metrics; Experimentation; Product analytics; AI/data platform literacy",
        "skills_match_pt": "SQL; Python; Metricas de marketplace em escala; Experimentacao; Product analytics; Literacia em plataforma de dados/IA",
        "fit_why_en": "State of Data admired LatAm employer; r/brdev cites strong pay bands and career progression for tech/data.",
        "fit_why_pt": "Empregador LatAm admirado no State of Data; r/brdev cita faixas salariais fortes e progressao para tech/dados.",
        "notes_en": "Sep 2026 research. Filter Brazil roles on careers-meli.mercadolibre.com; watch melicidade / hybrid policy.",
        "notes_pt": "Pesquisa set/2026. Filtrar roles Brasil em careers-meli; acompanhar politica de melicidade / hibrido.",
    },
    {
        "id": "itau-unibanco",
        "sort_order": "23",
        "category_en": "Universal bank (BR preferred DA employer)",
        "category_pt": "Banco universal (empregador DA preferido BR)",
        "name_en": "Itau Unibanco",
        "name_pt": "Itau Unibanco",
        "city_en": "Sao Paulo (national bank)",
        "city_pt": "Sao Paulo (banco nacional)",
        "region_en": "Brazil (SP-centric tech; hybrid by role)",
        "region_pt": "Brasil (tech centrada em SP; hibrido por vaga)",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.itau.com.br/",
        "careers_url": "https://carreiras.itau.com.br/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Python; Banking / credit / risk KPIs; Power BI / enterprise BI; Stakeholder storytelling",
        "skills_match_pt": "SQL; Python; KPIs de banco / credito / risco; Power BI / BI enterprise; Storytelling com stakeholders",
        "fit_why_en": "State of Data admired LatAm bank; frequent community mention as top national data/tech employer with strong benefits.",
        "fit_why_pt": "Banco LatAm admirado no State of Data; mencao frequente na comunidade como top empregador nacional de dados/tech com beneficios fortes.",
        "notes_en": "Sep 2026 research. Large tech vacancy volume on carreiras.itau.com.br — filter Dados / Analytics / BI.",
        "notes_pt": "Pesquisa set/2026. Grande volume de vagas tech em carreiras.itau.com.br — filtrar Dados / Analytics / BI.",
    },
    {
        "id": "grupo-boticario",
        "sort_order": "24",
        "category_en": "Beauty retail / CPG (BR preferred data employer)",
        "category_pt": "Varejo de beleza / CPG (empregador de dados preferido BR)",
        "name_en": "Grupo Boticario",
        "name_pt": "Grupo Boticario",
        "city_en": "Curitiba / Brazil (remote data roles appear)",
        "city_pt": "Curitiba / Brasil (aparecem roles de dados remotos)",
        "region_en": "Brazil (PR HQ; remote/hybrid analytics openings)",
        "region_pt": "Brasil (sede PR; vagas analytics remotas/hibridas)",
        "priority": "high",
        "status": "interested",
        "home_office": "yes",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.grupoboticario.com.br/",
        "careers_url": "https://grupoboticario.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Power BI / analytics; Retail / D2C metrics; Python (plus); Stakeholder reporting",
        "skills_match_pt": "SQL; Power BI / analytics; Metricas de varejo / D2C; Python (plus); Reporting para stakeholders",
        "fit_why_en": "On State of Data LatAm admired list; live remote Dados & Analytics openings on Gupy.",
        "fit_why_pt": "Na lista LatAm State of Data; vagas remotas vivas de Dados & Analytics na Gupy.",
        "notes_en": "Sep 2026 browser check: Analista Dados & Analytics / Analista III - Dados remote on grupoboticario.gupy.io.",
        "notes_pt": "Checagem set/2026: Analista Dados & Analytics / Analista III - Dados remoto em grupoboticario.gupy.io.",
    },
    {
        "id": "hotmart",
        "sort_order": "25",
        "category_en": "Creator economy / edtech platform",
        "category_pt": "Creator economy / plataforma edtech",
        "name_en": "Hotmart",
        "name_pt": "Hotmart",
        "city_en": "Belo Horizonte / Sao Paulo",
        "city_pt": "Belo Horizonte / Sao Paulo",
        "region_en": "Brazil (BH/SP; hybrid by role)",
        "region_pt": "Brasil (BH/SP; hibrido por vaga)",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "no",
        "website": "https://www.hotmart.com/",
        "careers_url": "https://job-boards.eu.greenhouse.io/hotmartcareersbr",
        "ats_kind": "third_party",
        "ats_name": "Greenhouse",
        "ats_url": "https://www.greenhouse.com/",
        "skills_match_en": "SQL; Python; Product / growth analytics; Experimentation; Marketplace creator metrics",
        "skills_match_pt": "SQL; Python; Product / growth analytics; Experimentacao; Metricas de marketplace de creators",
        "fit_why_en": "State of Data LatAm admired list — strong product-analytics DA path in BR tech.",
        "fit_why_pt": "Lista LatAm State of Data — forte trilha DA de product analytics em tech BR.",
        "notes_en": "Sep 2026 research. Careers via Greenhouse Hotmart BR board.",
        "notes_pt": "Pesquisa set/2026. Carreiras via board Greenhouse Hotmart BR.",
    },
    {
        "id": "natura-co",
        "sort_order": "26",
        "category_en": "Beauty / CPG (Natura &Co)",
        "category_pt": "Beleza / CPG (Natura &Co)",
        "name_en": "Natura &Co",
        "name_pt": "Natura &Co",
        "city_en": "Sao Paulo metro / Brazil",
        "city_pt": "RMSP / Brasil",
        "region_en": "Brazil (SP; hybrid/remote by role)",
        "region_pt": "Brasil (SP; hibrido/remoto por vaga)",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.natura.com.br/",
        "careers_url": "https://natura.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Power BI / analytics; Commercial / supply / D2C KPIs; Python (plus)",
        "skills_match_pt": "SQL; Power BI / analytics; KPIs comerciais / supply / D2C; Python (plus)",
        "fit_why_en": "State of Data LatAm admired CPG employer — regulated beauty retail analytics path.",
        "fit_why_pt": "Empregador CPG LatAm admirado no State of Data — trilha analytics de varejo de beleza.",
        "notes_en": "Sep 2026 research. Filter Dados / BI / Analytics on natura.gupy.io.",
        "notes_pt": "Pesquisa set/2026. Filtrar Dados / BI / Analytics em natura.gupy.io.",
    },
    {
        "id": "sicredi",
        "sort_order": "27",
        "category_en": "Credit cooperative / financial services",
        "category_pt": "Cooperativa de credito / servicos financeiros",
        "name_en": "Sicredi",
        "name_pt": "Sicredi",
        "city_en": "Brazil (cooperative network)",
        "city_pt": "Brasil (rede cooperativa)",
        "region_en": "Brazil national (hybrid/onsite by cooperative)",
        "region_pt": "Brasil nacional (hibrido/presencial por cooperativa)",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.sicredi.com.br/",
        "careers_url": "https://sicredi.gupy.io/",
        "ats_kind": "third_party",
        "ats_name": "Gupy",
        "ats_url": "https://www.gupy.io/",
        "skills_match_en": "SQL; Power BI; Credit / ops KPIs; Banking domain analytics; Python (plus)",
        "skills_match_pt": "SQL; Power BI; KPIs de credito / ops; Analytics de dominio bancario; Python (plus)",
        "fit_why_en": "State of Data LatAm admired financial cooperative — DA path in credit/ops analytics.",
        "fit_why_pt": "Cooperativa financeira LatAm admirada no State of Data — trilha DA em analytics de credito/ops.",
        "notes_en": "Sep 2026 research. Careers on sicredi.gupy.io; openings vary by regional cooperative.",
        "notes_pt": "Pesquisa set/2026. Carreiras em sicredi.gupy.io; vagas variam por cooperativa regional.",
    },
    {
        "id": "magazine-luiza",
        "sort_order": "28",
        "category_en": "Retail / ecommerce (Magalu)",
        "category_pt": "Varejo / ecommerce (Magalu)",
        "name_en": "Magazine Luiza",
        "name_pt": "Magazine Luiza",
        "city_en": "Sao Paulo / Brazil",
        "city_pt": "Sao Paulo / Brasil",
        "region_en": "Brazil (SP HQ; hybrid/remote by MagaluTech role)",
        "region_pt": "Brasil (sede SP; hibrido/remoto por role MagaluTech)",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.magazineluiza.com.br/",
        "careers_url": "https://carreiras.magazineluiza.com.br/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Retail / marketplace metrics; Power BI / Looker (plus); Product analytics adjacent",
        "skills_match_pt": "SQL; Python; Metricas de varejo / marketplace; Power BI / Looker (plus); Adjacencia a product analytics",
        "fit_why_en": "State of Data LatAm admired retailer — MagaluTech is a classic BR DA/product-analytics target.",
        "fit_why_pt": "Varejista LatAm admirada no State of Data — MagaluTech e alvo classico BR de DA/product analytics.",
        "notes_en": "Sep 2026 research. Careers portal carreiras.magazineluiza.com.br — filter dados / analytics / MagaluTech.",
        "notes_pt": "Pesquisa set/2026. Portal carreiras.magazineluiza.com.br — filtrar dados / analytics / MagaluTech.",
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
