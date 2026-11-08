"""Environment detection and debug logging for Career Cockpit.

Detects whether running in 'personal' or 'work' environment, resolves
paths for scripts, repos, executables, and companions accordingly,
and provides unified file/console debug logging.
"""

from __future__ import annotations

import getpass
import json
import logging
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent

# --- Environment Detection ---

def detect_environment() -> str:
    """Return 'work' or 'personal' based on user, paths, and environment markers."""
    force = os.environ.get("CAREER_FORCE_ENV", "").strip().lower()
    if force in ("work", "personal"):
        return force

    user = getpass.getuser().lower()
    if user == "fie7ca":
        return "work"
    if user == "eduev":
        return "personal"

    root_str = str(ROOT_DIR).lower()
    if "01 - scripts" in root_str or "general workspace" in root_str or "bosch" in root_str:
        return "work"
    if "meu drive" in root_str or "17 - projects" in root_str:
        return "personal"

    # Check tasks/data/environment.txt if scripts repo is nearby
    for candidate in [
        ROOT_DIR.parent / "scripts" / "tasks" / "data" / "environment.txt",
        Path.home() / "Documents" / "01 - Scripts" / "tasks" / "data" / "environment.txt",
    ]:
        if candidate.is_file():
            try:
                val = candidate.read_text(encoding="utf-8-sig").strip().lower()
                if val in ("work", "personal"):
                    return val
            except Exception:
                pass

    return "personal"


CURRENT_ENV = detect_environment()


# --- Path Resolution based on Environment ---

def get_scripts_dir() -> Path:
    override = os.environ.get("CAREER_SCRIPTS_DIR", "").strip()
    if override and Path(override).is_dir():
        return Path(override)

    env = detect_environment()
    candidates: list[Path] = []

    if env == "work":
        candidates.extend([
            Path(r"C:\Users\fie7ca\Documents\01 - Scripts"),
            Path.home() / "Documents" / "01 - Scripts",
            ROOT_DIR.parent / "01 - Scripts",
            ROOT_DIR.parent / "scripts",
        ])
    else:
        candidates.extend([
            Path(r"C:\Users\eduev\Meu Drive\17 - Projects\scripts"),
            ROOT_DIR.parent / "scripts",
            Path.home() / "Documents" / "scripts",
        ])

    # Generic fallbacks
    candidates.extend([
        ROOT_DIR.parent / "scripts",
        ROOT_DIR.parent.parent / "scripts",
        ROOT_DIR / "scripts",
    ])

    for c in candidates:
        if (c / "Utils" / "career_form_fill.ahk").is_file():
            return c
        if c.is_dir():
            return c

    return ROOT_DIR.parent / "scripts"


def get_ahk_script() -> Path:
    sdir = get_scripts_dir()
    for sub in ("Utils/career_form_fill.ahk", "career_form_fill.ahk"):
        target = sdir / sub
        if target.is_file():
            return target
    return sdir / "Utils" / "career_form_fill.ahk"


def get_uia_inspector_path() -> Path:
    sdir = get_scripts_dir()
    candidate = sdir / "vendor" / "UIA-v2" / "UIATreeInspector.ahk"
    if candidate.is_file():
        return candidate
    return sdir / "UIATreeInspector.ahk"


def get_ahk_exe() -> Path:
    override = os.environ.get("CAREER_AHK_EXE", "").strip()
    if override and Path(override).is_file():
        return Path(override)

    candidates = [
        Path.home() / "AppData" / "Local" / "Programs" / "AutoHotkey" / "v2" / "AutoHotkey64.exe",
        Path.home() / "AppData" / "Local" / "Programs" / "AutoHotkey" / "AutoHotkey64.exe",
        Path(r"C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe"),
        Path(r"C:\Program Files\AutoHotkey\AutoHotkey64.exe"),
    ]
    for c in candidates:
        if c.is_file():
            return c

    import shutil
    found = shutil.which("AutoHotkey64.exe") or shutil.which("AutoHotkey.exe")
    if found:
        return Path(found)

    return Path(r"C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe")


# --- Logging Setup ---

LOG_DIR = ROOT_DIR / "my-data" / "debug"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "career_debug.log"

logger = logging.getLogger("career_debug")
logger.setLevel(logging.DEBUG)

if not logger.handlers:
    # File handler (append mode, UTF-8)
    fh = logging.FileHandler(str(LOG_FILE), encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    fmt = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    fh.setFormatter(fmt)
    logger.addHandler(fh)

    # Console handler (flushed)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.INFO)
    ch.setFormatter(fmt)
    logger.addHandler(ch)


def log_debug(message: str, data: Any = None) -> None:
    if data is not None:
        try:
            dumped = json.dumps(data, default=str, ensure_ascii=False)
            message = f"{message} | data={dumped}"
        except Exception:
            message = f"{message} | data={str(data)}"
    logger.debug(message)
    for h in logger.handlers:
        h.flush()


def log_info(message: str, data: Any = None) -> None:
    if data is not None:
        try:
            dumped = json.dumps(data, default=str, ensure_ascii=False)
            message = f"{message} | data={dumped}"
        except Exception:
            message = f"{message} | data={str(data)}"
    logger.info(message)
    for h in logger.handlers:
        h.flush()


def log_error(message: str, exc: BaseException | None = None) -> None:
    if exc:
        import traceback
        tb = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
        message = f"{message}\n{tb}"
    logger.error(message)
    for h in logger.handlers:
        h.flush()


def get_debug_summary() -> dict[str, Any]:
    env = detect_environment()
    sdir = get_scripts_dir()
    ahk_script = get_ahk_script()
    ahk_exe_path = get_ahk_exe()
    inspector_path = get_uia_inspector_path()

    return {
        "timestamp": datetime.now().isoformat(),
        "environment": env,
        "username": getpass.getuser(),
        "repo_root": str(ROOT_DIR),
        "scripts_dir": str(sdir),
        "scripts_dir_exists": sdir.is_dir(),
        "ahk_script": str(ahk_script),
        "ahk_script_exists": ahk_script.is_file(),
        "ahk_exe": str(ahk_exe_path),
        "ahk_exe_exists": ahk_exe_path.is_file(),
        "uia_inspector": str(inspector_path),
        "uia_inspector_exists": inspector_path.is_file(),
    }


# Log startup environment detection
log_info(f"Career Cockpit Environment initialized: {CURRENT_ENV.upper()}", get_debug_summary())
