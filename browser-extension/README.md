# Career Cockpit Autofill (Chrome Extension)

> [!NOTE]
> **Deprecated:** This browser extension is deprecated and no longer part of the primary Career Cockpit workflow.
> Job application form filling is now handled via **AutoHotkey + UIA Automation** and the **AI Companion** (Alt+F / Alt+A in the cockpit).

Manifest V3 extension that fills job application forms from:

1. **Imported AI companion JSON** (`application_answers` with `form_url` + `fields[]`) — preferred
2. **Heuristic / optional LLM mapping** from your canonical career CSVs — fallback

**Never auto-submits.**

## Workflow

1. Open the application form tab in Chrome.
2. Extension side panel → pick the job opening → **Capture page for AI**  
   (saves Ctrl+A text + form field digest + compact HTML to the opening, sets Application form URL, copies to clipboard).
3. In the career cockpit: **Generate form prompt** (prefilled from capture) → paste into your AI companion.
4. **Import form JSON** (confirm Form page URL).
5. Back on the form tab → **Fill this page**.

The side panel shows a 4-step stepper and guides you until a matching payload is found for the active tab URL.

## Install (unpacked)

1. Start the career cockpit: `web\start.bat` (or `python python/career_server.py --port 8770`).
2. Open Chrome → `chrome://extensions` → enable **Developer mode**.
3. Click **Load unpacked** → select this `browser-extension` folder.

## Notes

- Requires the local server at `http://127.0.0.1:8770`.
- URL matching uses origin + pathname (ignores query/hash).
- `job_url` = job posting / source page; `form_url` inside `application_answers` = page to autofill.
- Learned per-site mappings: `my-data/autofill/mappings.json`.
- Optional LLM mapping: set `CAREER_AUTOFILL_LLM_URL` and `CAREER_AUTOFILL_LLM_KEY` (or `OPENAI_API_KEY`).
