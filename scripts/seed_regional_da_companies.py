"""One-shot: seed Campinas-region DA employers + skills_match/fit_why columns."""
from __future__ import annotations

import csv
from pathlib import Path

path = Path("my-data/canonical/companies.csv")
with path.open(encoding="utf-8", newline="") as f:
    rows = list(csv.DictReader(f))
    fieldnames = list(rows[0].keys())

for col in (
    "skills_match_en",
    "skills_match_detail_en",
    "skills_match_pt",
    "skills_match_detail_pt",
    "fit_why_en",
    "fit_why_detail_en",
    "fit_why_pt",
    "fit_why_detail_pt",
):
    if col not in fieldnames:
        fieldnames.insert(fieldnames.index("notes_en"), col)


def twin(row: dict, base: str, val: str) -> None:
    row[base] = val
    if base.endswith("_en"):
        row[base[: -len("_en")] + "_detail_en"] = val
    elif base.endswith("_pt"):
        row[base[: -len("_pt")] + "_detail_pt"] = val


EXISTING = {
    "bosch-brasil": {
        "skills_en": "Power BI; Python; SQL; Excel/VBA; CSI/NPS; Applied research; AI tools; Stakeholder dashboards",
        "skills_pt": "Power BI; Python; SQL; Excel/VBA; CSI/NPS; Pesquisa aplicada; Ferramentas de IA; Dashboards para stakeholders",
        "why_en": "Current employer in Campinas metro. Internal DA path: Power BI maturity dashboards, CX transcript analytics, CSI/NPS outcomes, AI training — strongest local profile match.",
        "why_pt": "Empregador atual na RMC. Trilha interna de DA: dashboards Power BI de maturidade, analytics de CX, CSI/NPS, treinamento de IA — melhor match local de perfil.",
        "da": "yes",
        "priority": "high",
    },
    "scala-svcpcp01": {
        "skills_en": "SQL; Python; Cloud metrics; Capacity/ops analytics; Dashboarding",
        "skills_pt": "SQL; Python; Metricas de cloud; Analytics de capacidade/ops; Dashboards",
        "why_en": "Regional hyperscale operator — DA fit via cloud capacity, sustainability and ops metrics (secondary to DSA).",
        "why_pt": "Operador hiperescala regional — fit de DA via metricas de capacidade, sustentabilidade e ops (secundario ao DSA).",
        "da": "yes",
    },
    "odata-sp02": {
        "skills_en": "SQL; Python; Infrastructure KPIs; Cloud processing metrics",
        "skills_pt": "SQL; Python; KPIs de infraestrutura; Metricas de processamento cloud",
        "why_en": "Hortolandia hyperscale site — DA angle on infrastructure/cloud processing KPIs for operators.",
        "why_pt": "Site hiperescala em Hortolandia — angulo de DA em KPIs de infraestrutura/processamento cloud.",
        "da": "yes",
    },
}

for r in rows:
    for c in fieldnames:
        r.setdefault(c, "")
    if r["id"] in EXISTING:
        e = EXISTING[r["id"]]
        twin(r, "skills_match_en", e["skills_en"])
        twin(r, "skills_match_pt", e["skills_pt"])
        twin(r, "fit_why_en", e["why_en"])
        twin(r, "fit_why_pt", e["why_pt"])
        r["fit_data_analyst"] = e.get("da", r.get("fit_data_analyst", "no"))
        if "priority" in e:
            r["priority"] = e["priority"]

NEW = [
    {
        "id": "eldorado-campinas",
        "sort_order": "20",
        "category_en": "Regional R&D institute",
        "category_pt": "Instituto de P&D regional",
        "name_en": "Instituto de Pesquisas Eldorado",
        "name_pt": "Instituto de Pesquisas Eldorado",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (Techno Park / Unicamp ecosystem)",
        "region_pt": "RMC (Techno Park / ecossistema Unicamp)",
        "priority": "high",
        "status": "researching",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "no",
        "website": "https://www.eldorado.org.br/",
        "skills_en": "Power BI (semantic models); Python (Pandas/NumPy); PostgreSQL/SQL; ETL/ELT; Git; Agile rituals",
        "skills_pt": "Power BI (modelos semanticos); Python (Pandas/NumPy); PostgreSQL/SQL; ETL/ELT; Git; Rituais ageis",
        "why_en": "Campinas R&D institute with Power BI + Python DA roles. Unicamp-adjacent culture matches MSc Technology / InfoViz; dashboard + research-engineering blend.",
        "why_pt": "Instituto de P&D em Campinas com vagas de DA em Power BI + Python. Cultura proxima a Unicamp combina com o mestrado; dashboards + engenharia de pesquisa.",
        "notes_en": "Track Power BI Analyst openings. English often required. On-site Campinas typical.",
        "notes_pt": "Acompanhar vagas de Analista Power BI. Ingles frequentemente exigido. Tipicamente presencial em Campinas.",
    },
    {
        "id": "ciandt-campinas",
        "sort_order": "21",
        "category_en": "Regional digital / data consulting",
        "category_pt": "Consultoria digital / dados regional",
        "name_en": "CI&T (Campinas)",
        "name_pt": "CI&T (Campinas)",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (HQ roots; metro residents often office-required)",
        "region_pt": "RMC (raizes de sede; moradores da metro muitas vezes com presencial)",
        "priority": "high",
        "status": "interested",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "yes",
        "website": "https://ciandt.com/br/pt-br/carreiras",
        "skills_en": "SQL; Python; Power BI / analytics reporting; GenAI-assisted analysis; Azure/Databricks (plus); Stakeholder storytelling",
        "skills_pt": "SQL; Python; Power BI / reporting analitico; Analise assistida por GenAI; Azure/Databricks (plus); Storytelling com stakeholders",
        "why_en": "Born in Campinas; active Data Science & Analytics hiring. Senior DA / Martech / Azure analytics fit AI training, Azure exposure, insight-to-decision work.",
        "why_pt": "Nascida em Campinas; contratacao ativa em Data Science & Analytics. Senior DA / Martech / Azure combinam com treino de IA, Azure e insights.",
        "notes_en": "If you live in Campinas metro, check office-frequency policy on each JD. Strong DA pipeline.",
        "notes_pt": "Se mora na RMC, verificar politica de presencial em cada JD. Pipeline forte de DA.",
    },
    {
        "id": "cpqd-campinas",
        "sort_order": "22",
        "category_en": "Regional R&D institute",
        "category_pt": "Instituto de P&D regional",
        "name_en": "CPqD",
        "name_pt": "CPqD",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "high",
        "status": "researching",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "yes",
        "website": "https://www.cpqd.com.br/trabalhe-conosco/",
        "skills_en": "Data analysis; BI; Applied research; Telecom/AI domain; SQL/Python (typical for DA tracks)",
        "skills_pt": "Analise de dados; BI; Pesquisa aplicada; Dominio telecom/IA; SQL/Python (tipico em trilhas de DA)",
        "why_en": "Major LatAm R&D center in Campinas with DA/BI career paths. Applied research culture aligns with Unicamp MSc and Bosch research-designer background.",
        "why_pt": "Grande centro de P&D da LatAm em Campinas com trilhas de DA/BI. Cultura de pesquisa aplicada alinha com mestrado Unicamp e perfil de pesquisa na Bosch.",
        "notes_en": "Monitor trabalhe-conosco and LinkedIn for Data Analyst / BI openings.",
        "notes_pt": "Monitorar trabalhe-conosco e LinkedIn para vagas de Analista de Dados / BI.",
    },
    {
        "id": "cpfl-campinas",
        "sort_order": "23",
        "category_en": "Regional energy / utilities",
        "category_pt": "Energia / utilities regional",
        "name_en": "CPFL Energia (Grupo CPFL)",
        "name_pt": "CPFL Energia (Grupo CPFL)",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "no",
        "website": "https://www.cpfl.com.br/",
        "skills_en": "Python; SQL; Power BI; Data validation; Advanced analytics / insight reports; Stakeholder presentations",
        "skills_pt": "Python; SQL; Power BI; Validacao de dados; Analytics avancado / relatorios de insight; Apresentacoes a stakeholders",
        "why_en": "Campinas energy group posts Data Analytics roles needing Python/SQL/Power BI — exact stack overlap for applied analytics in a regulated domain.",
        "why_pt": "Grupo de energia em Campinas publica vagas de Data Analytics pedindo Python/SQL/Power BI — overlap exato de stack para analytics aplicado.",
        "notes_en": "Often on-site Campinas. Emphasize validation, CSI-style outcomes, and Power BI dashboards.",
        "notes_pt": "Frequentemente presencial em Campinas. Enfatizar validacao, outcomes tipo CSI e dashboards Power BI.",
    },
    {
        "id": "agibank-campinas",
        "sort_order": "24",
        "category_en": "Regional fintech / banking",
        "category_pt": "Fintech / banco regional",
        "name_en": "Agibank",
        "name_pt": "Agibank",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "high",
        "status": "interested",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "no",
        "website": "https://agibank.com.br/",
        "skills_en": "SQL; Python automation; Power BI/Tableau; GenAI productivity; Channel/product KPIs; Clear reporting",
        "skills_pt": "SQL; Automacao Python; Power BI/Tableau; Produtividade com GenAI; KPIs de canal/produto; Relatorios claros",
        "why_en": "Campinas on-site DA Pleno: SQL + Python + BI + GenAI — maps to AI tools training and dashboard storytelling; product/channel analytics angle.",
        "why_pt": "DA Pleno presencial em Campinas: SQL + Python + BI + GenAI — mapeia treino de IA e storytelling com dashboards; angulo de analytics de produto/canal.",
        "notes_en": "Presencial Campinas typical. Highlight GenAI training (100+ people) and Power BI audit dashboard work.",
        "notes_pt": "Tipicamente presencial em Campinas. Destacar treino GenAI (100+ pessoas) e dashboard de auditoria Power BI.",
    },
    {
        "id": "msx-campinas",
        "sort_order": "25",
        "category_en": "Regional tech consulting",
        "category_pt": "Consultoria tech regional",
        "name_en": "MSX International",
        "name_pt": "MSX International",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro (hybrid)",
        "region_pt": "RMC (hibrido)",
        "priority": "medium",
        "status": "researching",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "no",
        "website": "https://www.msxi.com/",
        "skills_en": "SQL; Python; Power BI; Databricks; Power Platform (Apps/Automate); Executive PowerPoint",
        "skills_pt": "SQL; Python; Power BI; Databricks; Power Platform (Apps/Automate); PowerPoint executivo",
        "why_en": "Hybrid Campinas DA Pleno: SQL/Python/Power BI + automation — close to Excel/VBA/macro and Power BI practice; applied stats as a plus.",
        "why_pt": "DA Pleno hibrido em Campinas: SQL/Python/Power BI + automacao — proximo de Excel/VBA/macros e pratica Power BI; estatistica aplicada como diferencial.",
        "notes_en": "Hybrid Campinas. Leverage AutoHotkey/Python macros as automation evidence.",
        "notes_pt": "Hibrido Campinas. Usar macros AutoHotkey/Python como evidencia de automacao.",
    },
    {
        "id": "samsung-srbr-campinas",
        "sort_order": "26",
        "category_en": "Regional R&D institute",
        "category_pt": "Instituto de P&D regional",
        "name_en": "Samsung Research Brazil (SRBR)",
        "name_pt": "Samsung Research Brazil (SRBR)",
        "city_en": "Campinas",
        "city_pt": "Campinas",
        "region_en": "Campinas metro",
        "region_pt": "RMC",
        "priority": "medium",
        "status": "researching",
        "fit_da": "yes",
        "fit_po": "no",
        "fit_dsa": "no",
        "website": "https://research.samsung.com/",
        "skills_en": "Data science / analytics fundamentals; Python; Applied research; ML/AI exposure",
        "skills_pt": "Fundamentos de ciencia de dados / analytics; Python; Pesquisa aplicada; Exposicao a ML/IA",
        "why_en": "Samsung research presence in Campinas with data-science internship/analyst-adjacent tracks. Research culture fits Unicamp MSc + AI interest.",
        "why_pt": "Presenca de pesquisa Samsung em Campinas com trilhas de estagio/dados. Cultura de pesquisa combina com mestrado Unicamp + interesse em IA.",
        "notes_en": "Watch campus/research career pages for data analytics openings; competition is research-heavy.",
        "notes_pt": "Acompanhar paginas de carreira campus/pesquisa para vagas de analytics; concorrencia forte em pesquisa.",
    },
]


def make_row(n: dict) -> dict:
    r = {c: "" for c in fieldnames}
    r["id"] = n["id"]
    r["sort_order"] = n["sort_order"]
    twin(r, "category_en", n["category_en"])
    twin(r, "category_pt", n["category_pt"])
    twin(r, "name_en", n["name_en"])
    twin(r, "name_pt", n["name_pt"])
    twin(r, "city_en", n["city_en"])
    twin(r, "city_pt", n["city_pt"])
    twin(r, "region_en", n["region_en"])
    twin(r, "region_pt", n["region_pt"])
    r["priority"] = n["priority"]
    r["status"] = n["status"]
    r["fit_data_analyst"] = n["fit_da"]
    r["fit_product_owner"] = n["fit_po"]
    r["fit_digital_solution_architect"] = n["fit_dsa"]
    r["website"] = n["website"]
    twin(r, "skills_match_en", n["skills_en"])
    twin(r, "skills_match_pt", n["skills_pt"])
    twin(r, "fit_why_en", n["why_en"])
    twin(r, "fit_why_pt", n["why_pt"])
    twin(r, "notes_en", n["notes_en"])
    twin(r, "notes_pt", n["notes_pt"])
    return r


existing_ids = {r["id"] for r in rows}
for n in NEW:
    if n["id"] not in existing_ids:
        rows.append(make_row(n))

with path.open("w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
    w.writeheader()
    w.writerows(rows)

da = [r for r in rows if (r.get("fit_data_analyst") or "").lower() == "yes"]
print("total", len(rows), "DA-fit", len(da))
for r in da:
    print(r["id"], "|", r["category_en"])
