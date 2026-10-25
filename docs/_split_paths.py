import csv
from pathlib import Path

p = Path("my-data/canonical/profile.csv")
rows = list(csv.DictReader(p.open(encoding="utf-8-sig", newline="")))
row = rows[0]
base = "https://duducm2.github.io/my-personal-repo/"
row.pop("site_url", None)
row["site_data_analyst_url"] = base + "data-analyst/"
row["site_product_owner_url"] = base + "product-owner/"
row["site_digital_solution_architect_url"] = base + "digital-solution-architect/"
fieldnames = [name for name in row.keys()]
with p.open("w", encoding="utf-8", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
print(row["site_data_analyst_url"])
print(row["site_product_owner_url"])
print(row["site_digital_solution_architect_url"])
