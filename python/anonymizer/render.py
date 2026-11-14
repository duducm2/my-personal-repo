"""Pillow-based renderer for region and whole-image anonymization effects."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

LOREM_WORDS = (
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor "
    "incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud"
).split()

_FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\arial.ttf"),
    Path(r"C:\Windows\Fonts\segoeui.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
]


def _load_font(size: int) -> ImageFont.ImageFont | ImageFont.FreeTypeFont:
    size = max(8, int(size))
    for cand in _FONT_CANDIDATES:
        if cand.is_file():
            try:
                return ImageFont.truetype(str(cand), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def _sample_border_color(img: Image.Image, bbox: tuple[int, int, int, int]) -> tuple[int, int, int]:
    x0, y0, x1, y1 = bbox
    w, h = img.size
    pad_x0 = max(0, x0 - 2)
    pad_y0 = max(0, y0 - 2)
    pad_x1 = min(w, x1 + 2)
    pad_y1 = min(h, y1 + 2)
    crop = np.array(img.crop((pad_x0, pad_y0, pad_x1, pad_y1)).convert("RGB"))
    if crop.size == 0:
        return (245, 245, 245)
    edges = np.concatenate([crop[0, :], crop[-1, :], crop[:, 0], crop[:, -1]], axis=0)
    med = np.median(edges, axis=0)
    return (int(med[0]), int(med[1]), int(med[2]))


def _contrast_color(bg: tuple[int, int, int]) -> tuple[int, int, int]:
    lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]
    return (42, 42, 46) if lum > 140 else (232, 232, 236)


def _lorem_for_width(draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont | ImageFont.FreeTypeFont, max_w: int, seed_idx: int) -> str:
    words: list[str] = []
    idx = seed_idx % len(LOREM_WORDS)
    while True:
        candidate = " ".join(words + [LOREM_WORDS[idx % len(LOREM_WORDS)]])
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] > max_w and words:
            break
        words.append(LOREM_WORDS[idx % len(LOREM_WORDS)])
        idx += 1
        if len(words) >= 16:
            break
    if not words:
        return "lorem"
    return " ".join(words)


def _region_mask(size: tuple[int, int], region: dict[str, Any]) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    rtype = region.get("type", "rect")
    if rtype == "stroke":
        pts = region.get("points") or []
        width = max(4, int(region.get("width", 18)))
        if len(pts) >= 2:
            flat = [(int(round(p[0])), int(round(p[1]))) for p in pts]
            draw.line(flat, fill=255, width=width, joint="curve")
            r = width // 2
            for px, py in flat:
                draw.ellipse((px - r, py - r, px + r, py + r), fill=255)
        elif len(pts) == 1:
            px, py = int(round(pts[0][0])), int(round(pts[0][1]))
            r = width // 2
            draw.ellipse((px - r, py - r, px + r, py + r), fill=255)
    elif rtype == "ellipse":
        x, y = int(round(region["x"])), int(round(region["y"]))
        w, h = max(1, int(round(region["w"]))), max(1, int(round(region["h"])))
        draw.ellipse((x, y, x + w, y + h), fill=255)
    else:
        x, y = int(round(region["x"])), int(round(region["y"]))
        w, h = max(1, int(round(region["w"]))), max(1, int(round(region["h"])))
        draw.rectangle((x, y, x + w, y + h), fill=255)
    return mask


def _effect_pixelate(img: Image.Image, bbox: tuple[int, int, int, int], region: dict[str, Any], strength: int) -> Image.Image:
    x0, y0, x1, y1 = bbox
    cw, ch = max(1, x1 - x0), max(1, y1 - y0)
    crop = img.crop(bbox)
    block = max(6, int(round(min(ch, cw) * (0.35 + 0.12 * strength))))
    if region.get("source") == "ocr":
        block = max(block, int(round(ch * 0.6)))
    small_w = max(1, cw // block)
    small_h = max(1, ch // block)
    pix = crop.resize((small_w, small_h), Image.Resampling.BILINEAR).resize((cw, ch), Image.Resampling.NEAREST)
    out = img.copy()
    out.paste(pix, (x0, y0))
    return out


def _effect_blur(img: Image.Image, bbox: tuple[int, int, int, int], region: dict[str, Any], strength: int) -> Image.Image:
    x0, y0, x1, y1 = bbox
    cw, ch = max(1, x1 - x0), max(1, y1 - y0)
    pad = max(12, int(round(min(cw, ch) * 0.25)))
    px0, py0 = max(0, x0 - pad), max(0, y0 - pad)
    px1, py1 = min(img.width, x1 + pad), min(img.height, y1 + pad)
    crop = img.crop((px0, py0, px1, py1))
    radius = max(8, int(round(min(cw, ch) * (0.12 + 0.04 * strength))))
    blurred = crop.filter(ImageFilter.GaussianBlur(radius=radius))
    inner = blurred.crop((x0 - px0, y0 - py0, x1 - px0, y1 - py0))
    out = img.copy()
    out.paste(inner, (x0, y0))
    return out


def _effect_solid(img: Image.Image, bbox: tuple[int, int, int, int], region: dict[str, Any], strength: int) -> Image.Image:
    out = img.copy()
    draw = ImageDraw.Draw(out)
    fill = tuple(region.get("color") or (28, 25, 23))
    draw.rectangle(bbox, fill=fill)
    return out


def _effect_lorem(img: Image.Image, bbox: tuple[int, int, int, int], region: dict[str, Any], strength: int, idx: int) -> Image.Image:
    x0, y0, x1, y1 = bbox
    cw, ch = max(1, x1 - x0), max(1, y1 - y0)
    bg = _sample_border_color(img, bbox)
    fg = _contrast_color(bg)
    out = img.copy()
    draw = ImageDraw.Draw(out)
    draw.rectangle(bbox, fill=bg)
    font_size = max(8, int(round(ch * 0.72)))
    font = _load_font(font_size)
    text = _lorem_for_width(draw, font, max(10, cw - 4), idx)
    tb = draw.textbbox((0, 0), text, font=font)
    th = tb[3] - tb[1]
    ty = y0 + max(0, (ch - th) // 2) - tb[1]
    draw.text((x0 + 2, ty), text, font=font, fill=fg)
    return out


def render_anonymized(image_path: Path, recipe: dict[str, Any]) -> Image.Image:
    """Render an anonymized PIL Image from an original file and a recipe dict."""
    with Image.open(image_path) as raw:
        img = raw.convert("RGB")

    strength = int(recipe.get("strength", 3))
    strength = max(1, min(5, strength))

    if recipe.get("method") == "whole_image" and not recipe.get("regions"):
        radius = max(10, int(round(min(img.size) * (0.015 * strength))))
        return img.filter(ImageFilter.GaussianBlur(radius=radius))

    regions = recipe.get("regions") or []
    for idx, region in enumerate(regions):
        mask = _region_mask(img.size, region)
        bbox = mask.getbbox()
        if not bbox:
            continue
        effect = region.get("effect", "pixelate")
        if effect == "solid":
            patched = _effect_solid(img, bbox, region, strength)
        elif effect == "blur":
            patched = _effect_blur(img, bbox, region, strength)
        elif effect == "lorem":
            patched = _effect_lorem(img, bbox, region, strength, idx)
        else:
            patched = _effect_pixelate(img, bbox, region, strength)
        img.paste(patched, (0, 0), mask)

    return img
