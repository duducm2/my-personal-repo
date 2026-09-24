"""Clarify Master's: approved Sep 2026, diploma Dec 2026."""

from __future__ import annotations

from pathlib import Path

root = Path(__file__).resolve().parents[1]

# Order matters: longer / more specific first
reps = [
    # Grammar bug from prior bulk replace
    (
        "Mestrado em Tecnologia com concluído em setembro de 2026",
        "Mestrado em Tecnologia aprovado em setembro de 2026 (diploma em dezembro de 2026)",
    ),
    (
        "Completed a Master's in Technology in September 2026",
        "Approved for a Master's in Technology in September 2026 (diploma December 2026)",
    ),
    (
        "I completed a Master's in Technology in September 2026",
        "I was approved for a Master's in Technology in September 2026 (diploma December 2026)",
    ),
    (
        "Concluí o Mestrado em Tecnologia em setembro de 2026",
        "Fui aprovado no Mestrado em Tecnologia em setembro de 2026 (diploma em dezembro de 2026)",
    ),
    (
        "Master's in Technology completed September 2026",
        "Master's in Technology approved September 2026 (diploma December 2026)",
    ),
    (
        "Mestrado em Tecnologia concluído em setembro de 2026",
        "Mestrado em Tecnologia aprovado em setembro de 2026 (diploma em dezembro de 2026)",
    ),
    (
        "(#strong[completed September 2026])",
        "(#strong[approved September 2026; diploma December 2026])",
    ),
    (
        "(#strong[concluído em setembro de 2026])",
        "(#strong[aprovado set/2026; diploma dez/2026])",
    ),
    (
        "(#strong[concluído set/2026])",
        "(#strong[aprovado set/2026; diploma dez/2026])",
    ),
    (
        "(**completed September 2026**)",
        "(**approved September 2026; diploma December 2026**)",
    ),
    (
        "(**concluído em setembro de 2026**)",
        "(**aprovado set/2026; diploma dez/2026**)",
    ),
    (
        "(**concluído set/2026**)",
        "(**aprovado set/2026; diploma dez/2026**)",
    ),
    (
        "Unicamp (2023–2026, completed September 2026).",
        "Unicamp (2023–2026, approved September 2026; diploma December 2026).",
    ),
    (
        "Unicamp (2023–2026, concluído set/2026).",
        "Unicamp (2023–2026, aprovado set/2026; diploma dez/2026).",
    ),
    (
        "Unicamp (2023–2026, concluído em setembro de 2026).",
        "Unicamp (2023–2026, aprovado em setembro de 2026; diploma em dezembro de 2026).",
    ),
    (
        "completed September 2026, Grade A coursework",
        "approved September 2026, diploma December 2026; Grade A coursework",
    ),
    (
        "completed Sep 2026",
        "approved Sep 2026; diploma Dec 2026",
    ),
    (
        "completed September 2026",
        "approved September 2026 (diploma December 2026)",
    ),
    (
        "concluído em setembro de 2026",
        "aprovado em setembro de 2026 (diploma em dezembro de 2026)",
    ),
    (
        "concluído set/2026",
        "aprovado set/2026; diploma dez/2026",
    ),
    (
        "The Master's was completed in September 2026 after dissertation approval.",
        "Master's approved in September 2026; diploma scheduled for December 2026.",
    ),
    (
        "O mestrado foi concluído em setembro de 2026, após aprovação da dissertação.",
        "Mestrado aprovado em setembro de 2026; diploma previsto para dezembro de 2026.",
    ),
    (
        "mestre em Tecnologia pela Unicamp (concluído em setembro de 2026).",
        "mestre em Tecnologia pela Unicamp (aprovado em setembro de 2026; diploma em dezembro de 2026).",
    ),
    (
        "Fui aprovado no Mestrado em Tecnologia (Sistemas de Informação e Comunicação) pela Unicamp em setembro de 2026.",
        "Fui aprovado no Mestrado em Tecnologia (Sistemas de Informação e Comunicação) pela Unicamp em setembro de 2026; o diploma sai em dezembro de 2026.",
    ),
    # LinkedIn date end → Dec when certificate is taken
    ("Aug 2023 - Sep 2026", "Aug 2023 - Dec 2026"),
    ("ago de 2023 - set de 2026", "ago de 2023 - dez de 2026"),
]

globs = [
    "my-data/canonical/*.csv",
    "resume/**/*.typ",
    "prompts/**/*.md",
    "scripts/seed_*.py",
    "scripts/_enrich_dissertation.py",
    "scripts/migrate_bilingual_labels.py",
    "scripts/patch_pt_*.py",
    "scripts/audit_canonical_data.py",
    "lattes/fields.md",
]

files: list[Path] = []
for g in globs:
    files.extend(root.glob(g))
files = [f for f in files if "_generated" not in f.parts and f.is_file()]

changed: list[str] = []
for path in sorted(set(files)):
    text = path.read_text(encoding="utf-8")
    new = text
    for old, rep in reps:
        new = new.replace(old, rep)
    if new != text:
        path.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(path.relative_to(root)))

print(f"Updated {len(changed)} files")
for c in changed:
    print(" -", c)

# education_linkedin detail sentence if still old approval-only wording
edu = root / "my-data" / "canonical" / "education_linkedin.csv"
t = edu.read_text(encoding="utf-8")
old = "The Master's was completed in September 2026 after dissertation approval."
# already replaced via completed→approved path above; ensure diploma note exists
needle = "Master's approved in September 2026; diploma scheduled for December 2026."
if needle not in t and "diploma" not in t.lower():
    # try insert after approval sentence variants
    for cand in [
        "Master's approved in September 2026 (diploma December 2026).",
        "approved September 2026 (diploma December 2026).",
    ]:
        pass
print(
    "education_linkedin has diploma:", "diploma" in t.lower() or "dezembro" in t.lower()
)
