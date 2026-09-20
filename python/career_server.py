"""Local HTTP server for the career cockpit (static web + CSV API)."""

from __future__ import annotations

import argparse
import json
import mimetypes
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


class CareerHandler(BaseHTTPRequestHandler):
    server_version = "CareerCockpit/1.0"

    @property
    def store(self) -> CanonicalStore:
        return self.server.store  # type: ignore[attr-defined]

    def log_message(self, format: str, *args: Any) -> None:
        sys.stderr.write("[career-cockpit] " + format % args + "\n")

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
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

    def _serve_static(self, path: str) -> None:
        rel = unquote(path.lstrip("/")) or "index.html"
        if ".." in rel.replace("\\", "/").split("/"):
            self._json(400, {"ok": False, "error": "invalid path"})
            return
        file_path = (WEB_DIR / rel).resolve()
        if not str(file_path).startswith(str(WEB_DIR.resolve())):
            self._json(400, {"ok": False, "error": "invalid path"})
            return
        if file_path.is_dir():
            file_path = file_path / "index.html"
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
