"""Orchestrate window capture, the AI companion prompt, and AHK form filling."""

from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Any

from autofill_data_source import parse_application_answers
from build_ai_form_prompt import build_form_fill_prompt
from career_ahk import read_clipboard_text, run_ahk, send_companion_hotkey
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
    _attach_interactive_desktop()
    chrome_titles: list[str] = []
    suggested = ""
    if _HAVE_WIN32:
        try:
            def enum_chrome(hwnd: int, _: Any) -> None:
                if win32gui.IsWindowVisible(hwnd):
                    t = win32gui.GetWindowText(hwnd).strip()
                    t_low = t.lower()
                    if any(b in t_low for b in ("chrome", "edge", "brave", "firefox")):
                        if not any(
                            skip in t_low
                            for skip in (
                                "career cockpit",
                                "job openings — home",
                                "gemini",
                                "chatgpt",
                                "copilot",
                                "claude",
                                "clipangel",
                            )
                        ):
                            chrome_titles.append(t)

            win32gui.EnumWindows(enum_chrome, None)
            if chrome_titles:
                suggested = chrome_titles[0]
        except Exception:
            pass

    if not chrome_titles:
        try:
            result = run_ahk("capture-window", timeout=8)
            if result.get("ok"):
                suggested = str(result.get("window_name") or "")
                chrome_titles = result.get("windows") or []
        except Exception:
            pass

    if opening_id and chrome_titles:
        sess = load_session(opening_id)
        if sess.get("window_name") and sess["window_name"] in chrome_titles:
            suggested = sess["window_name"]
        else:
            tokens = [tok.lower() for tok in opening_id.replace("-", " ").replace("_", " ").split() if len(tok) >= 4]
            for t in chrome_titles:
                t_low = t.lower()
                if any(tok in t_low for tok in tokens):
                    suggested = t
                    break

    if opening_id and suggested:
        save_session(opening_id, window_name=suggested)
    return {
        "ok": True,
        "window_name": suggested,
        "windows": chrome_titles,
    }


def open_uia() -> dict[str, Any]:
    _attach_interactive_desktop()
    inspector_hwnd = 0
    if _HAVE_WIN32:
        try:
            def find_inspector(hwnd: int, _: Any) -> None:
                nonlocal inspector_hwnd
                if win32gui.IsWindowVisible(hwnd) and "UIATreeInspector" in win32gui.GetWindowText(hwnd):
                    inspector_hwnd = hwnd

            win32gui.EnumWindows(find_inspector, None)
        except Exception:
            pass

    if inspector_hwnd:
        _focus_window(inspector_hwnd)
        return {"ok": True, "hwnd": inspector_hwnd}

    # Launch interactively on the user's interactive desktop via task scheduler
    short_bat = r"C:\Users\eduev\MEUDRI~1\17-PRO~1\scripts\Utils\open_uia.bat"
    try:
        subprocess.run(
            ["schtasks", "/create", "/tn", "OpenUIA", "/tr", short_bat, "/sc", "once", "/st", "23:59", "/it", "/f"],
            check=False,
            capture_output=True,
        )
        subprocess.run(["schtasks", "/run", "/tn", "OpenUIA"], check=False, capture_output=True)
        subprocess.run(["schtasks", "/delete", "/tn", "OpenUIA", "/f"], check=False, capture_output=True)
    except Exception:
        pass

    for _ in range(10):
        time.sleep(0.3)
        if _HAVE_WIN32:
            try:
                def find_inspector2(hwnd: int, _: Any) -> None:
                    nonlocal inspector_hwnd
                    if win32gui.IsWindowVisible(hwnd) and "UIATreeInspector" in win32gui.GetWindowText(hwnd):
                        inspector_hwnd = hwnd

                win32gui.EnumWindows(find_inspector2, None)
                if inspector_hwnd:
                    _focus_window(inspector_hwnd)
                    return {"ok": True, "hwnd": inspector_hwnd}
            except Exception:
                pass

    return {"ok": True}


def build_and_send(store: Any, opening_id: str, window_name: str) -> dict[str, Any]:
    opening = _opening(store, opening_id)
    window_name = (window_name or "").strip()
    if not window_name:
        raise ValueError("Type the application tab title first.")

    tree = ""
    # 1. Direct AHK dump-tree from the live Chrome window (fast, 100% automatic)
    with tempfile.TemporaryDirectory(prefix="career-form-") as tmp:
        tree_path = Path(tmp) / "tree.txt"
        try:
            dumped = run_ahk(
                "dump-tree",
                timeout=15,
                title=window_name,
                out=str(tree_path),
            )
            if dumped.get("ok") and tree_path.is_file():
                candidate = tree_path.read_text(encoding="utf-8-sig")
                if looks_like_uia_tree(candidate):
                    tree = candidate
        except Exception:
            pass

    # 2. Check if the clipboard contains a valid UIA tree
    if not tree:
        try:
            cb = read_clipboard_text(timeout=0.5)
            if looks_like_uia_tree(cb):
                tree = cb
        except Exception:
            pass

    # 3. Check if a saved tree exists in session for this opening
    if not tree:
        session = load_session(opening_id)
        saved_tree = str(session.get("ui_tree") or "")
        if looks_like_uia_tree(saved_tree):
            tree = saved_tree

    # 4. Check if opening has raw form text saved
    if not tree:
        raw_form = str(opening.get("application_form_raw") or "").strip()
        if raw_form and len(raw_form) > 30:
            tree = raw_form

    # 5. If still no tree, report error clearly
    if not tree:
        raise ValueError(
            f"Could not read the application window UI tree automatically. Make sure the application tab ({window_name}) is open in Chrome."
        )

    save_session(opening_id, window_name=window_name, ui_tree=tree)
    prompt = build_form_fill_prompt(
        opening,
        store.load_prompt_context(),
        tree,
        window_name,
    )
    sent = send_prompt_text(prompt)
    return {
        "ok": True,
        "chars": len(prompt),
        "tree_chars": len(tree),
        "window": sent.get("window") or "",
        "method": sent.get("method") or "native",
    }


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
