#!/usr/bin/env python3
"""One-time patch for PT narrative and education translations."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / "my-data" / "canonical"
SCRIPTS = Path(__file__).resolve().parent
import sys

if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
from patch_pt_first_person import (  # noqa: E402
    BULLET_PT,
    PRESENT_TABLE_PT,
    PROFILE_PT,
    TOOLING_BULLET_PT,
)

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
    ("general", "present_table"): PRESENT_TABLE_PT["general"],
    ("product-owner", "present_table"): PRESENT_TABLE_PT["product-owner"],
    ("general", "tooling_bullet"): TOOLING_BULLET_PT["general"],
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
        if key[1] == "profile" and key[0] in PROFILE_PT:
            row["text_pt"] = PROFILE_PT[key[0]]

    with nar_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)
    print(f"patched {len(PT_NARRATIVES)} narrative fields in {nar_path.name}")

    bullets_path = CANON / "experience_bullets.csv"
    bullets = list(csv.DictReader(bullets_path.open(encoding="utf-8", newline="")))
    for row in bullets:
        key = (row["experience_id"], row["variant"], int(row["sort_order"]))
        if key in BULLET_PT:
            row["text_pt"] = BULLET_PT[key]
    with bullets_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=bullets[0].keys(), quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(bullets)
    print(f"patched {len(BULLET_PT)} bullet fields in {bullets_path.name}")

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
