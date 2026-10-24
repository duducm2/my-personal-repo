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

ROOT_DIR = Path(__file__).resolve().parent.parent

_VK_LWIN = 0x5B
_VK_MENU = 0x12
_VK_SHIFT = 0x10
_VK_I = 0x49
_KEYEVENTF_KEYUP = 0x0002
_KEYEVENTF_EXTENDEDKEY = 0x0001
_INPUT_KEYBOARD = 1


def scripts_dir() -> Path:
    override = os.environ.get("CAREER_SCRIPTS_DIR", "").strip()
    if override:
        return Path(override)
    return ROOT_DIR.parent / "scripts"


def ahk_script_path() -> Path:
    override = os.environ.get("CAREER_FORM_FILL_AHK", "").strip()
    if override:
        return Path(override)
    return scripts_dir() / "Utils" / "career_form_fill.ahk"


def ahk_exe() -> Path:
    override = os.environ.get("CAREER_AHK_EXE", "").strip()
    candidates = []
    if override:
        candidates.append(Path(override))
    local = os.environ.get("LOCALAPPDATA", "")
    if local:
        candidates.append(
            Path(local) / "Programs" / "AutoHotkey" / "v2" / "AutoHotkey64.exe"
        )
    candidates.append(Path(r"C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe"))
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    found = shutil.which("AutoHotkey64.exe") or shutil.which("AutoHotkey.exe")
    if found:
        return Path(found)
    raise RuntimeError(
        "AutoHotkey v2 was not found. Set CAREER_AHK_EXE to AutoHotkey64.exe."
    )


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

    down = (_VK_LWIN, _VK_MENU, _VK_SHIFT, _VK_I)
    sequence = [stroke(vk, False) for vk in down] + [
        stroke(vk, True) for vk in reversed(down)
    ]
    batch = (INPUT * len(sequence))(*sequence)
    user32 = ctypes.WinDLL("user32", use_last_error=True)
    sent = user32.SendInput(len(sequence), ctypes.byref(batch), ctypes.sizeof(INPUT))
    if sent != len(sequence):
        err = ctypes.get_last_error()
        raise OSError(f"SendInput sent {sent} of {len(sequence)} (error {err})")


def run_ahk(action: str, *, timeout: float = 60, **args: str) -> dict[str, Any]:
    """Run career_form_fill.ahk. Extra args are passed as --name value."""
    script = ahk_script_path()
    if not script.is_file():
        raise RuntimeError(f"AutoHotkey script not found: {script}")
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
        try:
            completed = subprocess.run(  # noqa: S603
                command,
                check=False,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
            )
        except subprocess.TimeoutExpired as exc:
            raise RuntimeError(
                f"AutoHotkey {action} timed out after {int(timeout)}s"
            ) from exc
        stderr = (completed.stderr or "").strip()
        stdout = (completed.stdout or "").strip()
        if result_path.is_file():
            try:
                payload = json.loads(result_path.read_text(encoding="utf-8-sig"))
            except json.JSONDecodeError as exc:
                raise RuntimeError(
                    f"AutoHotkey {action} returned invalid JSON: {exc}"
                ) from exc
        else:
            detail = stderr or stdout or f"exit {completed.returncode}"
            raise RuntimeError(f"AutoHotkey {action} failed: {detail[:800]}")
        if not isinstance(payload, dict):
            raise RuntimeError(f"AutoHotkey {action} returned a non-object result")
        if completed.returncode != 0 and payload.get("ok"):
            payload["ok"] = False
            payload["error"] = (
                payload.get("error") or stderr[:800] or "AutoHotkey failed"
            )
        if not payload.get("ok"):
            message = str(payload.get("error") or stderr or "AutoHotkey failed")
            if stderr and stderr not in message:
                message = f"{message} ({stderr[:400]})"
            payload["error"] = message
        return payload
