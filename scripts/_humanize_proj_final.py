# -*- coding: utf-8 -*-
import csv
from pathlib import Path

ROOT = Path("my-data/canonical")
path = ROOT / "projects.csv"

with path.open(encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

updates = {
    "agritech-iot-cattle": {
        "summary_detail_en": (
            "In AgriTech livestock work I looked for operational bottlenecks on cattle ranches "
            "and turned qualitative evidence into an IoT and software product strategy. "
            "Ranch work splits between breeders watching margins and cowboys running physical routines outdoors. "
            "I used Interpretative Phenomenological Analysis for those lived experiences and Grounded Theory "
            "across more than one hundred observations, quotes, and behaviors. "
            "Fieldwork included on-site ethnography, semi-structured interviews, and benchmarking at AgriShow Brazil. "
            "From that I built journey maps for owners versus cowboys, a Power BI insights hub, "
            "product-market fit checks, prototypes, and an MVP for cattle IoT telemetry."
        ),
        "summary_detail_pt": (
            "No trabalho AgriTech pecuário, busquei gargalos operacionais em fazendas "
            "e transformei evidência qualitativa em estratégia de produto IoT e software. "
            "O trabalho na fazenda se divide entre criadores atentos às margens e peões executando rotinas físicas no campo. "
            "Usei Análise Fenomenológica Interpretativa para essas experiências vividas e Teoria Fundamentada "
            "em mais de cem observações, falas e comportamentos. "
            "O campo incluiu etnografia in loco, entrevistas semiestruturadas e benchmarking na AgriShow Brasil. "
            "A partir disso construí mapas de jornada para donos e peões, um hub de insights em Power BI, "
            "checagens de product-market fit, protótipos e um MVP para telemetria bovina IoT."
        ),
    },
    "dissertation-trustmate-stats": {
        "summary_detail_en": (
            "For the TrustMate dissertation statistics track I built a full inferential pipeline. "
            "Shapiro-Wilk checks for normality; Welch and paired t-tests (Python/scipy) at attribute level; "
            "Cohen's d for effect size; Benjamini-Hochberg FDR across the family of tests; "
            "and descriptive stats (mean, SD, variance, SE, CI) in Power BI with 50+ visual structures. "
            "It pairs with the Information Visualization coursework: hypothesis testing and reporting "
            "that stay clear from sample to population."
        ),
        "summary_detail_pt": (
            "Na trilha estatística da dissertação TrustMate construí um pipeline inferencial completo. "
            "Checagens Shapiro-Wilk de normalidade; testes t de Welch e pareados (Python/scipy) por atributo; "
            "d de Cohen para tamanho de efeito; FDR de Benjamini-Hochberg na família de testes; "
            "e estatísticas descritivas (média, DP, variância, EE, IC) no Power BI com 50+ estruturas visuais. "
            "Isso se conecta à disciplina de Visualização da Informação: teste de hipóteses e reporte "
            "claros da amostra à população."
        ),
    },
}

n = 0
for row in rows:
    data = updates.get(row["id"])
    if data:
        row.update(data)
        n += 1

with path.open("w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
    w.writeheader()
    w.writerows(rows)

print(f"projects updated: {n}")
