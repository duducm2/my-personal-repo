"""Polish master's approval/diploma phrasing."""

from __future__ import annotations

from pathlib import Path

root = Path(__file__).resolve().parents[1]

reps = [
    (
        "Approved for a Master's in Technology in September 2026 (diploma December 2026) (Grade A across all coursework)",
        "Master's in Technology approved September 2026 (diploma December 2026; Grade A across all coursework)",
    ),
    (
        "Approved for a Master's in Technology in September 2026 (diploma December 2026), with Grade A across all coursework",
        "Master's in Technology approved September 2026 (diploma December 2026), with Grade A across all coursework",
    ),
    (
        "I was approved for a Master's in Technology in September 2026 (diploma December 2026), with Grade A across all coursework",
        "I had my Master's in Technology approved in September 2026 (diploma December 2026), with Grade A across all coursework",
    ),
    (
        "I'm a data analyst. A lot of what I do is taking messy operational and experiential signals and turning them into something structured enough to decide on. That usually means advanced Excel (formulas, VBA, database-style workbooks), CSV pipelines, Power BI, Python and SQL, plus descriptive and inferential statistics. The Information Visualization coursework in my Master's (Grade A) shapes how I pick visuals and interaction for stakeholders. I use CSI and NPS when I need to prioritize what actually matters. I was approved for a Master's in Technology in September 2026 (diploma December 2026), with Grade A across all coursework.",
        "I'm a data analyst. A lot of what I do is taking messy operational and experiential signals and turning them into something structured enough to decide on. That usually means advanced Excel (formulas, VBA, database-style workbooks), CSV pipelines, Power BI, Python and SQL, plus descriptive and inferential statistics. The Information Visualization coursework in my Master's (Grade A) shapes how I pick visuals and interaction for stakeholders. I use CSI and NPS when I need to prioritize what actually matters. I had my Master's in Technology approved in September 2026 (diploma December 2026), with Grade A across all coursework.",
    ),
    (
        "Fui aprovado no Mestrado em Tecnologia em setembro de 2026 (diploma em dezembro de 2026) (nota A em todas as disciplinas)",
        "Fui aprovado no Mestrado em Tecnologia em setembro de 2026 (diploma em dezembro de 2026; nota A em todas as disciplinas)",
    ),
]

globs = [
    "my-data/canonical/*.csv",
    "resume/**/*.typ",
    "prompts/**/*.md",
    "scripts/seed_*.py",
    "lattes/fields.md",
]
files: list[Path] = []
for g in globs:
    files.extend(root.glob(g))
files = [f for f in files if f.is_file() and "_generated" not in f.parts]

changed = []
for path in sorted(set(files)):
    text = path.read_text(encoding="utf-8")
    new = text
    for old, rep in reps:
        new = new.replace(old, rep)
    # catch remaining awkward EN
    new = new.replace(
        "Approved for a Master's in Technology in September 2026 (diploma December 2026)",
        "Master's in Technology approved September 2026 (diploma December 2026)",
    )
    new = new.replace(
        "I was approved for a Master's in Technology in September 2026 (diploma December 2026)",
        "I had my Master's in Technology approved in September 2026 (diploma December 2026)",
    )
    if new != text:
        path.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(path.relative_to(root)))

print("updated", len(changed))
for c in changed:
    print(" -", c)

# verify leftovers
bad = []
for path in files:
    t = path.read_text(encoding="utf-8")
    for pat in [
        "Approved for a Master's",
        "approved for a Master's",
        ") (Grade A",
        ") (nota A",
        "completed September",
        "com concluído",
    ]:
        if pat in t:
            bad.append(f"{path.name}: {pat}")
print("leftovers", bad)
