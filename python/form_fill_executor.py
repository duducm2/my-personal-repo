"""Match imported form answers to a saved UIA tree and write an AHK fill plan.

The plan is a small length-prefixed text file. AutoHotkey reads it without a
JSON library. Values may contain newlines; the character count is Unicode code
points, which matches AutoHotkey StrLen for ordinary career text.
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent
SESSION_DIR = ROOT_DIR / "my-data" / "autofill" / "form-windows"

FILLABLE_TYPES = {
    "Edit",
    "Document",
    "ComboBox",
    "CheckBox",
    "RadioButton",
    "Spinner",
    "List",
}
BROWSER_NAMES = {
    "back",
    "reload",
    "refresh",
    "minimize",
    "maximize",
    "close",
    "restore",
    "address and search bar",
    "address bar",
    "search",
    "new tab",
    "submit",
    "submit application",
    "apply",
    "apply now",
    "send",
    "send application",
}
LINE_RE = re.compile(
    r"^(?:(?P<path>\d+(?:,\d+)*):\s+)?Type:\s*\d+\s*\((?P<type>[^)]+)\)(?P<rest>.*)$"
)
PROP_RE = re.compile(r'(Name|Value|AutomationId|ClassName): "([^"]*)"')
UIA_MARK = re.compile(r"Type:\s*\d+\s*\(")


def _safe_opening_id(opening_id: str) -> str:
    cleaned = "".join(
        ch if ch.isalnum() or ch in ("-", "_") else "-"
        for ch in (opening_id or "").strip()
    )
    return (cleaned.strip("-_") or "opening")[:80]


def session_path(opening_id: str) -> Path:
    SESSION_DIR.mkdir(parents=True, exist_ok=True)
    return SESSION_DIR / f"{_safe_opening_id(opening_id)}.json"


def load_session(opening_id: str) -> dict[str, Any]:
    path = session_path(opening_id)
    data: dict[str, Any] = {
        "opening_id": opening_id,
        "window_name": "",
        "ui_tree": "",
    }
    if not path.is_file():
        return data
    try:
        loaded = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return data
    if isinstance(loaded, dict):
        data.update(loaded)
    data["opening_id"] = opening_id
    data["window_name"] = str(data.get("window_name") or "")
    data["ui_tree"] = str(data.get("ui_tree") or "")
    return data


def save_session(opening_id: str, **updates: Any) -> dict[str, Any]:
    data = load_session(opening_id)
    for key, value in updates.items():
        if value is not None:
            data[key] = value
    data["opening_id"] = opening_id
    data["updated_at"] = datetime.now().isoformat(timespec="seconds")
    session_path(opening_id).write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return data


def session_public(opening_id: str) -> dict[str, Any]:
    data = load_session(opening_id)
    tree = str(data.get("ui_tree") or "")
    return {
        "ok": True,
        "opening_id": opening_id,
        "window_name": str(data.get("window_name") or ""),
        "has_tree": bool(tree.strip()),
        "tree_chars": len(tree),
        "updated_at": str(data.get("updated_at") or ""),
    }


def looks_like_uia_tree(text: str) -> bool:
    sample = (text or "").strip()
    if len(sample) < 20:
        return False
    return UIA_MARK.search(sample) is not None


def _norm(text: str) -> str:
    value = (text or "").lower().replace("_", " ")
    value = re.sub(r"[*_]+", " ", value)
    value = re.sub(r"[^\w\s]", " ", value, flags=re.UNICODE)
    value = re.sub(
        r"\b(required|optional|obrigat[oó]rio|mandatory)\b",
        " ",
        value,
    )
    return re.sub(r"\s+", " ", value).strip()


def parse_uia_dump(text: str) -> list[dict[str, str]]:
    """Turn a UIA DumpAll clipboard into fillable controls, top to bottom."""
    controls: list[dict[str, str]] = []
    last_text = ""
    for raw_line in (text or "").splitlines():
        match = LINE_RE.match(raw_line.strip())
        if not match:
            continue
        type_name = match.group("type")
        props = dict(PROP_RE.findall(match.group("rest") or ""))
        name = props.get("Name", "").strip()
        if type_name == "Text" and name:
            last_text = name
            continue
        if type_name not in FILLABLE_TYPES and type_name != "Custom":
            continue
        if type_name == "Custom" and not name:
            continue
        borrowed = False
        label = name
        if not label and last_text:
            label = last_text
            borrowed = True
        controls.append(
            {
                "path": match.group("path") or "",
                "type": type_name,
                "name": name,
                "label": label,
                "automation_id": props.get("AutomationId", "").strip(),
            }
        )
        if borrowed:
            last_text = ""
    return controls


def _score(field: dict[str, Any], control: dict[str, str]) -> float:
    hay = _norm(control.get("label") or control.get("name") or "")
    if not hay or hay in BROWSER_NAMES or hay in {"edit", "input", "document", "combo box"}:
        return 0.0
    key = _norm(str(field.get("key") or "").replace("_", " "))
    label = _norm(str(field.get("label") or ""))
    if label and hay == label:
        return 1.0
    if key and hay == key:
        return 0.98
    if label and min(len(label), len(hay)) >= 3 and (label in hay or hay in label):
        return 0.9
    if key and min(len(key), len(hay)) >= 3 and (key in hay or hay in key):
        return 0.88
    tokens = [token for token in (label or key).split() if len(token) > 2]
    if not tokens:
        return 0.0
    hits = sum(1 for token in tokens if token in hay.split())
    if hits / len(tokens) >= 0.6:
        return 0.75
    return 0.0


def _action_for(control: dict[str, str]) -> str:
    type_name = control.get("type") or ""
    if type_name == "CheckBox":
        return "check"
    if type_name == "RadioButton":
        return "click"
    if type_name in {"ComboBox", "List", "Spinner"}:
        return "select"
    return "set_value"


def build_fill_steps(
    ui_tree: str,
    fields: list[dict[str, Any]],
) -> list[dict[str, str]]:
    controls = parse_uia_dump(ui_tree)
    used: set[int] = set()
    steps: list[dict[str, str]] = []
    for field in fields:
        value = "" if field.get("value") is None else str(field.get("value"))
        if not value.strip():
            continue
        best_index = -1
        best_score = 0.0
        for index, control in enumerate(controls):
            if index in used:
                continue
            score = _score(field, control)
            minimum = 0.9 if control.get("type") == "Custom" else 0.75
            if score >= minimum and score > best_score:
                best_score = score
                best_index = index
        if best_index < 0:
            continue
        used.add(best_index)
        control = controls[best_index]
        steps.append(
            {
                "action": _action_for(control),
                "type": control.get("type") or "",
                "name": control.get("name") or control.get("label") or "",
                "automation_id": control.get("automation_id") or "",
                "path": control.get("path") or "",
                "value": value,
                "label": str(field.get("label") or field.get("key") or ""),
            }
        )
        if len(steps) >= 60:
            break
    return steps


def write_fill_plan(path: Path, window_name: str, steps: list[dict[str, str]]) -> None:
    """Write a character-counted plan. Newlines inside values stay as \\n."""

    def field(tag: str, value: str) -> str:
        text = (value or "").replace("\r\n", "\n").replace("\r", "\n")
        return f"{tag} {len(text)}\n{text}\n"

    parts = [field("W", window_name), f"N {len(steps)}\n"]
    for step in steps:
        parts.append(field("A", step.get("action") or "set_value"))
        parts.append(field("T", step.get("type") or ""))
        parts.append(field("M", step.get("name") or ""))
        parts.append(field("I", step.get("automation_id") or ""))
        parts.append(field("P", step.get("path") or ""))
        parts.append(field("V", step.get("value") or ""))
        parts.append(field("L", step.get("label") or ""))
    path.write_text("".join(parts), encoding="utf-8", newline="\n")


def _demo() -> None:
    tree = "\n".join(
        [
            'Type: 50032 (Window) Name: "Acme Jobs - Google Chrome"',
            '1: Type: 50020 (Text) Name: "First name"',
            '2: Type: 50004 (Edit) AutomationId: "firstName"',
            '3: Type: 50004 (Edit) Name: "Email"',
            '4: Type: 50003 (Button) Name: "Submit application"',
        ]
    )
    steps = build_fill_steps(
        tree,
        [
            {"key": "first_name", "label": "First name", "value": "Eduardo"},
            {"key": "email", "label": "Email", "value": "edu@example.com"},
            {"key": "resume", "label": "Resume", "value": ""},
        ],
    )
    assert [step["value"] for step in steps] == ["Eduardo", "edu@example.com"], steps
    assert steps[0]["path"] == "2"
    assert looks_like_uia_tree(tree)
    print("form_fill_executor ok", len(steps))


if __name__ == "__main__":
    _demo()
