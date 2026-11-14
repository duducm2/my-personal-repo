"""Face detection using OpenCV YuNet (when ONNX model present) with Haar cascade fallback."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import cv2
import numpy as np

YUNET_MODEL = Path(__file__).resolve().parent / "models" / "face_detection_yunet_2023mar.onnx"


def _expand_box(
    x: int, y: int, w: int, h: int, img_w: int, img_h: int, pad: float = 0.15
) -> tuple[int, int, int, int]:
    dx = int(round(w * pad))
    dy = int(round(h * pad))
    nx = max(0, x - dx)
    ny = max(0, y - dy)
    nw = min(img_w - nx, w + 2 * dx)
    nh = min(img_h - ny, h + 2 * dy)
    return nx, ny, max(1, nw), max(1, nh)


def detect_face_regions(image_path: Path) -> list[dict[str, Any]]:
    """Detect human faces in an image and return ellipse blur regions."""
    data = np.fromfile(str(image_path), dtype=np.uint8)
    bgr = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if bgr is None:
        return []
    img_h, img_w = bgr.shape[:2]

    boxes: list[tuple[int, int, int, int]] = []
    if YUNET_MODEL.is_file() and hasattr(cv2, "FaceDetectorYN"):
        detector = cv2.FaceDetectorYN.create(
            str(YUNET_MODEL), "", (img_w, img_h), score_threshold=0.7
        )
        _, faces = detector.detect(bgr)
        if faces is not None:
            for f in faces:
                boxes.append((int(f[0]), int(f[1]), int(f[2]), int(f[3])))
    else:
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        cascade = cv2.CascadeClassifier(cascade_path)
        min_dim = max(24, int(min(img_w, img_h) * 0.04))
        detected = cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(min_dim, min_dim)
        )
        for x, y, w, h in detected:
            boxes.append((int(x), int(y), int(w), int(h)))

    regions: list[dict[str, Any]] = []
    for idx, (x, y, w, h) in enumerate(boxes, start=1):
        nx, ny, nw, nh = _expand_box(x, y, w, h, img_w, img_h)
        regions.append(
            {
                "id": f"face-{idx}",
                "type": "ellipse",
                "x": nx,
                "y": ny,
                "w": nw,
                "h": nh,
                "effect": "blur",
                "source": "face",
            }
        )
    return regions
