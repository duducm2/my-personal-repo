# Career Cockpit Autofill (Chrome Extension)

Manifest V3 extension that fills job application forms from:

1. **Imported AI companion JSON** (`application_answers` with `form_url` + `fields[]`) — preferred
2. **Heuristic / optional LLM mapping** from your canonical career CSVs — fallback

**Never auto-submits.**

## Workflow

1. In the career cockpit: open a job → **Generate form prompt** (paste ATS page text) → send to your AI companion.
2. **Import form JSON** (set **Form page URL** to the application form URL).
3. Open that form URL in Chrome.
4. Extension side panel → **Fill this page**.

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
