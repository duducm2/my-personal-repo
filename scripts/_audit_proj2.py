# -*- coding: utf-8 -*-
import csv
from pathlib import Path

root = Path("my-data/canonical")
with (root / "projects.csv").open(encoding="utf-8", newline="") as f:
    for r in csv.DictReader(f):
        if r["id"] in ("agritech-iot-cattle", "dissertation-trustmate-stats"):
            print("===", r["id"], "===")
            print(r["summary_detail_en"][:700])
            print()
