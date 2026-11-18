"""Batch extraction & Desktop .txt ingestion coordinator for job openings."""

from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import time
from datetime import datetime
from pathlib import Path
from typing import Any

import environment
from environment import ROOT_DIR, get_ahk_exe, get_desktop_dir, log_error, log_info

EXTRACTION_MAP_PATH = ROOT_DIR / "my-data" / "canonical" / "portal_extraction_map.json"
BATCH_AHK_PATH = ROOT_DIR / "scripts" / "ahk" / "batch_extract_openings.ahk"
INSPECT_AHK_PATH = ROOT_DIR / "scripts" / "ahk" / "inspect_portal_uia.ahk"

_SAFE_ID_RE = re.compile(r"^[a-zA-Z0-9_-]+$")


def sanitize_company_id(company_id: str) -> str:
    cid = (company_id or "").strip()
    if not cid or not _SAFE_ID_RE.match(cid):
        raise ValueError(f"Invalid company_id: {company_id!r}")
    return cid


def desktop_txt_path(company_id: str) -> Path:
    cid = sanitize_company_id(company_id)
    return get_desktop_dir() / f"{cid}-openings.txt"


def load_extraction_map() -> dict[str, dict[str, Any]]:
    if not EXTRACTION_MAP_PATH.is_file():
        return {}
    try:
        data = json.loads(EXTRACTION_MAP_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception as exc:
        log_error("Failed to load portal_extraction_map.json", exc)
        return {}


def _company_portal_url(row: dict[str, Any], mapping: dict[str, Any] | None) -> str:
    if mapping and str(mapping.get("url") or "").strip():
        return str(mapping["url"]).strip()
    for key in ("ats_url", "careers_url", "website"):
        val = str(row.get(key) or "").strip()
        if val:
            return val
    return ""


def _is_pinned(row: dict[str, Any]) -> bool:
    return str(row.get("pinned") or "").strip().lower() in ("1", "true", "yes", "y")


def get_batch_status(store: Any) -> dict[str, Any]:
    collections = store.load_all()
    companies = collections.get("companies") or []
    ext_map = load_extraction_map()
    desktop = get_desktop_dir()

    items: list[dict[str, Any]] = []
    for row in companies:
        cid = str(row.get("id") or "").strip()
        if not cid:
            continue
        mapping = ext_map.get(cid)
        url = _company_portal_url(row, mapping)
        if not url:
            continue
        pinned = _is_pinned(row)
        txt_file = desktop / f"{cid}-openings.txt"
        txt_exists = txt_file.is_file()
        txt_mtime = ""
        txt_size = 0
        if txt_exists:
            try:
                st = txt_file.stat()
                txt_size = st.st_size
                txt_mtime = datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M")
            except OSError:
                pass
        items.append(
            {
                "id": cid,
                "name": str(row.get("name_en") or row.get("name_pt") or cid).strip(),
                "city": str(row.get("city_en") or "").strip(),
                "pinned": pinned,
                "url": url,
                "family": str((mapping or {}).get("family") or row.get("ats_name") or "Custom"),
                "strategy": str((mapping or {}).get("strategy") or "single_page_copy"),
                "mapped": mapping is not None,
                "txt_exists": txt_exists,
                "txt_name": txt_file.name,
                "txt_mtime": txt_mtime,
                "txt_size": txt_size,
            }
        )

    items.sort(key=lambda x: (0 if x["pinned"] else 1, x["name"].lower()))
    return {
        "ok": True,
        "desktop_dir": str(desktop),
        "companies": items,
    }


def read_desktop_txt(company_id: str) -> dict[str, Any]:
    path = desktop_txt_path(company_id)
    if not path.is_file():
        return {
            "ok": True,
            "exists": False,
            "file_name": path.name,
            "file_path": str(path),
            "content": "",
        }
    content = path.read_text(encoding="utf-8-sig", errors="replace")
    st = path.stat()
    return {
        "ok": True,
        "exists": True,
        "file_name": path.name,
        "file_path": str(path),
        "mtime": datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M"),
        "size": st.st_size,
        "content": content,
    }


def _clean_tsv(value: Any) -> str:
    return str(value or "").replace("\t", " ").replace("\r", " ").replace("\n", " ").strip()


def run_batch_extraction(
    store: Any,
    company_ids: list[str] | None = None,
    *,
    timeout: float = 600,
) -> dict[str, Any]:
    if not BATCH_AHK_PATH.is_file():
        raise RuntimeError(f"Batch AHK script not found: {BATCH_AHK_PATH}")

    status = get_batch_status(store)
    by_id = {c["id"]: c for c in status["companies"]}
    ext_map = load_extraction_map()

    if company_ids:
        selected_ids = [sanitize_company_id(cid) for cid in company_ids if str(cid).strip()]
    else:
        selected_ids = [c["id"] for c in status["companies"] if c["pinned"]]

    manifest_lines: list[str] = []
    for cid in selected_ids:
        info = by_id.get(cid)
        if not info or not info["url"]:
            continue
        m = ext_map.get(cid) or {}
        btn = m.get("button_match") or {}
        out_path = desktop_txt_path(cid)
        cols = [
            _clean_tsv(cid),
            _clean_tsv(info["name"]),
            _clean_tsv(info["url"]),
            _clean_tsv(m.get("strategy") or "single_page_copy"),
            _clean_tsv(btn.get("Type") or ""),
            _clean_tsv(btn.get("Name") or ""),
            _clean_tsv(m.get("max_clicks") or 10),
            _clean_tsv(m.get("wait_ms") or 2500),
            _clean_tsv(m.get("extract_mode") or "ctrl_a_copy"),
            _clean_tsv(out_path),
        ]
        manifest_lines.append("\t".join(cols))

    if not manifest_lines:
        return {"ok": True, "desktop_dir": str(get_desktop_dir()), "items": [], "error": ""}

    exe = get_ahk_exe()
    if not exe.is_file():
        raise RuntimeError(f"AutoHotkey v2 executable not found: {exe}")

    with tempfile.TemporaryDirectory(prefix="openings-batch-") as tmp:
        tmp_dir = Path(tmp)
        manifest_path = tmp_dir / "manifest.tsv"
        result_path = tmp_dir / "result.json"
        manifest_path.write_text("\n".join(manifest_lines) + "\n", encoding="utf-8")

        command = [
            str(exe),
            "/ErrorStdOut",
            str(BATCH_AHK_PATH),
            "--manifest",
            str(manifest_path),
            "--result",
            str(result_path),
        ]
        log_info(f"Starting batch extraction for {len(manifest_lines)} companies", {"ids": selected_ids})
        completed = subprocess.run(  # noqa: S603
            command,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
        )
        if result_path.is_file():
            payload = json.loads(result_path.read_text(encoding="utf-8-sig"))
        else:
            detail = (completed.stderr or completed.stdout or f"exit {completed.returncode}").strip()
            raise RuntimeError(f"Batch AHK produced no result: {detail[:600]}")

        payload["desktop_dir"] = str(get_desktop_dir())
        return payload


def launch_uia_inspector(url: str = "") -> dict[str, Any]:
    if not INSPECT_AHK_PATH.is_file():
        raise RuntimeError(f"UIA inspect script not found: {INSPECT_AHK_PATH}")
    exe = get_ahk_exe()
    cmd = [str(exe), str(INSPECT_AHK_PATH)]
    if url.strip():
        cmd.extend(["--url", url.strip()])
    subprocess.Popen(cmd)  # noqa: S603
    return {"ok": True, "inspector": str(environment.get_uia_inspector_path())}
