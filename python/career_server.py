"""Local HTTP server for the career cockpit (static web + CSV API)."""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
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

from canonical_store import CanonicalStore  # noqa: E402

DEFAULT_PORT = 8770
ROOT_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT_DIR / "web"
CANONICAL_DIR = ROOT_DIR / "my-data" / "canonical"
OUTPUT_DIR = ROOT_DIR / "output"

# Hard product rule: every resume PDF must fit on a single A4 page.
RESUME_MAX_PAGES = 1
RESUME_PAPER = "A4"

# Career deliverables under output/<variant>/ (resume + portfolio, EN/PT)
DOWNLOAD_CATALOG: list[dict[str, str]] = [
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


def list_downloads() -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
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
            item["one_page_ok"] = page_count == RESUME_MAX_PAGES if page_count else None
            item["max_pages"] = RESUME_MAX_PAGES
        items.append(item)
    return items


def resume_policy() -> dict[str, Any]:
    return {
        "max_pages": RESUME_MAX_PAGES,
        "paper": RESUME_PAPER,
        "note_en": "All resumes are limited to 1 page (A4).",
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


class CareerHandler(BaseHTTPRequestHandler):
    server_version = "CareerCockpit/1.0"

    @property
    def store(self) -> CanonicalStore:
        return self.server.store  # type: ignore[attr-defined]

    def log_message(self, format: str, *args: Any) -> None:
        sys.stderr.write("[career-cockpit] " + format % args + "\n")

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, status: int, payload: Any) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _bytes(self, status: int, data: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self._cors()
        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> Any:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

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
            if path != "/api/state":
                self._json(404, {"ok": False, "error": "not found"})
                return
            body = self._read_json()
            collections = body.get("collections")
            result = self.store.save_all(collections)
            self._json(200, result)
        except ValueError as exc:
            self._json(400, {"ok": False, "error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            traceback.print_exc()
            self._json(500, {"ok": False, "error": str(exc)})

    def do_POST(self) -> None:  # noqa: N802
        try:
            path = urlparse(self.path).path
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
            self._json(400, {"ok": False, "error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            traceback.print_exc()
            self._json(500, {"ok": False, "error": str(exc)})

    def _serve_download(self, path: str) -> None:
        parsed = urlparse(self.path)
        parts = [p for p in unquote(parsed.path).split("/") if p]
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
