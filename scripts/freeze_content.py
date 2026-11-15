#!/usr/bin/env python3
"""CLI to freeze and compare resume, portfolio, and canonical content."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))

from content_freeze import compare_with_frozen, freeze_current, get_history  # noqa: E402


def cmd_status(category: str | None) -> int:
    res = compare_with_frozen(category=category)
    if not res["frozen"]:
        print("No frozen baseline yet. Run: python scripts/freeze_content.py freeze")
        return 0

    m = res["manifest"]
    s = res["summary"]
    print(f"Frozen at: {m.get('frozen_at', '')}")
    if m.get("note"):
        print(f"Note:      {m['note']}")
    print(f"Files:     {m.get('file_count', 0)} tracked")
    print(
        f"Changes:   {s['total_changed']} total "
        f"(resumes={s['resumes']}, portfolios={s['portfolios']}, canonical={s['canonical']})"
    )
    for item in res["changes"]:
        print(
            f"  [{item['category']}] {item['status'].upper():8s} "
            f"{item['path']} (+{item['additions']}/-{item['deletions']})"
        )
    return 0


def cmd_diff(category: str | None) -> int:
    res = compare_with_frozen(category=category)
    if not res["frozen"]:
        print("No frozen baseline yet. Run: python scripts/freeze_content.py freeze")
        return 0
    if not res["changes"]:
        print("In sync with frozen baseline (0 changes).")
        return 0
    for item in res["changes"]:
        print("=" * 72)
        print(
            f"[{item['category']}] {item['path']} "
            f"(+{item['additions']}/-{item['deletions']})"
        )
        for line in item["diff_lines"]:
            print(line)
        if item.get("truncated"):
            print("... (diff truncated)")
    return 0


def cmd_freeze(note: str) -> int:
    res = freeze_current(note=note)
    m = res["manifest"]
    print(f"Frozen {m['file_count']} files at {m['frozen_at']}")
    if m.get("note"):
        print(f"Note: {m['note']}")
    return 0


def cmd_history() -> int:
    items = get_history()
    if not items:
        print("No freeze history recorded yet.")
        return 0
    for idx, entry in enumerate(items, 1):
        note = f" — {entry['note']}" if entry.get("note") else ""
        head = f" [{entry['git_head']}]" if entry.get("git_head") else ""
        print(
            f"{idx}. {entry['frozen_at']}{head}: "
            f"{entry.get('changed_count', 0)} changed files{note}"
        )
        for f in entry.get("changed_files", []):
            print(
                f"     - [{f['category']}] {f['path']} "
                f"(+{f['additions']}/-{f['deletions']})"
            )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Freeze and compare resume and portfolio content"
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_status = sub.add_parser("status", help="Show summary of changes vs frozen")
    p_status.add_argument(
        "--category", choices=("all", "resumes", "portfolios", "canonical")
    )

    p_diff = sub.add_parser("diff", help="Show unified diff vs frozen")
    p_diff.add_argument(
        "--category", choices=("all", "resumes", "portfolios", "canonical")
    )

    p_freeze = sub.add_parser("freeze", help="Freeze current content as baseline")
    p_freeze.add_argument("--note", default="", help="Optional review note")

    sub.add_parser("history", help="Show past freeze checkpoints")

    args = parser.parse_args()
    if args.cmd == "status":
        return cmd_status(args.category)
    if args.cmd == "diff":
        return cmd_diff(args.category)
    if args.cmd == "freeze":
        return cmd_freeze(args.note)
    if args.cmd == "history":
        return cmd_history()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
