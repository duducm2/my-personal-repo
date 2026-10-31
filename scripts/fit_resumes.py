#!/usr/bin/env python3
"""Fit each resume to one A4 page and record topics that did not fit.

Reads my-data/canonical and writes resume typst plus
my-data/generated/resume-priority/{variant}.json.
Does not rebuild portfolio decks.
"""
from __future__ import annotations

import argparse
import csv
import json
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))

from build_outputs import (
    FONTS,
    OUTPUTS,
    RESUME_MAIN,
    ROOT,
    pdf_page_count,
)  # noqa: E402
from generate_from_canonical import (  # noqa: E402
    PRIORITY_DIR,
    RESUME_DIR,
    VARIANTS,
    load_csv,
    load_narratives,
    render_resume,
    resume_out_path,
    topic_id_bullet,
    topic_id_extra,
    topic_id_skill,
)

OVERRIDES = ROOT / "my-data" / "canonical" / "resume_priority.csv"
ROLE_BASE = {
    "bosch-ar-2023": 100,
    "bosch-web-2020": 50,
    "bosch-hu-2019": 40,
    "bosch-intern-2017": 20,
}
KIND_RANK = {"bullet": 0, "extra": 1, "skill": 2}


def load_overrides() -> dict[str, int]:
    if not OVERRIDES.is_file():
        return {}
    out: dict[str, int] = {}
    with OVERRIDES.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            topic_id = (row.get("topic_id") or "").strip()
            raw = (row.get("priority") or "").strip()
            if topic_id and raw:
                out[topic_id] = int(raw)
    return out


def save_overrides(overrides: dict[str, int]) -> None:
    OVERRIDES.parent.mkdir(parents=True, exist_ok=True)
    with OVERRIDES.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["topic_id", "priority"])
        writer.writeheader()
        for topic_id in sorted(overrides):
            writer.writerow({"topic_id": topic_id, "priority": overrides[topic_id]})


def default_priority(
    kind: str, experience_id: str, category: str, sort_order: int
) -> int:
    sort_order = int(sort_order)
    if kind == "bullet":
        return ROLE_BASE.get(experience_id, 10) - sort_order
    if kind == "skill" and category == "Core":
        return 80 - sort_order
    if kind == "skill":
        return 30 - sort_order
    return 55 - sort_order


def collect_topics(variant: str, overrides: dict[str, int]) -> list[dict]:
    experience = {row["id"]: row for row in load_csv("experience.csv")}
    topics: list[dict] = []
    for row in load_csv("experience_bullets.csv"):
        if row["variant"] != variant:
            continue
        topic_id = topic_id_bullet(row)
        role = experience.get(row["experience_id"], {})
        base = default_priority("bullet", row["experience_id"], "", row["sort_order"])
        topics.append(
            {
                "id": topic_id,
                "kind": "bullet",
                "section_en": role.get("title_en") or row["experience_id"],
                "section_pt": role.get("title_pt") or row["experience_id"],
                "priority": overrides.get(topic_id, base),
                "pinned": row["experience_id"] == "bosch-ar-2023"
                and row["sort_order"] == "1",
                "text_en": row["text_en"],
                "text_pt": row["text_pt"],
            }
        )
    for row in load_csv("skills.csv"):
        if row["variant"] != variant:
            continue
        topic_id = topic_id_skill(row)
        base = default_priority("skill", "", row["category"], row["sort_order"])
        topics.append(
            {
                "id": topic_id,
                "kind": "skill",
                "section_en": row.get("category_label_en") or row["category"],
                "section_pt": row.get("category_label_pt") or row["category"],
                "priority": overrides.get(topic_id, base),
                "pinned": False,
                "text_en": row["label_en"],
                "text_pt": row["label_pt"],
            }
        )
    for row in load_csv("additional.csv"):
        topic_id = topic_id_extra(row)
        base = default_priority("extra", "", "", row["sort_order"])
        topics.append(
            {
                "id": topic_id,
                "kind": "extra",
                "section_en": "Additional",
                "section_pt": "Adicional",
                "priority": overrides.get(topic_id, base),
                "pinned": False,
                "text_en": row["text_en"],
                "text_pt": row["text_pt"],
            }
        )
    return topics


def write_resume_sources(variant: str, omit: set[str]) -> None:
    warnings: list[str] = []
    for lang in ("en", "pt"):
        content = render_resume(
            variant, load_narratives(lang), warnings, lang, omit=omit
        )
        resume_out_path(variant, lang).write_text(content, encoding="utf-8")
        if lang == "en":
            (RESUME_DIR[variant] / "content.typ").write_text(content, encoding="utf-8")
    for warning in warnings:
        print(f"  warn {variant}: {warning}")


def compile_resume(variant: str, lang: str) -> Path:
    out = OUTPUTS[(variant, lang, "resume")]
    out.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        [
            "typst",
            "compile",
            "--root",
            str(ROOT),
            "--font-path",
            str(FONTS),
            "--input",
            f"content=content.{lang}.typ",
            str(RESUME_MAIN[variant]),
            str(out),
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout or "typst compile failed").strip()
        raise RuntimeError(detail[-1200:])
    return out


def public_topic(topic: dict, status: str) -> dict:
    return {
        "id": topic["id"],
        "kind": topic["kind"],
        "section_en": topic["section_en"],
        "section_pt": topic["section_pt"],
        "priority": topic["priority"],
        "pinned": topic["pinned"],
        "text_en": topic["text_en"],
        "text_pt": topic["text_pt"],
        "status": status,
    }


def fit_variant(variant: str, overrides: dict[str, int]) -> dict:
    topics = collect_topics(variant, overrides)
    by_id = {topic["id"]: topic for topic in topics}
    omit: set[str] = set()
    pages = {"en": 0, "pt": 0}
    for _ in range(80):
        write_resume_sources(variant, omit)
        for lang in ("en", "pt"):
            pdf = compile_resume(variant, lang)
            pages[lang] = pdf_page_count(pdf)
        if pages["en"] <= 1 and pages["pt"] <= 1:
            break
        candidates = [
            topic for topic in topics if topic["id"] not in omit and not topic["pinned"]
        ]
        if not candidates:
            print(f"  {variant}: still over one page with only pinned topics left")
            break
        candidates.sort(
            key=lambda topic: (
                topic["priority"],
                KIND_RANK.get(topic["kind"], 9),
                topic["id"],
            )
        )
        dropped = candidates[0]
        omit.add(dropped["id"])
        print(
            f"  {variant}: drop {dropped['id']} (priority {dropped['priority']}) "
            f"pages en={pages['en']} pt={pages['pt']}"
        )
    else:
        print(f"  {variant}: stopped after 80 drops")

    for topic in sorted(
        (by_id[topic_id] for topic_id in list(omit) if topic_id in by_id),
        key=lambda item: (-item["priority"], item["id"]),
    ):
        omit.remove(topic["id"])
        write_resume_sources(variant, omit)
        trial = {}
        for lang in ("en", "pt"):
            trial[lang] = pdf_page_count(compile_resume(variant, lang))
        if trial["en"] <= 1 and trial["pt"] <= 1:
            pages = trial
            print(f"  {variant}: restore {topic['id']}")
            continue
        omit.add(topic["id"])

    write_resume_sources(variant, omit)
    for lang in ("en", "pt"):
        pages[lang] = pdf_page_count(compile_resume(variant, lang))

    kept = [
        public_topic(topic, "kept")
        for topic in sorted(
            (item for item in topics if item["id"] not in omit),
            key=lambda topic: (
                topic["priority"],
                KIND_RANK.get(topic["kind"], 9),
                topic["id"],
            ),
        )
    ]
    deprioritized = [
        public_topic(by_id[topic_id], "deprioritized")
        for topic_id in sorted(
            omit, key=lambda topic_id: (by_id[topic_id]["priority"], topic_id)
        )
        if topic_id in by_id
    ]
    payload = {
        "variant": variant,
        "pages": pages,
        "one_page": pages["en"] <= 1 and pages["pt"] <= 1,
        "kept": kept,
        "deprioritized": deprioritized,
    }
    PRIORITY_DIR.mkdir(parents=True, exist_ok=True)
    (PRIORITY_DIR / f"{variant}.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"  {variant}: en={pages['en']} pt={pages['pt']} "
        f"kept={len(kept)} left_off={len(deprioritized)}"
    )
    return payload


def write_index(payloads: dict[str, dict]) -> None:
    PRIORITY_DIR.mkdir(parents=True, exist_ok=True)
    index = {"variants": payloads}
    (PRIORITY_DIR / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def raise_topic(variant: str, topic_id: str) -> dict:
    if variant not in VARIANTS:
        raise SystemExit(f"Unknown variant: {variant}")
    overrides = load_overrides()
    overrides[topic_id] = 97
    payload = fit_variant(variant, overrides)
    save_overrides(overrides)
    existing = {}
    index_path = PRIORITY_DIR / "index.json"
    if index_path.is_file():
        existing = json.loads(index_path.read_text(encoding="utf-8")).get(
            "variants", {}
        )
    existing[variant] = payload
    write_index(existing)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Fit resumes to one page.")
    parser.add_argument("--variant", choices=VARIANTS)
    parser.add_argument(
        "--raise", dest="raise_topic", help="Topic id to prioritize, then refit."
    )
    args = parser.parse_args()
    overrides = load_overrides()
    variants = (args.variant,) if args.variant else VARIANTS
    if args.raise_topic:
        if not args.variant:
            raise SystemExit("--raise needs --variant")
        raise_topic(args.variant, args.raise_topic)
        return
    payloads = {}
    for variant in variants:
        print(f"Fitting {variant}")
        payloads[variant] = fit_variant(variant, overrides)
    if args.variant:
        index_path = PRIORITY_DIR / "index.json"
        existing = {}
        if index_path.is_file():
            existing = json.loads(index_path.read_text(encoding="utf-8")).get(
                "variants", {}
            )
        existing.update(payloads)
        write_index(existing)
    else:
        write_index(payloads)


if __name__ == "__main__":
    main()
