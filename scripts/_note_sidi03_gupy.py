"""Register SiDi Gupy AI-interview progress on sidi-03."""

from __future__ import annotations

import csv
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "my-data" / "canonical" / "job_openings.csv"

note = (
    "2026-09-24: Completed Gupy Candidatura Rapida AI-agent stage (WhatsApp). "
    "Single-message intro + Q&A: "
    "(1) end-to-end data science project (TrustMate dissertation: LLM agents + inferential stats); "
    "(2) low-quality data (Data Insights call-center pipeline + stakeholder limits); "
    "(3) production monitoring (honest: no classic ML in prod; ServiceNow relevance-score analog; "
    "plan = service health + output sampling + versioning/rollback; still learning drift/retrain); "
    "(4) LLM/agents (TrustMate ChatGPT o3 agents vs 127 humans; not RAG/LangChain multi-agent). "
    "Awaiting SiDi/Gupy next step."
)

with p.open(encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    fieldnames = list(reader.fieldnames or [])
    rows = list(reader)

updated = False
for row in rows:
    if row.get("id") != "sidi-03":
        continue
    existing = (row.get("notes") or "").strip()
    row["notes"] = f"{existing}\n{note}".strip() if existing else note
    if not (row.get("applied_on") or "").strip():
        row["applied_on"] = "2026-09-24"
    row["next_action"] = "Wait for Gupy/SiDi feedback after AI interview stage"
    row["is_new"] = "0"
    updated = True
    break

if not updated:
    raise SystemExit("sidi-03 not found")

with p.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)

# verify
with p.open(encoding="utf-8", newline="") as f:
    check = list(csv.DictReader(f))
assert len(check) == len(rows)
sidi = next(r for r in check if r["id"] == "sidi-03")
print(f"rows={len(check)}")
print(f"applied_on={sidi['applied_on']}")
print(f"next_action={sidi['next_action']}")
print(f"notes={sidi['notes'][:160]}...")
