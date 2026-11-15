"""Freeze and compare resume, portfolio, and canonical content baselines."""

from __future__ import annotations

import difflib
import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DEFAULT_ROOT = Path(__file__).resolve().parents[1]

VARIANTS = (
    "ux-researcher",
    "product-owner",
    "data-analyst",
    "digital-solution-architect",
)

CANONICAL_FILES = (
    "my-data/canonical/profile.csv",
    "my-data/canonical/about_linkedin.csv",
    "my-data/canonical/languages.csv",
    "my-data/canonical/target_titles.csv",
    "my-data/canonical/experience.csv",
    "my-data/canonical/experience_bullets.csv",
    "my-data/canonical/experience_linkedin.csv",
    "my-data/canonical/skills.csv",
    "my-data/canonical/education.csv",
    "my-data/canonical/education_linkedin.csv",
    "my-data/canonical/publications.csv",
    "my-data/canonical/additional.csv",
    "my-data/canonical/recognitions.csv",
    "my-data/canonical/certifications.csv",
    "my-data/canonical/courses.csv",
    "my-data/canonical/competences.csv",
    "my-data/canonical/volunteering.csv",
    "my-data/canonical/projects.csv",
    "my-data/canonical/narratives.csv",
    "my-data/canonical/field_labels.csv",
    "my-data/canonical/resume_settings.csv",
    "my-data/canonical/resume_priority.csv",
    "my-data/canonical/portfolio_images.csv",
    "my-data/canonical/deliverable_covers.json",
    "my-data/canonical/deliverables_overrides.json",
)

MAX_DIFF_LINES = 400


def _tracked_specs(root: Path) -> list[tuple[str, str]]:
    """Return list of (rel_posix_path, category) for all tracked content."""
    specs: list[tuple[str, str]] = []
    seen: set[str] = set()

    def add(rel: str, category: str) -> None:
        norm = rel.replace("\\", "/")
        if norm not in seen:
            seen.add(norm)
            specs.append((norm, category))

    for variant in VARIANTS:
        for lang in ("en", "pt"):
            add(f"resume/variants/{variant}/content.{lang}.typ", "resumes")
            add(f"portfolio/variants/{variant}/portfolio-deck.{lang}.md", "portfolios")
        add(f"docs/{variant}/index.html", "portfolios")
        add(f"docs/{variant}/path.js", "portfolios")

    for lang in ("en", "pt"):
        add(f"resume/typst/content.{lang}.typ", "resumes")

    add("docs/index.html", "portfolios")
    add("docs/lang.js", "portfolios")

    for rel in CANONICAL_FILES:
        add(rel, "canonical")

    return specs


def _categorize_path(rel: str) -> str:
    norm = rel.replace("\\", "/")
    if norm.startswith("resume/"):
        return "resumes"
    if norm.startswith("portfolio/") or norm.startswith("docs/"):
        return "portfolios"
    return "canonical"


def _detect_variant(rel: str) -> str:
    norm = rel.replace("\\", "/")
    for variant in VARIANTS:
        if f"/{variant}/" in norm:
            return variant
    return "shared"


def _sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def _git_head(root: Path) -> str:
    try:
        proc = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=str(root),
            capture_output=True,
            text=True,
            check=False,
        )
        if proc.returncode == 0:
            return proc.stdout.strip()
    except OSError:
        pass
    return ""


def _frozen_dir(root: Path) -> Path:
    return root / "my-data" / "frozen"


def get_history(root: Path | None = None) -> list[dict[str, Any]]:
    base = root or DEFAULT_ROOT
    hist_path = _frozen_dir(base) / "history.json"
    if not hist_path.is_file():
        return []
    try:
        data = json.loads(hist_path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (OSError, json.JSONDecodeError):
        return []


def _compute_file_diff(
    rel: str,
    category: str,
    frozen_text: str | None,
    live_text: str | None,
) -> dict[str, Any] | None:
    if frozen_text == live_text:
        return None

    if frozen_text is None and live_text is not None:
        status = "added"
        old_lines: list[str] = []
        new_lines = live_text.splitlines()
    elif frozen_text is not None and live_text is None:
        status = "removed"
        old_lines = frozen_text.splitlines()
        new_lines = []
    else:
        status = "modified"
        old_lines = (frozen_text or "").splitlines()
        new_lines = (live_text or "").splitlines()
        if old_lines == new_lines:
            return None

    diff_iter = list(
        difflib.unified_diff(
            old_lines,
            new_lines,
            fromfile=f"frozen/{rel}",
            tofile=f"current/{rel}",
            lineterm="",
            n=3,
        )
    )

    additions = sum(
        1 for line in diff_iter if line.startswith("+") and not line.startswith("+++")
    )
    deletions = sum(
        1 for line in diff_iter if line.startswith("-") and not line.startswith("---")
    )
    truncated = len(diff_iter) > MAX_DIFF_LINES
    if truncated:
        diff_iter = diff_iter[:MAX_DIFF_LINES]

    return {
        "path": rel,
        "category": category,
        "variant": _detect_variant(rel),
        "status": status,
        "additions": additions,
        "deletions": deletions,
        "diff_lines": diff_iter,
        "truncated": truncated,
    }


def compare_with_frozen(
    category: str | None = None,
    root: Path | None = None,
) -> dict[str, Any]:
    """Compare current live resume/portfolio/canonical files against frozen baseline."""
    base = root or DEFAULT_ROOT
    fdir = _frozen_dir(base)
    manifest_path = fdir / "manifest.json"
    current_snap_dir = fdir / "current"

    if not manifest_path.is_file() or not current_snap_dir.is_dir():
        return {
            "frozen": False,
            "manifest": None,
            "summary": {
                "total_changed": 0,
                "resumes": 0,
                "portfolios": 0,
                "canonical": 0,
            },
            "changes": [],
        }

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    specs = _tracked_specs(base)
    spec_map = {rel: cat for rel, cat in specs}

    # Include any files that existed in the frozen snapshot even if removed from specs
    all_rels = list(spec_map.keys())
    for snap_file in sorted(current_snap_dir.rglob("*")):
        if snap_file.is_file():
            rel = snap_file.relative_to(current_snap_dir).as_posix()
            if rel not in spec_map:
                spec_map[rel] = _categorize_path(rel)
                all_rels.append(rel)

    changes: list[dict[str, Any]] = []
    counts = {"resumes": 0, "portfolios": 0, "canonical": 0}

    for rel in all_rels:
        cat = spec_map[rel]
        live_path = base / rel
        snap_path = current_snap_dir / rel

        live_text = _read_text(live_path) if live_path.is_file() else None
        snap_text = _read_text(snap_path) if snap_path.is_file() else None

        if live_text is None and snap_text is None:
            continue

        item = _compute_file_diff(rel, cat, snap_text, live_text)
        if item is not None:
            counts[cat] = counts.get(cat, 0) + 1
            if category is None or category == "all" or cat == category:
                changes.append(item)

    total_changed = sum(counts.values())
    return {
        "frozen": True,
        "manifest": manifest,
        "summary": {
            "total_changed": total_changed,
            **counts,
        },
        "changes": changes,
    }


def freeze_current(
    note: str = "",
    root: Path | None = None,
) -> dict[str, Any]:
    """Snapshot current resume, portfolio, and canonical files as the frozen baseline."""
    base = root or DEFAULT_ROOT
    fdir = _frozen_dir(base)
    fdir.mkdir(parents=True, exist_ok=True)
    current_snap_dir = fdir / "current"

    now_iso = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    git_head = _git_head(base)
    clean_note = note.strip()

    # Record previous diff summary in history if a frozen baseline already exists
    history = get_history(base)
    if (fdir / "manifest.json").is_file() and current_snap_dir.is_dir():
        prev_cmp = compare_with_frozen(root=base)
        changed_files = [
            {
                "path": c["path"],
                "category": c["category"],
                "status": c["status"],
                "additions": c["additions"],
                "deletions": c["deletions"],
            }
            for c in prev_cmp["changes"]
        ]
        checkpoint = {
            "frozen_at": now_iso,
            "note": clean_note,
            "git_head": git_head,
            "changed_count": len(changed_files),
            "changed_files": changed_files,
        }
        history.insert(0, checkpoint)
    else:
        checkpoint = {
            "frozen_at": now_iso,
            "note": clean_note or "Initial frozen baseline",
            "git_head": git_head,
            "changed_count": 0,
            "changed_files": [],
        }
        history.insert(0, checkpoint)

    # Update current/ snapshot in-place (avoids Windows / Google Drive directory lock on rmtree)
    current_snap_dir.mkdir(parents=True, exist_ok=True)
    hashes: dict[str, str] = {}
    file_count = 0
    written_rels: set[str] = set()
    for rel, _cat in _tracked_specs(base):
        src = base / rel
        if not src.is_file():
            continue
        dst = current_snap_dir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        text = _read_text(src)
        file_hash = _sha256_text(text)
        hashes[rel] = file_hash
        written_rels.add(rel)
        file_count += 1
        if dst.is_file() and _sha256_text(_read_text(dst)) == file_hash:
            continue
        dst.write_text(text, encoding="utf-8")

    # Remove any stale files in current/ that are no longer tracked
    for old_file in list(current_snap_dir.rglob("*")):
        if old_file.is_file():
            rel = old_file.relative_to(current_snap_dir).as_posix()
            if rel not in written_rels:
                old_file.unlink(missing_ok=True)

    manifest = {
        "frozen_at": now_iso,
        "note": clean_note,
        "git_head": git_head,
        "file_count": file_count,
        "hashes": hashes,
    }
    (fdir / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (fdir / "history.json").write_text(
        json.dumps(history[:50], indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    return {
        "ok": True,
        "manifest": manifest,
        "history": history[:50],
        "status": compare_with_frozen(root=base),
    }
