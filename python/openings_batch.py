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
from environment import ROOT_DIR, get_ahk_exe, get_desktop_dir, log_error, log_info, no_window_kwargs

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
                "verified": bool((mapping or {}).get("verified")),
                "verified_at": str((mapping or {}).get("verified_at") or ""),
                "notes": str((mapping or {}).get("notes") or ""),
                "requirements": str((mapping or {}).get("requirements") or ""),
                "correct_example": str((mapping or {}).get("correct_example") or ""),
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
    timeout: float = 900,
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
        target_url = m.get("url") or info["url"]
        cols = [
            _clean_tsv(cid),
            _clean_tsv(info["name"]),
            _clean_tsv(target_url),
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
        import career_ahk

        use_schtasks = not career_ahk._is_default_desktop()
        if use_schtasks:
            bat_path = tmp_dir / "run_batch.bat"
            bat_parts = [
                f'"{part}"' if (" " in part or not part.startswith("--")) else part
                for part in command
            ]
            bat_path.write_text(f"@echo off\n{' '.join(bat_parts)}\n", encoding="ascii", errors="ignore")
            vbs_path = tmp_dir / "run_batch.vbs"
            vbs_path.write_text(
                f'Set sh = CreateObject("WScript.Shell")\nsh.Run """{bat_path}""", 0, False\n',
                encoding="ascii",
                errors="ignore",
            )
            tn = f"CareerBatch_{os.getpid()}"
            try:
                subprocess.run(
                    ["schtasks", "/create", "/tn", tn, "/tr", f'wscript.exe "{vbs_path}"', "/sc", "once", "/st", "23:59", "/it", "/f"],
                    check=False,
                    capture_output=True,
                    **no_window_kwargs(),
                )
                subprocess.run(
                    ["schtasks", "/run", "/tn", tn],
                    check=False,
                    capture_output=True,
                    **no_window_kwargs(),
                )
                deadline = time.monotonic() + timeout
                while time.monotonic() < deadline:
                    if result_path.is_file() and result_path.stat().st_size > 0:
                        break
                    time.sleep(0.25)
            finally:
                subprocess.run(
                    ["schtasks", "/delete", "/tn", tn, "/f"],
                    check=False,
                    capture_output=True,
                    **no_window_kwargs(),
                )
            completed_detail = f"schtasks timeout after {int(timeout)}s"
        else:
            completed = subprocess.run(  # noqa: S603
                command,
                check=False,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                **no_window_kwargs(),
            )
            completed_detail = (completed.stderr or completed.stdout or f"exit {completed.returncode}").strip()

        if result_path.is_file():
            payload = json.loads(result_path.read_text(encoding="utf-8-sig"))
        else:
            raise RuntimeError(f"Batch AHK produced no result: {completed_detail[:600]}")

        payload["desktop_dir"] = str(get_desktop_dir())
        _mark_verified_from_results(payload.get("items") or [])
        return payload


def _mark_verified_from_results(items: list[dict[str, Any]]) -> None:
    if not items or not EXTRACTION_MAP_PATH.is_file():
        return
    succeeded = [
        str(it.get("id") or "").strip()
        for it in items
        if it.get("ok") and int(it.get("chars") or 0) > 300
    ]
    if not succeeded:
        return
    try:
        ext_map = json.loads(EXTRACTION_MAP_PATH.read_text(encoding="utf-8"))
        if not isinstance(ext_map, dict):
            return
        today = datetime.now().strftime("%Y-%m-%d")
        changed = False
        for cid in succeeded:
            if cid in ext_map and isinstance(ext_map[cid], dict):
                if not ext_map[cid].get("verified"):
                    ext_map[cid]["verified"] = True
                    ext_map[cid]["verified_at"] = today
                    changed = True
        if changed:
            EXTRACTION_MAP_PATH.write_text(
                json.dumps(ext_map, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )
    except Exception as exc:
        log_error("Failed to update verified status in portal_extraction_map.json", exc)


def set_company_verified(company_id: str, verified: bool) -> dict[str, Any]:
    cid = sanitize_company_id(company_id)
    ext_map = load_extraction_map()
    entry = ext_map.get(cid)
    if not isinstance(entry, dict):
        entry = {
            "family": "Custom",
            "strategy": "single_page_copy",
            "url": "",
            "button_match": None,
            "max_clicks": 5,
            "wait_ms": 2500,
            "extract_mode": "ctrl_a_copy",
        }
        ext_map[cid] = entry
    verified_flag = bool(verified)
    verified_at = datetime.now().strftime("%Y-%m-%d") if verified_flag else ""
    entry["verified"] = verified_flag
    entry["verified_at"] = verified_at
    EXTRACTION_MAP_PATH.parent.mkdir(parents=True, exist_ok=True)
    EXTRACTION_MAP_PATH.write_text(
        json.dumps(ext_map, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return {"ok": True, "id": cid, "verified": verified_flag, "verified_at": verified_at}


def set_company_requirements(
    company_id: str,
    requirements: str,
    correct_example: str | None = None,
) -> dict[str, Any]:
    cid = sanitize_company_id(company_id)
    ext_map = load_extraction_map()
    entry = ext_map.get(cid)
    if not isinstance(entry, dict):
        entry = {
            "family": "Custom",
            "strategy": "single_page_copy",
            "url": "",
            "button_match": None,
            "max_clicks": 5,
            "wait_ms": 2500,
            "extract_mode": "ctrl_a_copy",
        }
        ext_map[cid] = entry
    req_text = str(requirements or "").strip()
    entry["requirements"] = req_text
    if correct_example is not None:
        entry["correct_example"] = str(correct_example).strip()
    EXTRACTION_MAP_PATH.parent.mkdir(parents=True, exist_ok=True)
    EXTRACTION_MAP_PATH.write_text(
        json.dumps(ext_map, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return {
        "ok": True,
        "id": cid,
        "requirements": req_text,
        "correct_example": str(entry.get("correct_example") or ""),
    }


def launch_uia_inspector(url: str = "") -> dict[str, Any]:
    if not INSPECT_AHK_PATH.is_file():
        raise RuntimeError(f"UIA inspect script not found: {INSPECT_AHK_PATH}")
    exe = get_ahk_exe()
    cmd = [str(exe), str(INSPECT_AHK_PATH)]
    if url.strip():
        cmd.extend(["--url", url.strip()])
    subprocess.Popen(cmd)  # noqa: S603
    return {"ok": True, "inspector": str(environment.get_uia_inspector_path())}
