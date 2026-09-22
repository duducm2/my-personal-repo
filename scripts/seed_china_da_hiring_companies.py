"""Add China DA-heavy employers missing from companies.csv.

Round 2 after Alibaba / ByteDance / Tencent. Sources: 2025–2026 campus
hiring coverage (Jiemian, Yicai) + Maimai AI talent flow reports; Meituan /
Xiaohongshu / Ant / PDD / JD / Baidu as next-tier DA/BA demand.
"""

from __future__ import annotations

import csv
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "companies.csv"

NEW = [
    {
        "id": "meituan-china",
        "sort_order": "63",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "Meituan",
        "name_pt": "Meituan",
        "city_en": "Beijing, China (also Shanghai, Shenzhen, HK)",
        "city_pt": "Pequim, China (tambem Xangai, Shenzhen, HK)",
        "region_en": "China HQ - local commerce / delivery analytics; Keeta intl expansion",
        "region_pt": "Sede China - analytics de comercio local / delivery; expansao intl Keeta",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "yes",
        "fit_digital_solution_architect": "no",
        "website": "https://www.meituan.com/",
        "careers_url": "https://zhaopin.meituan.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Business / product analytics; Experimentation; Growth & ops metrics; BI storytelling",
        "skills_match_pt": "SQL; Python; Analytics de negocio / produto; Experimentacao; Metricas de growth e ops; Storytelling BI",
        "fit_why_en": "Top China DA/BA employer after ByteDance/Alibaba: large 2026 campus (thousands of offers) with explicit 商业分析师 / BA-DS tracks and live social-hire analyst roles (incl. Keeta ads analytics).",
        "fit_why_pt": "Top empregador DA/BA na China apos ByteDance/Alibaba: grande campus 2026 com trilhas explicitas de 商业分析师 / BA-DS e vagas sociais de analyst (incl. ads analytics Keeta).",
        "notes_en": "Sep 2026 China DA research round 2. Watch zhaopin.meituan.com for 数据分析 / 商业分析; Mandarin usually required for China roles; Keeta may open more intl English tracks.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. Acompanhar zhaopin.meituan.com por 数据分析 / 商业分析; mandarim costuma ser exigido em roles China; Keeta pode abrir mais trilhas intl em ingles.",
    },
    {
        "id": "xiaohongshu-china",
        "sort_order": "64",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "Xiaohongshu (RED)",
        "name_pt": "Xiaohongshu (RED)",
        "city_en": "Shanghai / Beijing, China",
        "city_pt": "Xangai / Pequim, China",
        "region_en": "China HQ - social commerce / content product analytics",
        "region_pt": "Sede China - analytics de social commerce / conteudo",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.xiaohongshu.com/",
        "careers_url": "https://job.xiaohongshu.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Product analytics; Content / community metrics; A/B testing; Visualization",
        "skills_match_pt": "SQL; Python; Analytics de produto; Metricas de conteudo / comunidade; Testes A/B; Visualizacao",
        "fit_why_en": "Maimai AI talent reports place Xiaohongshu near the top of new AI/data job postings (#2 after ByteDance in 2025 windows). Strong demand for product / AI-adjacent data analysts.",
        "fit_why_pt": "Relatorios Maimai de talentos AI colocam Xiaohongshu perto do topo em novas vagas AI/dados (#2 apos ByteDance em janelas 2025). Forte demanda por product / data analysts adjacentes a AI.",
        "notes_en": "Sep 2026 China DA research round 2. Check job.xiaohongshu.com for 数据分析师 / AI产品数据分析. Mandarin + local presence expected for most roles.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. Ver job.xiaohongshu.com por 数据分析师 / AI产品数据分析. Mandarim + presenca local esperados na maioria das vagas.",
    },
    {
        "id": "ant-group-china",
        "sort_order": "65",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "Ant Group",
        "name_pt": "Ant Group",
        "city_en": "Hangzhou, China (also Shanghai, Beijing)",
        "city_pt": "Hangzhou, China (tambem Xangai, Pequim)",
        "region_en": "China HQ - fintech / payments / risk analytics (Alibaba ecosystem)",
        "region_pt": "Sede China - analytics fintech / pagamentos / risco (ecossistema Alibaba)",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.antgroup.com/",
        "careers_url": "https://talent.antgroup.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Risk / credit / payments metrics; Experimentation; Fintech BI; Causal / fraud analytics (plus)",
        "skills_match_pt": "SQL; Python; Metricas de risco / credito / pagamentos; Experimentacao; BI fintech; Analytics causal / fraude (plus)",
        "fit_why_en": "Ranks among top China AI/data hiring destinations (Maimai net inflow / post volume). Deep DA demand in payments, risk, and growth analytics adjacent to Alibaba.",
        "fit_why_pt": "Entre os principais destinos China de contratacao AI/dados (volume / inflow Maimai). Forte demanda DA em pagamentos, risco e growth analytics adjacente ao Alibaba.",
        "notes_en": "Sep 2026 China DA research round 2. talent.antgroup.com — filter data / analytics / risk. Mandarin strongly preferred; intl roles rare.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. talent.antgroup.com — filtrar data / analytics / risk. Mandarim fortemente preferido; roles intl raros.",
    },
    {
        "id": "pinduoduo-china",
        "sort_order": "66",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "Pinduoduo / Temu",
        "name_pt": "Pinduoduo / Temu",
        "city_en": "Shanghai, China (Temu global hubs)",
        "city_pt": "Xangai, China (hubs globais Temu)",
        "region_en": "China HQ - marketplace analytics; Temu international ops",
        "region_pt": "Sede China - analytics de marketplace; ops internacionais Temu",
        "priority": "high",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "high",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "no",
        "website": "https://www.pinduoduo.com/",
        "careers_url": "https://careers.pinduoduo.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Marketplace / growth analytics; Experiment design; Search/rec metrics; Ops BI",
        "skills_match_pt": "SQL; Python; Analytics de marketplace / growth; Desenho de experimentos; Metricas de search/rec; BI de ops",
        "fit_why_en": "Aggressive China + Temu global expansion drives continuous DA/BA campus and social hiring (search/rec analysis, growth). Better intl/English surface area via Temu than pure China HQ peers.",
        "fit_why_pt": "Expansao agressiva China + Temu global impulsiona contratacao continua DA/BA (analise search/rec, growth). Via Temu ha mais superficie intl/ingles do que em peers so de HQ China.",
        "notes_en": "Sep 2026 China DA research round 2. Also check Temu careers boards for English analyst roles outside China. Intense culture reports are common.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. Tambem checar boards Temu por roles analyst em ingles fora da China. Relatos de cultura intensa sao comuns.",
    },
    {
        "id": "jd-china",
        "sort_order": "67",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "JD.com",
        "name_pt": "JD.com",
        "city_en": "Beijing, China (also Shanghai)",
        "city_pt": "Pequim, China (tambem Xangai)",
        "region_en": "China HQ - ecommerce / logistics / retail analytics",
        "region_pt": "Sede China - analytics de ecommerce / logistica / varejo",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.jd.com/",
        "careers_url": "https://zhaopin.jd.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Retail / supply-chain metrics; Product analytics; BI dashboards; AI-tool literacy (plus)",
        "skills_match_pt": "SQL; Python; Metricas de varejo / supply-chain; Analytics de produto; Dashboards BI; Literacia em ferramentas AI (plus)",
        "fit_why_en": "Major China ecommerce/logistics employer with ongoing campus DA tracks and strong 'worth going' employer rankings on Maimai. Solid DA volume, behind Meituan/Xiaohongshu on recent DA-visible buzz.",
        "fit_why_pt": "Grande empregador China de ecommerce/logistica com trilhas campus de DA e rankings fortes de empregador no Maimai. Volume DA solido, atras de Meituan/Xiaohongshu no buzz recente visivel de DA.",
        "notes_en": "Sep 2026 China DA research round 2. zhaopin.jd.com — filter 数据分析. Mandarin typically required.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. zhaopin.jd.com — filtrar 数据分析. Mandarim tipicamente exigido.",
    },
    {
        "id": "baidu-china",
        "sort_order": "68",
        "category_en": "Global enterprise (China) - remote track",
        "category_pt": "Empresa global (China) - trilha remota",
        "name_en": "Baidu",
        "name_pt": "Baidu",
        "city_en": "Beijing, China",
        "city_pt": "Pequim, China",
        "region_en": "China HQ - search / AI / cloud analytics",
        "region_pt": "Sede China - analytics de search / AI / cloud",
        "priority": "medium",
        "status": "researching",
        "home_office": "hybrid",
        "growth": "moderate",
        "fit_data_analyst": "yes",
        "fit_product_owner": "no",
        "fit_digital_solution_architect": "yes",
        "website": "https://www.baidu.com/",
        "careers_url": "https://talent.baidu.com/",
        "ats_kind": "proprietary",
        "ats_name": "",
        "ats_url": "",
        "skills_match_en": "SQL; Python; Product / search metrics; Experimentation; AI product analytics; Visualization",
        "skills_match_pt": "SQL; Python; Metricas de produto / search; Experimentacao; Analytics de produto AI; Visualizacao",
        "fit_why_en": "Still a large China tech hiring machine (thousands of roles including AI/data). DA demand is real but secondary to algorithm/AI engineering in public hiring narratives vs ByteDance/Meituan.",
        "fit_why_pt": "Ainda uma grande maquina de contratacao tech na China (milhares de roles incl. AI/dados). Demanda DA e real, mas secundaria a engenharia de algoritmo/AI nas narrativas publicas vs ByteDance/Meituan.",
        "notes_en": "Sep 2026 China DA research round 2. talent.baidu.com — search Data Analyst / 数据分析. Mandarin expected for China HQ.",
        "notes_pt": "Pesquisa China DA set/2026 rodada 2. talent.baidu.com — buscar Data Analyst / 数据分析. Mandarim esperado para HQ China.",
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
