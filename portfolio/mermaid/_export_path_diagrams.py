#!/usr/bin/env python3
"""Export path-specific future-career-path and method Mermaid diagrams."""
from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "pictures" / "diagrams"
VARIANT_DIRS = {
    "product-owner": ROOT
    / "portfolio"
    / "variants"
    / "product-owner"
    / "pictures"
    / "diagrams",
    "digital-solution-architect": ROOT
    / "portfolio"
    / "variants"
    / "digital-solution-architect"
    / "pictures"
    / "diagrams",
    "data-scientist": ROOT
    / "portfolio"
    / "variants"
    / "data-scientist"
    / "pictures"
    / "diagrams",
}

INIT = (
    "%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', "
    "'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', "
    "'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '36px'}, "
    "'flowchart': {'padding': 28, 'rankSpacing': 56, 'wrappingWidth': 900}}}%%\n"
)

CAREER = {
    "product-owner": {
        "en": (
            "Now · Discovery, prioritization, and delivery",
            "Next · Senior Product Owner",
            "Outcomes · Trusted product results",
        ),
        "pt": (
            "Agora · Descoberta, priorização e entrega",
            "Próximo · Product Owner Sênior",
            "Resultados · Resultados de produto confiáveis",
        ),
    },
    "digital-solution-architect": {
        "en": (
            "Now · Digitization, gates, and operable designs",
            "Next · Mid-Level Digital Solution Architect",
            "Outcomes · Solutions teams can run",
        ),
        "pt": (
            "Agora · Digitalização, gates e desenhos operáveis",
            "Próximo · Arquiteto de Soluções Digitais Pleno",
            "Resultados · Soluções que o time opera",
        ),
    },
    "data-scientist": {
        "en": (
            "Now · Applied research, stats, and analytics",
            "Next · Data Scientist Pleno",
            "Outcomes · Trustworthy experiments and decisions",
        ),
        "pt": (
            "Agora · Pesquisa aplicada, estatística e analytics",
            "Próximo · Cientista de Dados Pleno",
            "Resultados · Experimentos e decisões confiáveis",
        ),
    },
}

METHOD = {
    "product-owner": {
        "en": ("Need", "Priority · evidence-backed", "Shipped outcome"),
        "pt": ("Necessidade", "Prioridade · com evidência", "Resultado entregue"),
    },
    "digital-solution-architect": {
        "en": ("Problem", "Design · operable boundaries", "Runnable solution"),
        "pt": ("Problema", "Desenho · limites operáveis", "Solução operável"),
    },
    "data-scientist": {
        "en": ("Question", "Analysis · evidence and evaluation", "Owned decision"),
        "pt": ("Pergunta", "Análise · evidência e avaliação", "Decisão assumida"),
    },
}


def flow_mmd(a: str, b: str, c: str) -> str:
    return (
        f"{INIT}flowchart TB\n"
        f'  Now["{a}"]\n'
        f'  Next["{b}"]\n'
        f'  Seniors["{c}"]\n'
        f"  Now --> Next --> Seniors\n"
    )


def method_mmd(a: str, b: str, c: str) -> str:
    return (
        f"{INIT}flowchart TB\n"
        f'  Q["{a}"]\n'
        f'  E["{b}"]\n'
        f'  D["{c}"]\n'
        f"  Q --> E --> D\n"
    )


def render(mmd: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / "diagram.mmd"
        src.write_text(mmd, encoding="utf-8")
        cmd = (
            f'npx.cmd --yes @mermaid-js/mermaid-cli -i "{src}" -o "{dest}" '
            f"-b transparent -s 2"
        )
        subprocess.run(cmd, check=True, cwd=str(ROOT), shell=True)
    print(f"Wrote {dest}")


def main() -> None:
    for variant, langs in CAREER.items():
        for lang, labels in langs.items():
            dest = OUT / f"future-career-path-{variant}-{lang}.png"
            render(flow_mmd(*labels), dest)
            vcopy = VARIANT_DIRS[variant] / f"future-career-path-{lang}.png"
            vcopy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(dest, vcopy)
            print(f"Copied {vcopy}")

    for variant, langs in METHOD.items():
        for lang, labels in langs.items():
            dest = OUT / f"ai-agile-research-{variant}-{lang}.png"
            render(method_mmd(*labels), dest)
            vcopy = VARIANT_DIRS[variant] / f"ai-agile-research-{lang}.png"
            vcopy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(dest, vcopy)
            print(f"Copied {vcopy}")


if __name__ == "__main__":
    main()
