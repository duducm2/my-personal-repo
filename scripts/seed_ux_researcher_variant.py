#!/usr/bin/env python3
"""Seed ux-researcher career variant into canonical CSVs (idempotent)."""
from __future__ import annotations

import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
VARIANT = "ux-researcher"
LABEL_EN = "UX Researcher & Design Technologist"
LABEL_PT = "Pesquisador de UX e Design Technologist"


def read(name: str) -> list[dict[str, str]]:
    with (CANON / name).open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write(name: str, rows: list[dict[str, str]]) -> None:
    path = CANON / name
    fieldnames = list(rows[0].keys()) if rows else []
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {name} ({len(rows)} rows)")


def upsert_field_labels() -> None:
    rows = [r for r in read("field_labels.csv") if not (r["domain"] == "variant" and r["key"] == VARIANT)]
    out: list[dict[str, str]] = []
    inserted = False
    for r in rows:
        if r["domain"] == "variant" and not inserted:
            out.append(
                {
                    "domain": "variant",
                    "key": VARIANT,
                    "label_en": LABEL_EN,
                    "label_pt": LABEL_PT,
                }
            )
            inserted = True
        out.append(r)
    if not inserted:
        out.append(
            {
                "domain": "variant",
                "key": VARIANT,
                "label_en": LABEL_EN,
                "label_pt": LABEL_PT,
            }
        )
    write("field_labels.csv", out)


def upsert_skills() -> None:
    rows = [r for r in read("skills.csv") if r["variant"] != VARIANT]
    core = [
        ("Mixed-methods UX research", "Pesquisa de UX com métodos mistos"),
        ("Usability & heuristic evaluation", "Avaliação de usabilidade e heurística"),
        ("Qualitative synthesis & Grounded Theory", "Síntese qualitativa e Teoria Fundamentada"),
        ("Human-AI interaction & trust measurement", "Interação humano-IA e medição de confiança"),
        ("Interaction design & code prototyping", "Design de interação e prototipagem em código"),
        ("UX metrics & governance (CSI/NPS, SUS)", "Métricas de UX e governança (CSI/NPS, SUS)"),
        ("Cross-functional stakeholder alignment", "Alinhamento multidisciplinar de stakeholders"),
    ]
    tech = [
        ("Figma", "Figma"),
        ("React", "React"),
        ("HTML / CSS", "HTML / CSS"),
        ("Python", "Python"),
        ("Power BI", "Power BI"),
        ("SQL / SQL Server", "SQL / SQL Server"),
        ("ServiceNow", "ServiceNow"),
        ("Mermaid", "Mermaid"),
        ("Git", "Git"),
        ("GitHub", "GitHub"),
        ("Bitbucket", "Bitbucket"),
        ("VS Code", "VS Code"),
        ("Excel / VBA", "Excel / VBA"),
        ("CSV pipelines", "Pipelines CSV"),
        ("AI-assisted coding & prompt engineering", "Coding assistido por IA e engenharia de prompt"),
        ("Qualtrics / survey tools", "Qualtrics / ferramentas de survey"),
        ("Agile / Scrum / Kanban", "Agile / Scrum / Kanban"),
        ("Miro / FigJam", "Miro / FigJam"),
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
            "**UX Maturity Level 4 (Americas):** helped the Americas reach Level 4 in Global Services through governance, standardized templates, and training—enabling distributed teams to self-serve UX research and design.",
            "**Nível 4 de Maturidade em UX (Américas):** apoiei as Américas a atingir o Nível 4 em Global Services via governança, templates padronizados e treinamentos—capacitando times distribuídos a aplicar UX research e design com autonomia.",
        ),
        (
            "bosch-ar-2023",
            2,
            "**Automated UX relevance & CIP gates (ServiceNow):** designed property-based relevance scoring for UX intake and evaluated strategic CIP dashboards—connecting leadership visibility to user-friction evidence.",
            "**Relevância em UX automatizada e gates CIP (ServiceNow):** desenhei pontuação de relevância baseada em propriedades para intake de UX e avaliei dashboards estratégicos de CIP—conectando visibilidade da liderança a evidências de atrito do usuário.",
        ),
        (
            "bosch-ar-2023",
            3,
            "**Qualitative synthesis at scale (Power Tools CX):** applied Straussian Grounded Theory (open, axial, selective coding) to call-center transcripts using Python, AI-assisted coding, and Power BI—transforming raw customer voice into prioritized UX recommendations.",
            "**Síntese qualitativa em escala (CX Power Tools):** apliquei Teoria Fundamentada (codificação aberta, axial e seletiva) a transcrições de call center com Python, IA e Power BI—transformando a voz do cliente em recomendações de UX priorizadas.",
        ),
        (
            "bosch-ar-2023",
            4,
            "**End-to-end UX & rapid prototyping (Power Tools):** translated domain requirements into user journey flows and interactive prototypes with continuous stakeholder and user check-ins—aligning user needs and engineering feasibility.",
            "**UX ponta a ponta e prototipagem rápida (Power Tools):** traduzi requisitos de domínio em jornadas do usuário e protótipos interativos com check-ins contínuos de stakeholders e usuários—alinhando necessidades do usuário e viabilidade técnica.",
        ),
        (
            "bosch-ar-2023",
            5,
            "**Measured user outcomes:** maintained average **CSI 4.86 / NPS 9.94** across delivery projects (2024–2025); delivered AI-assisted tools training to 100+ participants (rating 4.88/5); international collaboration with Germany (2024, 2025).",
            "**Resultados de usuário mensurados:** mantive média **CSI 4,86 / NPS 9,94** nos projetos entregues (2024–2025); ministrei treinamento de ferramentas com IA para 100+ pessoas (avaliação 4,88/5); colaboração internacional com a Alemanha (2024, 2025).",
        ),
        (
            "bosch-web-2020",
            1,
            "**Design technologist delivery (React):** built accessible front-end interfaces, reusable design system components, and data-backed web applications in Scrum/Kanban—bridging the gap between UI design intent and production implementation.",
            "**Entrega como design technologist (React):** construí interfaces acessíveis, componentes reutilizáveis de design system e aplicações web baseadas em dados em Scrum/Kanban—fazendo a ponte entre o design de UI e a implementação em produção.",
        ),
        (
            "bosch-web-2020",
            2,
            "**User-centered collaboration:** partnered across design, research, and engineering squads to iterate on usability improvements, reduce user interaction friction, and validate production increments.",
            "**Colaboração centrada no usuário:** atuei em conjunto com times de design, pesquisa e engenharia para iterar melhorias de usabilidade, reduzir atritos de interação e validar incrementos em produção.",
        ),
        (
            "bosch-hu-2019",
            1,
            "**Digitization & user workflow optimization (Budapest):** conducted user workflow analysis and developed intuitive web applications for Business Excellence using SQL Server, IIS, Git, and VBA automations.",
            "**Digitalização e otimização do fluxo do usuário (Budapeste):** conduzi análise de fluxo de trabalho do usuário e desenvolvi aplicações web intuitivas para Business Excellence com SQL Server, IIS, Git e automações VBA.",
        ),
        (
            "bosch-hu-2019",
            2,
            "**Internal user experience ownership:** gathered operational pain points directly from process owners, rapidly iterating digital tool interfaces to simplify complex data entry and tracking.",
            "**Ownership de experiência do usuário interno:** mapeei dores operacionais diretamente com responsáveis de processos, iterando interfaces de ferramentas digitais para simplificar entradas e rastreamento de dados complexos.",
        ),
        (
            "bosch-intern-2017",
            1,
            "**Interface tooling & usability:** built user-friendly Excel/VBA continuous improvement systems; awarded **3rd place in Bosch Talent Forum 2018** for a Project Model Canvas visual management tool.",
            "**Tooling de interface e usabilidade:** construí sistemas de melhoria contínua amigáveis em Excel/VBA; premiado com **3º lugar no Fórum de Talentos Bosch 2018** por ferramenta de gestão visual do Project Model Canvas.",
        ),
    ]
    for exp_id, order, en, pt in bullets:
        rows.append(
            {
                "experience_id": exp_id,
                "variant": VARIANT,
                "sort_order": str(order),
                "text_en": en,
                "text_pt": pt,
            }
        )
    write("experience_bullets.csv", rows)


def upsert_titles() -> None:
    rows = [r for r in read("target_titles.csv") if r.get("path") != VARIANT]
    max_order = max(int(r["sort_order"]) for r in rows) if rows else 0
    path_en, path_pt = LABEL_EN, LABEL_PT
    new = [
        (
            "uxr-headline",
            "LinkedIn headline",
            "Headline do LinkedIn",
            "UX Researcher & Design Technologist | Mixed-Methods Research, Prototyping & Applied AI",
            "Pesquisador de UX e Design Technologist | Pesquisa com Métodos Mistos, Prototipagem e IA Aplicada",
            "CV tagline (ux-researcher)",
            "Linha de apresentação do CV (ux-researcher)",
        ),
        (
            "uxr-title-ux-researcher",
            "Job title",
            "Cargo",
            "UX Researcher",
            "Pesquisador(a) de UX",
            "Primary target title",
            "Cargo-alvo principal",
        ),
        (
            "uxr-title-design-technologist",
            "Job title",
            "Cargo",
            "Design Technologist",
            "Design Technologist",
            "Dual research-engineering target",
            "Cargo-alvo duplo pesquisa-engenharia",
        ),
        (
            "uxr-title-technical-ux-researcher",
            "Job title",
            "Cargo",
            "Technical UX Researcher",
            "Pesquisador(a) Técnico(a) de UX",
            "Tech-focused research role",
            "Cargo de pesquisa focado em tecnologia",
        ),
        (
            "uxr-title-product-designer",
            "Job title",
            "Cargo",
            "UX Researcher & Product Designer",
            "Pesquisador(a) de UX e Product Designer",
            "Dual researcher-designer profile",
            "Perfil duplo pesquisador-designer",
        ),
        (
            "uxr-title-ai-ux-researcher",
            "Job title",
            "Cargo",
            "AI/ML UX Researcher",
            "Pesquisador(a) de UX para IA/ML",
            "Emerging technology specialization",
            "Especialização em tecnologias emergentes",
        ),
    ]
    for i, (tid, kind_en, kind_pt, title_en, title_pt, src_en, src_pt) in enumerate(new, 1):
        order = str(max_order + i)
        rows.append(
            {
                "id": tid,
                "sort_order": order,
                "path": VARIANT,
                "path_label_en": path_en,
                "path_label_detail_en": path_en,
                "path_label_pt": path_pt,
                "path_label_detail_pt": path_pt,
                "kind_en": kind_en,
                "kind_detail_en": kind_en,
                "kind_pt": kind_pt,
                "kind_detail_pt": kind_pt,
                "title_en": title_en,
                "title_detail_en": title_en,
                "title_pt": title_pt,
                "title_detail_pt": title_pt,
                "source_en": src_en,
                "source_detail_en": src_en,
                "source_pt": src_pt,
                "source_detail_pt": src_pt,
            }
        )
    write("target_titles.csv", rows)


def n(
    field: str,
    label_en: str,
    label_pt: str,
    text_en: str,
    text_pt: str,
) -> dict[str, str]:
    return {
        "variant": VARIANT,
        "field": field,
        "label_en": label_en,
        "label_pt": label_pt,
        "text_en": text_en,
        "text_pt": text_pt,
    }


def upsert_narratives() -> None:
    rows = [r for r in read("narratives.csv") if r["variant"] != VARIANT]
    da_style = next(
        r["text_en"]
        for r in read("narratives.csv")
        if r["variant"] == "data-analyst" and r["field"] == "future_career_style"
    )
    da_style_pt = next(
        r["text_pt"]
        for r in read("narratives.csv")
        if r["variant"] == "data-analyst" and r["field"] == "future_career_style"
    )

    present_en = """| Area | Achievement |
|------|-------------|
| UX Maturity & Governance | Guided Americas to **UX Maturity Level 4** (Global Services); standardized templates & compliance tracking |
| Qualitative Synthesis | **Data Insights**: Grounded Theory (open/axial coding) + **Python/AI** on call-center transcripts → Power BI |
| Automated UX Gates | **ServiceNow** automated UX relevance scoring and strategic **CIP dashboards** for leadership visibility |
| Design Technologist | End-to-end tooling from requirements to **interactive prototypes** with regular user check-ins |
| Delivery Outcomes | Sustained average **CSI 4.86 / NPS 9.94** (2024–2025); delivered AI tools training to **100+** people (**4.88**/5) |
| HCI & Trust Research | Unicamp MSc (Grade A); peer-reviewed publications on **user trust in AI** (**IHC 2025, ISSRE 2025**) |"""

    present_pt = """| Área | Conquista |
|------|-----------|
| Maturidade e Governança UX | Conduzi as Américas ao **Nível 4 de Maturidade em UX** (Global Services); templates e governança |
| Síntese Qualitativa | **Data Insights**: Teoria Fundamentada (codificação aberta/axial) + **Python/IA** em transcrições → Power BI |
| Gates Automatizados de UX | Pontuação de relevância em UX no **ServiceNow** e dashboards **CIP** para visibilidade da liderança |
| Design Technologist | Tooling ponta a ponta de requisitos a **protótipos interativos** com check-ins contínuos de usuários |
| Resultados de Entrega | Média sustentada de **CSI 4,86 / NPS 9,94** (2024–2025); treinamento de IA para **100+** pessoas (**4,88**/5) |
| Pesquisa em IHC e Confiança | Mestrado Unicamp (nota A); artigos com peer-review sobre **confiança do usuário em IA** (**IHC 2025, ISSRE 2025**) |"""

    why_bullets_en = """- I believe technological products succeed when **rigorous user research and rapid engineering prototyping** move together.
- Applied Research at Bosch taught me to build **scalable UX governance**: intake gates, standardized templates, and measurable UX maturity (Level 4).
- Grounded Theory on call-center transcripts showed how qualitative user voice turns into **quantified, prioritized backlog decisions**.
- My master's research at Unicamp (IHC 2025, ISSRE 2025) grounded my practice in **user trust calibration for AI and complex interfaces**.
- Design technologist capability in **React, Figma, Python, and Power BI** allows me to prototype solutions in real code to validate feasibility early."""

    why_bullets_pt = """- Acredito que produtos tecnológicos vencem quando **pesquisa rigorosa com usuários e prototipagem rápida em engenharia** avançam juntas.
- A Pesquisa Aplicada na Bosch me ensinou a estruturar **governança de UX escalável**: gates de intake, templates padronizados e maturidade mensurável (Nível 4).
- A Teoria Fundamentada em transcrições de suporte mostrou como a voz qualitativa do usuário se traduz em **decisões quantificadas e priorizadas de backlog**.
- Minha pesquisa de mestrado na Unicamp (IHC 2025, ISSRE 2025) consolidou minha prática em **calibração de confiança do usuário para IA e interfaces complexas**.
- A capacidade de design technologist em **React, Figma, Python e Power BI** me permite prototipar soluções em código real para validar viabilidade cedo."""

    future_body_en = """## Future – How I Conduct UX Research & Design in High-Tech

- **Mixed-methods rigor:** generative discovery (interviews, contextual inquiry) combined with evaluative testing (SUS, usability benchmarks, quantitative trust scales).
- **Design technologist bridge:** translating UX concepts into interactive **React** prototypes and component specs that speed up engineering handoff.
- **Human-AI interaction:** applying Microsoft HAX, Google PAIR, and empirical evaluation to AI-augmented workflows.
- **ResearchOps & scalable insights:** repository-driven research findings, atomic UX nuggets, and self-service toolkits for cross-functional squads.
- **Outcome accountability:** tying design interventions directly to user task efficiency, adoption, error reduction, and sustained **CSI/NPS**.
"""

    future_body_pt = """## Futuro – Como conduzo Pesquisa e Design de UX em Alta Tecnologia

- **Rigor em métodos mistos:** descoberta generativa (entrevistas, pesquisa contextual) combinada com testes avaliativos (SUS, benchmarks de usabilidade, escalas quantitativas de confiança).
- **Ponte de design technologist:** traduzindo conceitos de UX em protótipos interativos em **React** e especificações de componentes que aceleram o handoff de engenharia.
- **Interação humano-IA:** aplicando diretrizes Microsoft HAX, Google PAIR e avaliação empírica em fluxos de trabalho com IA.
- **ResearchOps e insights escaláveis:** repositórios de pesquisa, achados atômicos e kits de ferramentas self-service para squads multidisciplinares.
- **Compromisso com resultados:** conectando intervenções de design diretamente à eficiência de tarefas do usuário, adoção, redução de erros e **CSI/NPS** sustentados.
"""

    narr = [
        n(
            "tagline",
            "Tagline",
            "Linha de apresentação",
            "UX Researcher & Design Technologist | Mixed-Methods Research, Prototyping & Applied AI",
            "Pesquisador de UX e Design Technologist | Pesquisa com Métodos Mistos, Prototipagem e IA Aplicada",
        ),
        n(
            "profile",
            "Profile summary",
            "Resumo do perfil",
            "UX researcher and design technologist with ~8 years of technology experience at Bosch (intern → web developer → applied research & design analyst). Combines **mixed-methods research** (Straussian Grounded Theory, qualitative coding, surveys, usability testing) with **design technologist execution** (React, high-fidelity code prototypes, Figma, Power BI). Master's in Technology approved Sep 2026 (Unicamp, Grade A across coursework); published peer-reviewed research on user trust in human-AI interaction (IHC 2025, ISSRE 2025). Guided Americas UX Maturity to Level 4; sustained average CSI 4.86 / NPS 9.94 across projects.",
            "Pesquisador de UX e design technologist com ~8 anos de experiência em tecnologia na Bosch (estágio → desenvolvedor web → analista de pesquisa aplicada e design). Combino **pesquisa com métodos mistos** (Teoria Fundamentada de Strauss, codificação qualitativa, surveys, testes de usabilidade) com **execução de design technologist** (React, protótipos de alta fidelidade em código, Figma, Power BI). Mestrado em Tecnologia aprovado em set/2026 (Unicamp, nota A em todas as disciplinas); pesquisa publicada com peer-review sobre confiança do usuário na interação humano-IA (IHC 2025, ISSRE 2025). Conduzi a maturidade de UX das Américas ao Nível 4; média sustentada de CSI 4,86 / NPS 9,94.",
        ),
        n(
            "deck_title",
            "Deck title",
            "Título do portfólio",
            "Eduardo Figueiredo – UX Research & Design Portfolio",
            "Eduardo Figueiredo – Portfólio de UX Research e Design",
        ),
        n(
            "why_h1",
            "Why slide heading",
            "Título slide Por quê",
            "Why I Practice UX Research and Design in Technology",
            "Por que atuo em Pesquisa e Design de UX em Tecnologia",
        ),
        n(
            "why_h2",
            "Why slide subheading",
            "Subtítulo slide Por quê",
            "Evidence-based design that bridges user mental models and complex technical systems",
            "Design baseado em evidências unindo modelos mentais do usuário e sistemas técnicos complexos",
        ),
        n(
            "why_bullets",
            "Why slide bullets",
            "Tópicos slide Por quê",
            why_bullets_en,
            why_bullets_pt,
        ),
        n(
            "who_role",
            "Who slide role",
            "Papel slide Quem sou",
            "UX Researcher & Design Technologist | Mixed-Methods Research, Prototyping & Applied AI",
            "Pesquisador de UX e Design Technologist | Pesquisa com Métodos Mistos, Prototipagem e IA Aplicada",
        ),
        n(
            "who_impact",
            "Who slide impact",
            "Impacto slide Quem sou",
            "I help technology and AI teams discover real user needs, design usable systems, and validate interaction paradigms through mixed-methods research, metrics (CSI/NPS, SUS), and high-fidelity code prototypes.",
            "Ajudo times de tecnologia e IA a descobrir necessidades reais de usuários, desenhar sistemas usáveis e validar paradigmas de interação por meio de métodos mistos, métricas (CSI/NPS, SUS) e protótipos de alta fidelidade em código.",
        ),
        n(
            "present_h2",
            "Present slide heading",
            "Título slide Presente",
            "Present – UX Research, Design Technologist & Governance (Bosch)",
            "Presente – Pesquisa de UX, Design Technologist e Governança (Bosch)",
        ),
        n(
            "present_table",
            "Present achievements table",
            "Tabela de conquistas",
            present_en,
            present_pt,
        ),
        n(
            "cip_pipeline_h2",
            "CIP pipeline heading",
            "Título pipeline CIP",
            "Present – User Research to Implementation: Intake → Evaluation → Governance",
            "Presente – Da Pesquisa do Usuário à Implementação: Intake → Avaliação → Governança",
        ),
        n(
            "relevance_h2",
            "Relevance model heading",
            "Título modelo de relevância",
            "Present – UX Relevance Scoring Model in ServiceNow",
            "Presente – Modelo de Pontuação de Relevância em UX no ServiceNow",
        ),
        n(
            "csi_h2",
            "CSI/NPS heading",
            "Título CSI/NPS",
            "Present – User Satisfaction Outcomes: CSI & NPS (2024–2025)",
            "Presente – Resultados de Satisfação do Usuário: CSI e NPS (2024–2025)",
        ),
        n(
            "tooling_h2",
            "Tooling project heading",
            "Título projeto tooling",
            "Design Technologist in Delivery – Tooling for Power Tools",
            "Design Technologist na Entrega – Projeto Tooling para Power Tools",
        ),
        n(
            "tooling_bullet",
            "Tooling bullet",
            "Item projeto tooling",
            "- **Tooling project for PT:** Translated complex domain workflows into interactive prototypes with **regular user and stakeholder check-ins**—bridging user mental models and production technical architecture.",
            "- **Projeto tooling para PT:** Traduzi fluxos complexos de domínio em protótipos interativos com **check-ins regulares de usuários e stakeholders**—unindo modelos mentais do usuário à arquitetura técnica de produção.",
        ),
        n(
            "infovis_pnad_h2",
            "InfoVis PNAD heading",
            "Título InfoVis PNAD",
            "Visual Ergonomics & Evaluation – MSc InfoVis: PNAD Contínua (Power BI)",
            "Ergonomia Visual e Avaliação – InfoVis (Mestrado): PNAD Contínua (Power BI)",
        ),
        n(
            "infovis_pnad_bullets",
            "InfoVis PNAD bullets",
            "Tópicos InfoVis PNAD",
            """- **MSc Information Visualization (Unicamp, Grade A):** user visual perception, cognitive load, and visual mapping—principles applied to design readable, task-efficient user interfaces.
- **PNAD Contínua in Power BI:** designed exploratory data interfaces prioritizing user legibility, workflow speed, and intuitive filtering.""",
            """- **Visualização da Informação (Mestrado Unicamp, nota A):** percepção visual do usuário, carga cognitiva e mapeamento visual—princípios aplicados para desenhar interfaces legíveis e eficientes para tarefas.
- **PNAD Contínua no Power BI:** desenhei interfaces exploratórias priorizando legibilidade para o usuário, velocidade de fluxo e filtragem intuitiva.""",
        ),
        n(
            "infovis_phrasenet_h2",
            "InfoVis PhraseNets heading",
            "Título InfoVis PhraseNets",
            "Qualitative & Text Analysis – Text & Network Structures (PhraseNets)",
            "Análise Qualitativa e Textual – Estruturas de Texto e Redes (PhraseNets)",
        ),
        n(
            "infovis_phrasenet_bullets",
            "InfoVis PhraseNets bullets",
            "Tópicos InfoVis PhraseNets",
            """- **Qualitative user expression mapping:** visualized unstructured user expressions, semantic patterns, and terminology through network graphs.
- **Interaction design principles:** Shneiderman's visual information seeking mantra applied to complex information hierarchies.""",
            """- **Mapeamento de expressões qualitativas do usuário:** visualização de termos, padrões semânticos e relações conceituais não estruturadas por grafos de rede.
- **Princípios de design de interação:** aplicação do mantra de Shneiderman para exploração de hierarquias complexas de informação.""",
        ),
        n(
            "dissertation_pbi_intro",
            "Dissertation PBI intro",
            "Intro dissertação PBI",
            "My master's dissertation investigates **user trust** in digital experiences and evaluates how users interact with and adopt **Agentic AI systems** compared to traditional workflows.",
            "Minha dissertação de mestrado investiga **confiança do usuário** em experiências digitais e avalia como usuários interagem e adotam **sistemas de IA agêntica** em comparação a fluxos tradicionais.",
        ),
        n(
            "dissertation_pbi_bullets",
            "Dissertation PBI bullets",
            "Tópicos dissertação PBI",
            """- **Empirical UX evaluation:** quantitative trust scales, behavioral task metrics, and user perception modeling across human-AI touchpoints.
- **Published HCI research:** peer-reviewed contributions at IHC 2025 and ISSRE 2025 on trust measurement and user decision dynamics in AI interaction.""",
            """- **Avaliação empírica de UX:** escalas quantitativas de confiança, métricas comportamentais de tarefas e modelagem da percepção do usuário em touchpoints humano-IA.
- **Pesquisa publicada em IHC:** artigos com peer-review no IHC 2025 e ISSRE 2025 sobre medição de confiança e dinâmica de decisões do usuário em interação com IA.""",
        ),
        n(
            "future_h2",
            "Future slide heading",
            "Título slide Futuro",
            "Future – UX Research & Design for Emerging Technologies & AI",
            "Futuro – Pesquisa e Design de UX para Tecnologias Emergentes e IA",
        ),
        n(
            "future_intro",
            "Future intro",
            "Introdução slide Futuro",
            "**Human-centered research, design technology, and applied AI** define my trajectory as a UX Researcher & Design Technologist. The diagram below illustrates the research and delivery loop I operate in.",
            "**Pesquisa centrada no usuário, design technology e IA aplicada** definem minha trajetória como Pesquisador de UX e Design Technologist. O diagrama abaixo ilustra o ciclo de pesquisa e entrega em que atuo.",
        ),
        n(
            "future_diagram_alt",
            "Future diagram alt text",
            "Texto alt diagrama Futuro",
            "Diagram ai-agile-research-ux-researcher: UX Research and Design in High-Tech Delivery",
            "Diagrama ai-agile-research-ux-researcher: Pesquisa e Design de UX em Entrega de Alta Tecnologia",
        ),
        n(
            "future_career_body",
            "Future career body",
            "Corpo slide carreira",
            future_body_en,
            future_body_pt,
        ),
        n(
            "future_career_style",
            "Future career CSS",
            "CSS slide carreira",
            da_style,
            da_style_pt,
        ),
        n(
            "closing_summary",
            "Closing summary",
            "Resumo de encerramento",
            "I combine rigorous mixed-methods research, design technologist code prototyping, and empirical trust measurement to build high-tech and AI products that users trust and adopt—validated by measurable outcomes.",
            "Combino pesquisa rigorosa com métodos mistos, prototipagem em código como design technologist e medição empírica de confiança para construir produtos de alta tecnologia e IA que os usuários confiam e adotam—validados por resultados mensuráveis.",
        ),
    ]

    # Copy shared slide chrome headers (h_*) from data-analyst
    da_rows = [r for r in read("narratives.csv") if r["variant"] == "data-analyst"]
    existing_fields = {x["field"] for x in narr}
    for r in da_rows:
        if r["field"] not in existing_fields:
            narr.append(
                n(
                    r["field"],
                    r.get("label_en", r["field"]),
                    r.get("label_pt", r["field"]),
                    r.get("text_en", ""),
                    r.get("text_pt", ""),
                )
            )

    rows.extend(narr)
    write("narratives.csv", rows)


def upsert_company_fit() -> None:
    rows = read("companies.csv")
    if not rows:
        return
    has_col = "fit_ux_researcher" in rows[0]

    # Heuristic for UX fit:
    # 1. Any company that fits Product Owner or Digital Solution Architect with digital/software/AI/tech focus
    # 2. Keywords in category, skills_match, fit_why, notes: software, digital, product, ai, ux, design, app, platform, tech, r&d, research
    ux_keywords = (
        "ux",
        "design",
        "product",
        "software",
        "digital",
        "ai",
        "cloud",
        "research",
        "mobile",
        "app",
        "plataforma",
        "desenvolvimento",
        "inovação",
        "innovation",
        "r&d",
        "tecnologia",
        "technology",
    )

    fit_count = 0
    for r in rows:
        cid = r.get("id", "")
        # Bosch and leading tech employers always fit
        if cid in (
            "bosch-brasil",
            "ciandt-campinas",
            "eldorado-campinas",
            "cpqd-campinas",
            "sensedia-campinas",
            "ifood-campinas",
            "motorola-jaguariuna",
            "accenture-brasil",
            "totvs",
            "globo-tecnologia",
            "itau-unibanco",
            "nubank",
            "mercado-livre",
            "banco-inter",
            "stone-pagamentos",
            "pagseguro",
            "daitan-campinas",
            "venturus-campinas",
            "siemens-brasil",
            "embraer",
            "dell-brasil",
            "lenovo-brasil",
            "ibm-brasil",
            "microsoft-brasil",
            "google-brasil",
            "amazon-brasil",
            "oracle-brasil",
        ):
            r["fit_ux_researcher"] = "yes"
            fit_count += 1
            continue

        po_fit = (r.get("fit_product_owner") or "").strip().lower() in ("yes", "y", "1", "true", "sim")
        blob = " ".join(
            [
                r.get("category_en", ""),
                r.get("category_pt", ""),
                r.get("name_en", ""),
                r.get("skills_match_en", ""),
                r.get("skills_match_pt", ""),
                r.get("fit_why_en", ""),
                r.get("fit_why_pt", ""),
                r.get("notes_en", ""),
                r.get("notes_pt", ""),
            ]
        ).lower()

        if po_fit or any(kw in blob for kw in ux_keywords):
            r["fit_ux_researcher"] = "yes"
            fit_count += 1
        else:
            r["fit_ux_researcher"] = "no"

    write("companies.csv", rows)
    print(f"companies.csv: seeded fit_ux_researcher ({fit_count} yes out of {len(rows)})")


def upsert_portals() -> None:
    rows = read("job_portals.csv")
    for r in rows:
        paths = [p.strip() for p in (r.get("fit_paths") or "").split(";") if p.strip()]
        # Add uxr to multi-path tech and general portals
        if r.get("id") in (
            "linkedin-br",
            "gupy",
            "trampos",
            "glassdoor-br",
            "linkedin-intl",
            "indeed-intl",
            "wellfound",
            "builtin",
            "arc",
            "remote-ok",
            "wwr",
            "glassdoor-intl",
        ):
            if "uxr" not in paths:
                paths.append("uxr")
                r["fit_paths"] = ";".join(paths)

    # Check if dedicated UX portals exist
    existing_ids = {r.get("id") for r in rows}
    new_portals = [
        {
            "id": "linkedin-ux-br",
            "sort_order": "13",
            "pinned": "",
            "scope": "brazil",
            "name": "LinkedIn Jobs (UX Researcher BR)",
            "job_search_url": "https://www.linkedin.com/jobs/search/?keywords=UX%20Researcher&location=Brazil",
            "system_kind": "proprietary",
            "ats_name": "",
            "ats_url": "",
            "fit_paths": "uxr",
            "notes": "Pre-filtered search for UX Researcher openings in Brazil.",
        },
        {
            "id": "gupy-ux",
            "sort_order": "14",
            "pinned": "",
            "scope": "brazil",
            "name": "Gupy (UX Research)",
            "job_search_url": "https://portal.gupy.io/job-search/term=ux%20researcher",
            "system_kind": "third_party",
            "ats_name": "Gupy",
            "ats_url": "https://www.gupy.io/",
            "fit_paths": "uxr",
            "notes": "Direct Gupy portal search for UX Researcher roles.",
        },
    ]
    for p in new_portals:
        if p["id"] not in existing_ids:
            rows.append(p)

    write("job_portals.csv", rows)


def upsert_profile() -> None:
    rows = read("profile.csv")
    if rows:
        row = rows[0]
        base = "https://duducm2.github.io/my-personal-repo/"
        row["site_ux_researcher_url"] = base + "ux-researcher/"
        write("profile.csv", rows)


def upsert_schema() -> None:
    rows = read("schema.csv")
    existing = {(r.get("file"), r.get("column")) for r in rows}
    new_cols = [
        (
            "profile.csv",
            "site_ux_researcher_url",
            "UX Researcher site",
            "Site UX Researcher",
        ),
        (
            "companies.csv",
            "fit_ux_researcher",
            "Fit UX Researcher",
            "Aderência UX Researcher",
        ),
    ]
    for file, col, en, pt in new_cols:
        if (file, col) not in existing:
            rows.append(
                {
                    "file": file,
                    "column": col,
                    "label_en": en,
                    "label_pt": pt,
                }
            )
    write("schema.csv", rows)


def ensure_folders() -> None:
    resume_dir = ROOT / "resume" / "variants" / VARIANT
    resume_dir.mkdir(parents=True, exist_ok=True)
    src = ROOT / "resume" / "variants" / "data-analyst" / "main.typ"
    dst = resume_dir / "main.typ"
    text = src.read_text(encoding="utf-8")
    text = text.replace(
        "RESUME LAYOUT — Data Analyst variant entry.",
        "RESUME LAYOUT — UX Researcher & Design Technologist variant entry.",
    )
    dst.write_text(text, encoding="utf-8")
    print(f"wrote {dst.relative_to(ROOT)}")

    port_dir = ROOT / "portfolio" / "variants" / VARIANT
    port_dir.mkdir(parents=True, exist_ok=True)
    print(f"ensured {port_dir.relative_to(ROOT)}")

    out_dir = ROOT / "output" / VARIANT
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"ensured {out_dir.relative_to(ROOT)}")

    docs_dir = ROOT / "docs" / VARIANT
    docs_dir.mkdir(parents=True, exist_ok=True)
    print(f"ensured {docs_dir.relative_to(ROOT)}")


def main() -> None:
    upsert_field_labels()
    upsert_skills()
    upsert_bullets()
    upsert_titles()
    upsert_narratives()
    upsert_company_fit()
    upsert_portals()
    upsert_profile()
    upsert_schema()
    ensure_folders()
    print("seed complete:", VARIANT)


if __name__ == "__main__":
    main()

