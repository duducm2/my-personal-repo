import csv
import re
from pathlib import Path

NEAR = re.compile(
    r"\b(campinas|rmc|campinas metro|nova odessa|sumaré|sumare|paulínia|paulinia|"
    r"hortolândia|hortolandia|jaguariúna|jaguariuna|indaiatuba|valinhos|vinhedo|"
    r"americana|limeira|santa bárbara|santa barbara d'?oeste|barão geraldo|"
    r"barao geraldo|techno park|unicamp)\b",
    re.I,
)
need = [
    "goodyear-santa-barbara",
    "romi-santa-barbara",
    "denso-santa-barbara",
    "kspg-nova-odessa",
    "suzano-americana",
]
rows = list(
    csv.DictReader(
        Path("my-data/canonical/companies.csv").open(encoding="utf-8", newline="")
    )
)
by_id = {r["id"]: r for r in rows}
near = []
for r in rows:
    text = " · ".join(
        r.get(k) or ""
        for k in (
            "region_en",
            "region_pt",
            "city_en",
            "city_pt",
            "notes_en",
            "notes_pt",
            "category_en",
        )
    )
    if NEAR.search(text):
        near.append(r["id"])
print("total", len(rows), "near_home", len(near))
for i in need:
    r = by_id[i]
    text = " · ".join(
        r.get(k) or "" for k in ("region_en", "city_en", "notes_en", "category_en")
    )
    print(i, "ho=" + r["home_office"], "near=" + str(bool(NEAR.search(text))))
