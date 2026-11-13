"""Local HTTP server for the career cockpit (static web + CSV API)."""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import traceback
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

from autofill_data_source import (  # noqa: E402
    build_autofill_bundle,
    default_mappings_path,
    find_payload_by_url,
    list_autofill_jobs,
)
from autofill_feedback import apply_feedback, load_mappings  # noqa: E402
from autofill_mapper import map_fields  # noqa: E402
from canonical_store import CanonicalStore  # noqa: E402
from career_form_flow import (  # noqa: E402
    build_and_send,
    capture_window,
    fill_form,
    open_uia,
    send_prompt_text,
    session_for,
)

DEFAULT_PORT = 8770
ROOT_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT_DIR / "web"
PORTFOLIO_DIR = ROOT_DIR / "docs"
CANONICAL_DIR = ROOT_DIR / "my-data" / "canonical"
PICTURES_DIR = ROOT_DIR / "pictures"
OUTPUT_DIR = ROOT_DIR / "output"
AUTOFILL_MAPPINGS_PATH = default_mappings_path(ROOT_DIR)
AUTOFILL_PENDING_PATH = ROOT_DIR / "my-data" / "autofill" / "pending.json"

# Win+Alt+Shift+L — AutoHotkey #!+l pastes the clipboard into a chosen window.
_VK_LWIN = 0x5B
_VK_MENU = 0x12
_VK_SHIFT = 0x10
_VK_L = 0x4C
_KEYEVENTF_KEYUP = 0x0002
_KEYEVENTF_EXTENDEDKEY = 0x0001
_INPUT_KEYBOARD = 1


def send_prompt_hotkey() -> None:
    """Press Win+Alt+Shift+L so the local AutoHotkey chord runs."""
    import ctypes
    from ctypes import wintypes

    class KEYBDINPUT(ctypes.Structure):
        _fields_ = (
            ("wVk", wintypes.WORD),
            ("wScan", wintypes.WORD),
            ("dwFlags", wintypes.DWORD),
            ("time", wintypes.DWORD),
            ("dwExtraInfo", ctypes.c_ulonglong),
        )

    class MOUSEINPUT(ctypes.Structure):
        _fields_ = (
            ("dx", wintypes.LONG),
            ("dy", wintypes.LONG),
            ("mouseData", wintypes.DWORD),
            ("dwFlags", wintypes.DWORD),
            ("time", wintypes.DWORD),
            ("dwExtraInfo", ctypes.c_ulonglong),
        )

    class HARDWAREINPUT(ctypes.Structure):
        _fields_ = (
            ("uMsg", wintypes.DWORD),
            ("wParamL", wintypes.WORD),
            ("wParamH", wintypes.WORD),
        )

    class INPUT_UNION(ctypes.Union):
        _fields_ = (("mi", MOUSEINPUT), ("ki", KEYBDINPUT), ("hi", HARDWAREINPUT))

    class INPUT(ctypes.Structure):
        _fields_ = (("type", wintypes.DWORD), ("union", INPUT_UNION))

    if ctypes.sizeof(INPUT) != 40:
        raise RuntimeError(f"INPUT size {ctypes.sizeof(INPUT)} is not 40")

    def stroke(vk: int, up: bool) -> INPUT:
        item = INPUT()
        item.type = _INPUT_KEYBOARD
        item.union.ki.wVk = vk
        flags = _KEYEVENTF_KEYUP if up else 0
        if vk == _VK_LWIN:
            flags |= _KEYEVENTF_EXTENDEDKEY
        item.union.ki.dwFlags = flags
        return item

    down = (_VK_LWIN, _VK_MENU, _VK_SHIFT, _VK_L)
    sequence = [stroke(vk, False) for vk in down] + [
        stroke(vk, True) for vk in reversed(down)
    ]
    batch = (INPUT * len(sequence))(*sequence)
    user32 = ctypes.WinDLL("user32", use_last_error=True)
    sent = user32.SendInput(len(sequence), ctypes.byref(batch), ctypes.sizeof(INPUT))
    if sent != len(sequence):
        err = ctypes.get_last_error()
        raise OSError(f"SendInput sent {sent} of {len(sequence)} (error {err})")


# Cover letters: Desktop deliverable + single overwriteable repo temp (no accumulation)
COVER_LETTER_TEMP_FILENAME = "Cover-Letter-current.pdf"
COVER_LETTER_CONTENT_FILENAME = "cover-current.typ"

# Hard product rule: every resume PDF must fit on a single A4 page.
RESUME_MAX_PAGES = 1
RESUME_PAPER = "A4"

# Career deliverables under output/<variant>/ (resume + portfolio, EN/PT)
DOWNLOAD_CATALOG: list[dict[str, str]] = [
    {
        "variant": "ux-researcher",
        "label_en": "UX Researcher & Design Technologist",
        "label_pt": "Pesquisador de UX e Design Technologist",
        "lang": "en",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-EN-ux-researcher.pdf",
    },
    {
        "variant": "ux-researcher",
        "label_en": "UX Researcher & Design Technologist",
        "label_pt": "Pesquisador de UX e Design Technologist",
        "lang": "pt",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-PT-ux-researcher.pdf",
    },
    {
        "variant": "ux-researcher",
        "label_en": "UX Researcher & Design Technologist",
        "label_pt": "Pesquisador de UX e Design Technologist",
        "lang": "en",
        "kind": "portfolio",
        "filename": "portfolio-deck-ux-researcher-EN.pdf",
    },
    {
        "variant": "ux-researcher",
        "label_en": "UX Researcher & Design Technologist",
        "label_pt": "Pesquisador de UX e Design Technologist",
        "lang": "pt",
        "kind": "portfolio",
        "filename": "portfolio-deck-ux-researcher-PT.pdf",
    },
    {
        "variant": "general",
        "label_en": "General",
        "label_pt": "Geral",
        "lang": "en",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-EN.pdf",
    },
    {
        "variant": "general",
        "label_en": "General",
        "label_pt": "Geral",
        "lang": "pt",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-PT.pdf",
    },
    {
        "variant": "product-owner",
        "label_en": "Product Owner",
        "label_pt": "Product Owner",
        "lang": "en",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-EN-product-owner.pdf",
    },
    {
        "variant": "product-owner",
        "label_en": "Product Owner",
        "label_pt": "Product Owner",
        "lang": "pt",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-PT-product-owner.pdf",
    },
    {
        "variant": "data-analyst",
        "label_en": "Data Analyst",
        "label_pt": "Analista de Dados",
        "lang": "en",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-EN-data-analyst.pdf",
    },
    {
        "variant": "data-analyst",
        "label_en": "Data Analyst",
        "label_pt": "Analista de Dados",
        "lang": "pt",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-PT-data-analyst.pdf",
    },
    {
        "variant": "general",
        "label_en": "General",
        "label_pt": "Geral",
        "lang": "en",
        "kind": "portfolio",
        "filename": "portfolio-deck-EN.pdf",
    },
    {
        "variant": "general",
        "label_en": "General",
        "label_pt": "Geral",
        "lang": "pt",
        "kind": "portfolio",
        "filename": "portfolio-deck-PT.pdf",
    },
    {
        "variant": "product-owner",
        "label_en": "Product Owner",
        "label_pt": "Product Owner",
        "lang": "en",
        "kind": "portfolio",
        "filename": "portfolio-deck-product-owner-EN.pdf",
    },
    {
        "variant": "product-owner",
        "label_en": "Product Owner",
        "label_pt": "Product Owner",
        "lang": "pt",
        "kind": "portfolio",
        "filename": "portfolio-deck-product-owner-PT.pdf",
    },
    {
        "variant": "data-analyst",
        "label_en": "Data Analyst",
        "label_pt": "Analista de Dados",
        "lang": "en",
        "kind": "portfolio",
        "filename": "portfolio-deck-data-analyst-EN.pdf",
    },
    {
        "variant": "data-analyst",
        "label_en": "Data Analyst",
        "label_pt": "Analista de Dados",
        "lang": "pt",
        "kind": "portfolio",
        "filename": "portfolio-deck-data-analyst-PT.pdf",
    },
    {
        "variant": "digital-solution-architect",
        "label_en": "Digital Solution Architect",
        "label_pt": "Arquiteto de Soluções Digitais",
        "lang": "en",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-EN-digital-solution-architect.pdf",
    },
    {
        "variant": "digital-solution-architect",
        "label_en": "Digital Solution Architect",
        "label_pt": "Arquiteto de Soluções Digitais",
        "lang": "pt",
        "kind": "resume",
        "filename": "CV-Eduardo-Figueiredo-PT-digital-solution-architect.pdf",
    },
    {
        "variant": "digital-solution-architect",
        "label_en": "Digital Solution Architect",
        "label_pt": "Arquiteto de Soluções Digitais",
        "lang": "en",
        "kind": "portfolio",
        "filename": "portfolio-deck-digital-solution-architect-EN.pdf",
    },
    {
        "variant": "digital-solution-architect",
        "label_en": "Digital Solution Architect",
        "label_pt": "Arquiteto de Soluções Digitais",
        "lang": "pt",
        "kind": "portfolio",
        "filename": "portfolio-deck-digital-solution-architect-PT.pdf",
    },
]


def pdf_page_count(path: Path) -> int | None:
    """Best-effort page count without extra dependencies."""
    try:
        data = path.read_bytes()
    except OSError:
        return None
    import re

    # Match /Type /Page but not /Type /Pages
    pages = len(re.findall(rb"/Type\s*/Page(?![s\w])", data))
    return pages if pages > 0 else None


RESUME_VARIANTS = {
    "ux-researcher",
    "general",
    "product-owner",
    "data-analyst",
    "digital-solution-architect",
}


def load_resume_settings() -> dict[str, int]:
    settings_file = ROOT_DIR / "my-data" / "canonical" / "resume_settings.csv"
    out = {v: 1 for v in RESUME_VARIANTS}
    if not settings_file.is_file():
        return out
    import csv

    with settings_file.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            v = (row.get("variant") or "").strip()
            raw = (row.get("max_pages") or "").strip()
            if v and raw and raw.isdigit():
                out[v] = max(1, min(2, int(raw)))
    return out


def list_downloads() -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    resume_settings = load_resume_settings()
    for entry in DOWNLOAD_CATALOG:
        path = OUTPUT_DIR / entry["variant"] / entry["filename"]
        available = path.is_file()
        page_count = pdf_page_count(path) if available else None
        item: dict[str, Any] = {
            **entry,
            "available": available,
            "url": f"/download/{entry['variant']}/{entry['filename']}",
            "view_url": f"/download/{entry['variant']}/{entry['filename']}?inline=1",
            "size": path.stat().st_size if available else 0,
            "page_count": page_count,
            "abs_path": str(path.resolve()) if available else "",
        }
        if entry["kind"] == "resume":
            max_p = resume_settings.get(entry["variant"], RESUME_MAX_PAGES)
            item["max_pages"] = max_p
            item["one_page_ok"] = (page_count == 1) if page_count else None
            item["page_limit_ok"] = (page_count <= max_p) if page_count else None
        items.append(item)
    return items


def resume_policy() -> dict[str, Any]:
    return {
        "standard_pages": 1,
        "max_pages_allowed": 2,
        "paper": RESUME_PAPER,
        "note_en": "Standard resume limit is 1 page (A4), with support for 1–2 pages.",
    }


def regenerate_deliverable(
    variant: str, kind: str = "both", max_pages: int | None = None
) -> dict[str, Any]:
    """Run generation, page fitting, and compile for single variant or 'all'."""
    if variant != "all" and variant not in RESUME_VARIANTS:
        raise ValueError(f"Unknown variant: {variant}")

    results: dict[str, Any] = {"variant": variant, "kind": kind}

    # 1. Generate text sources (.typ, .md, and web docs)
    gen_cmd = [
        sys.executable,
        str(ROOT_DIR / "scripts" / "generate_from_canonical.py"),
        "--lang",
        "all",
    ]
    if variant != "all":
        gen_cmd.extend(["--variant", variant])
    gen_proc = subprocess.run(
        gen_cmd,
        cwd=str(ROOT_DIR),
        capture_output=True,
        text=True,
        check=False,
    )
    if gen_proc.returncode != 0:
        err = (gen_proc.stderr or gen_proc.stdout or "Source generation failed").strip()
        raise RuntimeError(err[-1200:])

    # 2. Fit resume / compile Typst if requested
    if kind in ("resume", "both"):
        fit_cmd = [
            sys.executable,
            str(ROOT_DIR / "scripts" / "fit_resumes.py"),
        ]
        if variant != "all":
            fit_cmd.extend(["--variant", variant])
        if max_pages and variant != "all":
            fit_cmd.extend(["--max-pages", str(max_pages)])
        fit_proc = subprocess.run(
            fit_cmd,
            cwd=str(ROOT_DIR),
            capture_output=True,
            text=True,
            check=False,
        )
        if fit_proc.returncode != 0:
            err = (fit_proc.stderr or fit_proc.stdout or "Resume fit failed").strip()
            raise RuntimeError(err[-1200:])

    # 3. Compile portfolio via marp if requested
    if kind in ("portfolio", "both"):
        build_cmd = [
            sys.executable,
            str(ROOT_DIR / "scripts" / "build_outputs.py"),
            "--kind",
            "portfolio",
            "--skip-generate",
            "--skip-audit",
        ]
        if variant != "all":
            build_cmd.extend(["--variant", variant])
        build_proc = subprocess.run(
            build_cmd,
            cwd=str(ROOT_DIR),
            capture_output=True,
            text=True,
            check=False,
        )
        if build_proc.returncode != 0:
            err = (
                build_proc.stderr or build_proc.stdout or "Portfolio compile failed"
            ).strip()
            raise RuntimeError(err[-1200:])

    results["downloads"] = list_downloads()
    results["priority"] = resume_priority_index()
    return results


def resume_priority_index() -> dict[str, Any]:
    path = ROOT_DIR / "my-data" / "generated" / "resume-priority" / "index.json"
    if not path.is_file():
        return {"variants": {}}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        return {"variants": {}}
    return data


def raise_resume_topic(variant: str, topic_id: str) -> dict[str, Any]:
    if variant not in RESUME_VARIANTS:
        raise ValueError("Unknown resume career path")
    if not topic_id or any(ch in topic_id for ch in "/\\"):
        raise ValueError("Topic id required")
    script = ROOT_DIR / "scripts" / "fit_resumes.py"
    proc = subprocess.run(
        [
            sys.executable,
            str(script),
            "--variant",
            variant,
            "--raise",
            topic_id,
        ],
        cwd=str(ROOT_DIR),
        capture_output=True,
        text=True,
        timeout=180,
        check=False,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout or "Could not rebuild the resume").strip()
        raise RuntimeError(detail[-1800:])
    data = resume_priority_index()
    return {
        "ok": True,
        "variant": variant,
        "entry": (data.get("variants") or {}).get(variant),
    }


def _browser_exe_candidates() -> list[Path]:
    candidates: list[Path] = []
    if sys.platform == "win32":
        local = os.environ.get("LOCALAPPDATA", "")
        pf = os.environ.get("PROGRAMFILES", r"C:\Program Files")
        pf86 = os.environ.get("PROGRAMFILES(X86)", r"C:\Program Files (x86)")
        for base in (local, pf, pf86):
            if not base:
                continue
            root = Path(base)
            candidates.append(root / "Google" / "Chrome" / "Application" / "chrome.exe")
            candidates.append(
                root / "Microsoft" / "Edge" / "Application" / "msedge.exe"
            )
    for name in (
        "chrome",
        "google-chrome",
        "chromium",
        "msedge",
        "microsoft-edge",
        "chrome.exe",
        "msedge.exe",
    ):
        found = shutil.which(name)
        if found:
            candidates.append(Path(found))
    return candidates


def open_url_new_window(url: str) -> dict[str, Any]:
    """Open http(s) URL in a new browser window (foreground), not a background tab."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("only absolute http(s) URLs are allowed")

    # On Windows, ShellExecute via os.startfile properly targets the user's
    # active default browser on the interactive desktop.
    if sys.platform == "win32":
        try:
            os.startfile(url)  # noqa: S606
            return {"ok": True, "via": "os.startfile", "mode": "shell-execute"}
        except Exception:
            pass

    for exe in _browser_exe_candidates():
        if not exe.is_file():
            continue
        subprocess.Popen(  # noqa: S603
            [str(exe), "--new-window", url],
            close_fds=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return {"ok": True, "via": exe.name, "mode": "new-window"}

    # Last resort: OS default handler (may still open as a tab).
    webbrowser.open_new(url)
    return {"ok": True, "via": "webbrowser", "mode": "open_new"}


def resolve_download(variant: str, filename: str) -> Path | None:
    if variant not in {e["variant"] for e in DOWNLOAD_CATALOG}:
        return None
    allowed = {e["filename"] for e in DOWNLOAD_CATALOG if e["variant"] == variant}
    if filename not in allowed:
        return None
    path = (OUTPUT_DIR / variant / filename).resolve()
    if not str(path).startswith(str(OUTPUT_DIR.resolve())):
        return None
    if not path.is_file():
        return None
    return path


def _safe_opening_id(opening_id: str) -> str:
    cleaned = "".join(
        ch if ch.isalnum() or ch in ("-", "_") else "-"
        for ch in (opening_id or "").strip()
    )
    cleaned = cleaned.strip("-_") or "opening"
    return cleaned[:80]


def _strip_nickname_parens(text: str) -> str:
    """Remove parenthetical nicknames like '(Edu)' from cover-letter text."""
    cleaned = re.sub(r"\s*\([^)]{1,24}\)", "", str(text or ""))
    return re.sub(r"[ \t]{2,}", " ", cleaned).strip()


def _normalize_cover_closing(closing: str, formal_name: str, lang: str) -> str:
    """Keep sign-off formal: no nicknames; last name line matches profile."""
    formal = _strip_nickname_parens(formal_name) or formal_name.strip()
    raw = str(closing or "").strip()
    if not raw:
        salutation = "Atenciosamente," if lang == "pt" else "Sincerely,"
        return f"{salutation}\n{formal}" if formal else salutation

    lines = [
        _strip_nickname_parens(line) if line.strip() else line
        for line in raw.split("\n")
    ]
    # Drop trailing empties, then ensure signature is the formal name
    while lines and not lines[-1].strip():
        lines.pop()
    if formal:
        if not lines:
            lines = [formal]
        else:
            last = lines[-1].strip()
            # Replace last line when it looks like a personal name / contains nickname residue
            looks_like_name = (
                bool(re.search(r"[A-Za-zÀ-ÿ]", last)) and len(last.split()) >= 2
            )
            if (
                looks_like_name
                or last.lower() in formal.lower()
                or formal.lower() in last.lower()
            ):
                lines[-1] = formal
            elif last.endswith(","):
                lines.append(formal)
            else:
                lines.append(formal)
    return "\n".join(lines)


def _desktop_dir() -> Path:
    """Prefer OneDrive Desktop when present (common on this machine)."""
    home = Path.home()
    userprofile = Path(os.environ.get("USERPROFILE", "") or str(home))
    candidates = [
        userprofile / "OneDrive" / "Desktop",
        home / "OneDrive" / "Desktop",
        userprofile / "OneDrive" / "Ambiente de Trabalho",
        home / "OneDrive" / "Ambiente de Trabalho",
        userprofile / "Desktop",
        home / "Desktop",
    ]
    for path in candidates:
        if path.is_dir():
            return path
    fallback = userprofile / "Desktop"
    fallback.mkdir(parents=True, exist_ok=True)
    return fallback


def _purge_stale_cover_letter_pdfs(cover_dir: Path, keep_name: str) -> None:
    """Method 2: never accumulate cover-letter PDFs inside the repository."""
    if not cover_dir.is_dir():
        return
    for path in cover_dir.glob("*.pdf"):
        if path.name == keep_name:
            continue
        try:
            path.unlink()
        except OSError:
            pass


def build_cover_letter_pdf(payload: dict[str, Any]) -> dict[str, Any]:
    """Compile a one-page Typst cover letter for a job opening.

    Storage policy (avoid repo bloat):
    - Method 1: write the deliverable PDF to the local Desktop.
    - Method 2: keep at most one overwriteable temp PDF under output/cover-letters/
      for the cockpit viewer (never accumulate or commit multiple cover letters).
    """
    opening_id = str(payload.get("opening_id") or "").strip()
    if not opening_id:
        raise ValueError("opening_id required")
    lang = str(payload.get("lang") or "en").strip().lower()
    if lang not in ("en", "pt"):
        raise ValueError("lang must be en or pt")

    body = str(payload.get("body") or "").strip()
    if not body:
        raise ValueError("cover letter body is empty")

    profile_rows = CanonicalStore(CANONICAL_DIR)._read_csv_loose("profile.csv")
    profile = profile_rows[0] if profile_rows else {}

    # Cover letters use formal display/full name only — never nicknames
    name = _strip_nickname_parens(
        str(
            payload.get("name")
            or profile.get("display_name")
            or profile.get("full_name")
            or ""
        ).strip()
    )
    phone = str(payload.get("phone") or profile.get("phone") or "").strip()
    email = str(payload.get("email") or profile.get("email") or "").strip()
    linkedin = str(payload.get("linkedin") or profile.get("linkedin_url") or "").strip()
    location = str(
        payload.get("location")
        or (profile.get("location_pt") if lang == "pt" else profile.get("location_en"))
        or profile.get("location_en")
        or ""
    ).strip()

    closing = _normalize_cover_closing(
        str(payload.get("closing") or "").strip(),
        name,
        lang,
    )

    def typ_escape(value: str) -> str:
        return (
            value.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\r\n", "\\n")
            .replace("\n", "\\n")
            .replace("\r", "\\n")
        )

    safe_id = _safe_opening_id(opening_id)
    company_slug = _safe_opening_id(str(payload.get("company") or "company"))
    # Method 2 — single overwriteable temp inside the repo (for viewer only)
    temp_dir = OUTPUT_DIR / "cover-letters"
    temp_dir.mkdir(parents=True, exist_ok=True)
    _purge_stale_cover_letter_pdfs(temp_dir, COVER_LETTER_TEMP_FILENAME)
    temp_filename = COVER_LETTER_TEMP_FILENAME
    temp_path = temp_dir / temp_filename

    typst_dir = ROOT_DIR / "resume" / "typst"
    gen_dir = typst_dir / "_generated"
    gen_dir.mkdir(parents=True, exist_ok=True)
    content_path = gen_dir / COVER_LETTER_CONTENT_FILENAME
    template = typst_dir / "cover-letter.typ"
    fonts = typst_dir / "fonts"
    if not template.is_file():
        raise ValueError(f"missing template: {template}")

    fields = {
        "name": name,
        "phone": phone,
        "email": email,
        "location": location,
        "linkedin": linkedin,
        "date": str(payload.get("date") or "").strip(),
        "company": str(payload.get("company") or "").strip(),
        "role": str(payload.get("role") or "").strip(),
        "greeting": str(payload.get("greeting") or "").strip(),
        "body": body,
        "closing": closing,
        "lang": lang,
    }
    content_lines = [
        "// Generated cover-letter content — do not edit by hand.",
        f"// opening_id={safe_id} lang={lang}",
    ]
    for key, value in fields.items():
        content_lines.append(f'#let cover-{key} = "{typ_escape(value)}"')
    content_path.write_text("\n".join(content_lines) + "\n", encoding="utf-8")

    # Import path is resolved relative to the template file (resume/typst/).
    rel_content = f"_generated/{content_path.name}"
    cmd = [
        "typst",
        "compile",
        "--root",
        str(ROOT_DIR),
        "--font-path",
        str(fonts),
        "--input",
        f"content={rel_content}",
        str(template),
        str(temp_path),
    ]

    try:
        completed = subprocess.run(  # noqa: S603
            cmd,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    except FileNotFoundError as exc:
        raise ValueError(
            "typst not found on PATH — install Typst to build cover letters"
        ) from exc

    if completed.returncode != 0:
        err = (completed.stderr or completed.stdout or "typst compile failed").strip()
        raise ValueError(err[:800])

    if not temp_path.is_file():
        raise ValueError("cover letter PDF was not created")

    # Method 1 — deliverable lives on the Desktop (transient; not archived in git)
    desktop = _desktop_dir()
    desktop_filename = f"Cover-Letter-{company_slug}-{safe_id}-{lang.upper()}.pdf"
    # Keep Desktop names readable but bounded
    if len(desktop_filename) > 120:
        desktop_filename = f"Cover-Letter-{safe_id}-{lang.upper()}.pdf"
    desktop_path = desktop / desktop_filename
    shutil.copy2(temp_path, desktop_path)

    return {
        "ok": True,
        "opening_id": opening_id,
        "lang": lang,
        "filename": temp_filename,
        "abs_path": str(desktop_path.resolve()),
        "desktop_path": str(desktop_path.resolve()),
        "temp_path": str(temp_path.resolve()),
        "url": f"/download/cover-letters/{temp_filename}",
        "view_url": f"/download/cover-letters/{temp_filename}?inline=1",
    }


def resolve_cover_letter(filename: str) -> Path | None:
    if not filename or "/" in filename or "\\" in filename or ".." in filename:
        return None
    if not filename.lower().endswith(".pdf"):
        return None
    # Only the single overwriteable temp PDF is served from the repo.
    if filename != COVER_LETTER_TEMP_FILENAME:
        # Legacy named downloads → redirect to current temp if present
        filename = COVER_LETTER_TEMP_FILENAME
    path = (OUTPUT_DIR / "cover-letters" / filename).resolve()
    cover_root = (OUTPUT_DIR / "cover-letters").resolve()
    if not str(path).startswith(str(cover_root)):
        return None
    if not path.is_file():
        return None
    return path


def write_ai_fix_document(kind: str, content: str) -> dict[str, Any]:
    """Write an AI-companion fix note to the user's Desktop."""
    text = str(content or "").strip()
    if not text:
        raise ValueError("content required")
    safe_kind = (
        "".join(
            ch if ch.isalnum() or ch in ("-", "_") else "-" for ch in (kind or "fix")
        ).strip("-")
        or "fix"
    )
    stamp = __import__("datetime").datetime.now().strftime("%Y%m%d-%H%M%S")
    desktop = _desktop_dir()
    path = desktop / f"AI-fix-{safe_kind}-{stamp}.md"
    header = (
        f"# AI companion fix — {safe_kind}\n\n"
        f"Generated by career cockpit at {stamp}.\n"
        "Paste this file into your AI companion to regenerate a corrected payload.\n\n"
        "---\n\n"
    )
    path.write_text(header + text + "\n", encoding="utf-8")
    return {
        "ok": True,
        "path": str(path.resolve()),
        "filename": path.name,
        "desktop": str(desktop.resolve()),
    }


class CareerHandler(BaseHTTPRequestHandler):
    server_version = "CareerCockpit/1.0"

    @property
    def store(self) -> CanonicalStore:
        return self.server.store  # type: ignore[attr-defined]

    def log_message(self, format: str, *args: Any) -> None:
        # pythonw has no console; writing to a missing stderr aborts the response.
        if sys.stderr is None:
            return
        try:
            sys.stderr.write("[career-cockpit] " + format % args + "\n")
        except OSError:
            return

    def _error_text(self, exc: BaseException) -> str:
        return f"{type(exc).__name__}: {exc}"

    def _append_error_log(self, exc: BaseException) -> None:
        """pyw has no console, so save crashes are written to a file."""
        try:
            local = os.environ.get("LOCALAPPDATA") or ""
            log_dir = Path(local) / "career-cockpit" if local else ROOT_DIR / "output"
            log_dir.mkdir(parents=True, exist_ok=True)
            with (log_dir / "server.log").open("a", encoding="utf-8") as handle:
                handle.write("\n")
                traceback.print_exception(exc, file=handle)
        except OSError:
            return

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, status: int, payload: Any) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _bytes(self, status: int, data: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> Any:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            try:
                text = raw.decode("latin-1")
            except Exception:
                text = raw.decode("utf-8", errors="replace")
        return json.loads(text)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        try:
            path = urlparse(self.path).path
            if path == "/health":
                self._json(200, {"ok": True})
                return
            if path == "/api/state":
                self._json(200, {"collections": self.store.load_all()})
                return
            if path == "/api/prompt-context":
                self._json(200, self.store.load_prompt_context())
                return
            if path == "/api/downloads":
                self._json(
                    200,
                    {
                        "items": list_downloads(),
                        "resume_policy": resume_policy(),
                        "output_dir": str(OUTPUT_DIR.resolve()),
                    },
                )
                return
            if path == "/api/deliverables/content":
                self._json(
                    200,
                    {
                        "ok": True,
                        "deliverables": self.store.load_deliverables_data(),
                        "resumeSettings": load_resume_settings(),
                        "priorityIndex": resume_priority_index(),
                    },
                )
                return
            if path == "/api/deliverables/media-catalog":
                # Scan pictures/ and return list of images for visual selection
                media_files = []
                allowed_exts = {".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"}
                if PICTURES_DIR.is_dir():
                    for f in PICTURES_DIR.rglob("*"):
                        if f.is_file() and f.suffix.lower() in allowed_exts:
                            rel_to_pics = f.relative_to(PICTURES_DIR).as_posix()
                            media_files.append(
                                {
                                    "rel_path": f"pictures/{rel_to_pics}",
                                    "canonical_path": f"../../../pictures/{rel_to_pics}",
                                    "filename": f.name,
                                    "url": f"/pictures/{rel_to_pics}",
                                }
                            )
                media_files.sort(key=lambda x: x["rel_path"])
                self._json(200, {"ok": True, "files": media_files})
                return
            if path == "/api/resume-priority":
                self._json(200, resume_priority_index())
                return
            if path == "/api/autofill/state":
                collections = self.store.load_all()
                jobs = list_autofill_jobs(collections)
                pending = None
                if AUTOFILL_PENDING_PATH.is_file():
                    try:
                        pending = json.loads(
                            AUTOFILL_PENDING_PATH.read_text(encoding="utf-8")
                        )
                    except (OSError, json.JSONDecodeError):
                        pending = None
                self._json(
                    200,
                    {
                        "ok": True,
                        "jobs": jobs,
                        "pending": pending,
                        "cockpit_url": f"http://127.0.0.1:{self.server.server_port}",  # type: ignore[attr-defined]
                        "mappings_path": str(AUTOFILL_MAPPINGS_PATH.resolve()),
                        "llm_configured": bool(
                            os.environ.get("CAREER_AUTOFILL_LLM_URL")
                            or os.environ.get("OPENAI_API_KEY")
                        ),
                    },
                )
                return
            if path == "/api/career-autofill/session":
                from urllib.parse import parse_qs

                qs = parse_qs(urlparse(self.path).query or "")
                opening_id = (qs.get("opening_id") or [""])[0].strip()
                self._json(200, session_for(opening_id))
                return
            if path == "/api/autofill/answers-for-url":
                from urllib.parse import parse_qs

                qs = parse_qs(urlparse(self.path).query or "")
                url = (qs.get("url") or [""])[0].strip()
                job_id = (qs.get("job_id") or [""])[0].strip() or None
                if not url and not job_id:
                    self._json(400, {"ok": False, "error": "url or job_id required"})
                    return
                collections = self.store.load_all()
                result = find_payload_by_url(collections, url=url, job_id=job_id)
                self._json(200, result)
                return
            if path == "/api/debug/environment":
                import environment

                self._json(200, environment.get_debug_summary())
                return
            if path == "/api/debug/logs":
                import environment

                lines = []
                if environment.LOG_FILE.is_file():
                    all_lines = environment.LOG_FILE.read_text(
                        encoding="utf-8", errors="replace"
                    ).splitlines()
                    lines = all_lines[-150:]
                self._json(200, {"ok": True, "count": len(lines), "lines": lines})
                return
            if path.startswith("/download/"):
                self._serve_download(path)
                return
            self._serve_static(path)
        except Exception as exc:  # noqa: BLE001
            traceback.print_exc()
            self._json(500, {"ok": False, "error": str(exc)})

    def do_PUT(self) -> None:  # noqa: N802
        try:
            path = urlparse(self.path).path
            if path == "/api/deliverables/content":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object expected")
                deliverables = body.get("deliverables") or {}
                variant = str(body.get("variant") or "").strip()
                kind = str(body.get("kind") or "both").strip()
                max_pages = body.get("max_pages")
                if max_pages is not None:
                    try:
                        max_pages = int(max_pages)
                    except (ValueError, TypeError):
                        max_pages = None

                save_res = self.store.save_deliverables_data(deliverables)

                regen_res = {}
                if variant and (variant in RESUME_VARIANTS or variant == "all"):
                    regen_res = regenerate_deliverable(
                        variant=variant,
                        kind=kind,
                        max_pages=max_pages,
                    )
                self._json(
                    200,
                    {
                        "ok": True,
                        "saved": save_res,
                        "regeneration": regen_res,
                        "deliverables": self.store.load_deliverables_data(),
                        "resumeSettings": load_resume_settings(),
                        "downloads": list_downloads(),
                        "priority": resume_priority_index(),
                    },
                )
                return
            if path != "/api/state":
                self._json(404, {"ok": False, "error": "not found"})
                return
            body = self._read_json()
            collections = body.get("collections")
            result = self.store.save_all(collections)
            self._json(200, result)
        except ValueError as exc:
            self._append_error_log(exc)
            self._json(400, {"ok": False, "error": self._error_text(exc)})
        except Exception as exc:  # noqa: BLE001
            self._append_error_log(exc)
            if sys.stderr is not None:
                try:
                    traceback.print_exc()
                except OSError:
                    pass
            self._json(500, {"ok": False, "error": self._error_text(exc)})

    def do_POST(self) -> None:  # noqa: N802
        try:
            path = urlparse(self.path).path
            if path == "/api/deliverables/upload-image":
                import base64

                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object expected")
                project_id = (
                    str(body.get("project_id") or "uploads")
                    .strip()
                    .replace("..", "")
                    .replace("/", "")
                )
                filename = (
                    str(body.get("filename") or "")
                    .strip()
                    .replace("..", "")
                    .replace("/", "")
                )
                data_b64 = str(body.get("data_base64") or "").strip()
                if not filename or not data_b64:
                    raise ValueError("filename and data_base64 are required")
                # Strip data url prefix if present e.g. "data:image/png;base64,"
                if "," in data_b64:
                    data_b64 = data_b64.split(",", 1)[1]
                raw_bytes = base64.b64decode(data_b64)
                target_folder = PICTURES_DIR / "work" / project_id
                target_folder.mkdir(parents=True, exist_ok=True)
                dest = target_folder / filename
                dest.write_bytes(raw_bytes)
                rel_url = f"/pictures/work/{project_id}/{filename}"
                canon_path = f"../../../pictures/work/{project_id}/{filename}"
                self._json(
                    200,
                    {
                        "ok": True,
                        "url": rel_url,
                        "canonical_path": canon_path,
                        "filename": filename,
                        "project_id": project_id,
                    },
                )
                return
            if path == "/api/deliverables/regenerate":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object expected")
                variant = str(body.get("variant") or "").strip()
                kind = str(body.get("kind") or "both").strip()
                max_pages = body.get("max_pages")
                if max_pages is not None:
                    try:
                        max_pages = int(max_pages)
                    except (ValueError, TypeError):
                        max_pages = None
                regen_res = regenerate_deliverable(
                    variant=variant,
                    kind=kind,
                    max_pages=max_pages,
                )
                self._json(
                    200,
                    {
                        "ok": True,
                        "regeneration": regen_res,
                        "downloads": list_downloads(),
                        "priority": resume_priority_index(),
                    },
                )
                return
            if path == "/api/cover-letter":
                body = self._read_json()
                result = build_cover_letter_pdf(body if isinstance(body, dict) else {})
                self._json(200, result)
                return
            if path == "/api/resume-priority":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                variant = str(body.get("variant") or "").strip()
                topic_id = str(body.get("topic_id") or "").strip()
                self._json(200, raise_resume_topic(variant, topic_id))
                return
            if path == "/api/ai-fix-note":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                result = write_ai_fix_document(
                    str(body.get("kind") or "fix"),
                    str(body.get("content") or ""),
                )
                self._json(200, result)
                return
            if path == "/api/prompt-hotkey":
                send_prompt_hotkey()
                self._json(200, {"ok": True})
                return
            if path == "/api/prompt-send":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                self._json(200, send_prompt_text(str(body.get("text") or "")))
                return
            if path == "/api/career-autofill/capture-window":
                body = self._read_json()
                if not isinstance(body, dict):
                    body = {}
                import environment

                environment.log_info("POST /api/career-autofill/capture-window", body)
                self._json(
                    200,
                    capture_window(str(body.get("opening_id") or "")),
                )
                return
            if path == "/api/career-autofill/open-uia":
                import environment

                environment.log_info("POST /api/career-autofill/open-uia")
                self._json(200, open_uia())
                return
            if path == "/api/career-autofill/build-and-send":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                import environment

                environment.log_info("POST /api/career-autofill/build-and-send", body)
                self._json(
                    200,
                    build_and_send(
                        self.store,
                        str(body.get("opening_id") or ""),
                        str(body.get("window_name") or ""),
                    ),
                )
                return
            if path == "/api/career-autofill/fill-form":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                self._json(
                    200,
                    fill_form(self.store, str(body.get("opening_id") or "")),
                )
                return
            if path == "/api/autofill/map":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                fields = body.get("fields") or []
                if not isinstance(fields, list):
                    raise ValueError("fields must be a list")
                job_id = body.get("job_id") or None
                host = str(body.get("host") or "")
                lang = str(body.get("lang") or "en")
                use_llm = body.get("use_llm", True)
                collections = self.store.load_all()
                # Profile / skills / narratives live in prompt-context (not PUT /api/state).
                prompt_ctx = self.store.load_prompt_context()
                collections = {**collections, **prompt_ctx}
                bundle = build_autofill_bundle(collections, job_id=job_id, lang=lang)
                learned = load_mappings(AUTOFILL_MAPPINGS_PATH)
                mapped = map_fields(
                    fields=fields,
                    values_by_key=bundle["values_by_key"],
                    available_keys=bundle["available_keys"],
                    learned=learned,
                    host=host,
                    job=bundle.get("job"),
                    use_llm=bool(use_llm),
                )
                self._json(
                    200,
                    {
                        "ok": True,
                        "job": bundle.get("job"),
                        "variant": bundle.get("variant"),
                        "values_by_key": bundle["values_by_key"],
                        "available_keys": bundle["available_keys"],
                        "mappings": mapped["mappings"],
                        "min_confidence": mapped["min_confidence"],
                        "llm": mapped.get("llm"),
                        "url": body.get("url"),
                        "host": host,
                    },
                )
                return
            if path == "/api/autofill/feedback":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                host = str(body.get("host") or "").strip()
                if not host:
                    raise ValueError("host required")
                result = apply_feedback(
                    AUTOFILL_MAPPINGS_PATH,
                    host=host,
                    url=str(body.get("url") or ""),
                    job_id=body.get("job_id"),
                    corrections=list(body.get("corrections") or []),
                )
                self._json(200, result)
                return
            if path == "/api/autofill/pending":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                action = str(body.get("action") or "set").lower()
                AUTOFILL_PENDING_PATH.parent.mkdir(parents=True, exist_ok=True)
                if action == "clear":
                    if AUTOFILL_PENDING_PATH.is_file():
                        AUTOFILL_PENDING_PATH.unlink()
                    self._json(200, {"ok": True, "pending": None})
                    return
                job_id = str(body.get("job_id") or "").strip()
                if not job_id:
                    raise ValueError("job_id required")
                payload = {
                    "job_id": job_id,
                    "job_url": str(body.get("job_url") or ""),
                    "form_url": str(body.get("form_url") or ""),
                    "role_title": str(body.get("role_title") or ""),
                    "company": str(body.get("company") or ""),
                    "set_at": __import__("datetime")
                    .datetime.now()
                    .isoformat(timespec="seconds"),
                }
                AUTOFILL_PENDING_PATH.write_text(
                    json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
                self._json(200, {"ok": True, "pending": payload})
                return
            if path == "/api/autofill/capture-page":
                body = self._read_json()
                if not isinstance(body, dict):
                    raise ValueError("JSON object required")
                job_id = str(body.get("job_id") or "").strip()
                raw = str(body.get("raw") or "").strip()
                form_url = str(body.get("form_url") or body.get("url") or "").strip()
                if not job_id:
                    raise ValueError("job_id required")
                if not raw:
                    raise ValueError("raw page capture required")
                collections = self.store.load_all()
                openings = collections.get("jobOpenings") or []
                row = next(
                    (r for r in openings if str(r.get("id") or "") == job_id),
                    None,
                )
                if row is None:
                    raise ValueError(f"opening not found: {job_id}")
                row["application_form_raw"] = raw
                if form_url:
                    row["form_url"] = form_url
                # Persist via store
                result = self.store.save_all(collections)
                self._json(
                    200,
                    {
                        "ok": True,
                        "job_id": job_id,
                        "form_url": row.get("form_url") or "",
                        "raw_chars": len(raw),
                        "saved": result,
                    },
                )
                return
            if path != "/api/open-url":
                self._json(404, {"ok": False, "error": "not found"})
                return
            body = self._read_json()
            url = str(body.get("url") or "").strip()
            if not url:
                self._json(400, {"ok": False, "error": "url required"})
                return
            result = open_url_new_window(url)
            self._json(200, result)
        except ValueError as exc:
            try:
                import environment

                environment.log_error(f"POST {path} ValueError: {exc}")
            except Exception:
                pass
            self._json(400, {"ok": False, "error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            try:
                import environment

                environment.log_error(f"POST {path} Exception: {exc}", exc)
            except Exception:
                pass
            self._json(500, {"ok": False, "error": str(exc)})

    def _serve_download(self, path: str) -> None:
        parsed = urlparse(self.path)
        parts = [p for p in unquote(parsed.path).split("/") if p]
        # cover letters: ["download", "cover-letters", filename]
        if len(parts) == 3 and parts[0] == "download" and parts[1] == "cover-letters":
            file_path = resolve_cover_letter(parts[2])
            if file_path is None:
                self._json(404, {"ok": False, "error": "file not found"})
                return
            data = file_path.read_bytes()
            inline = "inline=1" in (parsed.query or "")
            disposition = "inline" if inline else "attachment"
            self.send_response(200)
            self.send_header("Content-Type", "application/pdf")
            self.send_header("Content-Length", str(len(data)))
            self.send_header(
                "Content-Disposition",
                f'{disposition}; filename="{file_path.name}"',
            )
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self._cors()
            self.end_headers()
            self.wfile.write(data)
            return
        # ["download", variant, filename]
        if len(parts) != 3 or parts[0] != "download":
            self._json(404, {"ok": False, "error": "not found"})
            return
        file_path = resolve_download(parts[1], parts[2])
        if file_path is None:
            self._json(404, {"ok": False, "error": "file not found"})
            return
        data = file_path.read_bytes()
        inline = "inline=1" in (parsed.query or "")
        disposition = "inline" if inline else "attachment"
        self.send_response(200)
        self.send_header("Content-Type", "application/pdf")
        self.send_header("Content-Length", str(len(data)))
        self.send_header(
            "Content-Disposition",
            f'{disposition}; filename="{file_path.name}"',
        )
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _serve_static(self, path: str) -> None:
        rel = unquote(path.lstrip("/")) or "jobs.html"
        # Job openings is the cockpit home; portals live at /portals.html
        if rel in ("", "index.html"):
            rel = "jobs.html"
        if ".." in rel.replace("\\", "/").split("/"):
            self._json(400, {"ok": False, "error": "invalid path"})
            return
        if rel.startswith("pictures/"):
            pic_path = (ROOT_DIR / rel).resolve()
            if (
                str(pic_path).startswith(str((ROOT_DIR / "pictures").resolve()))
                and pic_path.is_file()
            ):
                self._send_file(pic_path)
                return
        portfolio = self._portfolio_file(rel)
        if portfolio is not None:
            self._send_file(portfolio)
            return
        file_path = (WEB_DIR / rel).resolve()
        if not str(file_path).startswith(str(WEB_DIR.resolve())):
            self._json(400, {"ok": False, "error": "invalid path"})
            return
        if file_path.is_dir():
            file_path = (file_path / "jobs.html").resolve()
            if not file_path.is_file():
                file_path = (WEB_DIR / "jobs.html").resolve()
        if not file_path.is_file():
            self._json(404, {"ok": False, "error": "not found"})
            return
        self._send_file(file_path)

    def _portfolio_file(self, rel: str) -> Path | None:
        """Landing page in docs/, also published by GitHub Pages."""
        if rel in ("portfolio", "portfolio/"):
            inner = "index.html"
        elif rel.startswith("portfolio/"):
            inner = rel[len("portfolio/") :] or "index.html"
        else:
            return None
        if ".." in inner.replace("\\", "/").split("/"):
            return None
        root = PORTFOLIO_DIR.resolve()
        file_path = (PORTFOLIO_DIR / inner).resolve()
        if not str(file_path).startswith(str(root)):
            return None
        if file_path.is_dir():
            file_path = (file_path / "index.html").resolve()
        return file_path if file_path.is_file() else None

    def _send_file(self, file_path: Path) -> None:
        data = file_path.read_bytes()
        ctype = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
        if file_path.suffix == ".js":
            ctype = "application/javascript; charset=utf-8"
        elif file_path.suffix == ".css":
            ctype = "text/css; charset=utf-8"
        elif file_path.suffix == ".html":
            ctype = "text/html; charset=utf-8"
        self._bytes(200, data, ctype)


def main() -> int:
    parser = argparse.ArgumentParser(description="Career cockpit local server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--open", action="store_true")
    parser.add_argument(
        "--canonical",
        type=Path,
        default=CANONICAL_DIR,
        help="Path to my-data/canonical",
    )
    args = parser.parse_args()

    if not WEB_DIR.is_dir():
        print(f"web dir missing: {WEB_DIR}", file=sys.stderr)
        return 1
    if not args.canonical.is_dir():
        print(f"canonical dir missing: {args.canonical}", file=sys.stderr)
        return 1

    httpd = ThreadingHTTPServer(("127.0.0.1", args.port), CareerHandler)
    httpd.store = CanonicalStore(args.canonical)  # type: ignore[attr-defined]
    url = f"http://127.0.0.1:{args.port}/"
    print(f"Career cockpit at {url}")
    print(f"Canonical data: {args.canonical.resolve()}")
    if args.open:
        webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
