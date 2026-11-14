"""Tests for the non-destructive image anonymizer engine and storage guard."""

from __future__ import annotations

import io
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "python"))

from anonymizer.pii_rules import match_sensitive_text  # noqa: E402
from anonymizer.render import render_anonymized  # noqa: E402
from anonymizer.storage import (  # noqa: E402
    confirm_anonymization,
    resolve_display_path,
    revert_anonymization,
    safe_write,
    sha256_file,
    unique_path,
)


def _make_sample_image(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im = Image.new("RGB", (200, 120), (245, 245, 245))
    draw = ImageDraw.Draw(im)
    draw.rectangle((20, 20, 100, 60), fill=(20, 40, 180))
    draw.text((25, 30), "Secret", fill=(255, 255, 255))
    im.save(path, format="PNG")


def test_pii_rules_cover_emails_cpf_currency_and_fuzzy_keywords():
    assert "email" in match_sensitive_text("Contact: john.doe@bosch.com")
    assert "cpf" in match_sensitive_text("CPF 123.456.789-01")
    assert "currency" in match_sensitive_text("Saved 150,000 EUR/quarter")
    assert any(r.startswith("kw:") for r in match_sensitive_text("Medline case study", ["medline"]))
    assert any(r.startswith("kw:") for r in match_sensitive_text("Maxion Wheeis", ["Maxion"]))
    assert match_sensitive_text("Dashboard Overview", ["Medline"]) == []


def test_render_isolates_pixels_to_regions(tmp_path: Path):
    src = tmp_path / "sample.png"
    _make_sample_image(src)
    orig_arr = np.array(Image.open(src).convert("RGB"))

    for effect in ("pixelate", "solid", "blur", "lorem"):
        recipe = {
            "method": "manual",
            "strength": 3,
            "regions": [{"type": "rect", "x": 20, "y": 20, "w": 80, "h": 40, "effect": effect}],
        }
        out = render_anonymized(src, recipe)
        out_arr = np.array(out)
        # Outside region (e.g. bottom-right corner) is byte-identical
        assert np.array_equal(orig_arr[80:, 120:], out_arr[80:, 120:])
        # Inside region changed
        assert not np.array_equal(orig_arr[20:60, 20:100], out_arr[20:60, 20:100])


def test_safe_write_never_overwrites_originals_or_unrelated_files(tmp_path: Path, monkeypatch):
    import anonymizer.storage as st

    monkeypatch.setattr(st, "ROOT_DIR", tmp_path)
    monkeypatch.setattr(st, "PICTURES_DIR", tmp_path / "pictures")
    monkeypatch.setattr(st, "DOCS_MEDIA_DIR", tmp_path / "docs" / "media")
    monkeypatch.setattr(st, "DOCS_ANON_DIR", tmp_path / "docs" / "media" / "anon")
    monkeypatch.setattr(st, "PREVIEW_DIR", tmp_path / "my-data" / "anon-previews")
    reg = tmp_path / "my-data" / "canonical" / "image_anonymizations.csv"
    monkeypatch.setattr(st, "REGISTRY_PATH", reg)

    orig = tmp_path / "pictures" / "work" / "proj" / "secret.png"
    _make_sample_image(orig)
    orig_hash = sha256_file(orig)

    # Cannot write outside anonymization folders
    with pytest.raises(PermissionError):
        safe_write(orig, b"bad", registry_path=reg)

    # Confirm creates anonymized copy without touching original
    out_img = render_anonymized(
        orig,
        {"method": "manual", "regions": [{"type": "rect", "x": 20, "y": 20, "w": 80, "h": 40, "effect": "solid"}]},
    )
    buf = io.BytesIO()
    out_img.save(buf, format="PNG")
    row = confirm_anonymization("pictures/work/proj/secret.png", buf.getvalue(), {"method": "manual", "regions": []}, registry_path=reg)

    assert sha256_file(orig) == orig_hash
    assert resolve_display_path("pictures/work/proj/secret.png", registry_path=reg) == row["anonymized_path"]

    # Unrelated existing file inside _anonymized cannot be overwritten
    unrelated = tmp_path / "pictures" / "work" / "proj" / "_anonymized" / "other.png"
    unrelated.write_bytes(b"keep")
    with pytest.raises(FileExistsError):
        safe_write(unrelated, b"overwrite", allowed_existing_for_orig="pictures/work/proj/secret.png", registry_path=reg)

    # Revert falls back to original
    assert revert_anonymization("pictures/work/proj/secret.png", registry_path=reg) is True
    assert resolve_display_path("pictures/work/proj/secret.png", registry_path=reg) == "pictures/work/proj/secret.png"
    assert sha256_file(orig) == orig_hash


def test_unique_path_prevents_upload_overwrite(tmp_path: Path):
    first = tmp_path / "photo.png"
    first.write_bytes(b"one")
    second = unique_path(first)
    assert second.name == "photo-2.png"
    second.write_bytes(b"two")
    third = unique_path(first)
    assert third.name == "photo-3.png"
    assert first.read_bytes() == b"one"
