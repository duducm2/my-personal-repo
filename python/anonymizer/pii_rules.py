"""PII and sensitive-keyword matching rules for OCR text regions."""

from __future__ import annotations

import difflib
import re
import unicodedata

PII_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("email", re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")),
    ("url", re.compile(r"(?:https?://|www\.)\S+", re.IGNORECASE)),
    ("cpf", re.compile(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b")),
    ("cnpj", re.compile(r"\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b")),
    (
        "phone",
        re.compile(r"(?:\+?\d{1,3}[\s\-]?)?(?:\(?\d{2,3}\)?[\s\-]?)?\d{4,5}[\s\-]?\d{4}\b"),
    ),
    (
        "currency",
        re.compile(r"(?:R\$|US\$|EUR|BRL|USD|€|\$)\s?\d[\d.,]*|\b\d[\d.,]*\s?(?:EUR|BRL|USD)\b", re.IGNORECASE),
    ),
    ("date", re.compile(r"\b\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b")),
    ("digits", re.compile(r"\b\d{5,}\b")),
]


def _normalize(text: str) -> str:
    nfkd = unicodedata.normalize("NFKD", text)
    stripped = "".join(ch for ch in nfkd if not unicodedata.combining(ch))
    return stripped.lower().strip()


def match_sensitive_text(text: str, keywords: list[str] | None = None) -> list[str]:
    """Return list of matched rule names or keywords for an OCR text string."""
    if not text or not text.strip():
        return []

    reasons: list[str] = []
    for label, pattern in PII_PATTERNS:
        if pattern.search(text):
            reasons.append(label)

    if keywords:
        norm_text = _normalize(text)
        tokens = re.findall(r"[a-z0-9@._\-]+", norm_text)
        for raw_kw in keywords:
            kw = _normalize(raw_kw)
            if not kw:
                continue
            if kw in norm_text:
                reasons.append(f"kw:{raw_kw.strip()}")
                continue
            for tok in tokens:
                if len(tok) >= 3 and difflib.SequenceMatcher(None, kw, tok).ratio() >= 0.85:
                    reasons.append(f"kw:{raw_kw.strip()}")
                    break

    return reasons
