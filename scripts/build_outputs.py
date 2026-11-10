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

VARIANTS = (
    "ux-researcher",
    "general",
    "product-owner",
    "data-analyst",
    "digital-solution-architect",
)

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
    ("ux-researcher", "en", "resume"): ROOT
    / "output"
    / "ux-researcher"
    / "CV-Eduardo-Figueiredo-EN-ux-researcher.pdf",
    ("ux-researcher", "pt", "resume"): ROOT
    / "output"
    / "ux-researcher"
    / "CV-Eduardo-Figueiredo-PT-ux-researcher.pdf",
    ("ux-researcher", "en", "portfolio"): ROOT
    / "output"
    / "ux-researcher"
    / "portfolio-deck-ux-researcher-EN.pdf",
    ("ux-researcher", "pt", "portfolio"): ROOT
    / "output"
    / "ux-researcher"
    / "portfolio-deck-ux-researcher-PT.pdf",
}

RESUME_MAIN = {
    "ux-researcher": ROOT / "resume" / "variants" / "ux-researcher" / "main.typ",
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
    "ux-researcher": ROOT / "resume" / "variants" / "ux-researcher",
    "general": ROOT / "resume" / "typst",
    "product-owner": ROOT / "resume" / "variants" / "product-owner",
    "data-analyst": ROOT / "resume" / "variants" / "data-analyst",
    "digital-solution-architect": ROOT
    / "resume"
    / "variants"
    / "digital-solution-architect",
}

DECK_SRC = {
    "ux-researcher": ROOT
    / "portfolio"
    / "variants"
    / "ux-researcher"
    / "portfolio-deck.{lang}.md",
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


def pdf_page_count(path: Path) -> int:
    import re

    data = path.read_bytes()
    return len(re.findall(rb"/Type\s*/Page(?![s\w])", data))


def load_resume_settings() -> dict[str, int]:
    settings_file = ROOT / "my-data" / "canonical" / "resume_settings.csv"
    out = {v: 1 for v in VARIANTS}
    if not settings_file.is_file():
        return out
    import csv

    with settings_file.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            v = (row.get("variant") or "").strip()
            raw = (row.get("max_pages") or "").strip()
            if v and raw and raw.isdigit():
                out[v] = max(1, min(2, int(raw)))
    return out


def assert_resume_page_limit(
    path: Path, max_pages: int = 1, *, strict: bool = False
) -> None:
    pages = pdf_page_count(path)
    if pages <= max_pages:
        print(f"  ok {pages}p (limit={max_pages}p): {path.relative_to(ROOT)}")
        return
    msg = (
        f"Resume page limit violated: {path.relative_to(ROOT)} "
        f"has {pages} page(s); configured limit is {max_pages} page(s)."
    )
    if strict:
        raise SystemExit(msg)
    print(f"  WARN {msg}")


def assert_resume_one_page(path: Path, *, strict: bool) -> None:
    assert_resume_page_limit(path, max_pages=1, strict=strict)


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
            "--no-stdin",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build PDF deliverables in output/"
    )
    parser.add_argument(
        "--lang",
        choices=("en", "pt", "all"),
        default="all",
        help="Languages to build (default: all)",
    )
    parser.add_argument(
        "--variant",
        choices=VARIANTS,
        help="Single variant to build (default: all)",
    )
    parser.add_argument(
        "--kind",
        choices=("resume", "portfolio", "all"),
        default="all",
        help="Deliverable kind to compile (default: all)",
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
    parser.add_argument(
        "--strict-pages",
        action="store_true",
        help="Fail the build if any resume violates its configured page limit",
    )
    args = parser.parse_args()
    langs = LANGS if args.lang == "all" else (args.lang,)
    variants = (args.variant,) if args.variant else VARIANTS
    kinds = ("resume", "portfolio") if args.kind == "all" else (args.kind,)
    resume_limits = load_resume_settings()

    if not args.skip_generate:
        gen_cmd = [
            sys.executable,
            str(SCRIPTS / "generate_from_canonical.py"),
            "--lang",
            "all" if args.lang == "all" else args.lang,
        ]
        if args.variant:
            gen_cmd.extend(["--variant", args.variant])
        run(gen_cmd)

    if not args.skip_audit and not args.skip_generate and not args.variant:
        run([sys.executable, str(SCRIPTS / "audit_canonical_data.py")])

    for lang in langs:
        for variant in variants:
            if "resume" in kinds:
                compile_resume(variant, lang)
                assert_resume_page_limit(
                    OUTPUTS[(variant, lang, "resume")],
                    max_pages=resume_limits.get(variant, 1),
                    strict=args.strict_pages,
                )
            if "portfolio" in kinds:
                compile_portfolio(variant, lang)

    for legacy in LEGACY_PDFS:
        if legacy.exists():
            legacy.unlink()
            print(f"removed legacy {legacy.relative_to(ROOT)}")

    print("\nBuilt PDFs:")
    for lang in langs:
        for variant in variants:
            for kind in kinds:
                path = OUTPUTS[(variant, lang, kind)]
                print(f"  {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
