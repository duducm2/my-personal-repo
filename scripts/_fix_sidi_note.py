from pathlib import Path
import csv
import re

p = Path("my-data/canonical/job_openings.csv")
with p.open(encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    fields = reader.fieldnames
    rows = list(reader)

for row in rows:
    if row["id"] != "sidi-03":
        continue
    note = row.get("notes") or ""
    note = re.sub(
        r"Target pay R.*?CLT if offer\.",
        "Target pay R$10-11k CLT if offer.",
        note,
    )
    row["notes"] = note
    print(note.split("\n")[-1])

with p.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
