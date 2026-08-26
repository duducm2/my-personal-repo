#!/usr/bin/env python3
"""Seed data-scientist variant rows into canonical CSVs (idempotent)."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
VARIANT = "data-scientist"


def read(name: str) -> list[dict[str, str]]:
    with (CANON / name).open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def write(name: str, rows: list[dict[str, str]]) -> None:
    path = CANON / name
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(
            f, fieldnames=list(rows[0].keys()), quoting=csv.QUOTE_MINIMAL
        )
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {name} ({len(rows)} rows)")


def upsert_field_labels() -> None:
    rows = read("field_labels.csv")
    rows = [r for r in rows if not (r["domain"] == "variant" and r["key"] == VARIANT)]
    # insert after product-owner variant row
    out: list[dict[str, str]] = []
    inserted = False
    for r in rows:
        out.append(r)
        if r["domain"] == "variant" and r["key"] == "product-owner" and not inserted:
            out.append(
                {
                    "domain": "variant",
                    "key": VARIANT,
                    "label_en": "Data science",
                    "label_pt": "Ciência de dados",
                }
            )
            inserted = True
    if not inserted:
        out.append(
            {
                "domain": "variant",
                "key": VARIANT,
                "label_en": "Data science",
                "label_pt": "Ciência de dados",
            }
        )
    write("field_labels.csv", out)


def upsert_skills() -> None:
    rows = [r for r in read("skills.csv") if r["variant"] != VARIANT]
    core = [
        ("Data analysis & metrics", "Análise de dados e métricas"),
        ("Experimentation & ML", "Experimentação e ML"),
        ("Visualization & BI", "Visualização e BI"),
        ("Applied Research", "Pesquisa Aplicada"),
        ("Python / SQL", "Python / SQL"),
    ]
    tech = [
        ("Python", "Python"),
        ("SQL", "SQL"),
        ("Power BI", "Power BI"),
        ("Matplotlib", "Matplotlib"),
        ("Seaborn", "Seaborn"),
        ("Excel", "Excel"),
        ("Azure", "Azure"),
        ("Cursor IDE", "Cursor IDE"),
        ("Git", "Git"),
        ("GitHub", "GitHub"),
        ("React", "React"),
        ("Figma", "Figma"),
        ("ServiceNow", "ServiceNow"),
        ("Bitbucket", "Bitbucket"),
        ("HTML", "HTML"),
        ("CSS", "CSS"),
        ("Mermaid", "Mermaid"),
        ("VS Code", "VS Code"),
        ("VBA", "VBA"),
        ("AutoHotkey", "AutoHotkey"),
    ]
    for i, (en, pt) in enumerate(core, 1):
        rows.append(
            {
                "variant": VARIANT,
                "category": "Core",
                "category_label_en": "Core",
                "category_label_pt": "Núcleo",
                "sort_order": str(i),
                "label_en": en,
                "label_pt": pt,
            }
        )
    for i, (en, pt) in enumerate(tech, 1):
        rows.append(
            {
                "variant": VARIANT,
                "category": "Tech",
                "category_label_en": "Tech",
                "category_label_pt": "Tecnologias",
                "sort_order": str(i),
                "label_en": en,
                "label_pt": pt,
            }
        )
    write("skills.csv", rows)


def upsert_bullets() -> None:
    rows = [r for r in read("experience_bullets.csv") if r["variant"] != VARIANT]
    bullets = [
        (
            "bosch-ar-2023",
            1,
            "Built **Power BI** dashboards for project/resource oversight and training tracking; used **CSI 4.86 / NPS 9.94** avg. across my projects (2024–2025) as outcome metrics.",
            "Desenvolvi dashboards **Power BI** para acompanhamento de projetos/recursos e treinamentos; usei **CSI 4,86 / NPS 9,94** méd. nos meus projetos (2024–2025) como métricas de resultado.",
        ),
        (
            "bosch-ar-2023",
            2,
            "Integrated Applied Research into **CIP / ServiceNow** as a **method-driven** quality and relevance gate—data-informed triage so the right work advances.",
            "Integrei Pesquisa Aplicada ao **CIP / ServiceNow** como gate de qualidade e relevância **orientado por método**—triagem baseada em dados para o trabalho certo avançar.",
        ),
        (
            "bosch-ar-2023",
            3,
            "**Tooling project (Power Tools):** supported delivery from requirements through prototypes with regular customer check-ins; tracked progress and feedback as input to decisions.",
            "**Projeto tooling (Power Tools):** apoiei a entrega de requisitos a protótipos com check-ins regulares com clientes; acompanhei progresso e feedback como input para decisões.",
        ),
        (
            "bosch-ar-2023",
            4,
            "Supported Americas to reach **UX Maturity Level 4 inside Global Services**: governance, templates, and training that made UX practice measurable and repeatable.",
            "Apoiei as Américas a atingir **Nível 4 de Maturidade em UX na Global Services**: governança, templates e treinamento que tornaram a prática de UX mensurável e repetível.",
        ),
        (
            "bosch-ar-2023",
            5,
            "**Agentic AI:** daily use of **Cursor IDE** and context management for research, analysis, and problem-solving across the Applied Research pipeline.",
            "**IA agêntica:** uso diário de **Cursor IDE** e gestão de contexto para pesquisa, análise e resolução de problemas no pipeline de Pesquisa Aplicada.",
        ),
        (
            "bosch-ar-2023",
            6,
            "**International & Mentorship:** two trips to Germany (2024, 2025); tutor at SENAI Digital Talent Academy.",
            "**Internacional e mentoria:** duas viagens à Alemanha (2024, 2025); tutor na SENAI Digital Talent Academy.",
        ),
        (
            "bosch-web-2020",
            1,
            "Front-end (React) and Applied Research delivery in **Scrum and Kanban**; collaborated on customer-facing apps and internal tools with measurable increments.",
            "Entrega front-end (React) e Pesquisa Aplicada em **Scrum e Kanban**; colaborei em apps para clientes e ferramentas internas com incrementos mensuráveis.",
        ),
        (
            "bosch-web-2020",
            2,
            "Worked with data-backed UI delivery and teamwork-driven shipping of web solutions.",
            "Atuei em entrega de UI apoiada por dados e shipping de soluções web em equipe.",
        ),
        (
            "bosch-hu-2019",
            1,
            "Digitized Business Excellence workflows in **Kanban**; clarified process needs and shipped internal tools.",
            "Digitalizei fluxos Business Excellence em **Kanban**; esclareci necessidades de processo e entreguei ferramentas internas.",
        ),
        (
            "bosch-hu-2019",
            2,
            "**Full-stack web development** with **SQL Server**, VS Code, and Windows Server (IIS)—data layer and tooling for internal processes.",
            "**Desenvolvimento web full-stack** com **SQL Server**, VS Code e Windows Server (IIS)—camada de dados e tooling para processos internos.",
        ),
        (
            "bosch-intern-2017",
            1,
            "Built **VBA (Excel)** automations for Continuous Improvement and internal communication—early data/ops tooling.",
            "Desenvolvi automações **VBA (Excel)** para Melhoria Contínua e comunicação interna—tooling inicial de dados/ops.",
        ),
    ]
    for eid, order, en, pt in bullets:
        rows.append(
            {
                "experience_id": eid,
                "variant": VARIANT,
                "sort_order": str(order),
                "text_en": en,
                "text_pt": pt,
            }
        )
    write("experience_bullets.csv", rows)


def upsert_narratives() -> None:
    rows = [r for r in read("narratives.csv") if r["variant"] != VARIANT]
    # labels from existing general rows
    labels = {
        r["field"]: (r["label_en"], r["label_pt"])
        for r in rows
        if r["variant"] == "general"
    }

    future_career_style = (
        ".future-career-wrap {\n"
        "  display: flex !important; flex-direction: column !important;\n"
        "  justify-content: center !important; align-items: center !important;\n"
        "  min-height: 55vh !important; width: 100% !important; margin-top: 0.75rem !important;\n"
        "  gap: 1rem !important;\n"
        "}\n"
        ".future-career-wrap p { margin: 0 !important; text-align: center !important; }\n"
        ".future-career-wrap img {\n"
        "  width: 38% !important; max-width: 38% !important; height: auto !important;\n"
        "  display: block !important; margin: 10px auto 0 !important;\n"
        "  border: none !important; box-shadow: none !important;\n"
        "}\n"
        ".future-po-bullets {\n"
        "  max-width: 85% !important; text-align: left !important; font-size: 0.95em !important;\n"
        "}"
    )

    texts: dict[str, tuple[str, str]] = {
        "tagline": (
            "Data Analysis, Experimentation & Applied Insights",
            "Análise de Dados, Experimentação e Insights Aplicados",
        ),
        "profile": (
            "Data-minded professional turning Applied Research and delivery into **measurable insight**: "
            "Power BI dashboards, Python/SQL analysis, and experimentation (including ML in my master's dissertation). "
            "Uses CSI/NPS and operational data to prioritize outcomes. Master's in Technology "
            "(**completing September 2026**) with **Grade A across all coursework**.",
            "**Transformo** Pesquisa Aplicada e entrega em **insight mensurável**: "
            "dashboards Power BI, análise com Python/SQL e experimentação (incluindo ML na dissertação de mestrado). "
            "**Uso** CSI/NPS e dados operacionais para priorizar resultados. Mestrado em Tecnologia "
            "(**conclusão em setembro de 2026**) com **nota A em todas as disciplinas**.",
        ),
        "deck_title": (
            "Eduardo Figueiredo – Portfolio",
            "Eduardo Figueiredo – Portfólio",
        ),
        "why_h1": (
            "Why I Work with Data, Experimentation & Applied Research",
            "Por que trabalho com Dados, Experimentação e Pesquisa Aplicada",
        ),
        "why_h2": (
            "Evidence that turns complex services into better decisions",
            "Evidência que transforma serviços complexos em melhores decisões",
        ),
        "why_bullets": (
            "- I believe decisions in service organizations should be **evidence-based**, especially when they affect real people and businesses.\n"
            "- My work centers **data analysis**, **experimentation**, and **Applied Research**: measuring outcomes and feeding insight into delivery.\n"
            "- This portfolio shows that path through real projects and metrics.",
            "- Acredito que decisões em organizações de serviço devem ser **baseadas em evidência**, especialmente quando afetam pessoas reais e negócios.\n"
            "- Meu trabalho centra **análise de dados**, **experimentação** e **Pesquisa Aplicada**: mensurar resultados e alimentar a entrega com insight.\n"
            "- Este portfólio mostra esse caminho por meio de projetos reais e métricas.",
        ),
        "who_role": (
            "Data Analysis, Experimentation & Applied Insights",
            "Análise de Dados, Experimentação e Insights Aplicados",
        ),
        "who_impact": (
            "I help teams decide and improve with clarity: dashboards and metrics to see reality, experimentation to learn, and Applied Research to turn insight into action.",
            "Ajudo equipes a decidir e melhorar com clareza: dashboards e métricas para ver a realidade, experimentação para aprender e Pesquisa Aplicada para transformar insight em ação.",
        ),
        "present_h2": (
            "Present – Data, Metrics & Applied Research (Bosch Brasil)",
            "Presente – Dados, Métricas e Pesquisa Aplicada (Bosch Brasil)",
        ),
        "present_table": (
            "| Area                               | Achievement                                                                                                                        |\n"
            "| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n"
            "| Role                               | Applied Research & Design Analyst – Bosch Brasil (May 2023 – present); Applied Research Expert & Project Champion at GS/BDU            |\n"
            "| Metrics & BI                       | Power BI dashboards for project/resource oversight; **CSI 4.86 / NPS 9.94** avg. across my projects (2024–2025)                         |\n"
            "| International                      | Two trips to Germany (2024, 2025) for role-related work                                                                            |\n"
            "| CO2 Tracking (GS/Applied Research) | Marketing scouting for CO2 telemetry; finding: lack of market demand — a data-informed stop                                       |\n"
            "| Tooling project (PT)               | Requirements through high-fidelity prototypes with regular customer check-ins; progress and feedback tracked for decisions         |\n"
            "| UX Maturity                        | Americas Level 4 – governance, templates, training that made UX practice measurable                                                |\n"
            "| CIP + Applied Research             | ServiceNow CIM integration; Applied Research as a method-driven quality/relevance gate                                           |\n"
            "| Collaboration                      | Tutor of Digital Talent Academy Students                                                                                           |",
            "| Área                               | Conquista                                                                                                                        |\n"
            "| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n"
            "| Cargo                               | Analista de Pesquisa Aplicada e Design – Bosch Brasil (mai 2023 – atual); Especialista em Pesquisa Aplicada e Project Champion na GS/BDU            |\n"
            "| Métricas e BI                       | Dashboards Power BI para projetos/recursos; **CSI 4,86 / NPS 9,94** méd. nos meus projetos (2024–2025)                         |\n"
            "| Internacional                      | Realizei duas viagens à Alemanha (2024, 2025) por trabalho relacionado ao cargo                                                                            |\n"
            "| Rastreamento CO2 (GS/Pesquisa Aplicada) | Conduzi prospecção de mercado para telemetria CO2; achado: falta de demanda — interrupção baseada em dados                                       |\n"
            "| Projeto tooling (PT)               | Requisitos a protótipos de alta fidelidade com check-ins regulares; progresso e feedback acompanhados para decisões         |\n"
            "| Maturidade em UX                        | Nível 4 nas Américas – governança, templates, treinamento que tornaram a prática de UX mensurável                                                |\n"
            "| CIP + Pesquisa Aplicada             | Integração ServiceNow CIM; Pesquisa Aplicada como gate de qualidade/relevância orientado por método                                           |\n"
            "| Colaboração                      | Sou tutor de estudantes da Digital Talent Academy                                                                                           |",
        ),
        "cip_pipeline_h2": (
            "Present – CIP and Applied Research: Data-Informed Methodology Pipeline",
            "Presente – CIP e Pesquisa Aplicada: Pipeline metodológico baseado em dados",
        ),
        "relevance_h2": (
            "Present – Relevance evaluation model (Low / Medium / High)",
            "Presente – Modelo de avaliação de relevância (Baixa / Média / Alta)",
        ),
        "csi_h2": (
            "Present – Outcome Metrics: CSI & NPS (2024–2025)",
            "Presente – Métricas de resultado: CSI e NPS (2024–2025)",
        ),
        "tooling_h2": (
            "Measurement in Delivery – Tooling Project for PT",
            "Mensuração na entrega – Projeto Tooling para PT",
        ),
        "tooling_bullet": (
            "- **Tooling project for PT:** Supported delivery from requirements through high-fidelity prototypes with **regular customer check-ins**—feedback and progress as inputs to decisions.",
            "- **Projeto tooling para PT:** Apoiei a entrega de requisitos a protótipos de alta fidelidade com **check-ins regulares com clientes**—feedback e progresso como inputs para decisões.",
        ),
        "future_h2": (
            "Future – Analysis, Experimentation & Delivery Context",
            "Futuro – Contexto de análise, experimentação e entrega",
        ),
        "future_intro": (
            "**Metrics, experimentation, and delivery** meet in how I work with teams today. The diagram below is the agile/research operating context I work in.",
            "**Métricas, experimentação e entrega** se encontram em como trabalho com equipes hoje. O diagrama abaixo é o contexto ágil/pesquisa em que atuo.",
        ),
        "future_diagram_alt": (
            "Diagram ai-agile-research: AI and Agile in Applied Research",
            "Diagrama ai-agile-research: IA e Ágil em Pesquisa Aplicada",
        ),
        "future_career_body": (
            "## Future – How I Work with Data\n\n"
            "- **What I bring:** dashboards & outcome metrics (CSI/NPS); experimentation/ML in research; method-driven intake gates.\n\n"
            '<div class="future-career-wrap">\n'
            '<div class="future-po-bullets">\n\n'
            "| Competency              | Evidence from my work                                     |\n"
            "| ----------------------- | --------------------------------------------------------- |\n"
            "| Metrics & BI            | Power BI dashboards; CSI 4.86 / NPS 9.94 avg. (2024–2025) |\n"
            "| Experimentation / ML    | Master's dissertation: perceived trust, ML, AI-agent validation |\n"
            "| Data-informed intake    | ServiceNow Applied Research gate in CIP                   |\n"
            "| Measurable practice     | Americas UX Maturity Level 4 (templates, training)        |\n\n"
            "</div>\n"
            '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" alt="Diagram future-career-path: Prioritized career paths" /></p>\n'
            "</div>",
            "## Futuro – Como trabalho com dados\n\n"
            "- **O que trago:** dashboards e métricas de resultado (CSI/NPS); experimentação/ML na pesquisa; gates de entrada orientados por método.\n\n"
            '<div class="future-career-wrap">\n'
            '<div class="future-po-bullets">\n\n'
            "| Competência              | Evidência do meu trabalho                                     |\n"
            "| ----------------------- | --------------------------------------------------------- |\n"
            "| Métricas e BI            | Dashboards Power BI; CSI 4,86 / NPS 9,94 méd. (2024–2025) |\n"
            "| Experimentação / ML    | Dissertação: confiança percebida, ML, validação com agente de IA |\n"
            "| Entrada baseada em dados    | Gate de Pesquisa Aplicada no CIP ServiceNow                   |\n"
            "| Prática mensurável     | Nível 4 de Maturidade em UX nas Américas (templates, treinamento)        |\n\n"
            "</div>\n"
            '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" alt="Diagrama future-career-path: Caminhos de carreira priorizados" /></p>\n'
            "</div>",
        ),
        "future_career_style": (future_career_style, future_career_style),
        "closing_summary": (
            "I connect data to decisions: measuring outcomes, experimenting with methods, and turning Applied Research into clear insight for trustworthy, user-centered solutions.",
            "Conecto dados a decisões: mensuro resultados, experimento métodos e transformo Pesquisa Aplicada em insight claro para soluções confiáveis e centradas no usuário.",
        ),
    }

    for field, (en, pt) in texts.items():
        le, lp = labels.get(field, (field, field))
        rows.append(
            {
                "variant": VARIANT,
                "field": field,
                "label_en": le,
                "label_pt": lp,
                "text_en": en,
                "text_pt": pt,
            }
        )
    write("narratives.csv", rows)


def main() -> None:
    upsert_field_labels()
    upsert_skills()
    upsert_bullets()
    upsert_narratives()
    print("data-scientist CSV seed complete.")


if __name__ == "__main__":
    main()
