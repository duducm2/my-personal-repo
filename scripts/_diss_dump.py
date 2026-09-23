# -*- coding: utf-8 -*-
import csv
from pathlib import Path

root = Path("my-data/canonical")
out = Path("scripts/_diss_dump.txt")
lines = []

with (root / "education.csv").open(encoding="utf-8", newline="") as f:
    for r in csv.DictReader(f):
        lines.append("=== EDUCATION keys ===")
        lines.append(", ".join(r.keys()))
        for k, v in r.items():
            if v:
                lines.append(f"\n[{k}]\n{v}\n")

with (root / "education_linkedin.csv").open(encoding="utf-8", newline="") as f:
    for r in csv.DictReader(f):
        lines.append("=== EDUCATION LINKEDIN ===")
        for k, v in r.items():
            if v and ("desc" in k or "detail" in k or "note" in k or "text" in k):
                lines.append(f"\n[{k}]\n{v}\n")

with (root / "projects.csv").open(encoding="utf-8", newline="") as f:
    for r in csv.DictReader(f):
        if "trustmate" in r["id"] or "dissert" in r["id"]:
            lines.append(f"=== PROJECT {r['id']} ===")
            for k in (
                "name_en",
                "summary_en",
                "summary_detail_en",
                "summary_pt",
                "summary_detail_pt",
            ):
                lines.append(f"\n[{k}]\n{r.get(k) or ''}\n")

with (root / "narratives.csv").open(encoding="utf-8", newline="") as f:
    for r in csv.DictReader(f):
        if "dissertation" in r["field"]:
            lines.append(f"=== NARR {r['variant']}/{r['field']} ===")
            lines.append(f"EN:\n{r['text_en']}\n")
            lines.append(f"PT:\n{r['text_pt']}\n")

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "chars", out.stat().st_size)
