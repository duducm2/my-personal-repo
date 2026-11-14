"""Non-destructive storage, registry CSV, path validation, and never-overwrite guard."""

from __future__ import annotations

import csv
import hashlib
import json
import os
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
PICTURES_DIR = ROOT_DIR / "pictures"
DOCS_MEDIA_DIR = ROOT_DIR / "docs" / "media"
DOCS_ANON_DIR = DOCS_MEDIA_DIR / "anon"
PREVIEW_DIR = ROOT_DIR / "my-data" / "anon-previews"
REGISTRY_PATH = ROOT_DIR / "my-data" / "canonical" / "image_anonymizations.csv"

REGISTRY_COLUMNS = [
    "original_path",
    "original_sha256",
    "anonymized_path",
    "recipe_path",
    "method",
    "status",
    "updated_at",
]

ALLOWED_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def normalize_rel(path: str | Path) -> str:
    p = Path(path)
    if p.is_absolute():
        return p.resolve().relative_to(ROOT_DIR.resolve()).as_posix()
    return str(path).replace("\\", "/").lstrip("/")


def resolve_source_path(rel_or_abs: str | Path) -> Path:
    """Resolve an image path and ensure it lives under pictures/ or docs/media/."""
    raw = str(rel_or_abs).strip().lstrip("/")
    cand = (ROOT_DIR / raw).resolve() if not Path(raw).is_absolute() else Path(raw).resolve()
    pic_root = PICTURES_DIR.resolve()
    med_root = DOCS_MEDIA_DIR.resolve()
    in_pictures = cand == pic_root or pic_root in cand.parents
    in_media = cand == med_root or med_root in cand.parents
    if not (in_pictures or in_media):
        raise ValueError(f"Path outside allowed image roots: {rel_or_abs}")
    if cand.suffix.lower() not in ALLOWED_EXTS:
        raise ValueError(f"Unsupported image extension: {cand.suffix}")
    if not cand.is_file():
        raise FileNotFoundError(f"Image not found: {rel_or_abs}")
    return cand


def unique_path(dest: Path) -> Path:
    """Return a non-colliding path (foo.png -> foo-2.png) so uploads never overwrite."""
    if not dest.exists():
        return dest
    stem = dest.stem
    suffix = dest.suffix
    parent = dest.parent
    counter = 2
    while True:
        cand = parent / f"{stem}-{counter}{suffix}"
        if not cand.exists():
            return cand
        counter += 1


def load_registry(registry_path: Path = REGISTRY_PATH) -> list[dict[str, str]]:
    if not registry_path.is_file():
        return []
    with registry_path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def _write_registry(rows: list[dict[str, str]], registry_path: Path = REGISTRY_PATH) -> None:
    registry_path.parent.mkdir(parents=True, exist_ok=True)
    with registry_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=REGISTRY_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: str(row.get(k, "")).strip() for k in REGISTRY_COLUMNS})


def _is_in_safe_output_dir(target: Path) -> bool:
    res = target.resolve()
    if PREVIEW_DIR.resolve() in res.parents:
        return True
    if DOCS_ANON_DIR.resolve() in res.parents:
        return True
    if res.parent.name == "_anonymized" and (
        PICTURES_DIR.resolve() in res.parents or DOCS_MEDIA_DIR.resolve() in res.parents
    ):
        return True
    return False


def safe_write(
    target: Path,
    data: bytes,
    *,
    allowed_existing_for_orig: str | None = None,
    registry_path: Path = REGISTRY_PATH,
) -> Path:
    """Write bytes only to designated anonymization folders, never overwriting originals."""
    res = target.resolve()
    if not _is_in_safe_output_dir(res):
        raise PermissionError(f"Refusing to write outside anonymization folders: {target}")

    rows = load_registry(registry_path)
    registered_originals = {(ROOT_DIR / r["original_path"]).resolve() for r in rows if r.get("original_path")}
    if res in registered_originals:
        raise PermissionError(f"Refusing to overwrite registered original: {target}")

    if res.exists():
        # Allow overwriting only this image's own previous anonymized output/recipe
        permitted = False
        if allowed_existing_for_orig:
            norm_orig = normalize_rel(allowed_existing_for_orig)
            for r in rows:
                if r.get("original_path") == norm_orig and res in {
                    (ROOT_DIR / r.get("anonymized_path", "")).resolve(),
                    (ROOT_DIR / r.get("recipe_path", "")).resolve(),
                }:
                    permitted = True
                    break
        if not permitted:
            raise FileExistsError(f"Refusing to overwrite unrelated existing file: {target}")

    res.parent.mkdir(parents=True, exist_ok=True)
    res.write_bytes(data)
    return res


def cleanup_old_previews(max_age_seconds: int = 86400) -> int:
    if not PREVIEW_DIR.is_dir():
        return 0
    now = time.time()
    removed = 0
    for item in PREVIEW_DIR.iterdir():
        if item.is_file() and (now - item.stat().st_mtime) > max_age_seconds:
            try:
                item.unlink()
                removed += 1
            except OSError:
                pass
    return removed


def create_preview_file(img_bytes: bytes) -> tuple[str, Path]:
    cleanup_old_previews()
    preview_id = uuid.uuid4().hex
    dest = PREVIEW_DIR / f"{preview_id}.png"
    safe_write(dest, img_bytes)
    return preview_id, dest


def canonical_anon_paths(original_rel: str) -> tuple[Path, Path]:
    orig_abs = resolve_source_path(original_rel)
    anon_dir = orig_abs.parent / "_anonymized"
    stem = orig_abs.stem
    return anon_dir / f"{stem}.anon.png", anon_dir / f"{stem}.anon.json"


def confirm_anonymization(
    original_rel: str,
    img_bytes: bytes,
    recipe: dict[str, Any],
    *,
    registry_path: Path = REGISTRY_PATH,
) -> dict[str, str]:
    orig_abs = resolve_source_path(original_rel)
    norm_orig = normalize_rel(orig_abs)
    anon_abs, recipe_abs = canonical_anon_paths(norm_orig)
    orig_sha = sha256_file(orig_abs)

    recipe_payload = dict(recipe)
    recipe_payload["original_path"] = norm_orig
    recipe_payload["original_sha256"] = orig_sha
    recipe_bytes = json.dumps(recipe_payload, indent=2, ensure_ascii=False).encode("utf-8")

    safe_write(anon_abs, img_bytes, allowed_existing_for_orig=norm_orig, registry_path=registry_path)
    safe_write(recipe_abs, recipe_bytes, allowed_existing_for_orig=norm_orig, registry_path=registry_path)

    row = {
        "original_path": norm_orig,
        "original_sha256": orig_sha,
        "anonymized_path": normalize_rel(anon_abs),
        "recipe_path": normalize_rel(recipe_abs),
        "method": str(recipe.get("method") or "manual"),
        "status": "confirmed",
        "updated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
    }

    rows = [r for r in load_registry(registry_path) if r.get("original_path") != norm_orig]
    rows.append(row)
    rows.sort(key=lambda r: r.get("original_path", ""))
    _write_registry(rows, registry_path=registry_path)
    return row


def revert_anonymization(original_rel: str, *, registry_path: Path = REGISTRY_PATH) -> bool:
    norm_orig = normalize_rel(original_rel)
    rows = load_registry(registry_path)
    kept = [r for r in rows if r.get("original_path") != norm_orig]
    if len(kept) == len(rows):
        return False
    _write_registry(kept, registry_path=registry_path)
    return True


def resolve_display_path(original_rel: str, *, registry_path: Path = REGISTRY_PATH) -> str:
    """Return anonymized_path if confirmed & existing on disk, else return original_rel."""
    norm_orig = normalize_rel(original_rel)
    for r in load_registry(registry_path):
        if r.get("original_path") == norm_orig and r.get("status") == "confirmed":
            anon_rel = r.get("anonymized_path", "").strip()
            if anon_rel and (ROOT_DIR / anon_rel).is_file():
                return anon_rel
    return original_rel


def get_anonymization_status(original_rel: str, *, registry_path: Path = REGISTRY_PATH) -> dict[str, Any]:
    norm_orig = normalize_rel(original_rel)
    for r in load_registry(registry_path):
        if r.get("original_path") == norm_orig:
            recipe_data = None
            rp = r.get("recipe_path", "")
            if rp and (ROOT_DIR / rp).is_file():
                try:
                    recipe_data = json.loads((ROOT_DIR / rp).read_text(encoding="utf-8"))
                except (OSError, json.JSONDecodeError):
                    recipe_data = None
            return {
                "anonymized": r.get("status") == "confirmed" and (ROOT_DIR / r.get("anonymized_path", "")).is_file(),
                "row": r,
                "recipe": recipe_data,
            }
    return {"anonymized": False, "row": None, "recipe": None}
