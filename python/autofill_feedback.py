"""Persist and look up per-site autofill mapping corrections."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _norm_label(text: str) -> str:
    t = (text or "").lower()
    t = re.sub(r"[^\w\s]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def field_signature(field: dict[str, Any] | None = None, *, name: str = "", id_: str = "", label: str = "", type_: str = "") -> str:
    if field:
        name = str(field.get("name") or "")
        id_ = str(field.get("id") or "")
        label = str(field.get("label") or "")
        type_ = str(field.get("type") or "")
    return "|".join([name, id_, _norm_label(label)[:80], type_])


def load_mappings(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {"version": 1, "hosts": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"version": 1, "hosts": {}}
    if not isinstance(data, dict):
        return {"version": 1, "hosts": {}}
    data.setdefault("version", 1)
    data.setdefault("hosts", {})
    return data


def save_mappings(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def lookup_learned_mapping(store: dict[str, Any], host: str, field: dict[str, Any]) -> dict[str, Any] | None:
    hosts = store.get("hosts") or {}
    host_entry = hosts.get(host) or {}
    mappings = host_entry.get("mappings") or {}
    sig = field_signature(field)
    hit = mappings.get(sig)
    if hit:
        return hit
    # Fallback: match by normalized label only within host
    label = _norm_label(str(field.get("label") or ""))
    if not label:
        return None
    for _sig, entry in mappings.items():
        if _norm_label(str(entry.get("label") or "")) == label:
            return entry
    return None


def apply_feedback(
    path: Path,
    *,
    host: str,
    url: str = "",
    job_id: str | None = None,
    corrections: list[dict[str, Any]],
) -> dict[str, Any]:
    store = load_mappings(path)
    hosts = store.setdefault("hosts", {})
    host_entry = hosts.setdefault(host, {"mappings": {}, "updated_at": None})
    mappings = host_entry.setdefault("mappings", {})
    now = datetime.now(timezone.utc).isoformat()

    saved = 0
    for corr in corrections or []:
        sig = corr.get("field_signature") or field_signature(
            name=str(corr.get("name") or ""),
            id_=str(corr.get("id") or ""),
            label=str(corr.get("label") or ""),
            type_=str(corr.get("type") or ""),
        )
        key = corr.get("canonical_key")
        if not sig or not key:
            continue
        mappings[sig] = {
            "canonical_key": key,
            "custom_value": corr.get("custom_value"),
            "label": corr.get("label") or "",
            "name": corr.get("name") or "",
            "id": corr.get("id") or "",
            "updated_at": now,
            "job_id": job_id,
            "url": url,
        }
        saved += 1

    host_entry["updated_at"] = now
    store["updated_at"] = now
    save_mappings(path, store)
    return {"ok": True, "host": host, "saved": saved, "path": str(path.resolve())}
