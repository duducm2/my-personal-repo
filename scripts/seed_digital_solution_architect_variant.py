#!/usr/bin/env python3
"""Seed digital-solution-architect career variant into canonical CSVs (idempotent)."""
from __future__ import annotations

import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
VARIANT = "digital-solution-architect"
LABEL_EN = "Digital Solution Architect"
LABEL_PT = "Arquiteto de Soluções Digitais"


def read(name: str) -> list[dict[str, str]]:
    with (CANON / name).open(encoding="utf-8", newline="") as f:
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
        out.append(r)
        if r["domain"] == "variant" and r["key"] == "data-analyst" and not inserted:
            out.append(
                {
                    "domain": "variant",
                    "key": VARIANT,
                    "label_en": LABEL_EN,
                    "label_pt": LABEL_PT,
                }
            )
            inserted = True
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
        ("Solution & cloud architecture", "Arquitetura de soluções e cloud"),
        ("Digitization & systems design", "Digitalização e desenho de sistemas"),
        ("DevOps / CI-CD & automation", "DevOps / CI-CD e automação"),
        ("Applied Research & quality gates", "Pesquisa Aplicada e quality gates"),
        ("Global stakeholder alignment", "Alinhamento com stakeholders globais"),
    ]
    tech = [
        ("Azure", "Azure"),
        ("Python", "Python"),
        ("SQL / SQL Server", "SQL / SQL Server"),
        ("Power BI", "Power BI"),
        ("ServiceNow", "ServiceNow"),
        ("Git", "Git"),
        ("GitHub", "GitHub"),
        ("Bitbucket", "Bitbucket"),
        ("VS Code", "VS Code"),
        ("React", "React"),
        ("Windows Server / IIS", "Windows Server / IIS"),
        ("Docker", "Docker"),
        ("Excel / VBA", "Excel / VBA"),
        ("CSV pipelines", "Pipelines CSV"),
        ("Mermaid", "Mermaid"),
        ("HTML / CSS", "HTML / CSS"),
        ("Figma", "Figma"),
        ("Terraform (IaC)", "Terraform (IaC)"),
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
            "**Solution design for Global Services:** partnered on **strategic CIP dashboards** and automated **UX relevance** scoring in **ServiceNow** (property-based weights)—turning subjective intake into a **repeatable architecture gate**.",
            "**Desenho de solução para Global Services:** atuei em **dashboards estratégicos de CIP** e pontuação automatizada de **relevância em UX** no **ServiceNow** (pesos por propriedades)—transformando intake subjetivo em **gate de arquitetura repetível**.",
        ),
        (
            "bosch-ar-2023",
            2,
            "**Data Insights (Power Tools):** designed a **Python + AI** coding pipeline over call-center transcripts (Grounded Theory) with **Power BI** synthesis—cloud-ready analytics patterns for unstructured operational data.",
            "**Data Insights (Power Tools):** desenhei pipeline **Python + IA** sobre transcrições de call center (Teoria Fundamentada) com síntese em **Power BI**—padrões analíticos prontos para cloud sobre dados operacionais não estruturados.",
        ),
        (
            "bosch-ar-2023",
            3,
            "**UX Maturity Level 4 (Americas):** governance, templates, training; **Power BI** audit dashboard auto-fetching **Microsoft Lists**—instrumented compliance for project-management documentation.",
            "**Nível 4 de Maturidade UX (Américas):** governança, templates, treinamento; dashboard **Power BI** com ingestão automática de **Microsoft Lists**—conformidade instrumentada da documentação de PM.",
        ),
        (
            "bosch-ar-2023",
            4,
            "**Tooling (Power Tools):** end-to-end delivery from requirements to high-fidelity prototypes with customer check-ins—bridging business intent and technical architecture.",
            "**Tooling (Power Tools):** entrega ponta a ponta de requisitos a protótipos hi-fi com check-ins—ponte entre intenção de negócio e arquitetura técnica.",
        ),
        (
            "bosch-ar-2023",
            5,
            "**Agentic AI in the delivery loop:** daily **VS Code** + AI for research, method design, and faster iteration across global architecture-adjacent workstreams.",
            "**IA agêntica no ciclo de entrega:** uso diário de **VS Code** + IA para pesquisa, desenho de método e iteração mais rápida em workstreams adjacentes à arquitetura global.",
        ),
        (
            "bosch-ar-2023",
            6,
            "Outcome ownership: average **CSI 4.86 / NPS 9.94** (2024–2025); international collaboration with Germany (2024, 2025).",
            "Ownership de resultados: média **CSI 4,86 / NPS 9,94** (2024–2025); colaboração internacional com a Alemanha (2024, 2025).",
        ),
        (
            "bosch-web-2020",
            1,
            "Built **React** front-ends and internal/customer web solutions in **Scrum/Kanban**—component boundaries and API-facing delivery habits useful for **service-oriented** designs.",
            "Construí front-ends **React** e soluções web internas/cliente em **Scrum/Kanban**—limites de componente e entrega orientada a API úteis para desenhos **service-oriented**.",
        ),
        (
            "bosch-web-2020",
            2,
            "Collaborated across design, research, and engineering to ship increments with clear ownership—practice for architecture review culture.",
            "Colaborei entre design, pesquisa e engenharia para entregar incrementos com ownership claro—prática para cultura de architecture review.",
        ),
        (
            "bosch-hu-2019",
            1,
            "**Digitization Support Analyst (Budapest):** digitizing Business Excellence systems—**Kanban** delivery of web apps on **SQL Server**, **Windows Server (IIS)**, **Git**, and **VBA** automation.",
            "**Analista de Suporte à Digitalização (Budapeste):** digitalização de sistemas Business Excellence—entrega **Kanban** de apps web em **SQL Server**, **Windows Server (IIS)**, **Git** e automação **VBA**.",
        ),
        (
            "bosch-hu-2019",
            2,
            "End-to-end ownership of internal digital tools: from process need to hosted web system—early **solution architecture** muscle in a global Bosch context.",
            "Ownership ponta a ponta de ferramentas digitais internas: da necessidade de processo ao sistema web hospedado—músculo precoce de **arquitetura de soluções** em contexto Bosch global.",
        ),
        (
            "bosch-intern-2017",
            1,
            "**Excel/VBA + Access** digital systems for Continuous Improvement and Internal Communication; **3rd place, Bosch Talent Forum 2018** (Project Model Canvas tooling).",
            "**Excel/VBA + Access** como sistemas digitais para Melhoria Contínua e Comunicação Interna; **3º lugar, Fórum de Talentos Bosch 2018** (tooling Project Model Canvas).",
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
    # renumber sort_order at end
    max_order = max(int(r["sort_order"]) for r in rows) if rows else 0
    path_en, path_pt = LABEL_EN, LABEL_PT
    new = [
        (
            "dsa-headline",
            "LinkedIn headline",
            "Headline do LinkedIn",
            "Digital Solution Architect | Cloud, Digitization & Evidence-Based Delivery",
            "Arquiteto de Soluções Digitais | Cloud, Digitalização e Entrega Baseada em Evidência",
            "CV tagline (digital-solution-architect)",
            "Linha de apresentação do CV (digital-solution-architect)",
        ),
        (
            "dsa-title-mid-dsa",
            "Job title",
            "Cargo",
            "Mid-Level Digital Solution Architect",
            "Arquiteto de Soluções Digitais (Pleno)",
            "Target role: Bosch Power Solution / PS",
            "Cargo-alvo: Bosch Power Solution / PS",
        ),
        (
            "dsa-title-solution-architect",
            "Job title",
            "Cargo",
            "Solution Architect",
            "Arquiteto de Soluções",
            "CV career path",
            "Trilha do CV",
        ),
        (
            "dsa-title-cloud-architect",
            "Job title",
            "Cargo",
            "Cloud Solution Architect",
            "Arquiteto de Soluções Cloud",
            "Azure / digitization framing",
            "Framing Azure / digitalização",
        ),
    ]
    for i, (tid, kind_en, kind_pt, title_en, title_pt, src_en, src_pt) in enumerate(
        new, 1
    ):
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
    # Copy CSS style from data-analyst
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
| Digitization (Bosch HU) | End-to-end web systems for Business Excellence on **SQL Server**, **IIS**, **Git**; **Kanban** delivery |
| Architecture gates (GS) | Automated **UX relevance** in **ServiceNow**; strategic **CIP** dashboards for leadership clarity |
| Analytics → insight | **Data Insights**: Grounded Theory + **Python/AI** + **Power BI** on call-center transcripts |
| Maturity & governance | Americas **UX Maturity Level 4**; **Power BI** + **Microsoft Lists** document compliance |
| Delivery outcomes | Avg **CSI 4.86 / NPS 9.94** (2024–2025); tooling from requirements to hi-fi prototypes |
| Enablement | **AI tools** training for **100+** people (**4.88**/5); Germany trips 2024–2025 |"""

    present_pt = """| Área | Conquista |
|------|-----------|
| Digitalização (Bosch HU) | Sistemas web ponta a ponta para Business Excellence em **SQL Server**, **IIS**, **Git**; entrega **Kanban** |
| Gates de arquitetura (GS) | **Relevância em UX** automatizada no **ServiceNow**; dashboards **CIP** estratégicos para liderança |
| Analytics → insight | **Data Insights**: Teoria Fundamentada + **Python/IA** + **Power BI** em transcrições de call center |
| Maturidade e governança | **Nível 4 de Maturidade UX** nas Américas; **Power BI** + **Microsoft Lists** para conformidade documental |
| Resultados de entrega | Média **CSI 4,86 / NPS 9,94** (2024–2025); tooling de requisitos a protótipos hi-fi |
| Capacitação | Treinamento de **ferramentas de IA** para **100+** pessoas (**4,88**/5); viagens à Alemanha 2024–2025 |"""

    future_body_en = """## Future – How I Design Digital Solutions

- **Architecture as decision support:** patterns (services, events, quality gates) chosen for operability—not fashion.
- **Cloud & platform fluency:** deepen **Azure** landing zones, identity/RBAC, and IaC (**Terraform**/ARM) on top of existing digitization and data work.
- **Evidence in the loop:** keep Applied Research, metrics (**CSI/NPS**), and stakeholder validation inside architecture reviews.
- **Secure by default:** identity, policy, and observability as first-class concerns alongside compute and data.
- **Global collaboration:** bilingual delivery with distributed teams—already practiced across BR/HU/DE contexts.
"""

    future_body_pt = """## Futuro – Como desenho soluções digitais

- **Arquitetura como apoio à decisão:** padrões (serviços, eventos, quality gates) escolhidos por operabilidade—não por moda.
- **Fluência cloud e plataforma:** aprofundar landing zones **Azure**, identidade/RBAC e IaC (**Terraform**/ARM) sobre a digitalização e o trabalho com dados já feitos.
- **Evidência no ciclo:** manter Pesquisa Aplicada, métricas (**CSI/NPS**) e validação com stakeholders dentro de architecture reviews.
- **Seguro por padrão:** identidade, política e observabilidade como preocupações de primeira classe junto de compute e dados.
- **Colaboração global:** entrega bilíngue com times distribuídos—já praticada em contextos BR/HU/DE.
"""

    narr = [
        n(
            "tagline",
            "Tagline",
            "Linha de apresentação",
            "Digital Solution Architect | Cloud, Digitization & Evidence-Based Delivery",
            "Arquiteto de Soluções Digitais | Cloud, Digitalização e Entrega Baseada em Evidência",
        ),
        n(
            "profile",
            "Profile summary",
            "Resumo do perfil",
            "Digital solution architect mindset: I design and review **digitization** and analytics solutions that global teams can operate—**Azure**-aware platforms, **Python/SQL** data paths, **DevOps** automation habits, and **Applied Research** quality gates (ServiceNow relevance scoring, CIP dashboards). **Full-stack** background (React, SQL Server, IIS) plus Power BI and AI-assisted pipelines. Master's in Technology (**completing September 2026**) with **Grade A across all coursework**. Uses CSI/NPS to keep architecture honest about outcomes.",
            "**Atuo com mentalidade de arquiteto de soluções digitais:** desenho e reviso soluções de **digitalização** e analytics que times globais operam—plataformas com consciência **Azure**, caminhos de dados **Python/SQL**, hábitos de **DevOps** e quality gates de **Pesquisa Aplicada** (relevância no ServiceNow, dashboards CIP). Base **full-stack** (React, SQL Server, IIS) mais Power BI e pipelines com IA. Mestrado em Tecnologia (**conclusão set/2026**) com **nota A em todas as disciplinas**. **Uso** CSI/NPS para manter a arquitetura honesta quanto a resultados.",
        ),
        n(
            "deck_title",
            "Deck title",
            "Título do portfólio",
            "Eduardo Figueiredo – Portfolio",
            "Eduardo Figueiredo – Portfólio",
        ),
        n(
            "why_h1",
            "Why slide heading",
            "Título slide Por quê",
            "Why I Design Digital Solutions",
            "Por que desenho soluções digitais",
        ),
        n(
            "why_h2",
            "Why slide subheading",
            "Subtítulo slide Por quê",
            "Architecture that global teams can run, measure, and trust",
            "Arquitetura que times globais operam, medem e confiam",
        ),
        n(
            "why_bullets",
            "Why slide bullets",
            "Tópicos slide Por quê",
            """- I believe architecture succeeds when **operations, security, and evidence** travel together—not when diagrams stay on slides.
- Digitization work taught me to ship **end-to-end systems** (data store → app → hosting → Git) under real business constraints.
- Applied Research at Bosch sharpened **method gates**: relevance scoring, CIP dashboards, and measurable UX maturity.
- I use **Python, SQL, Power BI, and AI** to turn unstructured operational signal into structures architects and leaders can act on.
- Fluent English and bilingual delivery keep me effective in **global architecture** conversations.""",
            """- Acredito que arquitetura funciona quando **operações, segurança e evidência** caminham juntas—não quando diagramas ficam só no slide.
- Trabalho de digitalização me ensinou a entregar **sistemas ponta a ponta** (dados → app → hosting → Git) sob restrições reais de negócio.
- Pesquisa Aplicada na Bosch afiou **gates de método**: pontuação de relevância, dashboards CIP e maturidade UX mensurável.
- **Uso Python, SQL, Power BI e IA** para transformar sinal operacional não estruturado em estruturas acionáveis.
- Inglês fluente e entrega bilíngue me mantêm efetivo em conversas de **arquitetura global**.""",
        ),
        n(
            "who_role",
            "Who slide role",
            "Papel slide Quem sou",
            "Digital Solution Architect | Cloud, Digitization & Evidence-Based Delivery",
            "Arquiteto de Soluções Digitais | Cloud, Digitalização e Entrega Baseada em Evidência",
        ),
        n(
            "who_impact",
            "Who slide impact",
            "Impacto slide Quem sou",
            "I help teams design digitization and analytics solutions that survive contact with production: clear boundaries, measurable outcomes, and architecture reviews grounded in evidence.",
            "Ajudo times a desenhar soluções de digitalização e analytics que sobrevivem ao contato com produção: limites claros, resultados mensuráveis e architecture reviews baseadas em evidência.",
        ),
        n(
            "present_h2",
            "Present slide heading",
            "Título slide Presente",
            "Present – Digitization, Architecture Gates & Delivery (Bosch)",
            "Presente – Digitalização, gates de arquitetura e entrega (Bosch)",
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
            "Present – Method Pipeline: Evidence → Gate → Dashboard",
            "Presente – Pipeline de método: Evidência → Gate → Dashboard",
        ),
        n(
            "relevance_h2",
            "Relevance model heading",
            "Título modelo de relevância",
            "Present – Relevance evaluation model (Low / Medium / High)",
            "Presente – Modelo de avaliação de relevância (Baixa / Média / Alta)",
        ),
        n(
            "csi_h2",
            "CSI/NPS heading",
            "Título CSI/NPS",
            "Present – Outcome Metrics: CSI & NPS (2024–2025)",
            "Presente – Métricas de resultado: CSI e NPS (2024–2025)",
        ),
        n(
            "tooling_h2",
            "Tooling project heading",
            "Título projeto tooling",
            "Architecture in Delivery – Tooling Project for Power Tools",
            "Arquitetura na entrega – Projeto Tooling para Power Tools",
        ),
        n(
            "tooling_bullet",
            "Tooling bullet",
            "Item projeto tooling",
            "- **Tooling project for PT:** Bridged requirements to high-fidelity prototypes with **regular customer check-ins**—keeping business intent and technical design in one thread.",
            "- **Projeto tooling para PT:** Liguei requisitos a protótipos hi-fi com **check-ins regulares**—mantendo intenção de negócio e desenho técnico no mesmo fio.",
        ),
        n(
            "infovis_pnad_h2",
            "InfoVis PNAD heading",
            "Título InfoVis PNAD",
            "Data Visualization – MSc InfoVis: PNAD Contínua (Power BI)",
            "Visualização de dados – InfoVis (Mestrado): PNAD Contínua (Power BI)",
        ),
        n(
            "infovis_pnad_bullets",
            "InfoVis PNAD bullets",
            "Tópicos InfoVis PNAD",
            """- **MSc Information Visualization (Unicamp, Grade A):** visual structures and mapping for **multivariate** operational data—skills that transfer to architecting readable cloud analytics surfaces.
- **PNAD Contínua in Power BI:** from raw tables to interactive views stakeholders can explore.""",
            """- **Visualização da Informação (Mestrado Unicamp, nota A):** estruturas visuais e mapeamento para dados operacionais **multivariados**—habilidades que transferem para arquitetar superfícies analíticas cloud legíveis.
- **PNAD Contínua no Power BI:** de tabelas brutas a visões interativas exploráveis por stakeholders.""",
        ),
        n(
            "infovis_phrasenet_h2",
            "InfoVis PhraseNets heading",
            "Título InfoVis PhraseNets",
            "InfoVis – Text & Graph Visualization (PhraseNets)",
            "InfoVis – Visualização de textos e grafos (PhraseNets)",
        ),
        n(
            "infovis_phrasenet_bullets",
            "InfoVis PhraseNets bullets",
            "Tópicos InfoVis PhraseNets",
            """- **Graphs, trees, and text viz:** encoding relationships and co-occurrence—useful when architecture must expose **event** and **dependency** structure.
- **Interaction patterns:** filtering and detail-on-demand as UX constraints on data platforms.""",
            """- **Grafos, árvores e viz de texto:** codificar relações e coocorrência—útil quando a arquitetura precisa expor estrutura de **eventos** e **dependências**.
- **Padrões de interação:** filtragem e detalhe sob demanda como restrições de UX em plataformas de dados.""",
        ),
        n(
            "dissertation_pbi_intro",
            "Dissertation PBI intro",
            "Intro dissertação PBI",
            "My dissertation studies **trust** in digital experiences and how **Agentic AI** compares to human judgment—grounding architecture debates in measured user perception.",
            "Minha dissertação estuda **confiança** em experiências digitais e como **Agentic AI** se compara ao julgamento humano—ancorando debates de arquitetura em percepção medida do usuário.",
        ),
        n(
            "dissertation_pbi_bullets",
            "Dissertation PBI bullets",
            "Tópicos dissertação PBI",
            """- **Inferential pipeline:** Shapiro-Wilk → Welch/paired t-tests, Cohen's d, FDR—then **Power BI** reporting with 50+ visual structures.
- **Why it matters for architects:** evaluation design and honest metrics before scaling AI features on a platform.""",
            """- **Pipeline inferencial:** Shapiro-Wilk → t de Welch/pareado, d de Cohen, FDR—depois reporting em **Power BI** com 50+ estruturas visuais.
- **Por que importa para arquitetos:** desenho de avaliação e métricas honestas antes de escalar features de IA em uma plataforma.""",
        ),
        n(
            "future_h2",
            "Future slide heading",
            "Título slide Futuro",
            "Future – Cloud Architecture, Digitization & Global Delivery",
            "Futuro – Arquitetura cloud, digitalização e entrega global",
        ),
        n(
            "future_intro",
            "Future intro",
            "Introdução slide Futuro",
            "**Cloud platforms, digitization, and evidence** meet in how I want to grow as a Digital Solution Architect. The diagram below is the agile/research operating context I already work in.",
            "**Plataformas cloud, digitalização e evidência** se encontram em como quero crescer como Arquiteto de Soluções Digitais. O diagrama abaixo é o contexto ágil/pesquisa em que já atuo.",
        ),
        n(
            "future_diagram_alt",
            "Future diagram alt text",
            "Texto alt diagrama Futuro",
            "Diagram ai-agile-research: AI and Agile in Applied Research",
            "Diagrama ai-agile-research: IA e Ágil em Pesquisa Aplicada",
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
            "I connect digitization experience, analytics pipelines, and Applied Research gates into **solution architecture** that global teams can operate—measured by outcomes, not slideware.",
            "Conecto experiência de digitalização, pipelines analíticos e gates de Pesquisa Aplicada em **arquitetura de soluções** que times globais operam—medida por resultados, não por slides.",
        ),
    ]
    rows.extend(narr)
    write("narratives.csv", rows)


def ensure_folders() -> None:
    resume_dir = ROOT / "resume" / "variants" / VARIANT
    resume_dir.mkdir(parents=True, exist_ok=True)
    src = ROOT / "resume" / "variants" / "data-analyst" / "main.typ"
    dst = resume_dir / "main.typ"
    text = src.read_text(encoding="utf-8")
    text = text.replace(
        "RESUME LAYOUT — Data Analyst variant entry.",
        "RESUME LAYOUT — Digital Solution Architect variant entry.",
    )
    dst.write_text(text, encoding="utf-8")
    print(f"wrote {dst.relative_to(ROOT)}")

    port_dir = ROOT / "portfolio" / "variants" / VARIANT
    port_dir.mkdir(parents=True, exist_ok=True)
    print(f"ensured {port_dir.relative_to(ROOT)}")

    out_dir = ROOT / "output" / VARIANT
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"ensured {out_dir.relative_to(ROOT)}")


def main() -> None:
    upsert_field_labels()
    upsert_skills()
    upsert_bullets()
    upsert_titles()
    upsert_narratives()
    ensure_folders()
    print("seed complete:", VARIANT)


if __name__ == "__main__":
    main()
