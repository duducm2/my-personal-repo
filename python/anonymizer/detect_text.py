"""Lazy RapidOCR text detection wrapper."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image

_OCR_ENGINE = None


def _get_ocr():
    global _OCR_ENGINE
    if _OCR_ENGINE is None:
        from rapidocr_onnxruntime import RapidOCR

        _OCR_ENGINE = RapidOCR()
    return _OCR_ENGINE


def detect_text_regions(image_path: Path, max_side: int = 2000) -> list[dict[str, Any]]:
    """Run RapidOCR on an image and return normalized bounding-box regions."""
    with Image.open(image_path) as im:
        im = im.convert("RGB")
        orig_w, orig_h = im.size
        long_side = max(orig_w, orig_h)
        scale = 1.0
        if long_side > max_side:
            scale = max_side / float(long_side)
            new_size = (max(1, int(round(orig_w * scale))), max(1, int(round(orig_h * scale))))
            im = im.resize(new_size, Image.Resampling.BILINEAR)
        arr = np.array(im)

    ocr = _get_ocr()
    result, _ = ocr(arr)
    if not result:
        return []

    inv_scale = 1.0 / scale
    regions: list[dict[str, Any]] = []
    for idx, item in enumerate(result, start=1):
        box, text, score = item[0], item[1], item[2]
        xs = [pt[0] * inv_scale for pt in box]
        ys = [pt[1] * inv_scale for pt in box]
        x0 = max(0, int(round(min(xs))) - 2)
        y0 = max(0, int(round(min(ys))) - 2)
        x1 = min(orig_w, int(round(max(xs))) + 2)
        y1 = min(orig_h, int(round(max(ys))) + 2)
        w = max(1, x1 - x0)
        h = max(1, y1 - y0)
        regions.append(
            {
                "id": f"ocr-{idx}",
                "type": "rect",
                "x": x0,
                "y": y0,
                "w": w,
                "h": h,
                "text": str(text or ""),
                "confidence": float(score or 0.0),
                "source": "ocr",
            }
        )
    return regions
