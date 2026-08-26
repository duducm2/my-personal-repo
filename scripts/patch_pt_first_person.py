#!/usr/bin/env python3
"""Patch canonical CSVs for PT first-person voice."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"

PROFILE_PT = {
    "general": (
        "Sou pesquisador de UX e qualidade de software e **ajudo** equipes a construir "
        "**soluções centradas no usuário** por meio de **Pesquisa Aplicada, tecnologia e gestão de projetos**. "
        "Formação full-stack e **mentalidade científica**. **Uso** dados, CIP e **IA agêntica** no dia a dia. "
        "**Autodirigido e proativo** em design, front-end, Power BI e Python. "
        "Mestrado em Tecnologia (**conclusão em setembro de 2026**) com **nota A em todas as disciplinas**. "
        "**Aspiro** a **AI Scrum Master**."
    ),
    "product-owner": (
        "**Conecto descoberta à entrega**: **esclareço** necessidades, **alinho** stakeholders e **guio** soluções "
        "de requisitos à validação. Background em **Pesquisa Aplicada, UX e entrega de projetos** com base full-stack. "
        "**Uso** dados, CIP e **check-ins com clientes** para priorizar resultados. "
        "Mestrado em Tecnologia (**conclusão em setembro de 2026**) com **nota A em todas as disciplinas**."
    ),
}

PRESENT_TABLE_PT = {
    "general": (
        "| Área                               | Conquista                                                                                                                        |\n"
        "| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n"
        "| Cargo                               | Pesquisa Aplicada e Tecnologia – Bosch Brasil (jan 2023 – atual); Especialista em Pesquisa Aplicada e Project Champion na GS/BDU            |\n"
        "| Internacional                      | Realizei duas viagens à Alemanha (2024, 2025) por trabalho relacionado ao cargo                                                                            |\n"
        "| Rastreamento CO2 (GS/Pesquisa Aplicada) | Conduzi prospecção de mercado para telemetria CO2; achado: falta de demanda de mercado                                                               |\n"
        "| Projeto tooling (PT)               | **Liderei** a entrega técnica e gestão do projeto de requisitos a protótipos de alta fidelidade, com check-ins regulares com clientes. |\n"
        "| Maturidade em UX          | **Liderei** as Américas ao Nível 4 – governança, templates, treinamento                                                                          |\n"
        "| CIP + Pesquisa Aplicada             | **Integrei** ao ServiceNow CIM; gate de Pesquisa Aplicada no fluxo CIP                                                         |\n"
        "| Colaboração                      | Sou tutor de estudantes da Digital Talent Academy                                                                                           |"
    ),
    "product-owner": (
        "| Área                               | Conquista                                                                                                                       |\n"
        "| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |\n"
        "| Cargo (oficial)                    | Analista de Pesquisa Aplicada e Design – Bosch Brasil (jan 2023 – atual); Especialista em Pesquisa Aplicada e Project Champion na GS/BDU       |\n"
        "| Internacional                      | Realizei duas viagens à Alemanha (2024, 2025) por trabalho relacionado ao cargo                                                                           |\n"
        "| Rastreamento CO2 (GS/Pesquisa Aplicada) | Conduzi prospecção de mercado para telemetria CO2; achado: falta de demanda — resultado de descoberta que interrompeu trabalho de baixo valor            |\n"
        "| Projeto tooling (PT)               | Conduzi de requisitos a protótipos de alta fidelidade com **check-ins regulares com clientes**; ownership descoberta→entrega com parceiros técnicos |\n"
        "| Maturidade em UX          | Apoiei as Américas a atingir Nível 4 – governança, templates, treinamento que **produtizaram** a prática de UX para stakeholders                        |\n"
        "| CIP + Pesquisa Aplicada             | **Integrei** ServiceNow CIM; Pesquisa Aplicada como **gate de entrada / qualidade** para o trabalho certo avançar                           |\n"
        "| Colaboração                      | Sou tutor de estudantes da Digital Talent Academy                                                                                          |"
    ),
}

TOOLING_BULLET_PT = {
    "general": (
        "- **Projeto tooling para PT:** **Liderei** a **entrega técnica e gestão do projeto** "
        "de requisitos a protótipos de alta fidelidade, com **check-ins regulares com clientes**."
    ),
}

BULLET_PT: dict[tuple[str, str, int], str] = {
    ("bosch-ar-2023", "general", 2): (
        "Integrei CIP + Pesquisa no **ServiceNow**; adicionei gate de Pesquisa no fluxo; "
        "gate de qualidade **orientado por método**."
    ),
    ("bosch-ar-2023", "general", 3): (
        "**Projeto tooling (Power Tools):** apoiei a entrega técnica e gestão do projeto "
        "de requisitos a protótipos de alta fidelidade; check-ins regulares com clientes."
    ),
    ("bosch-ar-2023", "general", 4): (
        "Desenvolvi dashboards Power BI para acompanhamento de projetos/recursos e treinamentos."
    ),
    ("bosch-ar-2023", "general", 5): (
        "**IA agêntica:** uso diário com **Cursor IDE** e gestão de contexto para pesquisa, análise "
        "e resolução de problemas. Entrego Pesquisa Aplicada com eficiência no pipeline e artefatos."
    ),
    ("bosch-web-2020", "general", 1): (
        "Atuei em desenvolvimento front-end, React, Scrum, Kanban e Pesquisa Aplicada; "
        "soluções web e entrega em equipe."
    ),
    ("bosch-web-2020", "general", 2): (
        "Colaborei em aplicações para clientes e ferramentas internas."
    ),
    ("bosch-hu-2019", "general", 1): (
        "Digitalizei fluxos Business Excellence em **Kanban**; ferramentas e fluxos internos."
    ),
    ("bosch-hu-2019", "general", 2): (
        "Atuei em **desenvolvimento web full-stack:** VS Code, SQL Server, Windows Server (IIS)."
    ),
    ("bosch-intern-2017", "general", 1): (
        "Desenvolvi automações VBA (Excel) para Melhoria Contínua e comunicação interna."
    ),
    ("bosch-web-2020", "product-owner", 1): (
        "Entreguei soluções web internas e para clientes em **Scrum e Kanban**; "
        "colaborei com design, pesquisa e engenharia."
    ),
    ("bosch-intern-2017", "product-owner", 1): (
        "Desenvolvi ferramentas VBA para Melhoria Contínua e comunicação interna."
    ),
}


def patch_narratives() -> None:
    path = CANON / "narratives.csv"
    rows = list(csv.DictReader(path.open(encoding="utf-8", newline="")))
    for row in rows:
        key = (row["variant"], row["field"])
        if key[1] == "profile" and key[0] in PROFILE_PT:
            row["text_pt"] = PROFILE_PT[key[0]]
        elif key[1] == "present_table" and key[0] in PRESENT_TABLE_PT:
            row["text_pt"] = PRESENT_TABLE_PT[key[0]]
        elif key == ("general", "tooling_bullet"):
            row["text_pt"] = TOOLING_BULLET_PT["general"]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)
    print(
        f"patched narratives.csv ({len(PROFILE_PT) + len(PRESENT_TABLE_PT) + 1} fields)"
    )


def patch_bullets() -> None:
    path = CANON / "experience_bullets.csv"
    rows = list(csv.DictReader(path.open(encoding="utf-8", newline="")))
    for row in rows:
        key = (row["experience_id"], row["variant"], int(row["sort_order"]))
        if key in BULLET_PT:
            row["text_pt"] = BULLET_PT[key]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)
    print(f"patched experience_bullets.csv ({len(BULLET_PT)} bullets)")


def main() -> None:
    patch_narratives()
    patch_bullets()


if __name__ == "__main__":
    main()
