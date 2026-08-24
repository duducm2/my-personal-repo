#!/usr/bin/env python3
"""One-time patch for PT narrative and education translations."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"

PT_NARRATIVES: dict[tuple[str, str], str] = {
    ("general", "why_bullets"): (
        "- Acredito que software em organizações de serviço deve ser **confiável, utilizável e útil**, "
        "especialmente quando afeta pessoas reais e negócios.\n"
        "- Meu trabalho centra **tecnologia**, **gestão de projetos** e **Pesquisa Aplicada**: "
        "trazendo evidência e necessidades dos usuários para como construímos e entregamos.\n"
        "- Este portfólio percorre essa história."
    ),
    ("product-owner", "why_bullets"): (
        "- Acredito que produtos em organizações de serviço devem ser **confiáveis, utilizáveis e úteis**, "
        "especialmente quando afetam pessoas reais e negócios.\n"
        "- Meu trabalho conecta **necessidades de stakeholders**, **priorização** e **Pesquisa Aplicada**: "
        "trazendo evidência sobre o que construímos, por quê e em qual ordem.\n"
        "- Este portfólio mostra esse caminho descoberta → entrega por meio de projetos reais."
    ),
    ("general", "present_table"): (
        "| Área                               | Conquista                                                                                                                        |\n"
        "| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |\n"
        "| Cargo                               | Pesquisa Aplicada e Tecnologia – Bosch Brasil (mai 2023 – atual); Especialista em Pesquisa Aplicada e Project Champion na GS/BDU            |\n"
        "| Internacional                      | Duas viagens à Alemanha (2024, 2025) por trabalho relacionado ao cargo                                                                            |\n"
        "| Rastreamento CO2 (GS/Pesquisa Aplicada) | Prospecção de mercado para telemetria CO2; achado: falta de demanda de mercado                                                               |\n"
        "| Projeto tooling (PT)               | Liderança na entrega técnica e gestão do projeto de requisitos a protótipos de alta fidelidade, com check-ins regulares com clientes. |\n"
        "| Maturidade em Pesquisa Aplicada          | Liderança das Américas ao Nível 4 – governança, templates, treinamento                                                                          |\n"
        "| CIP + Pesquisa Aplicada             | Integração ao ServiceNow CIM; gate de Pesquisa Aplicada no fluxo CIP                                                         |\n"
        "| Colaboração                      | Tutor de estudantes da Digital Talent Academy                                                                                           |"
    ),
    ("product-owner", "present_table"): (
        "| Área                               | Conquista                                                                                                                       |\n"
        "| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |\n"
        "| Cargo (oficial)                    | Analista de Pesquisa Aplicada e Design – Bosch Brasil (mai 2023 – atual); Especialista em Pesquisa Aplicada e Project Champion na GS/BDU       |\n"
        "| Internacional                      | Duas viagens à Alemanha (2024, 2025) por trabalho relacionado ao cargo                                                                           |\n"
        "| Rastreamento CO2 (GS/Pesquisa Aplicada) | Prospecção de mercado para telemetria CO2; achado: falta de demanda — resultado de descoberta que interrompeu trabalho de baixo valor            |\n"
        "| Projeto tooling (PT)               | Requisitos → protótipos de alta fidelidade → **check-ins regulares com clientes**; ownership descoberta→entrega com parceiros técnicos |\n"
        "| Maturidade em Pesquisa Aplicada          | Nível 4 nas Américas – governança, templates, treinamento que **produtizaram** a prática de pesquisa para stakeholders                        |\n"
        "| CIP + Pesquisa Aplicada             | Integração ServiceNow CIM; Pesquisa Aplicada como **gate de entrada / qualidade** para o trabalho certo avançar                           |\n"
        "| Colaboração                      | Tutor de estudantes da Digital Talent Academy                                                                                          |"
    ),
    ("general", "tooling_bullet"): (
        "- **Projeto tooling para PT:** Liderança na **entrega técnica e gestão do projeto** "
        "de requisitos a protótipos de alta fidelidade, com **check-ins regulares com clientes**."
    ),
    ("product-owner", "tooling_bullet"): (
        "- **Projeto tooling para PT:** Conduzi o caminho de **requisitos** a **protótipos de alta fidelidade**, "
        "com **check-ins regulares com clientes** — validação com stakeholders integrada à entrega."
    ),
    ("general", "future_h2"): "Futuro",
    ("general", "future_diagram_alt"): (
        "Diagrama ai-agile-research: IA e Ágil em Pesquisa Aplicada, papel AI Scrum Master"
    ),
    ("product-owner", "future_diagram_alt"): (
        "Diagrama ai-agile-research: IA e Ágil em Pesquisa Aplicada"
    ),
    ("general", "future_career_body"): (
        "## Futuro – Aspirações de Carreira, Tipos de Vaga e Caminhos Priorizados para Liderança\n\n"
        '<div class="future-career-wrap">\n'
        '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" '
        'alt="Diagrama future-career-path: Caminhos priorizados para liderança, incluindo AI Scrum Master" /></p>\n'
        "</div>"
    ),
    ("product-owner", "future_career_body"): (
        "## Futuro – Como Trabalho\n\n"
        "- **O que trago:** descoberta → protótipos → check-ins com stakeholders; gates de entrada/qualidade; métricas de resultado (CSI/NPS).\n\n"
        '<div class="future-career-wrap">\n'
        '<div class="future-po-bullets">\n\n'
        "| Competência              | Evidência do meu trabalho                                     |\n"
        "| ----------------------- | --------------------------------------------------------- |\n"
        "| Descoberta e validação  | Tooling PT requisitos → protótipos → check-ins com clientes |\n"
        "| Priorização / entrada | Gate de Pesquisa Aplicada no CIP ServiceNow                   |\n"
        "| Habilitação de stakeholders  | Nível 4 de Maturidade em Pesquisa nas Américas (templates, treinamento)  |\n"
        "| Ownership de resultados       | CSI 4,86 / NPS 9,94 méd. (2024–2025)                      |\n\n"
        "</div>\n"
        '<p><img src="{{canonical:asset_prefix}}pictures/diagrams/future-career-path.png" '
        'alt="Diagrama future-career-path: Caminhos de carreira priorizados" /></p>\n'
        "</div>"
    ),
}


def main() -> None:
    nar_path = CANON / "narratives.csv"
    rows = list(csv.DictReader(nar_path.open(encoding="utf-8", newline="")))
    for row in rows:
        key = (row["variant"], row["field"])
        if key in PT_NARRATIVES:
            row["text_pt"] = PT_NARRATIVES[key]

    with nar_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)
    print(f"patched {len(PT_NARRATIVES)} narrative fields in {nar_path.name}")

    edu_path = CANON / "education.csv"
    edu = list(csv.DictReader(edu_path.open(encoding="utf-8", newline="")))
    fixes = {
        "1": {
            "degree_pt": "Mestrado em Tecnologia:",
            "institution_pt": "Sist. de Info. e Comunicação. Unicamp (2023–2026, conclusão em setembro de 2026).",
        },
        "2": {
            "degree_pt": "Análise e Desenvolvimento de Sistemas.",
            "institution_pt": "Unicamp (2015–2020).",
        },
        "3": {
            "degree_pt": "Técnico em Informática.",
            "institution_pt": "ETEC Bento Quirino (2012–2014).",
        },
    }
    for row in edu:
        if row["sort_order"] in fixes:
            row.update(fixes[row["sort_order"]])

    with edu_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=edu[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(edu)
    print(f"polished education PT in {edu_path.name}")


if __name__ == "__main__":
    main()
