# -*- coding: utf-8 -*-
"""Add CNPEM to companies + job portals."""
import csv
from pathlib import Path

ROOT = Path("my-data/canonical")


def append_row(path: Path, row: dict) -> None:
    with path.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    if any(r.get("id") == row["id"] for r in rows):
        print(f"{path.name}: {row['id']} already present — updating")
        rows = [row if r.get("id") == row["id"] else r for r in rows]
    else:
        print(f"{path.name}: appending {row['id']}")
        rows.append(row)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


company = {
    "id": "cnpem-campinas",
    "sort_order": "114",
    "category_en": "National energy & materials research center",
    "category_detail_en": "National energy & materials research center",
    "category_pt": "Centro nacional de pesquisa em energia e materiais",
    "category_detail_pt": "Centro nacional de pesquisa em energia e materiais",
    "name_en": "CNPEM",
    "name_detail_en": "CNPEM — Brazilian Center for Research in Energy and Materials",
    "name_pt": "CNPEM",
    "name_detail_pt": "CNPEM — Centro Nacional de Pesquisa em Energia e Materiais",
    "city_en": "Campinas (Polo II de Alta Tecnologia)",
    "city_detail_en": "Campinas (Polo II de Alta Tecnologia)",
    "city_pt": "Campinas (Polo II de Alta Tecnologia)",
    "city_detail_pt": "Campinas (Polo II de Alta Tecnologia)",
    "region_en": "Campinas metro (Unicamp / Sirius ecosystem)",
    "region_detail_en": "Campinas metro (Unicamp / Sirius ecosystem)",
    "region_pt": "RMC (ecossistema Unicamp / Sirius)",
    "region_detail_pt": "RMC (ecossistema Unicamp / Sirius)",
    "priority": "high",
    "status": "researching",
    "home_office": "",
    "growth": "",
    "fit_data_analyst": "yes",
    "fit_product_owner": "no",
    "fit_digital_solution_architect": "yes",
    "website": "https://cnpem.br/",
    "careers_url": "https://cnpem.gupy.io/",
    "ats_kind": "third_party",
    "ats_name": "Gupy",
    "ats_url": "https://cnpem.gupy.io/",
    "skills_match_en": (
        "Python; SQL; Scientific / ops data analytics; Instrumentation and control software; "
        "Applied research; Dashboards / reporting for lab and facility ops"
    ),
    "skills_match_detail_en": (
        "Python; SQL; Scientific / ops data analytics; Instrumentation and control software; "
        "Applied research; Dashboards / reporting for lab and facility ops"
    ),
    "skills_match_pt": (
        "Python; SQL; Analytics científico / ops; Software de instrumentação e controle; "
        "Pesquisa aplicada; Dashboards / reporting para ops de laboratório e infraestrutura"
    ),
    "skills_match_detail_pt": (
        "Python; SQL; Analytics científico / ops; Software de instrumentação e controle; "
        "Pesquisa aplicada; Dashboards / reporting para ops de laboratório e infraestrutura"
    ),
    "fit_why_en": (
        "Campinas national research campus (LNLS/Sirius, LNBio, LNBR, LNNano) with tech-specialist "
        "and software/automation openings on Gupy. Applied-research culture fits Unicamp MSc and "
        "Bosch research-designer background; DSA/DA via instrumentation, data, and facility systems."
    ),
    "fit_why_detail_en": (
        "Campinas national research campus (LNLS/Sirius, LNBio, LNBR, LNNano) with tech-specialist "
        "and software/automation openings on Gupy. Applied-research culture fits Unicamp MSc and "
        "Bosch research-designer background; DSA/DA via instrumentation, data, and facility systems."
    ),
    "fit_why_pt": (
        "Campus nacional de pesquisa em Campinas (LNLS/Sirius, LNBio, LNBR, LNNano) com vagas de "
        "especialista tecnológico e software/automação no Gupy. Cultura de pesquisa aplicada alinha "
        "com mestrado Unicamp e perfil de pesquisa na Bosch; DSA/DA via instrumentação, dados e sistemas."
    ),
    "fit_why_detail_pt": (
        "Campus nacional de pesquisa em Campinas (LNLS/Sirius, LNBio, LNBR, LNNano) com vagas de "
        "especialista tecnológico e software/automação no Gupy. Cultura de pesquisa aplicada alinha "
        "com mestrado Unicamp e perfil de pesquisa na Bosch; DSA/DA via instrumentação, dados e sistemas."
    ),
    "notes_en": (
        "Brazilian Center for Research in Energy and Materials (MCTI social organization). "
        "Careers: cnpem.gupy.io. Also watch PUE internships (pue.gupy.io). "
        "Campus: Rua Giuseppe Máximo Scolfaro, 10.000 — Polo II, Campinas/SP."
    ),
    "notes_detail_en": (
        "Brazilian Center for Research in Energy and Materials (MCTI social organization). "
        "Hosts Sirius (synchrotron), Orion biosafety complex (underway), and four national labs. "
        "Careers: cnpem.gupy.io. Internships: pue.gupy.io. "
        "Campus: Rua Giuseppe Máximo Scolfaro, 10.000 — Polo II de Alta Tecnologia, Campinas/SP."
    ),
    "notes_pt": (
        "Centro Nacional de Pesquisa em Energia e Materiais (organização social MCTI). "
        "Carreiras: cnpem.gupy.io. Também acompanhar estágios PUE (pue.gupy.io). "
        "Campus: Rua Giuseppe Máximo Scolfaro, 10.000 — Polo II, Campinas/SP."
    ),
    "notes_detail_pt": (
        "Centro Nacional de Pesquisa em Energia e Materiais (organização social MCTI). "
        "Abriga o Sirius (síncrotron), o complexo Orion (em andamento) e quatro laboratórios nacionais. "
        "Carreiras: cnpem.gupy.io. Estágios: pue.gupy.io. "
        "Campus: Rua Giuseppe Máximo Scolfaro, 10.000 — Polo II de Alta Tecnologia, Campinas/SP."
    ),
}

portal = {
    "id": "cnpem",
    "sort_order": "51",
    "scope": "brazil",
    "name": "CNPEM (Gupy)",
    "job_search_url": "https://cnpem.gupy.io/",
    "system_kind": "third_party",
    "ats_name": "Gupy",
    "ats_url": "https://cnpem.gupy.io/",
    "fit_paths": "da;dsa",
    "notes": (
        "CNPEM — Brazilian Center for Research in Energy and Materials (Campinas). "
        "National labs + Sirius; tech/software/automation specialist openings."
    ),
}

append_row(ROOT / "companies.csv", company)
append_row(ROOT / "job_portals.csv", portal)
print("done")
