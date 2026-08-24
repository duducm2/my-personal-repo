#!/usr/bin/env python3
"""Migrate canonical CSVs to bilingual label columns (_en / _pt) and add schema + field_labels."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
from patch_pt_first_person import (  # noqa: E402
    BULLET_PT,
    PRESENT_TABLE_PT,
    PROFILE_PT,
    TOOLING_BULLET_PT,
)


def write_csv(name: str, fieldnames: list[str], rows: list[dict]) -> None:
    path = CANON / name
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        for row in rows:
            w.writerow(row)
    print(f"wrote {path.relative_to(ROOT)} ({len(rows)} rows)")


def read_csv(name: str) -> list[dict[str, str]]:
    with (CANON / name).open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def main() -> None:
    # --- schema.csv: bilingual column labels for every data file ---
    schema_rows = [
        # profile.csv
        ("profile.csv", "full_name", "Full name", "Nome completo"),
        ("profile.csv", "display_name", "Display name", "Nome de exibição"),
        ("profile.csv", "phone", "Phone", "Telefone"),
        ("profile.csv", "email", "Email", "E-mail"),
        (
            "profile.csv",
            "linkedin_label_en",
            "LinkedIn label (EN)",
            "Rótulo LinkedIn (EN)",
        ),
        (
            "profile.csv",
            "linkedin_label_pt",
            "LinkedIn label (PT)",
            "Rótulo LinkedIn (PT)",
        ),
        ("profile.csv", "linkedin_url", "LinkedIn URL", "URL LinkedIn"),
        ("profile.csv", "lattes_label_en", "Lattes label (EN)", "Rótulo Lattes (EN)"),
        ("profile.csv", "lattes_label_pt", "Lattes label (PT)", "Rótulo Lattes (PT)"),
        ("profile.csv", "lattes_url", "Lattes URL", "URL Lattes"),
        ("profile.csv", "orcid_label_en", "ORCID label (EN)", "Rótulo ORCID (EN)"),
        ("profile.csv", "orcid_label_pt", "ORCID label (PT)", "Rótulo ORCID (PT)"),
        ("profile.csv", "orcid_url", "ORCID URL", "URL ORCID"),
        ("profile.csv", "location_en", "Location (EN)", "Localização (EN)"),
        ("profile.csv", "location_pt", "Location (PT)", "Localização (PT)"),
        ("profile.csv", "languages_en", "Languages (EN)", "Idiomas (EN)"),
        ("profile.csv", "languages_pt", "Languages (PT)", "Idiomas (PT)"),
        # experience.csv
        ("experience.csv", "id", "Experience ID", "ID da experiência"),
        ("experience.csv", "sort_order", "Sort order", "Ordem"),
        ("experience.csv", "start_date", "Start date", "Data início"),
        ("experience.csv", "end_date", "End date", "Data fim"),
        (
            "experience.csv",
            "date_display_en",
            "Date display (EN)",
            "Período exibido (EN)",
        ),
        (
            "experience.csv",
            "date_display_pt",
            "Date display (PT)",
            "Período exibido (PT)",
        ),
        ("experience.csv", "company", "Company", "Empresa"),
        ("experience.csv", "title_en", "Job title (EN)", "Cargo (EN)"),
        ("experience.csv", "title_pt", "Job title (PT)", "Cargo (PT)"),
        # experience_bullets.csv
        (
            "experience_bullets.csv",
            "experience_id",
            "Experience ID",
            "ID da experiência",
        ),
        ("experience_bullets.csv", "variant", "Variant", "Variante"),
        ("experience_bullets.csv", "sort_order", "Sort order", "Ordem"),
        ("experience_bullets.csv", "text_en", "Bullet text (EN)", "Texto do item (EN)"),
        ("experience_bullets.csv", "text_pt", "Bullet text (PT)", "Texto do item (PT)"),
        # skills.csv
        ("skills.csv", "variant", "Variant", "Variante"),
        ("skills.csv", "category", "Category key", "Chave da categoria"),
        (
            "skills.csv",
            "category_label_en",
            "Category label (EN)",
            "Rótulo da categoria (EN)",
        ),
        (
            "skills.csv",
            "category_label_pt",
            "Category label (PT)",
            "Rótulo da categoria (PT)",
        ),
        ("skills.csv", "sort_order", "Sort order", "Ordem"),
        ("skills.csv", "label_en", "Skill label (EN)", "Rótulo da habilidade (EN)"),
        ("skills.csv", "label_pt", "Skill label (PT)", "Rótulo da habilidade (PT)"),
        # education.csv
        ("education.csv", "sort_order", "Sort order", "Ordem"),
        ("education.csv", "degree_en", "Degree (EN)", "Grau (EN)"),
        ("education.csv", "degree_pt", "Degree (PT)", "Grau (PT)"),
        ("education.csv", "institution_en", "Institution (EN)", "Instituição (EN)"),
        ("education.csv", "institution_pt", "Institution (PT)", "Instituição (PT)"),
        ("education.csv", "detail_en", "Detail (EN)", "Detalhe (EN)"),
        ("education.csv", "detail_pt", "Detail (PT)", "Detalhe (PT)"),
        # publications.csv
        ("publications.csv", "sort_order", "Sort order", "Ordem"),
        ("publications.csv", "venue_en", "Venue (EN)", "Veículo (EN)"),
        ("publications.csv", "venue_pt", "Venue (PT)", "Veículo (PT)"),
        ("publications.csv", "citation_en", "Citation (EN)", "Citação (EN)"),
        ("publications.csv", "citation_pt", "Citation (PT)", "Citação (PT)"),
        # additional.csv
        ("additional.csv", "sort_order", "Sort order", "Ordem"),
        ("additional.csv", "text_en", "Text (EN)", "Texto (EN)"),
        ("additional.csv", "text_pt", "Text (PT)", "Texto (PT)"),
        # projects.csv
        ("projects.csv", "id", "Project ID", "ID do projeto"),
        ("projects.csv", "name_en", "Name (EN)", "Nome (EN)"),
        ("projects.csv", "name_pt", "Name (PT)", "Nome (PT)"),
        ("projects.csv", "summary_en", "Summary (EN)", "Resumo (EN)"),
        ("projects.csv", "summary_pt", "Summary (PT)", "Resumo (PT)"),
        ("projects.csv", "csi", "CSI score", "Nota CSI"),
        ("projects.csv", "nps", "NPS score", "Nota NPS"),
        ("projects.csv", "notes_en", "Notes (EN)", "Observações (EN)"),
        ("projects.csv", "notes_pt", "Notes (PT)", "Observações (PT)"),
        # narratives.csv
        ("narratives.csv", "variant", "Variant", "Variante"),
        ("narratives.csv", "field", "Field key", "Chave do campo"),
        ("narratives.csv", "label_en", "Field label (EN)", "Rótulo do campo (EN)"),
        ("narratives.csv", "label_pt", "Field label (PT)", "Rótulo do campo (PT)"),
        ("narratives.csv", "text_en", "Text (EN)", "Texto (EN)"),
        ("narratives.csv", "text_pt", "Text (PT)", "Texto (PT)"),
    ]
    write_csv(
        "schema.csv",
        ["file", "column", "label_en", "label_pt"],
        [
            {"file": f, "column": c, "label_en": le, "label_pt": lp}
            for f, c, le, lp in schema_rows
        ],
    )

    # --- field_labels.csv: bilingual labels for keys/enums ---
    field_label_rows = [
        ("variant", "general", "General", "Geral"),
        ("variant", "product-owner", "Discovery & delivery", "Descoberta e entrega"),
        ("skill_category", "Core", "Core", "Núcleo"),
        ("skill_category", "Tech", "Tech", "Tecnologias"),
        ("narrative_field", "tagline", "Tagline", "Linha de apresentação"),
        ("narrative_field", "profile", "Profile summary", "Resumo do perfil"),
        ("narrative_field", "deck_title", "Deck title", "Título do portfólio"),
        ("narrative_field", "why_h1", "Why slide heading", "Título slide Por quê"),
        (
            "narrative_field",
            "why_h2",
            "Why slide subheading",
            "Subtítulo slide Por quê",
        ),
        (
            "narrative_field",
            "why_bullets",
            "Why slide bullets",
            "Tópicos slide Por quê",
        ),
        ("narrative_field", "who_role", "Who slide role", "Papel slide Quem sou"),
        ("narrative_field", "who_impact", "Who slide impact", "Impacto slide Quem sou"),
        (
            "narrative_field",
            "present_h2",
            "Present slide heading",
            "Título slide Presente",
        ),
        (
            "narrative_field",
            "present_table",
            "Present achievements table",
            "Tabela de conquistas",
        ),
        (
            "narrative_field",
            "cip_pipeline_h2",
            "CIP pipeline heading",
            "Título pipeline CIP",
        ),
        (
            "narrative_field",
            "relevance_h2",
            "Relevance model heading",
            "Título modelo de relevância",
        ),
        ("narrative_field", "csi_h2", "CSI/NPS heading", "Título CSI/NPS"),
        (
            "narrative_field",
            "tooling_h2",
            "Tooling project heading",
            "Título projeto tooling",
        ),
        ("narrative_field", "tooling_bullet", "Tooling bullet", "Item projeto tooling"),
        ("narrative_field", "future_h2", "Future slide heading", "Título slide Futuro"),
        ("narrative_field", "future_intro", "Future intro", "Introdução slide Futuro"),
        (
            "narrative_field",
            "future_diagram_alt",
            "Future diagram alt text",
            "Texto alt diagrama Futuro",
        ),
        (
            "narrative_field",
            "future_career_body",
            "Future career body",
            "Corpo slide carreira",
        ),
        (
            "narrative_field",
            "future_career_style",
            "Future career CSS",
            "CSS slide carreira",
        ),
        (
            "narrative_field",
            "closing_summary",
            "Closing summary",
            "Resumo de encerramento",
        ),
    ]
    field_labels = {(domain, key): (le, lp) for domain, key, le, lp in field_label_rows}
    write_csv(
        "field_labels.csv",
        ["domain", "key", "label_en", "label_pt"],
        [
            {"domain": d, "key": k, "label_en": le, "label_pt": lp}
            for d, k, le, lp in field_label_rows
        ],
    )

    cat_labels = (
        field_labels[("skill_category", "Core")],
        field_labels[("skill_category", "Tech")],
    )

    # --- profile.csv ---
    p = read_csv("profile.csv")[0]
    write_csv(
        "profile.csv",
        [
            "full_name",
            "display_name",
            "phone",
            "email",
            "linkedin_label_en",
            "linkedin_label_pt",
            "linkedin_url",
            "lattes_label_en",
            "lattes_label_pt",
            "lattes_url",
            "orcid_label_en",
            "orcid_label_pt",
            "orcid_url",
            "location_en",
            "location_pt",
            "languages_en",
            "languages_pt",
        ],
        [
            {
                "full_name": p["full_name"],
                "display_name": p["display_name"],
                "phone": p["phone"],
                "email": p["email"],
                "linkedin_label_en": p.get(
                    "linkedin_label_en", p.get("linkedin_label", "LinkedIn")
                ),
                "linkedin_label_pt": p.get("linkedin_label_pt", "LinkedIn"),
                "linkedin_url": p["linkedin_url"],
                "lattes_label_en": p.get(
                    "lattes_label_en", p.get("lattes_label", "Lattes")
                ),
                "lattes_label_pt": p.get("lattes_label_pt", "Lattes"),
                "lattes_url": p["lattes_url"],
                "orcid_label_en": p.get(
                    "orcid_label_en", p.get("orcid_label", "ORCID")
                ),
                "orcid_label_pt": p.get("orcid_label_pt", "ORCID"),
                "orcid_url": p["orcid_url"],
                "location_en": p.get("location_en", p.get("location", "")),
                "location_pt": p.get(
                    "location_pt",
                    p.get("location_en", p.get("location", "")).replace(
                        "Brazil", "Brasil"
                    ),
                ),
                "languages_en": p.get("languages_en", p.get("languages", "")),
                "languages_pt": p.get(
                    "languages_pt", "Português (Nativo)   Inglês (Fluente)"
                ),
            }
        ],
    )

    # --- experience.csv ---
    title_pt_map = {
        "Applied Research & Design Analyst": "Analista de Pesquisa Aplicada e Design",
        "Web Developer": "Desenvolvedor Web",
        "Digitization Support Analyst": "Analista de Suporte à Digitalização",
        "Intern": "Estagiário",
    }
    date_pt_map = {
        "May 2023 – Present": "Mai 2023 – Atual",
        "Jan 2020 – Nov 2023": "Jan 2020 – Nov 2023",
        "Jan 2019 – Dec 2019": "Jan 2019 – Dez 2019",
        "Jan 2017 – Nov 2018": "Jan 2017 – Nov 2018",
    }
    write_csv(
        "experience.csv",
        [
            "id",
            "sort_order",
            "start_date",
            "end_date",
            "date_display_en",
            "date_display_pt",
            "company",
            "title_en",
            "title_pt",
        ],
        [
            {
                "id": r["id"],
                "sort_order": r["sort_order"],
                "start_date": r["start_date"],
                "end_date": r["end_date"],
                "date_display_en": r.get("date_display_en", r.get("date_display", "")),
                "date_display_pt": r.get(
                    "date_display_pt",
                    date_pt_map.get(
                        r.get("date_display_en", r.get("date_display", "")), ""
                    ),
                ),
                "company": r["company"],
                "title_en": r.get("title_en", r.get("title", "")),
                "title_pt": r.get(
                    "title_pt",
                    title_pt_map.get(
                        r.get("title_en", r.get("title", "")), r.get("title", "")
                    ),
                ),
            }
            for r in read_csv("experience.csv")
        ],
    )

    # --- experience_bullets.csv --- PT translations keyed by (experience_id, variant, sort_order)
    bullet_pt: dict[tuple[str, str, int], str] = {
        (
            "bosch-ar-2023",
            "general",
            1,
        ): "Apoiei as Américas a atingir **Nível 4 de Maturidade em Pesquisa na Global Services**: governança, templates, treinamento. **CSI 4,86 / NPS 9,94** méd. nos meus projetos (2024–2025).",
        (
            "bosch-ar-2023",
            "general",
            2,
        ): "Integração CIP + Pesquisa no **ServiceNow**; gate de Pesquisa no fluxo; gate de qualidade **orientado por método**.",
        (
            "bosch-ar-2023",
            "general",
            3,
        ): "**Projeto tooling (Power Tools):** apoio à entrega técnica e gestão do projeto de requisitos a protótipos de alta fidelidade; check-ins regulares com clientes.",
        (
            "bosch-ar-2023",
            "general",
            4,
        ): "Dashboards Power BI para acompanhamento de projetos/recursos e treinamentos.",
        (
            "bosch-ar-2023",
            "general",
            5,
        ): "**IA agêntica:** uso diário com **Cursor IDE** e gestão de contexto para pesquisa, análise e resolução de problemas.",
        (
            "bosch-ar-2023",
            "general",
            6,
        ): "**Internacional e mentoria:** duas viagens à Alemanha (2024, 2025); tutor na SENAI Digital Talent Academy.",
        (
            "bosch-web-2020",
            "general",
            1,
        ): "Desenvolvimento front-end, React, Scrum, Kanban, Pesquisa Aplicada; soluções web e entrega em equipe.",
        (
            "bosch-web-2020",
            "general",
            2,
        ): "Colaboração em aplicações para clientes e ferramentas internas.",
        (
            "bosch-hu-2019",
            "general",
            1,
        ): "Digitalização Business Excellence em **Kanban**; ferramentas e fluxos internos.",
        (
            "bosch-hu-2019",
            "general",
            2,
        ): "**Desenvolvimento web full-stack:** VS Code, SQL Server, Windows Server (IIS).",
        (
            "bosch-intern-2017",
            "general",
            1,
        ): "VBA (Excel) para Melhoria Contínua e comunicação interna.",
        (
            "bosch-ar-2023",
            "product-owner",
            1,
        ): "**Projeto tooling (Power Tools):** conduzi o caminho de requisitos a protótipos de alta fidelidade; **check-ins regulares** com clientes e coordenação com parceiros técnicos.",
        (
            "bosch-ar-2023",
            "product-owner",
            2,
        ): "Integrei Pesquisa Aplicada ao **CIP / ServiceNow** como gate de entrada e qualidade—triagem orientada por método.",
        (
            "bosch-ar-2023",
            "product-owner",
            3,
        ): "Apoiei as Américas a atingir **Nível 4 de Maturidade em Pesquisa**: governança, templates e treinamento que **produtizaram** a prática de pesquisa.",
        (
            "bosch-ar-2023",
            "product-owner",
            4,
        ): "Evidência de resultados: **CSI 4,86 / NPS 9,94** méd. (2024–2025); Power BI para projetos e recursos.",
        (
            "bosch-ar-2023",
            "product-owner",
            5,
        ): "**Internacional e mentoria:** duas viagens à Alemanha (2024, 2025); tutor na SENAI Digital Talent Academy.",
        (
            "bosch-web-2020",
            "product-owner",
            1,
        ): "Entreguei soluções web internas e para clientes em **Scrum e Kanban**; colaboração entre design, pesquisa e engenharia.",
        (
            "bosch-web-2020",
            "product-owner",
            2,
        ): "Traduzi necessidades em incrementos front-end (React) com entrega em equipe.",
        (
            "bosch-hu-2019",
            "product-owner",
            1,
        ): "Digitalizei fluxos Business Excellence em **Kanban**—esclarecendo necessidades e entregando ferramentas internas.",
        (
            "bosch-hu-2019",
            "product-owner",
            2,
        ): "**Desenvolvimento web full-stack:** VS Code, SQL Server, Windows Server (IIS).",
        (
            "bosch-intern-2017",
            "product-owner",
            1,
        ): "Ferramentas VBA para Melhoria Contínua e comunicação interna.",
    }
    bullet_pt.update(BULLET_PT)
    write_csv(
        "experience_bullets.csv",
        ["experience_id", "variant", "sort_order", "text_en", "text_pt"],
        [
            {
                "experience_id": b["experience_id"],
                "variant": b["variant"],
                "sort_order": b["sort_order"],
                "text_en": b.get("text_en", b.get("text", "")),
                "text_pt": b.get(
                    "text_pt",
                    bullet_pt.get(
                        (b["experience_id"], b["variant"], int(b["sort_order"])),
                        b.get("text_en", b.get("text", "")),
                    ),
                ),
            }
            for b in read_csv("experience_bullets.csv")
        ],
    )

    # --- skills.csv ---
    skill_pt_map = {
        "Applied Research": "Pesquisa Aplicada",
        "Project Management": "Gestão de Projetos",
        "Continuous Improvement (CIP)": "Melhoria Contínua (CIP)",
        "AI Systems": "Sistemas de IA",
        "Product discovery": "Descoberta de produto",
        "Stakeholder alignment": "Alinhamento de stakeholders",
        "Prioritization & outcomes": "Priorização e resultados",
        "Agile / CIP": "Ágil (Scrum / Kanban) / CIP",
    }
    write_csv(
        "skills.csv",
        [
            "variant",
            "category",
            "category_label_en",
            "category_label_pt",
            "sort_order",
            "label_en",
            "label_pt",
        ],
        [
            {
                "variant": s["variant"],
                "category": s["category"],
                "category_label_en": s.get(
                    "category_label_en",
                    "Core" if s["category"] == "Core" else "Tech",
                ),
                "category_label_pt": s.get(
                    "category_label_pt",
                    "Núcleo" if s["category"] == "Core" else "Tecnologias",
                ),
                "sort_order": s["sort_order"],
                "label_en": s.get("label_en", s.get("label", "")),
                "label_pt": s.get(
                    "label_pt",
                    skill_pt_map.get(
                        s.get("label_en", s.get("label", "")),
                        s.get("label_en", s.get("label", "")),
                    ),
                ),
            }
            for s in read_csv("skills.csv")
        ],
    )

    # --- education.csv ---
    write_csv(
        "education.csv",
        [
            "sort_order",
            "degree_en",
            "degree_pt",
            "institution_en",
            "institution_pt",
            "detail_en",
            "detail_pt",
        ],
        [
            {
                "sort_order": e["sort_order"],
                "degree_en": e.get("degree_en", e.get("degree", "")),
                "degree_pt": e.get(
                    "degree_pt",
                    e.get("degree_en", e.get("degree", ""))
                    .replace("Master's", "Mestrado")
                    .replace("Technology:", "em Tecnologia:")
                    .replace("Systems Analysis", "Análise de Sistemas")
                    .replace("Technical Degree", "Técnico"),
                ),
                "institution_en": e.get("institution_en", e.get("institution", "")),
                "institution_pt": e.get(
                    "institution_pt",
                    e.get("institution_en", e.get("institution", "")).replace(
                        "completing September 2026", "conclusão em setembro de 2026"
                    ),
                ),
                "detail_en": e.get("detail_en", e.get("detail", "")),
                "detail_pt": e.get(
                    "detail_pt",
                    (
                        "Dissertação: mensuração de **confiança percebida** em sites de e-commerce com plataforma digital (ISO/IEC 25000), experimentação, ML e validação humano vs **agente de IA**. Disciplinas (**nota A em todas**): Escrita Acadêmica, Pesquisa Científica, Inovação e Transferência de Tecnologia, Visualização da Informação."
                        if e["sort_order"] == "1"
                        and e.get("detail_en", e.get("detail", ""))
                        else e.get("detail_en", e.get("detail", ""))
                    ),
                ),
            }
            for e in read_csv("education.csv")
        ],
    )

    # --- publications, additional, projects ---
    write_csv(
        "publications.csv",
        ["sort_order", "venue_en", "venue_pt", "citation_en", "citation_pt"],
        [
            {
                "sort_order": r["sort_order"],
                "venue_en": r.get("venue_en", r.get("venue", "")),
                "venue_pt": r.get("venue_pt", r.get("venue_en", r.get("venue", ""))),
                "citation_en": r.get("citation_en", r.get("citation", "")),
                "citation_pt": r.get(
                    "citation_pt", r.get("citation_en", r.get("citation", ""))
                ),
            }
            for r in read_csv("publications.csv")
        ],
    )

    add_pt = {
        "1": "3º Lugar – Bosch Talent Forum 2018.",
        "2": "InfoVis: visualização web PhraseNets para análise de coocorrência de texto.",
        "3": "Voluntário – ONG Hospitalhaços (Admin).",
    }
    write_csv(
        "additional.csv",
        ["sort_order", "text_en", "text_pt"],
        [
            {
                "sort_order": r["sort_order"],
                "text_en": r.get("text_en", r.get("text", "")),
                "text_pt": r.get(
                    "text_pt",
                    add_pt.get(r["sort_order"], r.get("text_en", r.get("text", ""))),
                ),
            }
            for r in read_csv("additional.csv")
        ],
    )

    proj_pt = {
        "tooling-pt": (
            "EXT_M-PUR36 Tooling (Power Tools)",
            "Requisitos a protótipos de alta fidelidade com check-ins regulares com clientes.",
            "Principal evidência descoberta→entrega.",
        ),
        "cip-research-gate": (
            "Gate CIP + Pesquisa Aplicada ServiceNow",
            "Gate de qualidade/entrada no fluxo CIP; triagem Low/Medium/High.",
            "Evidência de priorização/entrada.",
        ),
        "maturity-l4": (
            "Nível 4 de Maturidade em Pesquisa – Américas",
            "Governança, templates e treinamento que produtizaram a prática de pesquisa.",
            "Habilitação de stakeholders.",
        ),
        "outcomes-2024-2025": (
            "Médias CSI/NPS dos projetos 2024–2025",
            "Média CSI 4,86 / NPS 9,94 nos projetos.",
            "Métrica de ownership de resultados.",
        ),
    }
    write_csv(
        "projects.csv",
        [
            "id",
            "name_en",
            "name_pt",
            "summary_en",
            "summary_pt",
            "csi",
            "nps",
            "notes_en",
            "notes_pt",
        ],
        [
            {
                "id": r["id"],
                "name_en": r.get("name_en", r.get("name", "")),
                "name_pt": r.get(
                    "name_pt",
                    proj_pt.get(r["id"], (r.get("name_en", r.get("name", "")), "", ""))[
                        0
                    ],
                ),
                "summary_en": r.get("summary_en", r.get("summary", "")),
                "summary_pt": r.get(
                    "summary_pt",
                    proj_pt.get(
                        r["id"], ("", r.get("summary_en", r.get("summary", "")), "")
                    )[1],
                ),
                "csi": r.get("csi", ""),
                "nps": r.get("nps", ""),
                "notes_en": r.get("notes_en", r.get("notes", "")),
                "notes_pt": r.get(
                    "notes_pt",
                    proj_pt.get(
                        r["id"], ("", "", r.get("notes_en", r.get("notes", "")))
                    )[2],
                ),
            }
            for r in read_csv("projects.csv")
        ],
    )

    # --- narratives.csv --- load PT from companion or generate inline
    narrative_pt = _load_narrative_pt_translations()
    narrative_pt.update(
        {
            ("general", "present_table"): PRESENT_TABLE_PT["general"],
            ("product-owner", "present_table"): PRESENT_TABLE_PT["product-owner"],
            ("general", "tooling_bullet"): TOOLING_BULLET_PT["general"],
        }
    )
    write_csv(
        "narratives.csv",
        ["variant", "field", "label_en", "label_pt", "text_en", "text_pt"],
        [
            {
                "variant": n["variant"],
                "field": n["field"],
                "label_en": field_labels.get(
                    ("narrative_field", n["field"]), (n["field"], n["field"])
                )[0],
                "label_pt": field_labels.get(
                    ("narrative_field", n["field"]), (n["field"], n["field"])
                )[1],
                "text_en": n.get("text_en", n.get("text", "")),
                "text_pt": n.get(
                    "text_pt",
                    narrative_pt.get(
                        (n["variant"], n["field"]), n.get("text_en", n.get("text", ""))
                    ),
                ),
            }
            for n in read_csv("narratives.csv")
        ],
    )

    print("Bilingual migration complete.")


def _load_narrative_pt_translations() -> dict[tuple[str, str], str]:
    """Portuguese narrative text keyed by (variant, field)."""
    return {
        ("general", "tagline"): "Pesquisa Aplicada, Tecnologia e Gestão de Projetos",
        (
            "product-owner",
            "tagline",
        ): "Descoberta, Entrega e Resultados com Stakeholders",
        ("general", "profile"): PROFILE_PT["general"],
        ("product-owner", "profile"): PROFILE_PT["product-owner"],
        ("general", "deck_title"): "Eduardo Figueiredo – Portfólio",
        ("product-owner", "deck_title"): "Eduardo Figueiredo – Portfólio",
        (
            "general",
            "why_h1",
        ): "Por que trabalho com Tecnologia, Gestão de Projetos e Pesquisa Aplicada",
        ("product-owner", "why_h1"): "Por que descoberta e entrega importam",
        (
            "general",
            "why_h2",
        ): "Software confiável e centrado no humano para serviços complexos",
        (
            "product-owner",
            "why_h2",
        ): "Da descoberta à entrega para produtos confiáveis e centrados no humano",
        ("general", "who_role"): "Pesquisa Aplicada, Tecnologia e Gestão de Projetos",
        (
            "product-owner",
            "who_role",
        ): "Descoberta, Entrega e Resultados com Stakeholders",
        ("general", "who_impact"): (
            "Ajudo equipes a governar melhor e melhorar mais rápido, usando Pesquisa Aplicada para priorizar, "
            "decidir e entregar com dados claros e accountability."
        ),
        ("product-owner", "who_impact"): (
            "Ajudo equipes a priorizar e entregar com clareza: Pesquisa Aplicada para decidir, alinhamento de stakeholders "
            "para comprometer e resultados mensuráveis para provar valor."
        ),
        (
            "general",
            "present_h2",
        ): "Presente – Pesquisa Aplicada e Tecnologia (Bosch Brasil)",
        (
            "product-owner",
            "present_h2",
        ): "Presente – Trabalho orientado a produto na Bosch Brasil",
        ("general", "csi_h2"): "Presente – Desempenho CSI e NPS (2024–2025)",
        (
            "product-owner",
            "csi_h2",
        ): "Presente – Evidência de resultados: CSI e NPS (2024–2025)",
        (
            "general",
            "cip_pipeline_h2",
        ): "Presente – Integração CIP e Pesquisa Aplicada: Pipeline metodológico",
        (
            "product-owner",
            "cip_pipeline_h2",
        ): "Presente – Gate de entrada CIP: Pipeline metodológico",
        ("general", "relevance_h2"): "Presente – Modelo de avaliação de relevância",
        (
            "product-owner",
            "relevance_h2",
        ): "Presente – Modelo de priorização (relevância Baixa / Média / Alta)",
        ("general", "tooling_h2"): "Implementação técnica – Projeto Tooling para PT",
        (
            "product-owner",
            "tooling_h2",
        ): "Descoberta → Entrega – Projeto Tooling para PT",
        ("product-owner", "future_h2"): "Futuro – Contexto de entrega ágil",
        ("product-owner", "future_intro"): (
            "**Descoberta, priorização e entrega** se encontram em como trabalho com equipes hoje. "
            "O diagrama abaixo é o contexto ágil/pesquisa em que atuo."
        ),
        ("general", "closing_summary"): (
            "Trago evidência de Pesquisa Aplicada, suporte tecnológico e entrega de projetos para ajudar equipes a construir soluções "
            "confiáveis, centradas no usuário, com dados claros, accountability e impacto mensurável."
        ),
        ("product-owner", "closing_summary"): (
            "Conecto descoberta à entrega: esclareço necessidades, alinho stakeholders, priorizo com evidência e valido resultados — "
            "criando produtos confiáveis, centrados no usuário, com impacto mensurável."
        ),
    }


if __name__ == "__main__":
    main()
