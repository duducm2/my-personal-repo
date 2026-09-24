"""Heuristic (+ optional LLM) mapping of detected form fields to canonical keys."""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from typing import Any

from autofill_feedback import lookup_learned_mapping

MIN_CONFIDENCE = 0.55
LLM_MIN_CONFIDENCE = 0.5

# Patterns: (canonical_key, list of regexes against haystack, base confidence)
SYNONYMS: list[tuple[str, list[str], float]] = [
    ("first_name", [r"\bfirst[\s_-]*name\b", r"\bgiven[\s_-]*name\b", r"\bnome\b(?!\s+completo)", r"\bprenom\b"], 0.92),
    ("last_name", [r"\blast[\s_-]*name\b", r"\bfamily[\s_-]*name\b", r"\bsurname\b", r"\bsobrenome\b", r"\bapellido\b"], 0.92),
    ("full_name", [r"\bfull[\s_-]*name\b", r"\blegal[\s_-]*name\b", r"\bnome[\s_-]*completo\b", r"\byour[\s_-]*name\b", r"^name$", r"\bcandidate[\s_-]*name\b"], 0.9),
    ("email", [r"\be-?mail\b", r"\bcorreo\b"], 0.95),
    ("phone", [r"\bphone\b", r"\bmobile\b", r"\btelefone\b", r"\bcelular\b", r"\bwhatsapp\b", r"\btel\b"], 0.93),
    ("linkedin_url", [r"\blinkedin\b"], 0.95),
    ("city", [r"\bcity\b", r"\bcidade\b", r"\blocalidade\b"], 0.85),
    ("country", [r"\bcountry\b", r"\bpa[ií]s\b", r"\bnationality\b"], 0.8),
    ("location", [r"\blocation\b", r"\baddress\b", r"\bendoere[cç]o\b", r"\bwhere[\s_-]*are[\s_-]*you[\s_-]*based\b"], 0.8),
    ("about", [r"\babout[\s_-]*(you|yourself|me)\b", r"\bcover[\s_-]*letter\b(?!)", r"\bpersonal[\s_-]*statement\b", r"\btell[\s_-]*us[\s_-]*about\b", r"\bwhy[\s_-]*(do[\s_-]*you[\s_-]*)?want\b", r"\bmotivation\b", r"\bapresenta[cç][aã]o\b"], 0.72),
    ("cover_letter", [r"\bcover[\s_-]*letter\b", r"\bcarta[\s_-]*de[\s_-]*apresenta", r"\badditional[\s_-]*information\b"], 0.88),
    ("summary", [r"\bsummary\b", r"\bprofile\b", r"\bprofessional[\s_-]*summary\b", r"\bresumo\b"], 0.8),
    ("skills", [r"\bskills?\b", r"\bcompetenc", r"\bhabilidades\b", r"\btechnologies\b", r"\btech[\s_-]*stack\b"], 0.85),
    ("current_company", [r"\bcurrent[\s_-]*company\b", r"\bcurrent[\s_-]*employer\b", r"\bcompany[\s_-]*name\b", r"\bempresa\s+atual\b", r"\bemployer\b"], 0.82),
    ("current_title", [r"\bcurrent[\s_-]*(job[\s_-]*)?title\b", r"\bjob[\s_-]*title\b", r"\bcargo\b", r"\bposition\b"], 0.8),
    ("education_summary", [r"\beducation\b", r"\bschool\b", r"\buniversity\b", r"\bforma[cç][aã]o\b"], 0.75),
    ("highest_degree", [r"\bdegree\b", r"\bhighest[\s_-]*(level|degree|education)\b", r"\beducation[\s_-]*level\b"], 0.78),
    ("languages", [r"\blanguages?\b", r"\bidiomas?\b"], 0.85),
    ("website", [r"\bwebsite\b", r"\bportfolio\b", r"\bpersonal[\s_-]*site\b", r"\burl\b"], 0.7),
    ("portfolio", [r"\bportfolio\b", r"\bgithub\b"], 0.75),
    ("salary_expectation", [r"\bsalary\b", r"\bcompensa", r"\bexpectativa[\s_-]*salarial\b", r"\bpay[\s_-]*expect"], 0.8),
    ("hear_about", [r"\bhow[\s_-]*did[\s_-]*you[\s_-]*hear\b", r"\bsource\b", r"\breferred\b", r"\bcomo[\s_-]*soube\b"], 0.85),
    ("work_authorization_note", [r"\bwork[\s_-]*authori", r"\beligible[\s_-]*to[\s_-]*work\b", r"\bsponsorship\b", r"\bvisa\b", r"\bautoriza"], 0.65),
    ("relocation", [r"\brelocati", r"\bwilling[\s_-]*to[\s_-]*relocate\b", r"\bmudanca\b"], 0.7),
]

AUTOCOMPLETE_MAP = {
    "email": "email",
    "username": "email",
    "tel": "phone",
    "phone": "phone",
    "mobile-tel": "phone",
    "given-name": "first_name",
    "family-name": "last_name",
    "name": "full_name",
    "organization": "current_company",
    "organization-title": "current_title",
    "street-address": "location",
    "address-level2": "city",
    "country": "country",
    "country-name": "country",
    "url": "website",
}

# Sensitive / EEO — never auto-fill confidently
BLOCKLIST = re.compile(
    r"\b(gender|sex|race|ethnic|veteran|disability|lgbt|sexual|orientat|"
    r"date[\s_-]*of[\s_-]*birth|birth[\s_-]*date|ssn|social[\s_-]*security|"
    r"password|credit[\s_-]*card|bank|passport)\b",
    re.I,
)


def _norm(text: str) -> str:
    t = (text or "").lower()
    t = t.replace("_", " ").replace("-", " ")
    t = re.sub(r"[^\w\s]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def _haystack(field: dict[str, Any]) -> str:
    parts = [
        field.get("label") or "",
        field.get("name") or "",
        field.get("id") or "",
        field.get("placeholder") or "",
        field.get("autocomplete") or "",
        field.get("nearby") or "",
    ]
    return _norm(" ".join(parts))


def _select_value_for_options(desired: str, options: list[dict[str, Any]]) -> str | None:
    if not desired or not options:
        return desired
    d = desired.lower().strip()
    for opt in options:
        label = str(opt.get("label") or "").strip()
        value = str(opt.get("value") or "").strip()
        if label.lower() == d or value.lower() == d:
            return value or label
    for opt in options:
        label = str(opt.get("label") or "").lower()
        value = str(opt.get("value") or "").lower()
        if d in label or d in value or label in d:
            return opt.get("value") or opt.get("label")
    return None


def heuristic_match(field: dict[str, Any], values_by_key: dict[str, str]) -> dict[str, Any]:
    hay = _haystack(field)
    if BLOCKLIST.search(hay):
        return {
            "field": field,
            "canonicalKey": None,
            "value": None,
            "confidence": 0.0,
            "source": "blocked",
            "reason": "sensitive_or_eeo",
        }

    ac = (field.get("autocomplete") or "").lower().strip()
    if ac and ac in AUTOCOMPLETE_MAP:
        key = AUTOCOMPLETE_MAP[ac]
        val = values_by_key.get(key)
        if val:
            return {
                "field": field,
                "canonicalKey": key,
                "value": _coerce_value(field, val),
                "confidence": 0.97,
                "source": "autocomplete",
                "reason": f"autocomplete={ac}",
            }

    best_key = None
    best_conf = 0.0
    best_reason = ""
    for key, patterns, base in SYNONYMS:
        if key not in values_by_key or not values_by_key.get(key):
            continue
        for pat in patterns:
            if re.search(pat, hay, re.I):
                conf = base
                # Prefer more specific name/id hits
                name_id = _norm(f"{field.get('name','')} {field.get('id','')}")
                if re.search(pat, name_id, re.I):
                    conf = min(0.99, conf + 0.05)
                if conf > best_conf:
                    best_conf = conf
                    best_key = key
                    best_reason = f"pattern:{pat}"
                break

    if best_key:
        val = _coerce_value(field, values_by_key[best_key])
        return {
            "field": field,
            "canonicalKey": best_key,
            "value": val,
            "confidence": best_conf,
            "source": "heuristic",
            "reason": best_reason,
        }

    return {
        "field": field,
        "canonicalKey": None,
        "value": None,
        "confidence": 0.0,
        "source": "none",
        "reason": "no_match",
    }


def _coerce_value(field: dict[str, Any], value: str) -> str | bool | None:
    ftype = (field.get("type") or "").lower()
    if ftype == "checkbox":
        # Only check consent-like boxes if label suggests agreement and we have a value
        hay = _haystack(field)
        if re.search(r"\b(agree|accept|confirm|authorize|consent|li|terms)\b", hay):
            return True
        return None
    if ftype in ("select", "radio"):
        options = field.get("options") or []
        matched = _select_value_for_options(str(value), options)
        return matched
    return value


def map_fields_heuristic(
    fields: list[dict[str, Any]],
    values_by_key: dict[str, str],
    learned: dict[str, Any] | None = None,
    host: str = "",
) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for field in fields:
        learned_hit = lookup_learned_mapping(learned or {}, host, field)
        if learned_hit:
            key = learned_hit.get("canonical_key")
            if key == "custom" and learned_hit.get("custom_value"):
                results.append(
                    {
                        "field": field,
                        "canonicalKey": "custom",
                        "value": learned_hit.get("custom_value"),
                        "confidence": 0.99,
                        "source": "learned",
                        "reason": "user_feedback",
                    }
                )
                continue
            if key and values_by_key.get(key):
                results.append(
                    {
                        "field": field,
                        "canonicalKey": key,
                        "value": _coerce_value(field, values_by_key[key]),
                        "confidence": 0.98,
                        "source": "learned",
                        "reason": "user_feedback",
                    }
                )
                continue
        results.append(heuristic_match(field, values_by_key))
    return results


def _llm_enabled() -> bool:
    return bool(os.environ.get("CAREER_AUTOFILL_LLM_URL") or os.environ.get("OPENAI_API_KEY"))


def _llm_map_unknown(
    unknown_fields: list[dict[str, Any]],
    available_keys: list[dict[str, str]],
    job: dict[str, Any] | None,
) -> dict[str, dict[str, Any]]:
    """Return map of field uid -> {canonicalKey, confidence, reason}."""
    if not unknown_fields or not _llm_enabled():
        return {}

    url = os.environ.get("CAREER_AUTOFILL_LLM_URL") or "https://api.openai.com/v1/chat/completions"
    key = os.environ.get("CAREER_AUTOFILL_LLM_KEY") or os.environ.get("OPENAI_API_KEY") or ""
    model = os.environ.get("CAREER_AUTOFILL_LLM_MODEL") or "gpt-4o-mini"

    # Privacy: send labels only, not values
    compact_fields = [
        {
            "uid": f.get("uid"),
            "label": f.get("label"),
            "name": f.get("name"),
            "id": f.get("id"),
            "type": f.get("type"),
            "placeholder": f.get("placeholder"),
            "nearby": (f.get("nearby") or "")[:120],
            "options": [o.get("label") for o in (f.get("options") or [])[:15]],
        }
        for f in unknown_fields
    ]
    keys_only = [{"key": k["key"], "label": k.get("label")} for k in available_keys]

    system = (
        "You map job-application form fields to canonical profile keys. "
        "Return JSON only: {\"mappings\":[{\"uid\":\"...\",\"canonicalKey\":\"key_or_null\","
        "\"confidence\":0.0,\"reason\":\"...\"}]}. "
        "Use null canonicalKey when unsure or when the field is EEO/sensitive/custom essay. "
        "Never invent keys outside the provided list."
    )
    user = json.dumps(
        {
            "job": {"company": (job or {}).get("company"), "role": (job or {}).get("role_title")},
            "available_keys": keys_only,
            "fields": compact_fields,
        },
        ensure_ascii=False,
    )

    payload = {
        "model": model,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError) as exc:
        return {"__error__": {"reason": str(exc)}}

    content = ""
    try:
        content = body["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        return {}

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        return {}

    out: dict[str, dict[str, Any]] = {}
    for item in parsed.get("mappings") or []:
        uid = item.get("uid")
        if not uid:
            continue
        out[uid] = {
            "canonicalKey": item.get("canonicalKey"),
            "confidence": float(item.get("confidence") or 0),
            "reason": item.get("reason") or "llm",
        }
    return out


def map_fields(
    fields: list[dict[str, Any]],
    values_by_key: dict[str, str],
    available_keys: list[dict[str, str]],
    learned: dict[str, Any] | None = None,
    host: str = "",
    job: dict[str, Any] | None = None,
    use_llm: bool = True,
) -> dict[str, Any]:
    mapped = map_fields_heuristic(fields, values_by_key, learned=learned, host=host)

    unknown = [
        m["field"]
        for m in mapped
        if (m.get("confidence") or 0) < MIN_CONFIDENCE and m.get("source") != "blocked"
    ]

    llm_info: dict[str, Any] = {"used": False, "count": 0}
    if use_llm and unknown:
        llm_hits = _llm_map_unknown(unknown, available_keys, job)
        if "__error__" in llm_hits:
            llm_info["error"] = llm_hits["__error__"]["reason"]
        else:
            llm_info["used"] = True
            by_uid = {m["field"]["uid"]: i for i, m in enumerate(mapped)}
            for uid, hit in llm_hits.items():
                idx = by_uid.get(uid)
                if idx is None:
                    continue
                key = hit.get("canonicalKey")
                conf = float(hit.get("confidence") or 0)
                if not key or key not in values_by_key or conf < LLM_MIN_CONFIDENCE:
                    continue
                mapped[idx] = {
                    "field": mapped[idx]["field"],
                    "canonicalKey": key,
                    "value": _coerce_value(mapped[idx]["field"], values_by_key[key]),
                    "confidence": conf,
                    "source": "llm",
                    "reason": hit.get("reason") or "llm",
                }
                llm_info["count"] += 1

    return {
        "mappings": mapped,
        "min_confidence": MIN_CONFIDENCE,
        "llm": llm_info,
    }
