"""User-initiated, non-destructive image anonymization engine."""

from __future__ import annotations

import io
from pathlib import Path
from typing import Any

from .detect_faces import detect_face_regions
from .detect_text import detect_text_regions
from .pii_rules import match_sensitive_text
from .render import render_anonymized
from .storage import (
    PREVIEW_DIR,
    confirm_anonymization,
    create_preview_file,
    get_anonymization_status,
    load_registry,
    normalize_rel,
    resolve_display_path,
    resolve_source_path,
    revert_anonymization,
)


def detect_regions(
    image_rel: str,
    method: str = "auto",
    params: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Detect anonymizable regions and recommend the best method for the image."""
    params = params or {}
    img_path = resolve_source_path(image_rel)
    keywords = params.get("keywords") or []
    if isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(",") if k.strip()]

    # Always run lightweight detection for recommendation if method == "auto"
    faces = detect_face_regions(img_path) if method in ("auto", "faces") else []
    ocr_regions = (
        detect_text_regions(img_path)
        if method in ("auto", "all_text_pixelate", "all_text_lorem", "sensitive_text")
        else []
    )

    recommended = "all_text_pixelate"
    if faces:
        recommended = "faces"
    elif ocr_regions:
        sensitive_hits = [
            r for r in ocr_regions if match_sensitive_text(r.get("text", ""), keywords)
        ]
        if sensitive_hits:
            recommended = "sensitive_text"

    chosen = recommended if method == "auto" else method
    regions: list[dict[str, Any]] = []

    if chosen == "faces":
        regions = faces or detect_face_regions(img_path)
    elif chosen == "all_text_pixelate":
        for r in ocr_regions:
            regions.append({**r, "effect": "pixelate"})
    elif chosen == "all_text_lorem":
        for r in ocr_regions:
            regions.append({**r, "effect": "lorem"})
    elif chosen == "sensitive_text":
        for r in ocr_regions:
            reasons = match_sensitive_text(r.get("text", ""), keywords)
            if reasons:
                regions.append({**r, "effect": "solid", "reasons": reasons})
    elif chosen == "whole_image":
        regions = []

    return {
        "ok": True,
        "method": chosen,
        "recommended": recommended,
        "regions": regions,
        "ocr_regions": ocr_regions,
        "stats": {
            "faces": len(faces),
            "ocr_boxes": len(ocr_regions),
            "selected_regions": len(regions),
        },
    }


def render_preview(image_rel: str, recipe: dict[str, Any]) -> dict[str, Any]:
    """Render an anonymized preview PNG into my-data/anon-previews/."""
    img_path = resolve_source_path(image_rel)
    out_img = render_anonymized(img_path, recipe)
    buf = io.BytesIO()
    out_img.save(buf, format="PNG")
    preview_id, preview_path = create_preview_file(buf.getvalue())
    return {
        "ok": True,
        "preview_id": preview_id,
        "preview_url": f"/api/anonymize/preview/{preview_id}.png",
        "width": out_img.width,
        "height": out_img.height,
        "preview_path": str(preview_path),
    }


def confirm_from_preview(
    image_rel: str,
    preview_id: str | None,
    recipe: dict[str, Any],
) -> dict[str, Any]:
    """Persist the confirmed anonymized image (from preview or fresh render) and update registry."""
    img_path = resolve_source_path(image_rel)
    img_bytes: bytes | None = None
    if preview_id:
        safe_id = "".join(ch for ch in preview_id if ch.isalnum())
        cand = PREVIEW_DIR / f"{safe_id}.png"
        if cand.is_file():
            img_bytes = cand.read_bytes()
    if img_bytes is None:
        out_img = render_anonymized(img_path, recipe)
        buf = io.BytesIO()
        out_img.save(buf, format="PNG")
        img_bytes = buf.getvalue()

    row = confirm_anonymization(normalize_rel(img_path), img_bytes, recipe)
    return {"ok": True, "row": row}


__all__ = [
    "confirm_from_preview",
    "detect_regions",
    "get_anonymization_status",
    "load_registry",
    "render_preview",
    "resolve_display_path",
    "revert_anonymization",
]
