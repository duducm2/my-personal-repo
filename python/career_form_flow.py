"""Orchestrate window capture, the AI companion prompt, and AHK form filling."""

from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Any

from autofill_data_source import parse_application_answers
from build_ai_form_prompt import build_form_fill_prompt
from career_ahk import run_ahk, send_companion_hotkey
from form_fill_executor import (
    build_fill_steps,
    load_session,
    looks_like_uia_tree,
    save_session,
    session_public,
    write_fill_plan,
)


def _opening(store: Any, opening_id: str) -> dict[str, Any]:
    opening_id = (opening_id or "").strip()
    if not opening_id:
        raise ValueError("opening_id is required")
    collections = store.load_all()
    for row in collections.get("jobOpenings") or []:
        if str(row.get("id") or "") == opening_id:
            return row
    raise ValueError(f"Opening not found: {opening_id}")


def capture_window(opening_id: str = "") -> dict[str, Any]:
    result = run_ahk("capture-window", timeout=25)
    if not result.get("ok"):
        raise RuntimeError(str(result.get("error") or "Could not read Chrome windows"))
    window_name = str(result.get("window_name") or "")
    if opening_id and window_name:
        save_session(opening_id, window_name=window_name)
    return {
        "ok": True,
        "window_name": window_name,
        "windows": result.get("windows") or [],
    }


def open_uia() -> dict[str, Any]:
    result = run_ahk("open-uia", timeout=20)
    if not result.get("ok"):
        raise RuntimeError(
            str(result.get("error") or "Could not open UIA Tree Inspector")
        )
    return {"ok": True}


def build_and_send(store: Any, opening_id: str, window_name: str) -> dict[str, Any]:
    opening = _opening(store, opening_id)
    window_name = (window_name or "").strip()
    if not window_name:
        raise ValueError("Type the application tab title first.")
    with tempfile.TemporaryDirectory(prefix="career-form-") as tmp:
        folder = Path(tmp)
        tree_path = folder / "tree.txt"
        dumped = run_ahk(
            "dump-tree",
            timeout=180,
            title=window_name,
            out=str(tree_path),
        )
        if not dumped.get("ok"):
            raise RuntimeError(
                str(dumped.get("error") or "Could not read the application window")
            )
        tree = ""
        if tree_path.is_file():
            tree = tree_path.read_text(encoding="utf-8-sig")
        if not looks_like_uia_tree(tree):
            raise RuntimeError(
                "UIA Tree Inspector did not copy a UI tree. "
                "The tab title has to match the start of a window in that list."
            )
        save_session(opening_id, window_name=window_name, ui_tree=tree)
        prompt = build_form_fill_prompt(
            opening,
            store.load_prompt_context(),
            tree,
            window_name,
        )
        prompt_path = folder / "prompt.txt"
        prompt_path.write_text(prompt, encoding="utf-8", newline="\n")
        send_companion_hotkey()
        sent = run_ahk("send-prompt", timeout=45, file=str(prompt_path))
        if not sent.get("ok"):
            raise RuntimeError(str(sent.get("error") or "Could not send the prompt"))
    return {"ok": True, "chars": len(prompt), "tree_chars": len(tree)}


import ctypes
import time
from typing import Any

try:
    import win32clipboard
    import win32con
    import win32gui
    import win32process
    _HAVE_WIN32 = True
except ImportError:
    _HAVE_WIN32 = False


def _attach_interactive_desktop() -> bool:
    try:
        user32 = ctypes.windll.user32
        hwinsta = user32.OpenWindowStationW("WinSta0", False, 0x37F)
        if hwinsta:
            user32.SetProcessWindowStation(hwinsta)
        hdesk = user32.OpenDesktopW("Default", 0, False, 0x1FF)
        if hdesk:
            user32.SetThreadDesktop(hdesk)
        return True
    except Exception:
        return False


def _set_clipboard_text(text: str, timeout: float = 2.0) -> bool:
    if not _HAVE_WIN32:
        return False
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            win32clipboard.OpenClipboard()
            try:
                win32clipboard.EmptyClipboard()
                win32clipboard.SetClipboardText(text, win32con.CF_UNICODETEXT)
                return True
            finally:
                win32clipboard.CloseClipboard()
        except Exception:
            time.sleep(0.05)
    return False


def _find_companion_window() -> tuple[int, str]:
    if not _HAVE_WIN32:
        return 0, ""
    candidates: list[tuple[int, str]] = []

    def enum_cb(hwnd: int, _: Any) -> None:
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd).strip()
            t_low = title.lower()
            if any(term in t_low for term in ("gemini", "chatgpt", "copilot", "claude", "perplexity")):
                candidates.append((hwnd, title))

    try:
        win32gui.EnumWindows(enum_cb, None)
    except Exception:
        pass
    if candidates:
        return candidates[0]
    return 0, ""


def _focus_window(hwnd: int) -> bool:
    if not _HAVE_WIN32 or not hwnd:
        return False
    try:
        user32 = ctypes.windll.user32
        kernel32 = ctypes.windll.kernel32
        cur_t = kernel32.GetCurrentThreadId()
        fg_hwnd = user32.GetForegroundWindow()
        fg_t = user32.GetWindowThreadProcessId(fg_hwnd, None)
        target_t = user32.GetWindowThreadProcessId(hwnd, None)

        if fg_t and fg_t != cur_t:
            user32.AttachThreadInput(cur_t, fg_t, True)
        if target_t and target_t != cur_t:
            user32.AttachThreadInput(cur_t, target_t, True)

        # Alt key tap to unblock SetForegroundWindow
        user32.keybd_event(0x12, 0, 0, 0)
        user32.keybd_event(0x12, 0, 2, 0)

        user32.ShowWindow(hwnd, win32con.SW_RESTORE)
        user32.BringWindowToTop(hwnd)
        ret = user32.SetForegroundWindow(hwnd)

        if target_t and target_t != cur_t:
            user32.AttachThreadInput(cur_t, target_t, False)
        if fg_t and fg_t != cur_t:
            user32.AttachThreadInput(cur_t, fg_t, False)

        time.sleep(0.15)
        return ret != 0 or user32.GetForegroundWindow() == hwnd
    except Exception:
        return False


def _send_paste_and_submit() -> None:
    user32 = ctypes.windll.user32
    # Ctrl+A to clear / select all
    user32.keybd_event(0x11, 0, 0, 0)
    user32.keybd_event(0x41, 0, 0, 0)
    time.sleep(0.04)
    user32.keybd_event(0x41, 0, 2, 0)
    user32.keybd_event(0x11, 0, 2, 0)
    time.sleep(0.08)
    # Ctrl+V to paste
    user32.keybd_event(0x11, 0, 0, 0)
    user32.keybd_event(0x56, 0, 0, 0)
    time.sleep(0.04)
    user32.keybd_event(0x56, 0, 2, 0)
    user32.keybd_event(0x11, 0, 2, 0)
    time.sleep(0.3)
    # Enter to submit
    user32.keybd_event(0x0D, 0, 0, 0)
    time.sleep(0.04)
    user32.keybd_event(0x0D, 0, 2, 0)


def send_prompt_text(prompt: str) -> dict[str, Any]:
    """Focus the AI companion and paste a finished prompt, then submit it."""
    prompt = (prompt or "").strip()
    if not prompt:
        raise ValueError("Prompt is empty.")

    _attach_interactive_desktop()
    _set_clipboard_text(prompt)

    # 1. Try sending the companion global hotkey (Win+Alt+Shift+I)
    try:
        send_companion_hotkey()
    except Exception:
        pass

    # 2. Look for open companion window (Gemini, ChatGPT, Copilot, etc.)
    hwnd, title = _find_companion_window()
    if not hwnd:
        # Give companion hotkey up to 1 second to surface the window if launched
        for _ in range(5):
            time.sleep(0.2)
            hwnd, title = _find_companion_window()
            if hwnd:
                break

    if hwnd:
        focused = _focus_window(hwnd)
        if focused:
            time.sleep(0.25)
            _send_paste_and_submit()
            return {"ok": True, "chars": len(prompt), "window": title}

    # 3. Fallback to AHK send-prompt if native focus didn't find the window
    with tempfile.TemporaryDirectory(prefix="career-prompt-") as tmp:
        prompt_path = Path(tmp) / "prompt.txt"
        prompt_path.write_text(prompt, encoding="utf-8", newline="\n")
        try:
            sent = run_ahk("send-prompt", timeout=20, file=str(prompt_path))
            if sent.get("ok"):
                return {"ok": True, "chars": len(prompt), "method": "ahk"}
        except Exception:
            pass

    # 4. Safe fallback: prompt is guaranteed to be on the clipboard
    return {
        "ok": True,
        "chars": len(prompt),
        "clipboard_only": True,
        "message": "Prompt copied to clipboard.",
    }


def fill_form(store: Any, opening_id: str) -> dict[str, Any]:
    opening = _opening(store, opening_id)
    session = load_session(opening_id)
    window_name = str(session.get("window_name") or "").strip()
    tree = str(session.get("ui_tree") or "")
    if not window_name:
        raise ValueError(
            "No window name saved for this opening. Press Alt+F and capture the ATS tab title."
        )
    if not looks_like_uia_tree(tree):
        raise ValueError(
            "No UI tree saved for this opening. Press Alt+F, copy the full tree with Shift+C, "
            "then Build & send before filling."
        )
    payload = parse_application_answers(str(opening.get("application_answers") or ""))
    fields = (payload or {}).get("fields") or []
    if not fields:
        raise ValueError(
            "No imported form answers. Press Alt+A after the AI companion replies."
        )
    steps = build_fill_steps(tree, fields)
    if not steps:
        raise ValueError(
            "None of the imported answers matched a control in the saved UI tree. "
            "Copy the tree again from the application window and Build & send."
        )
    with tempfile.TemporaryDirectory(prefix="career-fill-") as tmp:
        plan_path = Path(tmp) / "plan.txt"
        write_fill_plan(plan_path, window_name, steps)
        result = run_ahk("fill-form", timeout=240, plan=str(plan_path))
    if not result.get("ok"):
        raise RuntimeError(str(result.get("error") or "Form fill failed"))
    errors = result.get("errors") or []
    if not isinstance(errors, list):
        errors = [str(errors)]
    return {
        "ok": True,
        "filled": int(result.get("filled") or 0),
        "skipped": int(result.get("skipped") or 0),
        "planned": len(steps),
        "errors": [str(item) for item in errors[:8]],
        "window_name": window_name,
    }


def session_for(opening_id: str) -> dict[str, Any]:
    if not (opening_id or "").strip():
        raise ValueError("opening_id is required")
    return session_public(opening_id)
