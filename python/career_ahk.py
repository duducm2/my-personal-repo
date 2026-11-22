"""Run the career form-fill AutoHotkey script and open the AI companion.

The companion chord is Win+Alt+Shift+I, the same global shortcut the scripts
repo already uses. SendInput comes from Python so the running AutoHotkey
hook sees it.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import environment
from environment import log_debug, log_info, log_error, no_window_kwargs

ROOT_DIR = Path(__file__).resolve().parent.parent

_VK_LWIN = 0x5B
_VK_MENU = 0x12
_VK_SHIFT = 0x10
_VK_I = 0x49
_KEYEVENTF_KEYUP = 0x0002
_KEYEVENTF_EXTENDEDKEY = 0x0001
_INPUT_KEYBOARD = 1


def _script_dir_candidates() -> list[Path]:
    candidates: list[Path] = []
    override = os.environ.get("CAREER_SCRIPTS_DIR", "").strip()
    if override:
        candidates.append(Path(override))

    # Sibling folder next to repository root (personal workspace setup)
    candidates.append(ROOT_DIR.parent / "scripts")

    # User Documents/scripts (common in work/corporate environments)
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

    # Parent of parent (if repos are nested under a category folder)
    candidates.append(ROOT_DIR.parent.parent / "scripts")

    # Repository-local scripts folder
    candidates.append(ROOT_DIR / "scripts")

    unique: list[Path] = []
    seen: set[str] = set()
    for candidate in candidates:
        key = str(candidate).lower()
        if key not in seen:
            seen.add(key)
            unique.append(candidate)
    return unique


def scripts_dir() -> Path:
    return environment.get_scripts_dir()


def ahk_script_path() -> Path:
    return environment.get_ahk_script()


def ahk_exe() -> Path:
    return environment.get_ahk_exe()


def read_clipboard_text(timeout: float = 2.0) -> str:
    """Read Unicode text from the clipboard without going through AutoHotkey.

    A_Clipboard blocks when another script is watching the clipboard. This reads
    CF_UNICODETEXT directly and gives up if the clipboard stays busy.
    """
    import ctypes
    import time
    from ctypes import wintypes

    user32 = ctypes.WinDLL("user32", use_last_error=True)
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    user32.OpenClipboard.argtypes = [wintypes.HWND]
    user32.OpenClipboard.restype = wintypes.BOOL
    user32.CloseClipboard.argtypes = []
    user32.CloseClipboard.restype = wintypes.BOOL
    user32.GetClipboardData.argtypes = [wintypes.UINT]
    user32.GetClipboardData.restype = wintypes.HANDLE
    kernel32.GlobalLock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalLock.restype = ctypes.c_void_p
    kernel32.GlobalUnlock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalUnlock.restype = wintypes.BOOL

    cf_unicode_text = 13
    deadline = time.monotonic() + timeout
    opened = False
    while time.monotonic() < deadline:
        if user32.OpenClipboard(None):
            opened = True
            break
        time.sleep(0.05)
    if not opened:
        raise RuntimeError(
            "Clipboard is busy. Copy the UI tree again, then Build & send."
        )
    try:
        handle = user32.GetClipboardData(cf_unicode_text)
        if not handle:
            return ""
        pointer = kernel32.GlobalLock(handle)
        if not pointer:
            return ""
        try:
            return ctypes.wstring_at(pointer) or ""
        finally:
            kernel32.GlobalUnlock(handle)
    finally:
        user32.CloseClipboard()


def send_companion_hotkey() -> None:
    """Press Win+Alt+Shift+I so the running scripts repo opens the AI companion."""
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

    def stroke(vk: int, up: bool) -> INPUT:
        item = INPUT()
        item.type = _INPUT_KEYBOARD
        item.union.ki.wVk = vk
        flags = _KEYEVENTF_KEYUP if up else 0
        if vk == _VK_LWIN:
            flags |= _KEYEVENTF_EXTENDEDKEY
        item.union.ki.dwFlags = flags
        return item

    import time

    down = (_VK_LWIN, _VK_MENU, _VK_SHIFT, _VK_I)
    down_seq = [stroke(vk, False) for vk in down]
    up_seq = [stroke(vk, True) for vk in reversed(down)]

    user32 = ctypes.WinDLL("user32", use_last_error=True)
    batch_down = (INPUT * len(down_seq))(*down_seq)
    sent_down = user32.SendInput(len(down_seq), ctypes.byref(batch_down), ctypes.sizeof(INPUT))
    time.sleep(0.05)
    batch_up = (INPUT * len(up_seq))(*up_seq)
    sent_up = user32.SendInput(len(up_seq), ctypes.byref(batch_up), ctypes.sizeof(INPUT))
    if sent_down != len(down_seq) or sent_up != len(up_seq):
        err = ctypes.get_last_error()
        raise OSError(f"SendInput failed (error {err})")


def _is_default_desktop() -> bool:
    try:
        import ctypes
        u = ctypes.windll.user32
        hdesk = u.GetThreadDesktop(ctypes.windll.kernel32.GetCurrentThreadId())
        buf = ctypes.create_unicode_buffer(256)
        u.GetUserObjectInformationW(hdesk, 2, buf, 256, None)
        return buf.value.lower() == "default"
    except Exception:
        return False


def run_ahk(action: str, *, timeout: float = 60, **args: str) -> dict[str, Any]:
    """Run career_form_fill.ahk. Extra args are passed as --name value."""
    import time
    start_t = time.monotonic()

    script = ahk_script_path()
    if not script.is_file():
        searched = "\n  - ".join(
            str(d / "Utils" / "career_form_fill.ahk") for d in _script_dir_candidates()
        )
        msg = f"AutoHotkey script not found: {script}\nChecked locations:\n  - {searched}"
        log_error(msg)
        raise RuntimeError(msg)
    exe = ahk_exe()
    with tempfile.TemporaryDirectory(prefix="career-ahk-") as tmp:
        result_path = Path(tmp) / "result.json"
        command = [
            str(exe),
            "/ErrorStdOut",
            str(script),
            "--action",
            action,
            "--result",
            str(result_path),
        ]
        for key, value in args.items():
            command.extend([f"--{key.replace('_', '-')}", str(value)])

        stderr = ""
        stdout = ""
        completed_code = 0
        use_schtasks = not _is_default_desktop()

        log_debug(f"run_ahk starting: action={action}, use_schtasks={use_schtasks}", {"command": command})

        if use_schtasks:
            bat_path = Path(tmp) / "run_ahk.bat"
            bat_parts = []
            for part in command:
                if " " in part or not part.startswith("--"):
                    bat_parts.append(f'"{part}"')
                else:
                    bat_parts.append(part)
            bat_path.write_text(f"@echo off\n{' '.join(bat_parts)}\n", encoding="ascii", errors="ignore")

            # Silent VBScript wrapper to prevent cmd.exe from flashing a terminal window or stealing focus
            vbs_path = Path(tmp) / "run_ahk.vbs"
            vbs_content = f'Set sh = CreateObject("WScript.Shell")\nsh.Run """{bat_path}""", 0, False\n'
            vbs_path.write_text(vbs_content, encoding="ascii", errors="ignore")

            tn = f"CareerAHK_{os.getpid()}"
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
                    time.sleep(0.1)
            finally:
                subprocess.run(
                    ["schtasks", "/delete", "/tn", tn, "/f"],
                    check=False,
                    capture_output=True,
                    **no_window_kwargs(),
                )
        else:
            try:
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
                completed_code = completed.returncode
                stderr = (completed.stderr or "").strip()
                stdout = (completed.stdout or "").strip()
            except subprocess.TimeoutExpired as exc:
                log_error(f"AutoHotkey {action} timed out after {int(timeout)}s")
                raise RuntimeError(
                    f"AutoHotkey {action} timed out after {int(timeout)}s"
                ) from exc

        dur = round(time.monotonic() - start_t, 2)
        if result_path.is_file():
            try:
                payload = json.loads(result_path.read_text(encoding="utf-8-sig"))
            except json.JSONDecodeError as exc:
                log_error(f"AutoHotkey {action} returned invalid JSON ({dur}s)", exc)
                raise RuntimeError(
                    f"AutoHotkey {action} returned invalid JSON: {exc}"
                ) from exc
        else:
            detail = stderr or stdout or f"exit {completed_code}"
            log_error(f"AutoHotkey {action} produced no result file ({dur}s): {detail[:800]}")
            raise RuntimeError(f"AutoHotkey {action} failed: {detail[:800]}")
        if not isinstance(payload, dict):
            log_error(f"AutoHotkey {action} returned a non-object result ({dur}s)")
            raise RuntimeError(f"AutoHotkey {action} returned a non-object result")
        if completed_code != 0 and payload.get("ok"):
            payload["ok"] = False
            payload["error"] = (
                payload.get("error") or stderr[:800] or "AutoHotkey failed"
            )
        if not payload.get("ok"):
            message = str(payload.get("error") or stderr or "AutoHotkey failed")
            if stderr and stderr not in message:
                message = f"{message} ({stderr[:400]})"
            payload["error"] = message
            log_error(f"AutoHotkey {action} failed ({dur}s): {message}")
        else:
            log_info(f"AutoHotkey {action} succeeded ({dur}s)", payload)
        return payload
