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

def _script_dir_candidates() -> list[Path]:
    candidates: list[Path] = []
    override = os.environ.get("CAREER_SCRIPTS_DIR", "").strip()
    if override:
        candidates.append(Path(override))

    home = Path.home()
    candidates.append(home / "Documents" / "scripts")

    userprofile = os.environ.get("USERPROFILE", "").strip()
    if userprofile:
        candidates.append(Path(userprofile) / "Documents" / "scripts")

    onedrive = os.environ.get("OneDrive", "").strip()
    if onedrive:
        candidates.append(Path(onedrive) / "Documents" / "scripts")

    onedrive_commercial = os.environ.get("OneDriveCommercial", "").strip()
    if onedrive_commercial:
        candidates.append(Path(onedrive_commercial) / "Documents" / "scripts")

    env = detect_environment()
    if env == "work":
        candidates.extend([
            Path(r"C:\Users\fie7ca\Documents\scripts"),
            Path(r"C:\Users\fie7ca\Documents\01 - Scripts"),
            home / "Documents" / "01 - Scripts",
            ROOT_DIR.parent / "01 - Scripts",
            ROOT_DIR.parent / "scripts",
        ])
    else:
        candidates.extend([
            Path(r"C:\Users\eduev\Meu Drive\17 - Projects\scripts"),
            ROOT_DIR.parent / "scripts",
            home / "Documents" / "scripts",
        ])

    candidates.extend([
        ROOT_DIR.parent / "scripts",
        ROOT_DIR.parent.parent / "scripts",
        ROOT_DIR / "scripts",
    ])

    unique: list[Path] = []
    seen: set[str] = set()
    for candidate in candidates:
        key = str(candidate).lower()
        if key not in seen:
            seen.add(key)
            unique.append(candidate)
    return unique


def get_scripts_dir() -> Path:
    override = os.environ.get("CAREER_SCRIPTS_DIR", "").strip()
    if override and Path(override).is_dir():
        return Path(override)

    candidates = _script_dir_candidates()

    # 1. Prefer candidate directories that actually contain career_form_fill.ahk
    for c in candidates:
        if (c / "Utils" / "career_form_fill.ahk").is_file() or (c / "career_form_fill.ahk").is_file():
            return c

    # 2. Fallback to any candidate directory that exists
    for c in candidates:
        if c.is_dir():
            return c

    return ROOT_DIR.parent / "scripts"


def get_ahk_script() -> Path:
    sdir = get_scripts_dir()
    for sub in ("Utils/career_form_fill.ahk", "career_form_fill.ahk"):
        target = sdir / sub
        if target.is_file():
            return target

    # Exhaustive fallback: check all candidate paths directly
    for c in _script_dir_candidates():
        for sub in ("Utils/career_form_fill.ahk", "career_form_fill.ahk"):
            target = c / sub
            if target.is_file():
                return target

    return sdir / "Utils" / "career_form_fill.ahk"


def get_uia_inspector_path() -> Path:
    sdir = get_scripts_dir()
    candidate = sdir / "vendor" / "UIA-v2" / "UIATreeInspector.ahk"
    if candidate.is_file():
        return candidate
    alt = sdir / "UIATreeInspector.ahk"
    if alt.is_file():
        return alt

    for c in _script_dir_candidates():
        for sub in ("vendor/UIA-v2/UIATreeInspector.ahk", "UIATreeInspector.ahk"):
            target = c / sub
            if target.is_file():
                return target

    return candidate


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

# Reset and configure handlers (pure FileHandler to avoid Windows console Errno 22)
for h in list(logger.handlers):
    try:
        logger.removeHandler(h)
    except Exception:
        pass

fh = logging.FileHandler(str(LOG_FILE), encoding="utf-8")
fh.setLevel(logging.DEBUG)
fmt = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
fh.setFormatter(fmt)
logger.addHandler(fh)


def _flush_handlers() -> None:
    for h in list(logger.handlers):
        try:
            h.flush()
        except Exception:
            pass


def log_debug(message: str, data: Any = None) -> None:
    try:
        if data is not None:
            try:
                dumped = json.dumps(data, default=str, ensure_ascii=False)
                message = f"{message} | data={dumped}"
            except Exception:
                message = f"{message} | data={str(data)}"
        logger.debug(message)
        _flush_handlers()
    except Exception:
        pass


def log_info(message: str, data: Any = None) -> None:
    try:
        if data is not None:
            try:
                dumped = json.dumps(data, default=str, ensure_ascii=False)
                message = f"{message} | data={dumped}"
            except Exception:
                message = f"{message} | data={str(data)}"
        logger.info(message)
        _flush_handlers()
    except Exception:
        pass


def log_error(message: str, exc: BaseException | None = None) -> None:
    try:
        if exc:
            import traceback
            tb = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
            message = f"{message}\n{tb}"
        logger.error(message)
        _flush_handlers()
    except Exception:
        pass


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

