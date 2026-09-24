# Career Cockpit Autofill (Chrome Extension)

Manifest V3 extension that detects form fields on any job application page, maps them to your local Career Cockpit canonical data, and fills them with human-like interactions. **Never auto-submits.**

## Install (unpacked)

1. Start the career cockpit: `web\start.bat` (or `python python/career_server.py --port 8770`).
2. Open Chrome → `chrome://extensions` → enable **Developer mode**.
3. Click **Load unpacked** → select this `browser-extension` folder.
4. Open a job application form in a normal tab, then use the extension popup or side panel.

## From the Career Cockpit

In a job opening modal, click **Autofill active application page**. That opens the extension side panel with the job preselected. Switch to the application tab and run autofill.

## Notes

- Requires the local server at `http://127.0.0.1:8770`.
- Learned per-site mappings are stored in `my-data/autofill/mappings.json`.
- Optional LLM mapping: set env `CAREER_AUTOFILL_LLM_URL` and `CAREER_AUTOFILL_LLM_KEY` (OpenAI-compatible chat completions). Without them, heuristic mapping only is used.
