#!/usr/bin/env python3
"""Generate canonical content and compile all resume + portfolio PDFs to output/."""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
FONTS = ROOT / "resume" / "typst" / "fonts"

LANGS = ("en", "pt")
LANG_SUFFIX = {"en": "EN", "pt": "PT"}

VARIANTS = ("general", "product-owner", "data-analyst", "digital-solution-architect")

OUTPUTS = {
    ("general", "en", "resume"): ROOT
    / "output"
    / "general"
    / "CV-Eduardo-Figueiredo-EN.pdf",
    ("general", "pt", "resume"): ROOT
    / "output"
    / "general"
    / "CV-Eduardo-Figueiredo-PT.pdf",
    ("general", "en", "portfolio"): ROOT
    / "output"
    / "general"
    / "portfolio-deck-EN.pdf",
    ("general", "pt", "portfolio"): ROOT
    / "output"
    / "general"
    / "portfolio-deck-PT.pdf",
    ("product-owner", "en", "resume"): ROOT
    / "output"
    / "product-owner"
    / "CV-Eduardo-Figueiredo-EN-product-owner.pdf",
    ("product-owner", "pt", "resume"): ROOT
    / "output"
    / "product-owner"
    / "CV-Eduardo-Figueiredo-PT-product-owner.pdf",
    ("product-owner", "en", "portfolio"): ROOT
    / "output"
    / "product-owner"
    / "portfolio-deck-product-owner-EN.pdf",
    ("product-owner", "pt", "portfolio"): ROOT
    / "output"
    / "product-owner"
    / "portfolio-deck-product-owner-PT.pdf",
    ("data-analyst", "en", "resume"): ROOT
    / "output"
    / "data-analyst"
    / "CV-Eduardo-Figueiredo-EN-data-analyst.pdf",
    ("data-analyst", "pt", "resume"): ROOT
    / "output"
    / "data-analyst"
    / "CV-Eduardo-Figueiredo-PT-data-analyst.pdf",
    ("data-analyst", "en", "portfolio"): ROOT
    / "output"
    / "data-analyst"
    / "portfolio-deck-data-analyst-EN.pdf",
    ("data-analyst", "pt", "portfolio"): ROOT
    / "output"
    / "data-analyst"
    / "portfolio-deck-data-analyst-PT.pdf",
    ("digital-solution-architect", "en", "resume"): ROOT
    / "output"
    / "digital-solution-architect"
    / "CV-Eduardo-Figueiredo-EN-digital-solution-architect.pdf",
    ("digital-solution-architect", "pt", "resume"): ROOT
    / "output"
    / "digital-solution-architect"
    / "CV-Eduardo-Figueiredo-PT-digital-solution-architect.pdf",
    ("digital-solution-architect", "en", "portfolio"): ROOT
    / "output"
    / "digital-solution-architect"
    / "portfolio-deck-digital-solution-architect-EN.pdf",
    ("digital-solution-architect", "pt", "portfolio"): ROOT
    / "output"
    / "digital-solution-architect"
    / "portfolio-deck-digital-solution-architect-PT.pdf",
}

RESUME_MAIN = {
    "general": ROOT / "resume" / "typst" / "main.typ",
    "product-owner": ROOT / "resume" / "variants" / "product-owner" / "main.typ",
    "data-analyst": ROOT / "resume" / "variants" / "data-analyst" / "main.typ",
    "digital-solution-architect": ROOT
    / "resume"
    / "variants"
    / "digital-solution-architect"
    / "main.typ",
}

RESUME_CONTENT = {
    "general": ROOT / "resume" / "typst",
    "product-owner": ROOT / "resume" / "variants" / "product-owner",
    "data-analyst": ROOT / "resume" / "variants" / "data-analyst",
    "digital-solution-architect": ROOT
    / "resume"
    / "variants"
    / "digital-solution-architect",
}

DECK_SRC = {
    "general": ROOT / "portfolio" / "portfolio-deck.{lang}.md",
    "product-owner": ROOT
    / "portfolio"
    / "variants"
    / "product-owner"
    / "portfolio-deck.{lang}.md",
    "data-analyst": ROOT
    / "portfolio"
    / "variants"
    / "data-analyst"
    / "portfolio-deck.{lang}.md",
    "digital-solution-architect": ROOT
    / "portfolio"
    / "variants"
    / "digital-solution-architect"
    / "portfolio-deck.{lang}.md",
}

# Legacy filenames without language suffix (removed after successful build)
LEGACY_PDFS = [
    ROOT / "output" / "general" / "portfolio-deck.pdf",
    ROOT / "output" / "product-owner" / "portfolio-deck-product-owner.pdf",
]


def run(cmd: list[str], *, cwd: Path = ROOT) -> None:
    print("+", " ".join(cmd))
    if sys.platform == "win32" and cmd[0] == "npx":
        cmd = ["cmd", "/c", "npx", *cmd[1:]]
    subprocess.run(cmd, cwd=cwd, check=True)


def generate(lang_arg: str) -> None:
    run(
        [
            sys.executable,
            str(SCRIPTS / "generate_from_canonical.py"),
            "--lang",
            lang_arg,
        ]
    )


def compile_resume(variant: str, lang: str) -> None:
    content_file = f"content.{lang}.typ"
    out = OUTPUTS[(variant, lang, "resume")]
    out.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "typst",
            "compile",
            "--root",
            str(ROOT),
            "--font-path",
            str(FONTS),
            "--input",
            f"content={content_file}",
            str(RESUME_MAIN[variant]),
            str(out),
        ]
    )


def compile_portfolio(variant: str, lang: str) -> None:
    deck = Path(str(DECK_SRC[variant]).format(lang=lang))
    out = OUTPUTS[(variant, lang, "portfolio")]
    out.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "npx",
            "@marp-team/marp-cli@latest",
            str(deck),
            "-o",
            str(out),
            "--allow-local-files",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build all PDF deliverables in output/"
    )
    parser.add_argument(
        "--lang",
        choices=("en", "pt", "all"),
        default="all",
        help="Languages to build (default: all)",
    )
    parser.add_argument(
        "--skip-generate",
        action="store_true",
        help="Skip CSV generation (compile existing .en/.pt sources only)",
    )
    parser.add_argument(
        "--skip-audit",
        action="store_true",
        help="Skip audit_canonical_data.py after generate",
    )
    args = parser.parse_args()
    langs = LANGS if args.lang == "all" else (args.lang,)

    if not args.skip_generate:
        generate("all" if args.lang == "all" else args.lang)

    if not args.skip_audit and not args.skip_generate:
        run([sys.executable, str(SCRIPTS / "audit_canonical_data.py")])

    for lang in langs:
        for variant in VARIANTS:
            compile_resume(variant, lang)
            compile_portfolio(variant, lang)

    for legacy in LEGACY_PDFS:
        if legacy.exists():
            legacy.unlink()
            print(f"removed legacy {legacy.relative_to(ROOT)}")

    print("\nBuilt PDFs:")
    for lang in langs:
        for variant in VARIANTS:
            for kind in ("resume", "portfolio"):
                path = OUTPUTS[(variant, lang, kind)]
                print(f"  {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
