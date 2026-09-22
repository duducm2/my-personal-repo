"""Add US employers with highest Data Analyst posting volume missing from companies.csv.

Sources (Sep 2026): Get U Hired US DA posting aggregates (Capital One, JPMorgan,
Deloitte lead); Lander active-listing snapshot; Amazon/Google already tracked.
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "capital-one-us",
        "sort_order": "53",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "Capital One",
        "name_pt": "Capital One",
        "city_en": "McLean, VA (US hubs; remote by role)",
        "city_pt": "McLean, VA (hubs EUA; remoto por vaga)",
        "region_en": "United States HQ - consumer bank / tech; strong remote/hybrid DA hiring",
        "region_pt": "Sede EUA - banco consumidor / tech; forte contratacao DA remote/hybrid",
        "priority": "high",
        "status": "interested",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.capitalone.com/",
        "careers_url": "https://www.capitalonecareers.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Credit / product / marketing analytics; Experimentation; BI storytelling; Cloud data platforms (plus)",
        "skills_match_pt": "SQL; Python; Analytics de credito / produto / marketing; Experimentacao; Storytelling BI; Plataformas de dados cloud (plus)",
        "fit_why_en": "Highest tracked US Data Analyst posting volume in recent aggregates (Get U Hired / Lander). Tech-forward bank with mature analytics career paths and frequent remote/hybrid roles.",
        "fit_why_pt": "Maior volume rastreado de vagas Data Analyst nos EUA em agregados recentes (Get U Hired / Lander). Banco tech-forward com trilhas maduras de analytics e muitas vagas remote/hybrid.",
        "notes_en": "Sep 2026 US DA research. Watch capitalonecareers.com for Data Analyst / Business Analyst. Often open to US remote; confirm Brazil eligibility per JD.",
        "notes_pt": "Pesquisa DA EUA set/2026. Acompanhar capitalonecareers.com por Data Analyst / Business Analyst. Frequentemente remote EUA; confirmar elegibilidade Brasil por JD.",
    },
    {
        "id": "jpmorgan-us",
        "sort_order": "54",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "JPMorgan Chase",
        "name_pt": "JPMorgan Chase",
        "city_en": "New York, NY (global; US tech hubs)",
        "city_pt": "Nova York, NY (global; hubs tech EUA)",
        "region_en": "United States HQ - universal bank; large analytics / CCB / markets DA demand",
        "region_pt": "Sede EUA - banco universal; grande demanda DA em analytics / CCB / markets",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.jpmorganchase.com/",
        "careers_url": "https://careers.jpmorgan.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Finance / risk / product metrics; Dashboards; Stakeholder narratives; Excel/VBA (plus)",
        "skills_match_pt": "SQL; Python; Metricas de financas / risco / produto; Dashboards; Narrativas para stakeholders; Excel/VBA (plus)",
        "fit_why_en": "Consistently #2 US Data Analyst posting volume. Massive internal analytics org across consumer, commercial, and markets — high absolute DA hiring even if hybrid-heavy.",
        "fit_why_pt": "Consistentemente #2 em volume de vagas Data Analyst nos EUA. Organizacao enorme de analytics em consumer, commercial e markets — alta contratacao absoluta de DA mesmo com vies hibrido.",
        "notes_en": "Sep 2026 US DA research. careers.jpmorgan.com — filter Data Analyst. Brazil remote is uncommon; watch LatAm / international postings.",
        "notes_pt": "Pesquisa DA EUA set/2026. careers.jpmorgan.com — filtrar Data Analyst. Remoto Brasil e incomum; acompanhar vagas LatAm / internacionais.",
    },
    {
        "id": "deloitte-us",
        "sort_order": "55",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "Deloitte",
        "name_pt": "Deloitte",
        "city_en": "New York, NY (US national; remote/client sites)",
        "city_pt": "Nova York, NY (nacional EUA; remoto/sites de cliente)",
        "region_en": "United States - Big 4 consulting; analytics / AI / BA delivery at volume",
        "region_pt": "Estados Unidos - consultoria Big 4; entrega analytics / AI / BA em volume",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.deloitte.com/",
        "careers_url": "https://www.deloitte.com/us/en/careers.html",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Power BI / Tableau; Client storytelling; Analytics consulting; AI-assisted analysis (plus)",
        "skills_match_pt": "SQL; Python; Power BI / Tableau; Storytelling com cliente; Consultoria de analytics; Analise assistida por IA (plus)",
        "fit_why_en": "Often leads global/US Data Analyst posting counts among consultancies (Deloitte / EY / Accenture cluster). High volume of analytics delivery roles; travel/hybrid culture.",
        "fit_why_pt": "Frequentemente lidera contagens de vagas Data Analyst global/EUA entre consultorias (cluster Deloitte / EY / Accenture). Alto volume de roles de entrega analytics; cultura travel/hybrid.",
        "notes_en": "Sep 2026 US DA research. Also consider Deloitte Brazil separately if targeting local delivery. US roles usually need work auth.",
        "notes_pt": "Pesquisa DA EUA set/2026. Considerar Deloitte Brasil aparte se mirar entrega local. Roles EUA costumam exigir autorizacao de trabalho.",
    },
    {
        "id": "accenture-us",
        "sort_order": "56",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "Accenture",
        "name_pt": "Accenture",
        "city_en": "US national (NY / Chicago hubs; client sites)",
        "city_pt": "Nacional EUA (hubs NY / Chicago; sites de cliente)",
        "region_en": "United States / global consulting - data & AI practice volume hiring",
        "region_pt": "EUA / consultoria global - contratacao em volume na pratica data & AI",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.accenture.com/",
        "careers_url": "https://www.accenture.com/us-en/careers",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Power BI; Client analytics delivery; Azure/AWS (plus); GenAI productivity",
        "skills_match_pt": "SQL; Python; Power BI; Entrega de analytics para cliente; Azure/AWS (plus); Produtividade com GenAI",
        "fit_why_en": "Top-tier US/global DA posting volume in consulting (with Capgemini/TCS/EY). Strong overlap with DSA/PO-adjacent delivery; Accenture LatAm is a parallel track.",
        "fit_why_pt": "Volume top de vagas DA EUA/global em consultoria (com Capgemini/TCS/EY). Forte overlap com entrega adjacente a DSA/PO; Accenture LatAm e trilha paralela.",
        "notes_en": "Sep 2026 US DA research. accenture.com/us-en/careers + consider Accenture Brasil for nearer-term fit.",
        "notes_pt": "Pesquisa DA EUA set/2026. accenture.com/us-en/careers + considerar Accenture Brasil para fit mais proximo.",
    },
    {
        "id": "walmart-us",
        "sort_order": "57",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "Walmart",
        "name_pt": "Walmart",
        "city_en": "Bentonville, AR (also Dallas / Bay Area tech)",
        "city_pt": "Bentonville, AR (tambem Dallas / Bay Area tech)",
        "region_en": "United States HQ - retail / ecommerce / supply-chain analytics at scale",
        "region_pt": "Sede EUA - analytics de varejo / ecommerce / supply-chain em escala",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.walmart.com/",
        "careers_url": "https://careers.walmart.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Retail / supply-chain metrics; Experimentation; BI dashboards; Product analytics adjacent",
        "skills_match_pt": "SQL; Python; Metricas de varejo / supply-chain; Experimentacao; Dashboards BI; Adjacencia a product analytics",
        "fit_why_en": "Among top non-bank product employers for US DA postings (retail tech at Walmart Global Tech). High absolute analytics hiring across stores, ecommerce, and logistics.",
        "fit_why_pt": "Entre os principais empregadores de produto (nao banco) em vagas DA nos EUA (retail tech Walmart Global Tech). Alta contratacao absoluta de analytics em lojas, ecommerce e logistica.",
        "notes_en": "Sep 2026 US DA research. careers.walmart.com — Data Analyst / Analytics. Usually US-based; remote Brazil rare.",
        "notes_pt": "Pesquisa DA EUA set/2026. careers.walmart.com — Data Analyst / Analytics. Geralmente baseado nos EUA; remoto Brasil raro.",
    },
    {
        "id": "citigroup-us",
        "sort_order": "58",
        "category_en": "Global enterprise (US) - remote track",
        "category_pt": "Empresa global (EUA) - trilha remota",
        "name_en": "Citi",
        "name_pt": "Citi",
        "city_en": "New York, NY (global hubs)",
        "city_pt": "Nova York, NY (hubs globais)",
        "region_en": "United States HQ - global bank; risk / product / ops analytics volume",
        "region_pt": "Sede EUA - banco global; volume de analytics de risco / produto / ops",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.citi.com/",
        "careers_url": "https://jobs.citi.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Risk / finance metrics; Reporting automation; BI; Stakeholder communication",
        "skills_match_pt": "SQL; Python; Metricas de risco / financas; Automacao de reporting; BI; Comunicacao com stakeholders",
        "fit_why_en": "Ranks in top global DA posting employers (fintech/bank cluster with JPMorgan / Capital One). Strong LatAm presence may open regional analyst paths.",
        "fit_why_pt": "Entre os top empregadores globais de vagas DA (cluster fintech/banco com JPMorgan / Capital One). Forte presenca LatAm pode abrir trilhas regionais de analyst.",
        "notes_en": "Sep 2026 US DA research. jobs.citi.com + Citi Brasil careers for nearer geographic fit.",
        "notes_pt": "Pesquisa DA EUA set/2026. jobs.citi.com + carreiras Citi Brasil para fit geografico mais proximo.",
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
